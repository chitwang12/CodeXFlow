import WebSocket, { WebSocketServer } from "ws";
import http from "http";

type ClientMap = Map<string, WebSocket>;
export const clients: ClientMap = new Map();

export function initWebSocket(server: http.Server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws", // 🔥 IMPORTANT
  });

  console.log("🟢 WebSocket server initialized on /ws");

  wss.on("connection", (socket, req) => {
    console.log("🟢 WS connection attempt");

    if (!req.url) {
      socket.close();
      return;
    }

    const url = new URL(req.url, "http://localhost");
    const submissionId = url.searchParams.get("submissionId");

    console.log("submissionId:", submissionId);

    if (!submissionId) {
      socket.close();
      return;
    }

    clients.set(submissionId, socket);
    console.log("✅ WS client registered");

    socket.on("close", () => {
      clients.delete(submissionId);
      console.log("🔴 WS connection closed");
    });
  });
}
