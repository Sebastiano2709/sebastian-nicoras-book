import "server-only";
// Minimal structured logger; swap for the host's logging integration. Never log message bodies or full emails.
type Fields = Record<string, unknown>;
function write(level: "info" | "warn" | "error", fields: Fields, msg: string) {
  const err = fields.err instanceof Error ? fields.err.message : fields.err;
  const line = JSON.stringify({ level, msg, ...fields, ...(err !== undefined ? { err } : {}), time: new Date().toISOString() });
  if (level === "error") console.error(line);
  else console.log(line);
}
export const logger = {
  info: (fields: Fields, msg: string) => write("info", fields, msg),
  warn: (fields: Fields, msg: string) => write("warn", fields, msg),
  error: (fields: Fields, msg: string) => write("error", fields, msg),
};
