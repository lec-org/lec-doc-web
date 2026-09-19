import ReactDOM from "react-dom/client";
import { LecDocApp } from "./embedded.tsx";

const container = document.getElementById("root");
if (!container) throw new Error("Lec Doc root element is missing");

const origin = window.location.origin;
ReactDOM.createRoot(container).render(
  <LecDocApp runtime={{
    mode: "web",
    appUrl: origin,
    backendUrl: `${origin}/api`,
    collaborationUrl: origin,
    socketUrl: origin,
    assetBaseUrl: origin,
  }} />,
);
