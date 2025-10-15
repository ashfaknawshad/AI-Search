/**
 * GIF Recording Module for AI-Search
 * Handles frame capture and GIF encoding during algorithm visualization
 */

class GifRecorder {
    constructor(canvas) {
        this.canvas = canvas;
        this.frames = [];
        this.isRecording = false;
        this.gif = null;
        this.frameDelay = 500; // Match animation speed
    }

    /**
     * Start recording frames
     */
    startRecording() {
        this.frames = [];
        this.isRecording = true;
        
        // Initialize gif.js with local worker script to avoid CORS issues
        this.gif = new GIF({
            workers: 2,
            quality: 10,
            width: this.canvas.width,
            height: this.canvas.height,
            workerScript: './gif.worker.js'
        });

        console.log('GIF recording started');
    }

    /**
     * Capture current canvas frame
     */
    captureFrame() {
        console.log(`captureFrame called - isRecording: ${this.isRecording}, gif exists: ${!!this.gif}`);
        
        if (!this.isRecording || !this.gif) {
            console.log('Not recording or no GIF instance, skipping frame');
            return;
        }

        // Create a copy of the canvas
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = this.canvas.width;
        frameCanvas.height = this.canvas.height;
        const ctx = frameCanvas.getContext('2d');
        
        // Draw current canvas state
        ctx.drawImage(this.canvas, 0, 0);
        
        // Add frame to GIF
        this.gif.addFrame(frameCanvas, {
            delay: this.frameDelay,
            copy: true
        });

        this.frames.push(frameCanvas);
        console.log(`✓ Captured frame ${this.frames.length}`);
    }

    /**
     * Stop recording and generate GIF
     */
    stopRecording() {
        if (!this.isRecording || !this.gif) {
            return;
        }

        this.isRecording = false;
        console.log(`Encoding ${this.frames.length} frames...`);

        // Show loading indicator
        this.showEncodingProgress();

        // Render GIF
        this.gif.on('finished', (blob) => {
            this.downloadGif(blob);
            this.hideEncodingProgress();
            this.gif = null;
            this.frames = [];
        });

        this.gif.on('progress', (progress) => {
            this.updateEncodingProgress(progress);
        });

        this.gif.render();
    }

    /**
     * Download generated GIF
     */
    downloadGif(blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `ai-search-${Date.now()}.gif`;
        link.href = url;
        link.click();
        
        // Cleanup
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        console.log('GIF downloaded successfully');
    }

    /**
     * Show encoding progress indicator
     */
    showEncodingProgress() {
        const overlay = document.createElement('div');
        overlay.id = 'gif-encoding-overlay';
        overlay.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    background: white;
                    padding: 32px 48px;
                    border-radius: 16px;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                ">
                    <div style="
                        width: 48px;
                        height: 48px;
                        border: 4px solid #e2e8f0;
                        border-top-color: #667eea;
                        border-radius: 50%;
                        margin: 0 auto 16px;
                        animation: spin 1s linear infinite;
                    "></div>
                    <h3 style="margin: 0 0 8px; font-weight: 600; color: #1e293b;">
                        Encoding GIF...
                    </h3>
                    <p id="gif-progress" style="margin: 0; color: #64748b; font-size: 14px;">
                        0%
                    </p>
                </div>
            </div>
            <style>
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(overlay);
    }

    /**
     * Update encoding progress
     */
    updateEncodingProgress(progress) {
        const progressEl = document.getElementById('gif-progress');
        if (progressEl) {
            progressEl.textContent = `${Math.round(progress * 100)}%`;
        }
    }

    /**
     * Hide encoding progress indicator
     */
    hideEncodingProgress() {
        const overlay = document.getElementById('gif-encoding-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    /**
     * Check if currently recording
     */
    get recording() {
        return this.isRecording;
    }
}

// Export for use in Python via Brython
window.GifRecorder = GifRecorder;
