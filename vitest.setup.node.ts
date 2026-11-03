import { vi } from "vitest";
// `import "server-only"` throws outside the Next.js server runtime (10 §3.3).
vi.mock("server-only", () => ({}));
