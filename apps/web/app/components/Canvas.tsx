"use client";

import { useEffect, useRef, useState } from "react";

export default function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Store the last cursor position
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Set canvas size to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Initial setup

    // 2. Listen for incoming drawings from other users
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "draw") {
        const { x, y, prevX, prevY } = data;
        
        // Draw the other person's line (Indigo color)
        ctx.strokeStyle = "rgba(79, 70, 229, 0.8)"; 
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    };

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      // Clean up socket listener if needed
    };
  }, [socket]);

  // --- DRAWING HANDLERS ---

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !lastPos || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    // 1. Draw locally immediately (Black line)
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // 2. Send the coordinates to the Server
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "draw",
        roomId,
        x: currentX,
        y: currentY,
        prevX: lastPos.x,
        prevY: lastPos.y
      }));
    }

    setLastPos({ x: currentX, y: currentY });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      className="absolute inset-0 bg-white cursor-crosshair touch-none"
    />
  );
}