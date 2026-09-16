import {
  HocuspocusProviderWebsocket,
  WebSocketStatus,
} from "@hocuspocus/provider";
import { getCollaborationUrl } from "@/lib/config.ts";
import { registerProtectedCleanup } from "@/features/auth/protected-session";

const RELEASE_GRACE_MS = 5000;

let socket: HocuspocusProviderWebsocket | null = null;
let editorCount = 0;
let releaseTimer: ReturnType<typeof setTimeout> | null = null;

registerProtectedCleanup(() => {
  if (releaseTimer) clearTimeout(releaseTimer);
  releaseTimer = null;
  editorCount = 0;
  socket?.destroy();
  socket = null;
});

export function getCollabSocket(): HocuspocusProviderWebsocket {
  if (!socket) {
    socket = new HocuspocusProviderWebsocket({
      url: getCollaborationUrl(),
      autoConnect: false,
    });
  }
  return socket;
}

export function acquireCollabSocket(): void {
  editorCount++;
  if (releaseTimer) {
    clearTimeout(releaseTimer);
    releaseTimer = null;
  }
  const collabSocket = getCollabSocket();
  collabSocket.shouldConnect = true;
  if (collabSocket.status === WebSocketStatus.Disconnected) {
    collabSocket.connect();
  }
}

export function releaseCollabSocket(): void {
  editorCount = Math.max(0, editorCount - 1);
  if (editorCount > 0) return;
  if (releaseTimer) clearTimeout(releaseTimer);
  releaseTimer = setTimeout(() => {
    releaseTimer = null;
    if (editorCount === 0) {
      socket?.disconnect();
    }
  }, RELEASE_GRACE_MS);
}
