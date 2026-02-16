import React, { ChangeEvent } from 'react';
import { FontFamily, ThumbnailConfig, VerticalPosition } from '../types';
import { Type, Palette, AlignCenter, AlignLeft, AlignRight, Layout, GripHorizontal, MousePointerClick } from 'lucide-react';

interface ControlsProps {
  config: ThumbnailConfig;
  updateConfig: (newConfig: ThumbnailConfig) => void;
}

const FONTS: FontFamily[] = ['Anton', 'Roboto', 'Oswald', 'Montserrat', 'Lato', 'Open Sans'];

export const Controls: React.FC<ControlsProps> = ({ config, updateConfig }) => {

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateConfig({ ...config, title: { ...config.title, text: e.target.value } });
  };

  const handleSubtitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateConfig({ ...config, subtitle: { ...config.subtitle, text: e.target.value } });
  };

  const toggleBold = (layer: 'title' | 'subtitle') => {
    updateConfig({
      ...config,
      [layer]: { ...config[layer], isBold: !config[layer].isBold }
    });
  };

  return (
    <div className="space-y-8 p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700 h-full overflow-y-auto">
      
      {/* Text Inputs */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Type className="w-5 h-5 text-blue-400" /> Content
        </h3>
        
        <div className="space-y-2">
          <label className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Main Title</label>
          <input
            type="text"
            maxLength={60}
            value={config.title.text}
            onChange={handleTitleChange}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
            placeholder="Enter title..."
          />
          <div className="text-right text-xs text-slate-500">{config.title.text.length}/60</div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Subtitle</label>
          <input
            type="text"
            maxLength={80}
            value={config.subtitle.text}
            onChange={handleSubtitleChange}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
            placeholder="Enter subtitle (optional)..."
          />
        </div>
      </section>

      {/* Title Styling */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-400" /> Title Style
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                 <label className="text-xs text-slate-400 block mb-1">Font Family</label>
                 <select
                    value={config.title.fontFamily}
                    onChange={(e) => updateConfig({ ...config, title: { ...config.title, fontFamily: e.target.value as FontFamily } })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-md px-2 py-2 text-sm text-white"
                >
                    {FONTS.map(font => <option key={font} value={font}>{font}</option>)}
                </select>
            </div>
             <div>
                 <label className="text-xs text-slate-400 block mb-1">Color</label>
                 <div className="flex items-center gap-2">
                     <input
                        type="color"
                        value={config.title.color}
                        onChange={(e) => updateConfig({ ...config, title: { ...config.title, color: e.target.value } })}
                        className="h-9 w-full bg-slate-900 rounded cursor-pointer"
                    />
                 </div>
            </div>
        </div>

        <div className="space-y-2">
           <label className="text-xs text-slate-400 flex justify-between">
              <span>Font Size</span>
              <span>{config.title.fontSize}px</span>
           </label>
           <input
              type="range"
              min="40"
              max="200"
              value={config.title.fontSize}
              onChange={(e) => updateConfig({ ...config, title: { ...config.title, fontSize: Number(e.target.value) } })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
        </div>

        <div className="flex gap-2">
            <button
                onClick={() => toggleBold('title')}
                className={`flex-1 py-2 rounded-md text-sm font-bold border transition-colors ${config.title.isBold ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-600 text-slate-400 hover:bg-slate-800'}`}
            >
                Bold
            </button>
            <button
                onClick={() => updateConfig({...config, title: {...config.title, showOutline: !config.title.showOutline}})}
                className={`flex-1 py-2 rounded-md text-sm font-bold border transition-colors ${config.title.showOutline ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-600 text-slate-400 hover:bg-slate-800'}`}
            >
                Outline
            </button>
            <button
                onClick={() => updateConfig({...config, title: {...config.title, showShadow: !config.title.showShadow}})}
                className={`flex-1 py-2 rounded-md text-sm font-bold border transition-colors ${config.title.showShadow ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-600 text-slate-400 hover:bg-slate-800'}`}
            >
                Shadow
            </button>
        </div>
      </section>

       {/* Layout & Overlay */}
       <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Layout className="w-5 h-5 text-green-400" /> Layout
        </h3>
        
        <div className="space-y-2">
            <label className="text-xs text-slate-400 block">Vertical Position</label>
            <div className="flex bg-slate-900 p-1 rounded-lg">
                {(['top', 'center', 'bottom'] as VerticalPosition[]).map(pos => (
                    <button
                        key={pos}
                        onClick={() => updateConfig({ ...config, verticalPosition: pos })}
                        className={`flex-1 capitalize py-1.5 text-xs rounded-md transition-all ${config.verticalPosition === pos ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {pos}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-xs text-slate-400 flex justify-between">
                <span>Alignment</span>
            </label>
             <div className="flex gap-2">
                <button
                    onClick={() => updateConfig({ ...config, title: {...config.title, alignment: 'left'}, subtitle: {...config.subtitle, alignment: 'left'} })}
                    className={`flex-1 py-2 flex justify-center rounded-md border ${config.title.alignment === 'left' ? 'bg-slate-700 border-slate-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
                >
                    <AlignLeft size={16} />
                </button>
                <button
                    onClick={() => updateConfig({ ...config, title: {...config.title, alignment: 'center'}, subtitle: {...config.subtitle, alignment: 'center'} })}
                    className={`flex-1 py-2 flex justify-center rounded-md border ${config.title.alignment === 'center' ? 'bg-slate-700 border-slate-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
                >
                    <AlignCenter size={16} />
                </button>
                <button
                    onClick={() => updateConfig({ ...config, title: {...config.title, alignment: 'right'}, subtitle: {...config.subtitle, alignment: 'right'} })}
                    className={`flex-1 py-2 flex justify-center rounded-md border ${config.title.alignment === 'right' ? 'bg-slate-700 border-slate-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
                >
                    <AlignRight size={16} />
                </button>
             </div>
        </div>

        <div className="space-y-2">
           <label className="text-xs text-slate-400 flex justify-between">
              <span>Background Overlay</span>
              <span>{Math.round(config.overlayOpacity * 100)}%</span>
           </label>
           <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.overlayOpacity}
              onChange={(e) => updateConfig({ ...config, overlayOpacity: Number(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
        </div>
      </section>

      <div className="pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">
             💡 Pro tip: Short, punchy titles work best!
        </p>
      </div>

    </div>
  );
};