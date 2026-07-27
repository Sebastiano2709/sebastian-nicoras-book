"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import Image from "next/image";

type LightboxState = { images: string[]; index: number } | null;

type LightboxContextType = {
  open: (images: string[], index: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
};

const LightboxContext = createContext<LightboxContextType | null>(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within LightboxProvider");
  return ctx;
}

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LightboxState>(null);

  const open = useCallback((images: string[], index: number) => {
    setState({ images, index });
  }, []);

  const close = useCallback(() => setState(null), []);

  const next = useCallback(() => {
    setState((s) => (s ? { ...s, index: (s.index + 1) % s.images.length } : s));
  }, []);

  const prev = useCallback(() => {
    setState((s) => (s ? { ...s, index: (s.index - 1 + s.images.length) % s.images.length } : s));
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!state) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [state, close, next, prev]);

  return (
    <LightboxContext.Provider value={{ open, close, next, prev }}>
      {children}
      {state && (
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); close(); }}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "24px",
              right: "32px",
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "2rem",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>

          {state.images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous"
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "2.5rem",
                cursor: "pointer",
                padding: "12px",
              }}
            >
              ‹
            </button>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              maxWidth: "1000px",
              maxHeight: "88vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              key={state.images[state.index]}
              src={state.images[state.index]}
              alt=""
              width={1400}
              height={1800}
              priority
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "100%",
                maxHeight: "88vh",
                objectFit: "contain",
              }}
            />
          </div>

          {state.images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next"
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "2.5rem",
                cursor: "pointer",
                padding: "12px",
              }}
            >
              ›
            </button>
          )}

          {state.images.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "50%",
                transform: "translateX(-50%)",
                color: "#fff",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                fontFamily: "monospace",
              }}
            >
              {state.index + 1} / {state.images.length}
            </div>
          )}
        </div>
      )}
    </LightboxContext.Provider>
  );
}

export function LightboxTrigger({
  images,
  index,
  children,
}: {
  images: string[];
  index: number;
  children: React.ReactNode;
}) {
  const { open } = useLightbox();
  return (
    <div onClick={() => open(images, index)} style={{ cursor: "zoom-in" }}>
      {children}
    </div>
  );
}