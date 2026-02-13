"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ExcalidrawUI, { Tool } from "./ExcalidrawUI";
import axios from "axios"; 
import { HTTP_BACKEND } from "@/config";



type Element = {
    id: string;
    type: Tool;
    x: number;
    y: number;
    width: number;
    height: number;
    strokeColor: string;
    strokeWidth: number;
    strokeStyle: "solid" | "dashed" | "dotted";
    opacity: number;
    points?: {x: number, y: number}[];
};

export default function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // --- STATE ---
  const [elements, setElements] = useState<Element[]>([]);
  const [activeElement, setActiveElement] = useState<Element | null>(null);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);

  // UI State
  const [tool, setTool] = useState<Tool>("pencil");
  const [color, setColor] = useState("#000000");
  const [width, setWidth] = useState<"thin"|"medium"|"thick">("medium");
  const [strokeStyle, setStrokeStyle] = useState<"solid"|"dashed"|"dotted">("solid");
  const [opacity, setOpacity] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // ----------------------------------------------------------------------
  // 1. INITIALIZATION: FETCH HISTORY & LISTEN TO SOCKET
  // ----------------------------------------------------------------------
  useEffect(() => {
    // A. Fetch Existing Shapes from HTTP Backend
    async function fetchShapes() {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${HTTP_BACKEND}/api/v1/room/${roomId}/shapes`, {
                headers: { Authorization: token }
            });
            
            if (response.data.shapes) {
                setElements(response.data.shapes.map((s: any) => ({
                    ...s,
                    opacity: s.opacity ?? 100,
                    strokeStyle: s.strokeStyle ?? "solid"
                })));
            }
        } catch (e) {
            console.error("Failed to load shapes:", e);
        }
    }

    fetchShapes();

    // B. Listen for Real-time Updates
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // 1. Handle new shape from other users
        if (data.type === "draw-add") {
            setElements((prev) => [...prev, data.element]);
        }
        
        // 2. Handle delete shape from other users (FIXED)
        if (data.type === "delete-shape") {
            setElements((prev) => prev.filter((el) => el.id !== data.id));
        }
    };

  }, [roomId, socket]);


  // ----------------------------------------------------------------------
  // CURSOR MANAGEMENT
  // ----------------------------------------------------------------------
  const getCursor = () => {
    if (tool === "hand") return isPanning ? "grabbing" : "grab";
    if (tool === "selection") return "default";
    if (tool === "eraser") return "crosshair"; 
    return "crosshair";
  };

  // ----------------------------------------------------------------------
  // RENDER LOOP
  // ----------------------------------------------------------------------
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom / 100, zoom / 100);

    elements.forEach(el => drawElement(ctx, el));
    if (activeElement) drawElement(ctx, activeElement);
    
    // Draw Selection Box
    if (selectedElement) {
        const padding = 8;
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        let minX = selectedElement.x, minY = selectedElement.y, maxX = selectedElement.x + selectedElement.width, maxY = selectedElement.y + selectedElement.height;

        if (selectedElement.type === "pencil" && selectedElement.points) {
            const xs = selectedElement.points.map(p => p.x);
            const ys = selectedElement.points.map(p => p.y);
            minX = Math.min(...xs); maxX = Math.max(...xs);
            minY = Math.min(...ys); maxY = Math.max(...ys);
        } else if (selectedElement.type === "line" || selectedElement.type === "arrow") {
             minX = Math.min(selectedElement.x, selectedElement.x + selectedElement.width);
             maxX = Math.max(selectedElement.x, selectedElement.x + selectedElement.width);
             minY = Math.min(selectedElement.y, selectedElement.y + selectedElement.height);
             maxY = Math.max(selectedElement.y, selectedElement.y + selectedElement.height);
        }

        ctx.strokeRect(minX - padding, minY - padding, (maxX - minX) + padding * 2, (maxY - minY) + padding * 2);
    }

    ctx.restore();
  }, [elements, activeElement, selectedElement, panOffset, zoom]);

  // ----------------------------------------------------------------------
  // DRAW HELPER
  // ----------------------------------------------------------------------
  const drawElement = (ctx: CanvasRenderingContext2D, element: Element) => {
    const { type, x, y, width, height, strokeColor, strokeWidth, opacity, points } = element;
    
    ctx.globalAlpha = opacity / 100;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = strokeColor;
    ctx.setLineDash(element.strokeStyle === "dashed" ? [15, 15] : element.strokeStyle === "dotted" ? [5, 10] : []);

    ctx.beginPath();

    if (type === "pencil" && points) {
        if (points.length > 0) { ctx.moveTo(points[0].x, points[0].y); points.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke(); }
    }
    else if (type === "rect") { ctx.strokeRect(x, y, width, height); } 
    else if (type === "circle") { ctx.beginPath(); ctx.ellipse(x + width/2, y + height/2, Math.abs(width/2), Math.abs(height/2), 0, 0, 2 * Math.PI); ctx.stroke(); }
    else if (type === "line" || type === "arrow") {
        ctx.moveTo(x, y); ctx.lineTo(x + width, y + height); ctx.stroke();
        if (type === "arrow") {
            const angle = Math.atan2(height, width);
            const headLen = strokeWidth * 4;
            const endX = x + width; const endY = y + height;
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - headLen * Math.cos(angle - Math.PI / 6), endY - headLen * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - headLen * Math.cos(angle + Math.PI / 6), endY - headLen * Math.sin(angle + Math.PI / 6));
            ctx.stroke();
        }
    }
    else if (type === "diamond") {
        const cx = x + width / 2; const cy = y + height / 2;
        ctx.moveTo(cx, y); ctx.lineTo(x + width, cy); ctx.lineTo(cx, y + height); ctx.lineTo(x, cy);
        ctx.closePath(); ctx.stroke();
    }
  };

  const isPointInElement = (x: number, y: number, el: Element) => {
    if (el.type === "pencil" && el.points) {
        const xs = el.points.map(p => p.x); const ys = el.points.map(p => p.y);
        const minX = Math.min(...xs) - 5; const maxX = Math.max(...xs) + 5;
        const minY = Math.min(...ys) - 5; const maxY = Math.max(...ys) + 5;
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
    const minX = Math.min(el.x, el.x + el.width) - 5; const maxX = Math.max(el.x, el.x + el.width) + 5;
    const minY = Math.min(el.y, el.y + el.height) - 5; const maxY = Math.max(el.y, el.y + el.height) + 5;
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  };

  const getMouseCoords = (e: React.MouseEvent) => ({
    x: (e.clientX - panOffset.x) * (100 / zoom),
    y: (e.clientY - panOffset.y) * (100 / zoom)
  });

  // ----------------------------------------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------------------------------------
  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getMouseCoords(e);

    if (tool === "hand") { setIsPanning(true); setPanStart({ x: e.clientX, y: e.clientY }); return; }

    if (tool === "selection") {
        const clickedEl = [...elements].reverse().find(el => isPointInElement(x, y, el));
        if (clickedEl) {
            setSelectedElement(clickedEl);
            setDragOffset({ x: x - clickedEl.x, y: y - clickedEl.y });
            setElements(prev => prev.filter(el => el.id !== clickedEl.id));
        } else {
            setSelectedElement(null);
            setDragOffset(null);
        }
        return;
    }

    // --- ERASER (FIXED) ---
    if (tool === "eraser") {
        const clickedEl = [...elements].reverse().find(el => isPointInElement(x, y, el));
        if (clickedEl) { 
            // 1. Remove Locally
            setElements(prev => prev.filter(el => el.id !== clickedEl.id)); 
            
            // 2. Send Delete to Server
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "delete-shape",
                    roomId,
                    id: clickedEl.id
                }));
            }
        }
        // Start eraser "drag" mode
        setActiveElement({ id: "eraser", type: "eraser", x, y, width:0, height:0, strokeColor:"", strokeWidth:0, strokeStyle:"solid", opacity:0 });
        return;
    }

    const id = Math.random().toString(36).substr(2, 9);
    const strokeWidth = width === "thin" ? 2 : width === "medium" ? 4 : 8;
    setActiveElement({
        id, type: tool,
        x, y, width: 0, height: 0,
        strokeColor: color, strokeWidth, strokeStyle, opacity,
        points: tool === "pencil" ? [{x, y}] : undefined
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tool === "hand" && isPanning) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setPanStart({ x: e.clientX, y: e.clientY });
        return;
    }

    const { x, y } = getMouseCoords(e);

    if (tool === "selection" && selectedElement && dragOffset) {
        const newX = x - dragOffset.x;
        const newY = y - dragOffset.y;
        
        if (selectedElement.type === "pencil" && selectedElement.points) {
             const dx = newX - selectedElement.x;
             const dy = newY - selectedElement.y;
             const newPoints = selectedElement.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
             setSelectedElement({ ...selectedElement, x: newX, y: newY, points: newPoints });
        } else {
             setSelectedElement({ ...selectedElement, x: newX, y: newY });
        }
        return;
    }

    // --- ERASER DRAG (FIXED) ---
    if (tool === "eraser" && activeElement?.id === "eraser") {
        const clickedEl = [...elements].reverse().find(el => isPointInElement(x, y, el));
        if (clickedEl) { 
            // 1. Remove Locally
            setElements(prev => prev.filter(el => el.id !== clickedEl.id)); 
            
            // 2. Send Delete to Server
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "delete-shape",
                    roomId,
                    id: clickedEl.id
                }));
            }
        }
        return;
    }

    if (!activeElement) return;

    if (tool === "pencil") {
        setActiveElement(prev => {
            if (!prev || !prev.points) return null;
            return { ...prev, points: [...prev.points, { x, y }] };
        });
    } else {
        setActiveElement(prev => {
            if (!prev) return null;
            return { ...prev, width: x - prev.x, height: y - prev.y };
        });
    }
  };

  const handleMouseUp = () => {
    if (tool === "hand") { setIsPanning(false); return; }
    if (tool === "selection" && selectedElement) {
        setElements(prev => [...prev, selectedElement]);
        setDragOffset(null);
        return;
    }
    if (tool === "eraser") { setActiveElement(null); return; }
    if (activeElement) {
        setElements(prev => [...prev, activeElement]);
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "draw-add", roomId, element: activeElement }));
        }
        setActiveElement(null);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  }, []);

  return (
    <div className="relative h-full w-full bg-[#f8f9fa] overflow-hidden">
        <ExcalidrawUI 
            activeTool={tool} setTool={setTool}
            color={color} setColor={setColor}
            width={width} setWidth={setWidth}
            opacity={opacity} setOpacity={setOpacity}
            strokeStyle={strokeStyle} setStrokeStyle={setStrokeStyle}
            zoom={zoom} setZoom={setZoom}
            onUndo={() => {}} onRedo={() => {}}
        />
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 touch-none block"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ cursor: getCursor() }}
        />
    </div>
  );
}