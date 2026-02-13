"use client";

import { 
  Hand, MousePointer2, Square, Circle, Diamond, ArrowRight, Minus, 
  Pencil, Eraser, Undo2, Redo2, 
  LogOut, Share2, Plus, Minus as MinusIcon, Check
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { StrokeWidthIcon, StrokeStyleIcon } from "./Icons"; 

// REMOVED "text" from this list
export type Tool = "hand" | "selection" | "rect" | "diamond" | "circle" | "arrow" | "line" | "pencil" | "eraser";

interface ExcalidrawUIProps {
  activeTool: Tool;
  setTool: (t: Tool) => void;
  color: string;
  setColor: (c: string) => void;
  width: "thin" | "medium" | "thick";
  setWidth: (w: "thin" | "medium" | "thick") => void;
  opacity: number;
  setOpacity: (o: number) => void;
  strokeStyle: "solid" | "dashed" | "dotted";
  setStrokeStyle: (s: "solid" | "dashed" | "dotted") => void;
  zoom: number;
  setZoom: (z: number) => void;
  onUndo: () => void;
  onRedo: () => void;
}

const COLORS = [
  "#000000", "#343a40", "#495057", "#c92a2a", "#a61e4d", 
  "#862e9c", "#5f3dc4", "#364fc7", "#1864ab", "#0b7285", 
  "#087f5b", "#2b8a3e", "#5c940d", "#e67700", "#d9480f"
];

export default function ExcalidrawUI({
  activeTool, setTool,
  color, setColor,
  width, setWidth,
  opacity, setOpacity,
  strokeStyle, setStrokeStyle,
  zoom, setZoom,
  onUndo, onRedo
}: ExcalidrawUIProps) {
  
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-50">
      
      {/* --- TOP HEADER --- */}
      <div className="flex items-start justify-between p-4 pointer-events-auto">
        <div className="flex items-center gap-3 pt-2">
            <span className="text-xl font-bold tracking-tight text-zinc-900 ml-1 bg-white/80 backdrop-blur px-2 rounded-md">
                Slate<span className="text-indigo-600">.</span>
            </span>
        </div>

        <div className="flex items-center gap-1 bg-white p-1.5 rounded-lg shadow-lg border border-zinc-200">
            <ToolBtn active={activeTool === "hand"} onClick={() => setTool("hand")} icon={<Hand className="w-4 h-4" />} />
            <ToolBtn active={activeTool === "selection"} onClick={() => setTool("selection")} icon={<MousePointer2 className="w-4 h-4" />} />
            <div className="w-px h-5 bg-zinc-200 mx-1" />
            <ToolBtn active={activeTool === "rect"} onClick={() => setTool("rect")} icon={<Square className="w-4 h-4" />} />
            <ToolBtn active={activeTool === "diamond"} onClick={() => setTool("diamond")} icon={<Diamond className="w-4 h-4" />} />
            <ToolBtn active={activeTool === "circle"} onClick={() => setTool("circle")} icon={<Circle className="w-4 h-4" />} />
            <ToolBtn active={activeTool === "arrow"} onClick={() => setTool("arrow")} icon={<ArrowRight className="w-4 h-4" />} />
            <ToolBtn active={activeTool === "line"} onClick={() => setTool("line")} icon={<Minus className="w-4 h-4" />} />
            <ToolBtn active={activeTool === "pencil"} onClick={() => setTool("pencil")} icon={<Pencil className="w-4 h-4" />} />
            {/* REMOVED TEXT BUTTON */}
            <ToolBtn active={activeTool === "eraser"} onClick={() => setTool("eraser")} icon={<Eraser className="w-4 h-4" />} />
        </div>

        <div className="flex items-center gap-2">
            <button 
                onClick={handleShare}
                className={`flex items-center gap-2 p-2 rounded-lg font-medium text-sm px-4 transition-all shadow-sm ${
                    copied ? "bg-green-100 text-green-700" : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
            >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? "Link Copied" : "Share"}
            </button>
            <div className="relative group">
                <button 
                    onClick={() => router.push('/canvas')}
                    className="p-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 border border-zinc-200 bg-white shadow-sm text-zinc-700 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                </button>
                <div className="absolute right-0 top-full mt-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Leave Room
                </div>
            </div>
        </div>
      </div>

      {/* --- PROPERTIES PANEL --- */}
      <div className="flex-1 relative">
        {activeTool !== "hand" && activeTool !== "eraser" && activeTool !== "selection" && (
            <div className="absolute left-4 top-20 pointer-events-auto bg-white border border-zinc-200 shadow-lg rounded-lg p-3 w-56 flex flex-col gap-5 max-h-[80vh] overflow-y-auto animate-in slide-in-from-left-5 fade-in duration-200">
                <div>
                    <label className="text-xs font-semibold text-zinc-500 mb-2 block uppercase tracking-wider">Stroke</label>
                    <div className="grid grid-cols-5 gap-1.5">
                        {COLORS.map(c => (
                            <button 
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-8 h-8 rounded-md transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-zinc-500 mb-2 block uppercase tracking-wider">Width</label>
                    <div className="flex gap-1 bg-zinc-100 p-1 rounded-lg">
                        <PropBtn active={width === "thin"} onClick={() => setWidth("thin")}><StrokeWidthIcon width="thin" /></PropBtn>
                        <PropBtn active={width === "medium"} onClick={() => setWidth("medium")}><StrokeWidthIcon width="medium" /></PropBtn>
                        <PropBtn active={width === "thick"} onClick={() => setWidth("thick")}><StrokeWidthIcon width="thick" /></PropBtn>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-zinc-500 mb-2 block uppercase tracking-wider">Style</label>
                    <div className="flex gap-1 bg-zinc-100 p-1 rounded-lg">
                        <PropBtn active={strokeStyle === "solid"} onClick={() => setStrokeStyle("solid")}><StrokeStyleIcon style="solid" /></PropBtn>
                        <PropBtn active={strokeStyle === "dashed"} onClick={() => setStrokeStyle("dashed")}><StrokeStyleIcon style="dashed" /></PropBtn>
                        <PropBtn active={strokeStyle === "dotted"} onClick={() => setStrokeStyle("dotted")}><StrokeStyleIcon style="dotted" /></PropBtn>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-zinc-500 mb-2 block uppercase tracking-wider">Opacity</label>
                    <input 
                        type="range" min="10" max="100" value={opacity} 
                        onChange={(e) => setOpacity(Number(e.target.value))}
                        className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                </div>
            </div>
        )}
      </div>

      {/* --- BOTTOM CONTROLS --- */}
      <div className="flex items-end justify-between p-4 pointer-events-auto">
        <div className="flex gap-3">
             <div className="flex items-center bg-white border border-zinc-200 shadow-sm rounded-lg overflow-hidden">
                <button onClick={() => setZoom(Math.max(10, zoom - 10))} className="p-2.5 hover:bg-zinc-50 text-zinc-600 border-r border-zinc-200"><MinusIcon className="w-4 h-4" /></button>
                <span className="px-3 text-xs font-medium text-zinc-600 min-w-[3rem] text-center">{zoom}%</span>
                <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-2.5 hover:bg-zinc-50 text-zinc-600 border-l border-zinc-200"><Plus className="w-4 h-4" /></button>
             </div>
             <div className="flex items-center gap-1">
                <button onClick={onUndo} className="p-2.5 bg-white border border-zinc-200 shadow-sm rounded-lg hover:bg-zinc-50 text-zinc-600"><Undo2 className="w-4 h-4" /></button>
                <button onClick={onRedo} className="p-2.5 bg-white border border-zinc-200 shadow-sm rounded-lg hover:bg-zinc-50 text-zinc-600"><Redo2 className="w-4 h-4" /></button>
             </div>
        </div>
      </div>
    </div>
  );
}

function ToolBtn({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-lg transition-colors ${active ? "bg-indigo-100 text-indigo-700" : "hover:bg-zinc-100 text-zinc-600"}`}
        >
            {icon}
        </button>
    )
}

function PropBtn({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center py-2 rounded-md transition-colors ${active ? "bg-white shadow text-indigo-600 ring-1 ring-zinc-200" : "hover:bg-zinc-200 text-zinc-500"}`}
        >
            {children}
        </button>
    )
}