import type { SubtitleCue } from './srt-parser';

export class SubtitleSyncEngine {
    private cues: SubtitleCue[];
    private currentCueIndex: number = 0;

    constructor(cues: SubtitleCue[]) {
        this.cues = cues.sort((a, b) => a.startTime - b.startTime);
    }

    getCurrentCue(currentTimeMs: number): SubtitleCue | null {
        // Optimization: Check current index first (sequential playback)
        if (this.currentCueIndex < this.cues.length) {
            const current = this.cues[this.currentCueIndex];
            if (currentTimeMs >= current.startTime && currentTimeMs <= current.endTime) {
                return current;
            }

            // Check next cue (if we just moved forward slightly)
            if (this.currentCueIndex + 1 < this.cues.length) {
                const next = this.cues[this.currentCueIndex + 1];
                if (currentTimeMs >= next.startTime && currentTimeMs <= next.endTime) {
                    this.currentCueIndex++;
                    return next;
                }
            }
        }

        // Fallback: Binary search for random seeking
        const index = this.binarySearch(currentTimeMs);
        if (index !== -1) {
            this.currentCueIndex = index;
            return this.cues[index];
        }

        return null;
    }

    private binarySearch(time: number): number {
        let left = 0;
        let right = this.cues.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const cue = this.cues[mid];

            if (time >= cue.startTime && time <= cue.endTime) {
                return mid;
            }

            if (time < cue.startTime) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        return -1;
    }
}
