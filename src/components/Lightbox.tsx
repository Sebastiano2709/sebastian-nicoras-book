"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
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
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const isSwiping = useRef(false);

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

  useEffect(() => {
    if (!state) return;
    const total = state.images.length;
    const nextIdx = (state.index + 1) % total;
    const prevIdx = (state.index - 1 + total) % total;
    [nextIdx, prevIdx].forEach((i) => {
      const img = new window.Image();
      img.src = state.images[i];
    });
  }, [state]);

  // Native, non-passive touch listeners so we can fully own the horizontal swipe gesture
  useEffect(() => {
    const el = overlayRef.current;
    if (!el || !state) return;

    function onTouchStart(e: TouchEvent) {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      isSwiping.current = false;
    }

    function onTouchMove(e: TouchEvent) {
      const dx = e.touches[0].clientX - startX.current;
      const dy = e.touches[0].clientY - startY.current;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        isSwiping.current = true;
        e.preventDefault();
      }
    }

    function onTouchEnd(e: TouchEvent) {
      if (!isSwiping.current) return;
      const dx = e.changedTouches[0].clientX - startX.current;
      if (Math.abs(dx) > 50) {
        if (dx < 0) {
          next();
        } else {
          prev();
        }
      }
      isSwiping.current = false;
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [state, next, prev]);

  return (
    <LightboxContext.Provider value={{ open, close, next, prev }}>
      {children}
      {state && (
        <div
          ref={overlayRef}
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
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              width: "48px",
              height: "48px",
              background: "rgba(0,0,0,0.4)",
              border: "none",
              borderRadius: "50%",
              color: "#fff",
              fontSize: "1.8rem",
              cursor: "pointer",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10000,
              touchAction: "manipulation",
            }}
          >
            ×
          </button>

          {state.images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
              style={{
                position: "absolute",
                left: "4px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "56px",
                height: "56px",
                background: "rgba(0,0,0,0.3)",
                border: "none",
                borderRadius: "50%",
                color: "#fff",
                fontSize: "2rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10000,
                touchAction: "manipulation",
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
              quality={80}
              sizes="(max-width: 768px) 100vw, 1000px"
              draggable={false}
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "100%",
                maxHeight: "88vh",
                objectFit: "contain",
                userSelect: "none",
              }}
            />
          </div>

          {state.images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
              style={{
                position: "absolute",
                right: "4px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "56px",
                height: "56px",
                background: "rgba(0,0,0,0.3)",
                border: "none",
                borderRadius: "50%",
                color: "#fff",
                fontSize: "2rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10000,
                touchAction: "manipulation",
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