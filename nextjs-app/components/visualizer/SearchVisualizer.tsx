'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function SearchVisualizer() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [brythonReady, setBrythonReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if all scripts are loaded
    if (scriptsLoaded && typeof window !== 'undefined' && (window as any).brython) {
      // Initialize Brython
      try {
        (window as any).brython({ debug: 1, pythonpath: ['/'] });
        setBrythonReady(true);
      } catch (error) {
        console.error('Error initializing Brython:', error);
      }
    }
  }, [scriptsLoaded]);

  return (
    <>
      {/* Load external dependencies */}
      <Script
        src="https://cdn.jsdelivr.net/npm/brython@3.9.1/brython.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://unpkg.com/lucide@latest"
        strategy="afterInteractive"
      />
      <Script
        src="https://unpkg.com/@popperjs/core@2"
        strategy="afterInteractive"
      />
      <Script
        src="https://unpkg.com/tippy.js@6"
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded(true)}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/gif-recorder.js"
        strategy="afterInteractive"
      />
      
      {/* Tippy.js CSS */}
      <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />

      {/* Python source */}
      {brythonReady && (
        <script type="text/python" src="/main.py?v=3.0"></script>
      )}

      <div ref={containerRef} className="relative w-full h-full">
        <div id="canvas-container" className="w-full h-full"></div>
        
        {/* Floating Toolbar */}
        <div className="floating-toolbar">
          <div className="toolbar-content">
            {/* Toolbar buttons will be added by main.py */}
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="bottom-panel" id="bottom-panel">
          <div className="panel-compact">
            <span className="selected-algorithm" id="selected-algo-display">Select Algorithm</span>
          </div>
          <div className="panel-expanded">
            {/* Algorithm selection will be added by main.py */}
          </div>
        </div>

        {/* Login Banner */}
        <div id="login-banner" className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-3 px-6 flex items-center justify-between shadow-lg animate-gradient-x">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="font-medium">Save your graphs and share them with others!</span>
          </div>
          <a 
            href="/" 
            className="bg-white text-purple-600 px-4 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
          >
            Sign up / Login
          </a>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --bg-gradient-start: #1e293b;
          --bg-gradient-end: #334155;
          --canvas-bg: #0f172a;
          --panel-bg: rgba(255, 255, 255, 0.95);
          --panel-text: #1e293b;
          --border-color: #e2e8f0;
          --text-secondary: #64748b;
        }

        body.light-mode {
          --bg-gradient-start: #e0f2fe;
          --bg-gradient-end: #bae6fd;
          --canvas-bg: #f8fafc;
          --panel-bg: rgba(255, 255, 255, 0.95);
          --panel-text: #1e293b;
          --border-color: #cbd5e1;
          --text-secondary: #475569;
        }

        #canvas-container {
          cursor: grab;
          background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
        }

        #canvas-container:active {
          cursor: grabbing;
        }

        #canvas-container.dragging-node {
          cursor: move !important;
        }

        .floating-toolbar {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--panel-bg);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          z-index: 1000;
        }

        .toolbar-content {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          max-width: 90vw;
        }

        .tool-btn {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: 2px solid transparent;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          color: var(--text-secondary);
        }

        .tool-btn:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .tool-btn.active {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }

        .tool-btn svg {
          width: 24px;
          height: 24px;
        }

        .divider {
          width: 2px;
          background: var(--border-color);
          margin: 0 4px;
        }

        .bottom-panel {
          position: fixed;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--panel-bg);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 10px 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .bottom-panel.expanded {
          cursor: default;
          padding: 16px 20px;
          max-width: 90vw;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
          transform: translateX(-50%) translateY(-10px) scale(1.02);
        }

        .panel-compact {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bottom-panel.expanded .panel-compact {
          display: none;
        }

        .panel-expanded {
          display: none;
          opacity: 0;
        }

        .bottom-panel.expanded .panel-expanded {
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: fadeSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .selected-algorithm {
          padding: 6px 12px;
          border-radius: 6px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }

        .algorithm-section {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .section-title {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }

        .algo-buttons {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .algo-btn {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1.5px solid var(--border-color);
          background: white;
          cursor: pointer;
          font-size: 11px;
          font-weight: 500;
          color: var(--panel-text);
          transition: all 0.2s;
          white-space: nowrap;
        }

        .algo-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          transform: scale(1.05);
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </>
  );
}
