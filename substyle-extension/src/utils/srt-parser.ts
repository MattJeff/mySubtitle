export interface SubtitleCue {
    id: number;
    startTime: number; // in milliseconds
    endTime: number;   // in milliseconds
    text: string;
}

export class SRTParser {
    static parse(srtContent: string): SubtitleCue[] {
        const cues: SubtitleCue[] = [];
        const blocks = srtContent.trim().split(/\n\s*\n/);

        for (const block of blocks) {
            const lines = block.split('\n');
            if (lines.length < 3) continue;

            const id = parseInt(lines[0].trim());
            const timeLine = lines[1].trim();
            const text = lines.slice(2).join('\n').trim();

            const [startStr, endStr] = timeLine.split(' --> ');
            if (!startStr || !endStr) continue;

            const startTime = this.timeStringToMs(startStr);
            const endTime = this.timeStringToMs(endStr);

            if (!isNaN(id) && !isNaN(startTime) && !isNaN(endTime)) {
                cues.push({ id, startTime, endTime, text });
            }
        }

        return cues;
    }

    private static timeStringToMs(timeString: string): number {
        // Format: HH:MM:SS,mmm
        const [time, ms] = timeString.split(',');
        const [hours, minutes, seconds] = time.split(':').map(Number);

        return (
            hours * 3600000 +
            minutes * 60000 +
            seconds * 1000 +
            parseInt(ms || '0')
        );
    }
}
