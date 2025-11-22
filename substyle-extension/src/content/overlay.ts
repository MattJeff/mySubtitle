export interface SubtitleStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  fontWeight?: number;
  outlineWidth?: number;
  outlineColor?: string;
  shadowIntensity?: number;
  backgroundColor?: string;
  padding?: number;
  borderRadius?: number;
  animation?: string;
}

export class YouTubeSubtitleOverlay {
  private overlay: HTMLDivElement;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'substyle-overlay';
    this.injectStyles();
    this.setupOverlay();
    this.injectOverlay();
  }

  private injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes substyle-pop {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  private setupOverlay() {
    this.overlay.style.cssText = `
      position: absolute;
      bottom: 10%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      pointer-events: none;
      text-align: center;
      max-width: 80%;
      transition: all 0.2s ease;
    `;
  }

  private injectOverlay() {
    // Try to find the video player container
    const player = document.querySelector('.html5-video-player') || document.querySelector('#movie_player');
    if (player) {
      player.appendChild(this.overlay);
    } else {
      console.warn('SubStyle: YouTube player not found, retrying in 1s...');
      setTimeout(() => this.injectOverlay(), 1000);
    }
  }

  public hideNativeSubtitles() {
    const nativeSubtitles = document.querySelector('.ytp-caption-window-container');
    if (nativeSubtitles) {
      (nativeSubtitles as HTMLElement).style.display = 'none';
    }
  }

  public updateText(text: string, style: SubtitleStyle) {
    if (!text) {
      this.overlay.innerHTML = '';
      return;
    }

    this.overlay.innerHTML = `
      <div style="
        font-family: ${style.fontFamily}, sans-serif;
        font-size: ${style.fontSize}px;
        color: ${style.color};
        font-weight: ${style.fontWeight || 700};
        text-shadow: 
          ${style.outlineWidth || 2}px ${style.outlineWidth || 2}px 0 ${style.outlineColor || '#000'},
          -${style.outlineWidth || 2}px -${style.outlineWidth || 2}px 0 ${style.outlineColor || '#000'},
          ${style.outlineWidth || 2}px -${style.outlineWidth || 2}px 0 ${style.outlineColor || '#000'},
          -${style.outlineWidth || 2}px ${style.outlineWidth || 2}px 0 ${style.outlineColor || '#000'},
          0 4px 12px rgba(0,0,0,${style.shadowIntensity || 0.5});
        background: ${style.backgroundColor || 'transparent'};
        padding: ${style.padding || 0}px;
        border-radius: ${style.borderRadius || 0}px;
        display: inline-block;
        animation: ${style.animation === 'pop' ? 'substyle-pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none'};
      ">
        ${text}
      </div>
    `;
  }
}
