import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// ── In-memory store for Points Table (dev only) ──────────────────────────────
// This lives in the Vite server process, so Admin Panel and OBS Browser Source
// both read/write from the exact same store regardless of which browser they use.

const store: Record<string, string> = {};

const ptsApiPlugin = (): Plugin => ({
  name: "pts-api",
  configureServer(server) {
    server.middlewares.use("/api/pts", (req, res, next) => {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
        return;
      }

      const game = new URL(req.url || "/", "http://localhost").searchParams.get("game");
      if (!game) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "game param required" }));
        return;
      }

      if (req.method === "GET") {
        res.end(store[game] || "[]");
        return;
      }

      if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
        req.on("end", () => {
          try {
            JSON.parse(body); // validate JSON
            store[game] = body;
            res.statusCode = 200;
            res.end(JSON.stringify({ ok: true }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "invalid JSON" }));
          }
        });
        return;
      }

      next();
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "development" && ptsApiPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
