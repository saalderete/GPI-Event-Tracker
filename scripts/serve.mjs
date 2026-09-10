// A static server for out/, honouring the base path the site was built
// with. Used by the PDF and screenshot scripts; also handy for a local look
// at the export: `npm run serve` then open the printed URL.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..", "out");
const base = (process.env.PORTAL_BASE ?? "").replace(/\/$/, "");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain"
};

export function startServer(port = 0) {
  const server = createServer(async (req, res) => {
    let url = decodeURIComponent((req.url ?? "/").split("?")[0]);
    if (base) {
      if (!url.startsWith(base)) {
        res.writeHead(404).end("outside base path");
        return;
      }
      url = url.slice(base.length) || "/";
    }
    let file = normalize(join(root, url));
    if (!file.startsWith(root)) {
      res.writeHead(403).end();
      return;
    }
    try {
      let s = await stat(file).catch(() => null);
      if (s?.isDirectory()) {
        file = join(file, "index.html");
        s = await stat(file).catch(() => null);
      }
      if (!s && !extname(file)) {
        file = `${file}.html`;
        s = await stat(file).catch(() => null);
      }
      if (!s) {
        const nf = await readFile(join(root, "404.html")).catch(() => "Not found");
        res.writeHead(404, { "content-type": "text/html; charset=utf-8" }).end(nf);
        return;
      }
      const body = await readFile(file);
      res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" }).end(body);
    } catch (e) {
      res.writeHead(500).end(String(e));
    }
  });
  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => {
      const { port: p } = server.address();
      resolve({ server, origin: `http://127.0.0.1:${p}${base}` });
    });
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { origin } = await startServer(Number(process.env.PORT ?? 4173));
  console.log(`Serving out/ at ${origin}/`);
}
