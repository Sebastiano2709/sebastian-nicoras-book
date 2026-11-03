// Test-only stand-in for the Resend API (RESEND_BASE_URL). Records emails; can be switched to fail.
import { createServer } from "node:http";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
mkdirSync(".e2e-tmp", { recursive: true });

const PORT = Number(process.env.MOCK_RESEND_PORT ?? 4010);
const LOG = process.env.MOCK_RESEND_LOG ?? ".e2e-tmp/emails.jsonl";
const MODE = process.env.MOCK_RESEND_MODE_FILE ?? ".e2e-tmp/resend-mode.txt";
writeFileSync(LOG, "");
writeFileSync(MODE, "ok");

createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    const mode = existsSync(MODE) ? readFileSync(MODE, "utf8").trim() : "ok";
    if (req.method === "POST" && req.url?.startsWith("/emails")) {
      if (mode === "fail") { res.writeHead(500, { "content-type": "application/json" }); res.end(JSON.stringify({ name: "internal_server_error", message: "mock failure" })); return; }
      appendFileSync(LOG, body + "\n");
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ id: `mock_${Date.now()}` }));
      return;
    }
    res.writeHead(200); res.end("ok");
  });
}).listen(PORT, () => console.log(`mock resend on ${PORT}`));
