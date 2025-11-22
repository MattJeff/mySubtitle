# SubStyle Backend

Backend Python pour générer des sous-titres avec Whisper local.

## Installation

### 1. Créer un environnement virtuel

```bash
cd substyle-backend
python3 -m venv venv
source venv/bin/activate  # Sur Mac/Linux
```

### 2. Installer les dépendances

```bash
pip install -r requirements.txt
```

**Note:** Installer aussi `ffmpeg` sur votre système:
```bash
# Mac
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg
```

### 3. Lancer le serveur

```bash
cd app
python main.py
```

Le serveur démarre sur `http://localhost:8000`

## Endpoints

### `POST /transcribe`

Génère des sous-titres pour une vidéo YouTube.

**Request:**
```json
{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response:**
```json
{
  "srt_content": "1\n00:00:00,000 --> 00:00:03,000\nHello world\n\n...",
  "video_id": "abc123",
  "language": "en",
  "duration": 213.5
}
```

### `GET /health`

Check si le serveur fonctionne.

## Cache

Les audios et transcriptions sont cachés dans `./cache/`:
- `cache/audio/` - Fichiers audio téléchargés
- `cache/transcripts/` - Transcriptions SRT

## Modèle Whisper

Par défaut, utilise le modèle `base` (rapide, ~140MB).

**Autres modèles disponibles:**
- `tiny` - Le plus rapide, moins précis
- `small` - Bon compromis
- `medium` - Plus précis, plus lent
- `large` - Le meilleur, très lent

Pour changer: modifier `whisper.load_model("base")` dans `main.py`

## Performance

**Modèle `base`:**
- Téléchargement: ~10-30s (dépend de la vidéo)
- Transcription: ~15-45s pour 5 minutes de vidéo
- Total: ~30-75s pour une vidéo de 5 minutes

**Avec cache:**
- Réponse instantanée (<1s) si déjà transcrite
