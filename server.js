/**
 * FearnJR Auto‑Server
 * Simple static server that automatically starts itself,
 * serves index.html and all assets, and keeps the UI functional.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8080;

// MIME types for static files
const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain"
};

// Auto‑server function
function serve(req, res) {
  let filePath = req.url === "/" ? "index.html" : req.url.slice(1);
  let ext = path.extname(filePath).toLowerCase();

  // If file doesn't exist, fallback to index.html
  if (!fs.existsSync(filePath)) {
    filePath = "index.html";
    ext = ".html";
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("404 Not Found");
    }

    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

// Create server
const server = http.createServer(serve);

// Auto‑start
server.listen(PORT, () => {
  console.log("");
  console.log("========================================");
  console.log("     FearnJR Auto‑Server is running     ");
  console.log("========================================");
  console.log(`Serving at: http://localhost:${PORT}`);
  console.log("Auto‑boot sequence initialized.");
  console.log("Desktop will load automatically.");
  console.log("");
});

// Auto‑restart if it crashes
process.on("uncaughtException", (err) => {
  console.error("Server crashed:", err);
  console.log("Restarting FearnJR Auto‑Server...");
  server.close(() => {
    server.listen(PORT);
  });
});
