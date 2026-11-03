// Fail fast at server start when the environment is invalid (05 §2.9) — not during `next build`.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { env } = await import("@/server/env");
    env();
  }
}
