"use client";

import { 
  Pencil, 
  Eraser, 
  Square, 
  Circle, 
  Type, 
  Hand, 
  Lock, 
  Unlock,
  Trash2,
  LogOut,
  MousePointer2
} from "lucide-react";
import { useRouter } from "next/navigation";

type Tool = "pencil" | "eraser" | "rect" | "circle" | "text" | "hand";

interface ToolbarProps {
  selectedTool: Tool;
  setTool: (tool: Tool) => void;
  selectedColor: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  isFilled: boolean;
  setIsFilled: (filled: boolean) => void;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  onClear: () => void;
}

export default function Toolbar({
  selectedTool,
  setTool,
  selectedColor,
  setColor,
  brushSize,
  setBrushSize,
  isFilled,
  setIsFilled,
  isLocked,
  setIsLocked,
  onClear,
}: ToolbarProps) {
  const router = useRouter();

  const colors = [
    { name: "Black", value: "#000000" },
    { name: "Blue", value: "#2563eb" },
    { name: "Red", value: "#dc2626" },
    { name: "Green", value: "#16a34a" },
    { name: "Orange", value: "#d97706" },
  ];

  const sizes = [4, 8, 12];

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-4 bg-white shadow-xl shadow-zinc-200/40 border border-zinc-200 rounded-2xl px-3 py-2">
        
        {/* --- GROUP 1: TOOLS --- */}
        <div className="flex items-center gap-1">
            <ToolButton 
              active={selectedTool === "hand"} 
              onClick={() => setTool("hand")} 
              icon={<Hand className="w-5 h-5" />} 
            />
            <ToolButton 
              active={selectedTool === "pencil"} 
              onClick={() => setTool("pencil")} 
              icon={<Pencil className="w-5 h-5" />} 
            />
             <ToolButton 
              active={selectedTool === "rect"} 
              onClick={() => setTool("rect")} 
              icon={<Square className="w-5 h-5" />} 
            />
            <ToolButton 
              active={selectedTool === "circle"} 
              onClick={() => setTool("circle")} 
              icon={<Circle className="w-5 h-5" />} 
            />
            <ToolButton 
              active={selectedTool === "text"} 
              onClick={() => setTool("text")} 
              icon={<Type className="w-5 h-5" />} 
            />
            <ToolButton 
              active={selectedTool === "eraser"} 
              onClick={() => setTool("eraser")} 
              icon={<Eraser className="w-5 h-5" />} 
            />
        </div>

        {/* --- DIVIDER --- */}
        <div className="w-px h-8 bg-zinc-200" />

        {/* --- GROUP 2: STYLES (Colors & Size) --- */}
        {/* Only show styles if we aren't panning or erasing */}
        {!isLocked && selectedTool !== "hand" && selectedTool !== "eraser" && (
            <div className="flex items-center gap-4 px-2">
                
                {/* Colors */}
                <div className="flex items-center gap-2">
                    {colors.map((c) => (
                    <button
                        key={c.value}
                        onClick={() => setColor(c.value)}
                        className={`w-5 h-5 rounded-full border border-zinc-200 transition-all ${
                        selectedColor === c.value 
                            ? "scale-125 ring-2 ring-offset-2 ring-zinc-900" 
                            : "hover:scale-110"
                        }`}
                        style={{ backgroundColor: c.value }}
                    />
                    ))}
                </div>

                {/* Sizes */}
                <div className="flex items-center gap-2 bg-zinc-50 rounded-lg p-1">
                    {sizes.map((s) => (
                        <button
                            key={s}
                            onClick={() => setBrushSize(s)}
                            className={`rounded-full bg-zinc-900 transition-all ${
                            brushSize === s ? "opacity-100" : "opacity-20 hover:opacity-50"
                            }`}
                            style={{ width: s, height: s, padding: 2 }}
                        />
                    ))}
                </div>

                {/* Fill Toggle */}
                {(selectedTool === "rect" || selectedTool === "circle") && (
                    <button
                        onClick={() => setIsFilled(!isFilled)}
                        className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md border transition-all ${
                            isFilled ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50"
                        }`}
                    >
                        {isFilled ? "Fill" : "Line"}
                    </button>
                )}
            </div>
        )}

        {/* --- DIVIDER --- */}
        <div className="w-px h-8 bg-zinc-200" />

        {/* --- GROUP 3: ACTIONS --- */}
        <div className="flex items-center gap-1">
            <IconButton 
                onClick={() => setIsLocked(!isLocked)}
                active={isLocked}
                icon={isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                danger={isLocked}
            />
            <IconButton 
                onClick={onClear}
                icon={<Trash2 className="w-4 h-4" />}
                danger
            />
            <IconButton 
                onClick={() => router.push('/canvas')}
                icon={<LogOut className="w-4 h-4" />}
            />
        </div>

      </div>
    </div>
  );
}

// Minimal Helper Button Components
function ToolButton({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`p-2.5 rounded-xl transition-all ${
                active 
                    ? "bg-zinc-900 text-white shadow-md" 
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
        >
            {icon}
        </button>
    )
}

function IconButton({ onClick, icon, active, danger }: { onClick: () => void, icon: React.ReactNode, active?: boolean, danger?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`p-2.5 rounded-xl transition-all ${
                active 
                    ? (danger ? "bg-red-50 text-red-600" : "bg-zinc-100 text-zinc-900")
                    : (danger ? "text-zinc-400 hover:text-red-600 hover:bg-red-50" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100")
            }`}
        >
            {icon}
        </button>
    )
}