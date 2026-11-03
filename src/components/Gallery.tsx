"use client";
import Image from "next/image";
import {
  createContext, useCallback, useContext, useEffect, useRef, useState,
  type CSSProperties, type PointerEvent, type ReactNode,
} from "react";

export type GalleryPhoto = { src: string; width: number; height: number; alt: string; lqip: string };
export type GalleryLabels = { view: string; dialog: string; close: string; previous: string; next: string; of: string };

type Ctx = { open: (index: number, button: HTMLButtonElement) => void; photos: GalleryPhoto[]; label: string };
const GroupContext = createContext<Ctx | null>(null);

/**
 * One lightbox per group of photos (portfolio, polaroids). The frames can live anywhere inside the group
 * (the portfolio's lead photo sits in the talent block, the rest in the grid) and open the same viewer.
 * Viewer: ONE native <dialog> (showModal → page inert, Escape closes, focus returns to the opener),
 * arrow keys, swipe, neighbours preloaded.
 */
export function PhotoGroup({ photos, labels, title, children }: {
  photos: GalleryPhoto[];
  labels: GalleryLabels;
  title: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const total = photos.length;

  const open = useCallback((i: number, button: HTMLButtonElement) => { openerRef.current = button; setIndex(i); }, []);
  // Open after React has rendered the dialog's content, so showModal() focuses the first control in it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (index === null || !dialog || dialog.open) return;
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
  }, [index]);
  const close = useCallback(() => dialogRef.current?.close(), []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + total) % total)), [total]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setIndex(null);
      document.documentElement.style.overflow = "";
      openerRef.current?.focus();
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const start = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: PointerEvent) => { start.current = { x: e.clientX, y: e.clientY }; };
  const onPointerUp = (e: PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  };

  const current = index === null ? null : photos[index];

  return (
    <GroupContext.Provider value={{ open, photos, label: labels.view }}>
      {children}
      <dialog ref={dialogRef} aria-label={`${labels.dialog}: ${title}`} className="lightbox"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
        }}>
        {index !== null && current ? (
          <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto]">
            <div className="lb-bar">
              <p aria-live="polite" className="lb-count">
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
                <span className="sr-only">{index + 1} {labels.of} {total}</span>
              </p>
              <button type="button" onClick={close}>{labels.close}</button>
            </div>
            <div className="lb-stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp}
              onPointerCancel={() => { start.current = null; }}>
              {[-1, 0, 1].map((d) => {
                const j = (index + d + total) % total;
                const p = photos[j];
                if (!p || (d !== 0 && j === index)) return null;
                return (
                  <Image key={d === 0 ? `cur-${p.src}` : `${d}-${p.src}`} src={p.src} alt={d === 0 ? p.alt : ""} aria-hidden={d === 0 ? undefined : true}
                    fill sizes="100vw" quality={85} loading="eager" draggable={false}
                    className={d === 0 ? "lb-current" : "pointer-events-none opacity-0"} />
                );
              })}
            </div>
            <div className="lb-bar">
              <button type="button" onClick={() => step(-1)}><span aria-hidden="true">←&nbsp;</span>{labels.previous}</button>
              <button type="button" onClick={() => step(1)}>{labels.next}<span aria-hidden="true">&nbsp;→</span></button>
            </div>
          </div>
        ) : null}
      </dialog>
    </GroupContext.Provider>
  );
}

/**
 * One photo, always shown whole: the frame takes the photo's own proportions (owner's request 2026-11-03 —
 * no feet or heads cut). Below-the-fold frames get the zoom-in reveal; frames already in view at hydration
 * are never hidden (09 §15.1). A blurred placeholder fills the frame until the photo has loaded.
 */
export function Frame({ index, sizes, eager = false }: { index: number; sizes: string; eager?: boolean }) {
  const ctx = useContext(GroupContext);
  const ref = useRef<HTMLElement>(null);
  const loaded = useRef(false);
  const photo = ctx?.photos[index];

  const markLoaded = useCallback(() => {
    const el = ref.current;
    if (!el || loaded.current) return;
    loaded.current = true;
    el.classList.add("loaded");
    window.setTimeout(() => el.classList.add("settled"), 2300);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const img = el.querySelector("img");
    if (img?.complete && img.naturalWidth) markLoaded();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already visible: never hide it
    el.classList.add("armed");
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { el.classList.add("in"); io.disconnect(); }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, [markLoaded]);

  if (!ctx || !photo) return null;
  return (
    <figure ref={ref} className="frame"
      style={{ "--lq": `url(${photo.lqip})`, aspectRatio: `${photo.width} / ${photo.height}` } as CSSProperties}>
      <button type="button" onClick={(e) => ctx.open(index, e.currentTarget)}>
        <span className="sr-only">{ctx.label} </span>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} loading={eager ? "eager" : "lazy"}
          onLoad={markLoaded} onError={markLoaded} />
      </button>
    </figure>
  );
}
