/**
 * Backend API Client
 * Communicates with local SubStyle backend for subtitle generation
 */

const BACKEND_URL = 'http://localhost:8000';

export interface TranscribeResponse {
    srt_content: string;
    video_id: string;
    language: string;
    duration: number;
}

export class BackendClient {
    private static abortController: AbortController | null = null;

    /**
     * Check if backend is running
     */
    static async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(`${BACKEND_URL}/health`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Cancel any ongoing transcription request
     */
    static cancelTranscription(): void {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    /**
     * Request subtitle generation for a YouTube video
     */
    static async transcribe(videoUrl: string): Promise<TranscribeResponse> {
        // Cancel any previous request
        this.cancelTranscription();

        // Create new abort controller for this request
        this.abortController = new AbortController();

        try {
            const response = await fetch(`${BACKEND_URL}/transcribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    video_url: videoUrl
                }),
                signal: this.abortController.signal
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Transcription failed');
            }

            const result = await response.json();
            this.abortController = null;
            return result;
        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw new Error('Transcription cancelled');
            }
            throw error;
        } finally {
            if (this.abortController?.signal.aborted) {
                this.abortController = null;
            }
        }
    }
}
