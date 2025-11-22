from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import yt_dlp
from faster_whisper import WhisperModel
import os
import hashlib
from pathlib import Path
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SubStyle Backend", version="1.0.0")

# Allow CORS from Chrome extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your extension ID
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
CACHE_DIR = Path("./cache")
AUDIO_DIR = CACHE_DIR / "audio"
TRANSCRIPTS_DIR = CACHE_DIR / "transcripts"

# Create directories
CACHE_DIR.mkdir(exist_ok=True)
AUDIO_DIR.mkdir(exist_ok=True)
TRANSCRIPTS_DIR.mkdir(exist_ok=True)

# Load Whisper model (using 'base' for good balance of speed/accuracy)
# Options: tiny, base, small, medium, large-v2, large-v3
# For fastest: use 'tiny', for best quality: use 'large-v3'
logger.info("Loading faster-whisper model...")
whisper_model = WhisperModel("base", device="cpu", compute_type="int8")
logger.info("faster-whisper model loaded!")


class TranscribeRequest(BaseModel):
    video_url: HttpUrl


class TranscribeResponse(BaseModel):
    srt_content: str
    video_id: str
    language: str
    duration: float


def get_video_id(url: str) -> str:
    """Extract video ID from YouTube URL"""
    # Simple hash-based ID for caching
    return hashlib.md5(url.encode()).hexdigest()[:12]


def download_audio(video_url: str, video_id: str) -> Path:
    """Download audio from YouTube video"""
    audio_file = AUDIO_DIR / f"{video_id}.mp3"
    
    if audio_file.exists():
        logger.info(f"Audio already cached for {video_id}")
        return audio_file
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': str(AUDIO_DIR / f"{video_id}.%(ext)s"),
        'quiet': True,
        'no_warnings': True,
    }
    
    logger.info(f"Downloading audio for {video_id}...")
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])
    
    logger.info(f"Audio downloaded: {audio_file}")
    return audio_file


def transcribe_audio(audio_file: Path) -> dict:
    """Transcribe audio using faster-whisper"""
    logger.info(f"Transcribing {audio_file.name}...")
    
    # Transcribe with faster-whisper
    segments, info = whisper_model.transcribe(
        str(audio_file),
        task="transcribe",
        beam_size=5,
        vad_filter=True  # Voice Activity Detection for better accuracy
    )
    
    # Convert generator to list
    segments_list = list(segments)
    
    logger.info(f"Transcription complete. Language: {info.language}, Duration: {info.duration:.1f}s")
    
    return {
        'language': info.language,
        'duration': info.duration,
        'segments': segments_list
    }


def generate_srt(segments: list) -> str:
    """Convert faster-whisper segments to SRT format"""
    srt_content = ""
    
    for i, segment in enumerate(segments, start=1):
        # faster-whisper returns Segment objects with .start, .end, .text
        start_time = format_timestamp(segment.start)
        end_time = format_timestamp(segment.end)
        text = segment.text.strip()
        
        srt_content += f"{i}\n"
        srt_content += f"{start_time} --> {end_time}\n"
        srt_content += f"{text}\n\n"
    
    return srt_content


def format_timestamp(seconds: float) -> str:
    """Format seconds to SRT timestamp (HH:MM:SS,mmm)"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


@app.get("/")
def read_root():
    return {
        "service": "SubStyle Backend",
        "status": "running",
        "whisper_model": "base"
    }


@app.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_video(request: TranscribeRequest):
    """
    Transcribe a YouTube video and return SRT subtitles
    """
    try:
        video_url = str(request.video_url)
        video_id = get_video_id(video_url)
        
        # Check cache
        cached_srt = TRANSCRIPTS_DIR / f"{video_id}.srt"
        if cached_srt.exists():
            logger.info(f"Using cached transcript for {video_id}")
            srt_content = cached_srt.read_text(encoding='utf-8')
            # Parse SRT to get language and duration (simplified)
            return TranscribeResponse(
                srt_content=srt_content,
                video_id=video_id,
                language="cached",
                duration=0.0
            )
        
        # Download audio
        audio_file = download_audio(video_url, video_id)
        
        # Transcribe
        result = transcribe_audio(audio_file)
        
        # Generate SRT
        srt_content = generate_srt(result['segments'])
        
        # Cache the result
        cached_srt.write_text(srt_content, encoding='utf-8')
        logger.info(f"Cached transcript for {video_id}")
        
        return TranscribeResponse(
            srt_content=srt_content,
            video_id=video_id,
            language=result['language'],
            duration=result['duration']
        )
        
    except Exception as e:
        logger.error(f"Error transcribing video: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
