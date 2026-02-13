"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Canvas from "@/app/components/Canvas";
import { WS_BACKEND } from "@/config";

export default function CanvasPage() {
    const router = useRouter();
    const params = useParams(); 
    const roomId = (params?.roomId as string) || "";
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (!roomId) return;

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signin");
            return;
        }
        
        const ws = new WebSocket(`${WS_BACKEND}?token=${token}`);

        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId: roomId
            }));
        };

        ws.onerror = (err) => {
            console.error("WebSocket failed", err);
        };

        return () => {
            ws.close();
        };

    }, [roomId, router]);

    if (!socket) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-indigo-500" />
                <p className="text-zinc-400 text-sm font-medium">Connecting to Room...</p>
            </div>
        );
    }

    return (
        <div className="relative h-screen w-full overflow-hidden bg-white">
            <Canvas roomId={roomId} socket={socket} />
        </div>
    );
}