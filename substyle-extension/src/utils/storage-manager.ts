export interface AppSettings {
    currentPreset: string;
    customStyle: any;
}

export class StorageManager {
    static async getSettings(): Promise<AppSettings> {
        const result = await chrome.storage.sync.get(['settings']);
        return (result.settings as AppSettings) || {
            currentPreset: 'submagic',
            customStyle: {}
        };
    }

    static async saveSettings(settings: AppSettings): Promise<void> {
        await chrome.storage.sync.set({ settings });
    }

    static async getCachedSubtitles(videoId: string): Promise<string | null> {
        const result = await chrome.storage.local.get([`sub_${videoId}`]);
        return (result[`sub_${videoId}`] as string) || null;
    }

    static async cacheSubtitles(videoId: string, srtContent: string): Promise<void> {
        await chrome.storage.local.set({ [`sub_${videoId}`]: srtContent });
    }
}
