import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DEFAULT_CONFIG, ThumbnailConfig } from './types';
import { Controls } from './components/Controls';
import { renderThumbnail } from './utils/canvasUtils';
import { Download, Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<ThumbnailConfig>(DEFAULT_CONFIG);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initial draw
  useEffect(() => {
    if (canvasRef.current) {
      renderThumbnail(canvasRef.current, image, config);
    }
  }, [config, image]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError("Invalid file type. Please upload JPG or PNG.");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setLoading(false);
      };
      img.onerror = () => {
        setError("Failed to load image.");
        setLoading(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.download = `youtube-thumbnail-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      setError("Could not generate download. Try again.");
    }
  };

  const resetCanvas = () => {
      setImage(null);
      setConfig(DEFAULT_CONFIG);
      setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500 selection:text-white">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                T
             </div>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                ThumbForge
             </h1>
          </div>
          <div className="flex items-center gap-4">
             <span className="hidden md:inline text-sm text-slate-500">Fast, secure, local.</span>
             <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
             </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-4 order-2 lg:order-1 h-fit">
           <Controls config={config} updateConfig={setConfig} />
        </div>

        {/* Right Column: Preview & Actions */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
            
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-800 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3">
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20">
                        <Upload size={18} />
                        Upload Image
                        <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleImageUpload} />
                    </label>
                    <button 
                        onClick={resetCanvas}
                        className="text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                        title="Reset"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
                
                <button
                    onClick={handleDownload}
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-green-900/20 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                    <Download size={18} />
                    Download PNG
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center gap-2">
                    <span className="font-bold">Error:</span> {error}
                </div>
            )}

            {/* Canvas Container */}
            <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl ring-1 ring-slate-700/50 group">
                <canvas 
                    ref={canvasRef}
                    width={1280}
                    height={720}
                    className="w-full h-full object-contain"
                />
                
                {/* Overlay loading state */}
                {loading && (
                    <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                )}
                
                {/* Empty State Overlay (only clickable if no image loaded to encourage upload) */}
                {!image && !loading && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <ImageIcon className="w-16 h-16 text-slate-600 mx-auto mb-2" />
                             <p className="text-slate-500 font-medium">Preview Area</p>
                        </div>
                    </div>
                )}
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Dimensions</p>
                    <p className="font-mono text-blue-400">1280 x 720</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                     <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Format</p>
                     <p className="font-mono text-purple-400">PNG (High Res)</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                     <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Privacy</p>
                     <p className="font-mono text-green-400">100% Client-Side</p>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default App;