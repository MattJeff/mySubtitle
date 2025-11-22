import { useState, useEffect } from 'react';
import VideoStatus from './components/VideoStatus';
import PresetSelector from './components/PresetSelector';
import StyleEditor from './components/StyleEditor';
import { BackendClient } from '../utils/backend-client';

// Default styles
const DEFAULT_STYLE = {
  fontFamily: 'Montserrat',
  fontSize: 48,
  color: '#FFFFFF',
  outlineColor: '#000000',
  animation: 'pop'
};

const PRESETS_DATA: Record<string, any> = {
  submagic: { ...DEFAULT_STYLE, fontFamily: 'Montserrat', color: '#FFFFFF', animation: 'pop' },
  neon: { ...DEFAULT_STYLE, fontFamily: 'Poppins', color: '#00F5FF', outlineColor: '#FF00FF', animation: 'fade' },
  bold: { ...DEFAULT_STYLE, fontFamily: 'Bebas Neue', fontSize: 60, color: '#FF0000', animation: 'slide' },
  minimal: { ...DEFAULT_STYLE, fontFamily: 'Inter', fontSize: 32, color: '#FFFFFF', outlineColor: 'transparent', animation: 'none' },
};

function App() {
  const [currentPreset, setCurrentPreset] = useState('submagic');
  const [style, setStyle] = useState(PRESETS_DATA['submagic']);
  const [videoStatus, setVideoStatus] = useState<{
    title: string;
    currentTime: string;
    duration: string;
    status: 'ready' | 'no-video' | 'processing';
  }>({
    title: 'Loading...',
    currentTime: '00:00',
    duration: '00:00',
    status: 'no-video'
  });
  // const [backendOnline, setBackendOnline] = useState(false); // For future AI features
  const [generating, setGenerating] = useState(false);
  // const [currentVideoUrl, setCurrentVideoUrl] = useState(''); // For future AI features
  const [pauseHealthChecks, setPauseHealthChecks] = useState(false);
  const [transcriptAvailable, setTranscriptAvailable] = useState(false);

  // Check backend status
  useEffect(() => {
    const checkBackend = async () => {
      // Check if processing is ongoing (stored in chrome.storage)
      try {
        const result = await chrome.storage.local.get(['isProcessing', 'processingUrl']);

        // Get current tab URL
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // If processing but URL changed, cancel processing
        if (result.isProcessing && result.processingUrl && tab.url !== result.processingUrl) {
          console.log('SubStyle: URL changed during processing, cancelling');
          BackendClient.cancelTranscription();
          await chrome.storage.local.remove(['isProcessing', 'processingUrl']);
          setGenerating(false);
          setPauseHealthChecks(false);
          setVideoStatus(prev => ({ ...prev, status: 'ready' }));
        } else if (result.isProcessing && result.processingUrl === tab.url) {
          // Only resume if we're on the same URL
          setPauseHealthChecks(true);
          setGenerating(true);
          setVideoStatus(prev => ({ ...prev, status: 'processing' }));
          console.log('SubStyle: Resumed processing state from storage for same video');
          return;
        } else if (result.isProcessing) {
          // Clear orphaned processing state
          console.log('SubStyle: Clearing orphaned processing state');
          await chrome.storage.local.remove(['isProcessing', 'processingUrl']);
        }
      } catch (e) {
        console.error('Error checking processing state:', e);
      }

      // Backend health check - for future AI features
      // if (pauseHealthChecks) return;
      // const isOnline = await BackendClient.healthCheck();
      // setBackendOnline(isOnline);
    };

    checkBackend();
    // Check every 5 seconds
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, [pauseHealthChecks]);

  // Query video info when popup opens
  useEffect(() => {
    const queryVideoInfo = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Check if we're on YouTube
        if (!tab.url?.includes('youtube.com/watch')) {
          setVideoStatus({
            title: 'Not on YouTube',
            currentTime: '00:00',
            duration: '00:00',
            status: 'no-video'
          });
          // Clear any ongoing processing if we're not on YouTube
          await chrome.storage.local.remove('isProcessing');
          BackendClient.cancelTranscription();
          setGenerating(false);
          setPauseHealthChecks(false);
          return;
        }

        // Check if URL changed while processing
        const storedUrl = await chrome.storage.local.get(['processingUrl']);
        if (storedUrl.processingUrl && storedUrl.processingUrl !== tab.url) {
          console.log('SubStyle: Video changed, cancelling ongoing processing');
          // Cancel ongoing processing if video changed
          BackendClient.cancelTranscription();
          await chrome.storage.local.remove(['isProcessing', 'processingUrl']);
          setGenerating(false);
          setPauseHealthChecks(false);
          setVideoStatus(prev => ({ ...prev, status: 'ready' }));
        }

        // Save video URL - for future AI features
        // setCurrentVideoUrl(tab.url);

        // Try to get video info from content script
        if (tab.id) {
          try {
            const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_VIDEO_INFO' });
            if (response && response.hasVideo) {
              // Don't override processing status if it's already set
              setVideoStatus(prev => ({
                title: response.title || 'Unknown',
                currentTime: response.currentTime || '00:00',
                duration: response.duration || '00:00',
                status: prev.status === 'processing' ? 'processing' : 'ready'
              }));

              // Check YouTube transcript availability
              try {
                const transcriptResponse = await chrome.tabs.sendMessage(tab.id, { type: 'CHECK_TRANSCRIPT_AVAILABLE' });
                setTranscriptAvailable(transcriptResponse?.available || false);
              } catch (e) {
                setTranscriptAvailable(false);
              }
            } else {
              setVideoStatus({
                title: 'No video detected',
                currentTime: '00:00',
                duration: '00:00',
                status: 'no-video'
              });
            }
          } catch (error) {
            // Content script not loaded yet - suggest refresh
            setVideoStatus({
              title: 'Please refresh the page',
              currentTime: '00:00',
              duration: '00:00',
              status: 'no-video'
            });
            console.log('Content script not loaded. User should refresh the page.');
          }
        }
      } catch (error) {
        console.error('Error querying video info:', error);
      }
    };

    queryVideoInfo();
  }, []);

  const handlePresetSelect = (presetId: string) => {
    setCurrentPreset(presetId);
    setStyle(PRESETS_DATA[presetId]);
  };

  const handleStyleChange = (key: string, value: any) => {
    setStyle((prev: any) => ({ ...prev, [key]: value }));
    setCurrentPreset('custom');
  };

  const handleApply = async () => {
    try {
      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab.id) {
        console.error('No active tab found');
        return;
      }

      // Send message to content script
      await chrome.tabs.sendMessage(tab.id, {
        type: 'UPDATE_STYLE',
        style: style
      });

      console.log('Style sent to content script:', style);
    } catch (error) {
      console.error('Error sending style:', error);
    }
  };

  /* AI Generation - Coming Soon!
  const handleGenerate = async () => {
    if (!currentVideoUrl || !backendOnline) return;

    setGenerating(true);
    setPauseHealthChecks(true); // Pause health checks while transcribing
    setVideoStatus(prev => ({ ...prev, status: 'processing' }));

    // Store processing state with the URL
    await chrome.storage.local.set({
      isProcessing: true,
      processingUrl: currentVideoUrl
    });

    try {
      // Request transcription from backend
      const result = await BackendClient.transcribe(currentVideoUrl);

      // Send SRT to content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'LOAD_SUBTITLES',
          srt_content: result.srt_content
        });

        // Show notification
        chrome.notifications.create({
          type: 'basic',
          iconUrl: '/icons/icon128.png',
          title: 'SubStyle - Transcription Ready! ✨',
          message: `Subtitles generated in ${result.language.toUpperCase()}. Ready to display!`
        });
      }

      setVideoStatus(prev => ({ ...prev, status: 'ready' }));
      console.log(`Subtitles generated! Language: ${result.language}`);
    } catch (error: any) {
      console.error('Error generating subtitles:', error);
      // Only show error notification if not cancelled
      if (error.message !== 'Transcription cancelled') {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: '/icons/icon128.png',
          title: 'SubStyle - Error ❌',
          message: `Failed to generate subtitles: ${error.message}`
        });
        setVideoStatus(prev => ({ ...prev, status: 'no-video' }));
      }
    } finally {
      setGenerating(false);
      setPauseHealthChecks(false); // Resume health checks
      // Clear processing state
      await chrome.storage.local.remove(['isProcessing', 'processingUrl']);
    }
  };
  */

  const handleCancelProcessing = async () => {
    console.log('SubStyle: Manually cancelling processing');
    BackendClient.cancelTranscription();
    await chrome.storage.local.remove(['isProcessing', 'processingUrl']);
    setGenerating(false);
    setPauseHealthChecks(false);
    setVideoStatus(prev => ({ ...prev, status: 'ready' }));
  };

  const handleUseYouTubeTranscript = async () => {
    if (!transcriptAvailable) return;

    setGenerating(true);
    setVideoStatus(prev => ({ ...prev, status: 'processing' }));

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) {
        throw new Error('No active tab found');
      }

      console.log('SubStyle: Requesting YouTube transcript extraction...');

      // Import and use extractor in the content script context
      const result = await chrome.tabs.sendMessage(tab.id, {
        type: 'EXTRACT_YOUTUBE_TRANSCRIPT'
      });

      console.log('SubStyle: Received response from content script:', result);

      if (result?.error) {
        throw new Error(result.error);
      }

      if (!result || !result.cues || result.cues.length === 0) {
        throw new Error('No transcript segments found');
      }

      console.log(`SubStyle: Received ${result.cues.length} segments from extractor`);

      // Send to content script to load
      await chrome.tabs.sendMessage(tab.id, {
        type: 'LOAD_YOUTUBE_TRANSCRIPT',
        cues: result.cues
      });

      chrome.notifications.create({
        type: 'basic',
        iconUrl: '/icons/icon128.png',
        title: 'SubStyle - Transcript Loaded! ⚡',
        message: `${result.cues.length} segments loaded from YouTube transcript`
      });

      setVideoStatus(prev => ({ ...prev, status: 'ready' }));
    } catch (error: any) {
      console.error('Error loading YouTube transcript:', error);
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '/icons/icon128.png',
        title: 'SubStyle - Error ❌',
        message: `Failed to load YouTube transcript: ${error.message || 'Unknown error'}`
      });
      setVideoStatus(prev => ({ ...prev, status: 'ready' }));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="w-[400px] min-h-[600px] bg-gray-900 text-white p-4 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          🎬 SubStyle
        </h1>
        {/* Settings button - for future features
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            ⚙️
          </button>
        </div>
        */}
      </div>

      <VideoStatus
        title={videoStatus.title}
        currentTime={videoStatus.currentTime}
        duration={videoStatus.duration}
        status={videoStatus.status}
      />

      {videoStatus.status === 'ready' && (
        <div className="space-y-2 mb-4">
          {transcriptAvailable && (
            <button
              onClick={handleUseYouTubeTranscript}
              disabled={generating}
              className="glass-button w-full flex items-center justify-center gap-2"
            >
              <span>⚡</span>
              <span>Load YouTube Transcript</span>
            </button>
          )}

          {/* AI Generation - Coming Soon!
          {backendOnline && (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="glass-button w-full flex items-center justify-center gap-2"
            >
              <span>{generating ? '⏳' : '🤖'}</span>
              <span>{generating ? 'Generating...' : 'Generate with AI (Slow)'}</span>
            </button>
          )}
          */}
        </div>
      )}

      {generating && (
        <div className="glass-panel p-4 mb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
            <span className="text-purple-400 font-medium">Processing transcription...</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">This may take 30-60 seconds for long videos</p>
          <button
            onClick={handleCancelProcessing}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
          >
            Cancel Processing
          </button>
        </div>
      )}

      {/* Backend status - for future AI features
      {!backendOnline && !generating && (
        <div className="glass-panel p-3 mb-4 text-center text-sm text-yellow-400">
          ⚠️ Backend offline. Start server: <code>python app/main.py</code>
        </div>
      )}
      */}

      <PresetSelector
        currentPreset={currentPreset}
        onSelect={handlePresetSelect}
      />

      <StyleEditor
        style={style}
        onChange={handleStyleChange}
      />

      <div className="mt-auto pt-4">
        <button
          onClick={handleApply}
          className="glass-button w-full flex items-center justify-center gap-2"
        >
          <span>🚀</span>
          <span>Apply to Video</span>
        </button>
      </div>
    </div>
  );
}

export default App;
