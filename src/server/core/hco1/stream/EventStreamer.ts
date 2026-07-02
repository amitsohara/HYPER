import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

export class EventStreamer {
    private wss: WebSocketServer | null = null;
    private clients: Set<WebSocket> = new Set();
    private history: any[] = [];

    public attach(server: Server) {
        this.wss = new WebSocketServer({ server, path: '/api/hml/stream' });
        
        this.wss.on('connection', (ws) => {
            this.clients.add(ws);
            
            // Send initial state/history if needed
            ws.send(JSON.stringify({ type: 'CONNECTION_ESTABLISHED', data: { status: 'observatory_connected' } }));
            
            ws.on('close', () => {
                this.clients.delete(ws);
            });
        });
    }

    public broadcast(event: any) {
        // Keep last 1000 events for quick replay or sync
        this.history.push(event);
        if (this.history.length > 1000) this.history.shift();

        const message = JSON.stringify(event);
        for (const client of this.clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    }

    public getHistory() {
        return this.history;
    }
}
