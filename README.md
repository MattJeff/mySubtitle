# 🎬 SubStyle - Custom YouTube Subtitles

Replace native YouTube subtitles with highly stylized, animated subtitles.

## ✨ Features (MVP v1.0)

- ⚡ **Fast YouTube Transcript Loading** - Instantly load and style YouTube's native transcripts
- 🎨 **Multiple Preset Styles** - Choose from SubMagic, Neon, Bold, and Minimal styles
- ✏️ **Custom Styling** - Adjust font, size, color, and animations
- 🎭 **Smooth Animations** - Pop, fade, and slide effects for subtitles
- 🌐 **Multi-language Support** - Works with any language supported by YouTube

## 📦 Installation

### Extension

1. Clone this repository
   ```bash
   git clone https://github.com/MattJeff/mySubtitle.git
   cd mySubtitle/substyle-extension
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Build the extension
   ```bash
   npm run build
   ```

4. Load in Chrome
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## 🚀 Usage

1. **Navigate to a YouTube video** with subtitles/captions
2. **Open the SubStyle extension** (click the icon in your toolbar)
3. **Click "Load YouTube Transcript"** - Subtitles will load instantly!
4. **Choose a preset** or customize your style
5. **Click "Apply Style"** to see your styled subtitles

## 🎨 Available Presets

- **SubMagic** - Modern, bold style with pop animations
- **Neon** - Vibrant cyan and magenta with fade effects
- **Bold** - Large, attention-grabbing red text
- **Minimal** - Clean, simple white text

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Extension**: Chrome Extension Manifest V3
- **Styling**: Tailwind CSS
- **Transcription**: YouTube native transcripts

## 🚧 Coming Soon

- 🤖 **AI-Powered Transcription** - Generate subtitles for videos without transcripts (using Whisper AI)
- 📝 **Word-by-word highlighting**
- 🎥 **More animation effects**
- 💾 **Save custom presets**

## 📝 Development

```bash
# Extension development
cd substyle-extension
npm install
npm run dev    # Development mode with hot reload
npm run build  # Production build
```

## 📄 License

MIT License - feel free to use and modify!

## 👤 Author

Created by [@MattJeff](https://github.com/MattJeff)

## 🙏 Acknowledgments

- Inspired by SubMagic and other subtitle styling tools
- Built with ❤️ using modern web technologies
