/**
 * YouTube Native Transcript Extractor
 * Extracts transcript from YouTube's native transcript panel
 */

export interface SubtitleCue {
    startTime: number;
    endTime: number;
    text: string;
}

export class YouTubeTranscriptExtractor {
    /**
     * Check if transcript button exists
     */
    static hasTranscriptAvailable(): boolean {
        // Look for transcript button in engagement panels - multiple possible selectors
        const transcriptButton = document.querySelector(
            'button[aria-label*="ranscript"], ' +
            'button[aria-label*="ranscription"], ' +
            'button[aria-label*="Show transcript"]'
        );

        if (transcriptButton) {
            return true;
        }

        // Check if transcript exists in menu items
        const menuItems = document.querySelectorAll('ytd-menu-service-item-renderer, tp-yt-paper-item');
        for (const item of menuItems) {
            const text = item.textContent || '';
            if (text.toLowerCase().includes('transcript')) {
                console.log('SubStyle: Found transcript in menu items');
                return true;
            }
        }

        // Try the three dots menu (might need to be opened)
        const moreActionsButton = document.querySelector('button[aria-label*="More actions"]');
        if (moreActionsButton) {
            console.log('SubStyle: Found More actions button, transcript might be in menu');
            return true; // Assume it might be available in the menu
        }

        return false;
    }

    /**
     * Open transcript panel if not already open
     */
    static async openTranscriptPanel(): Promise<boolean> {
        // First check if panel is already open
        let panel = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]');
        if (panel?.getAttribute('visibility') === 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED') {
            console.log('SubStyle: Transcript panel already open');
            return true;
        }

        // Try direct transcript button first
        let transcriptButton = document.querySelector<HTMLButtonElement>(
            'button[aria-label*="ranscript"], ' +
            'button[aria-label*="ranscription"], ' +
            'button[aria-label*="Show transcript"]'
        );

        if (!transcriptButton) {
            console.log('SubStyle: Direct transcript button not found, trying menu...');

            // Try the three dots menu
            const moreActionsButton = document.querySelector<HTMLButtonElement>('button[aria-label*="More actions"]');
            if (moreActionsButton) {
                console.log('SubStyle: Opening More actions menu...');
                moreActionsButton.click();
                await new Promise(resolve => setTimeout(resolve, 500));

                // Look for transcript option in the menu
                const menuItems = document.querySelectorAll('ytd-menu-service-item-renderer, tp-yt-paper-item, yt-formatted-string');
                let transcriptMenuItem: HTMLElement | null = null;

                for (const item of menuItems) {
                    const text = item.textContent || '';
                    if (text.toLowerCase().includes('transcript')) {
                        console.log('SubStyle: Found transcript text in menu:', text);
                        // Find the clickable parent
                        transcriptMenuItem = item.closest('tp-yt-paper-item, ytd-menu-service-item-renderer') as HTMLElement || item as HTMLElement;
                        break;
                    }
                }

                if (transcriptMenuItem) {
                    console.log('SubStyle: Clicking transcript menu item...');
                    transcriptMenuItem.click();
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    // Check if panel opened
                    panel = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]');
                    if (panel) {
                        console.log('SubStyle: Transcript panel opened successfully');
                        return true;
                    }
                } else {
                    console.log('SubStyle: No transcript option found in menu');
                }
            }
        } else {
            console.log('SubStyle: Found transcript button, clicking...');
            transcriptButton.click();
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check if panel opened
            panel = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]');
            if (panel) {
                console.log('SubStyle: Transcript panel opened successfully');
                return true;
            }
        }

        console.log('SubStyle: Failed to open transcript panel');
        return false;
    }

    /**
     * Extract transcript segments from opened panel
     */
    static extractTranscriptSegments(): SubtitleCue[] {
        const segments = document.querySelectorAll('ytd-transcript-segment-renderer');

        if (segments.length === 0) {
            console.log('SubStyle: No transcript segments found');
            return [];
        }

        const cues: SubtitleCue[] = [];

        segments.forEach((segment) => {
            const timestampEl = segment.querySelector('.segment-timestamp');
            const textEl = segment.querySelector('.segment-text');

            if (!timestampEl || !textEl) return;

            const timestampText = timestampEl.textContent?.trim() || '';
            const text = textEl.textContent?.trim() || '';

            if (!text) return;

            // Parse timestamp (format: "0:00" or "1:23:45")
            const startMs = this.parseYouTubeTimestamp(timestampText);

            // Estimate end time (use next segment's start or add 2 seconds)
            const nextSegment = segment.nextElementSibling;
            let endMs = startMs + 2000; // Default 2 seconds

            if (nextSegment) {
                const nextTimestampEl = nextSegment.querySelector('.segment-timestamp');
                if (nextTimestampEl) {
                    const nextTimestampText = nextTimestampEl.textContent?.trim() || '';
                    endMs = this.parseYouTubeTimestamp(nextTimestampText);
                }
            }

            cues.push({
                startTime: startMs,
                endTime: endMs,
                text: text
            });
        });

        console.log(`SubStyle: Extracted ${cues.length} transcript segments`);
        return cues;
    }

    /**
     * Parse YouTube timestamp to milliseconds
     * Format: "0:00", "1:23", "1:23:45"
     */
    private static parseYouTubeTimestamp(timestamp: string): number {
        const parts = timestamp.split(':').map(Number).reverse();

        let seconds = 0;

        // seconds
        if (parts[0] !== undefined) seconds += parts[0];
        // minutes
        if (parts[1] !== undefined) seconds += parts[1] * 60;
        // hours
        if (parts[2] !== undefined) seconds += parts[2] * 3600;

        return seconds * 1000;
    }

    /**
   * Main function: Extract transcript from YouTube
   */
    static async extractTranscript(): Promise<SubtitleCue[] | null> {
        try {
            console.log('SubStyle: Starting YouTube transcript extraction...');

            // Check if transcript is available
            if (!this.hasTranscriptAvailable()) {
                console.log('SubStyle: Transcript not available for this video');
                return null;
            }

            // Open panel
            const opened = await this.openTranscriptPanel();
            if (!opened) {
                console.log('SubStyle: Failed to open transcript panel');
                return null;
            }

            // Wait a bit more for segments to load
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Extract segments
            const cues = this.extractTranscriptSegments();

            if (cues.length === 0) {
                console.log('SubStyle: No segments found after extraction');
                return null;
            }

            console.log(`SubStyle: Successfully extracted ${cues.length} segments`);
            return cues;
        } catch (error) {
            console.error('SubStyle: Error during transcript extraction:', error);
            return null;
        }
    }
}
