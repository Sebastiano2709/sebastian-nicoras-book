"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { trackEvent, type EventName } from "@/lib/analytics";

export type MenuItem = { label: string; href: string; external?: boolean; event?: EventName };

/**
 * Full-screen menu as a native modal <dialog> (showModal): the page behind is inert, focus is trapped by the
 * browser, Escape closes, focus returns to the menu button. The links animate in with CSS only.
 */
export function SiteMenu({ items, lang, labels, wordmark, foot, language }: {
  items: MenuItem[];
  lang: string;
  labels: { open: string; close: string; nav: string };
  wordmark: string;
  foot: string[];
  language: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => { document.documentElement.style.overflow = ""; button.current?.setAttribute("aria-expanded", "false"); button.current?.focus(); };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  const open = () => {
    dialog.current?.showModal();
    document.documentElement.style.overflow = "hidden";
    button.current?.setAttribute("aria-expanded", "true");
  };
  const close = () => dialog.current?.close();

  return (
    <>
      <button ref={button} type="button" className="burger" aria-label={labels.open} aria-haspopup="dialog" aria-expanded="false" onClick={open}>
        <i /><i />
      </button>
      <dialog ref={dialog} className="menu" aria-label={labels.nav}>
        <div className="menu-top">
          <button type="button" className="close-x" aria-label={labels.close} onClick={close} />
          <span className="wordmark" aria-hidden="true">{wordmark}</span>
          {language}
        </div>
        <nav aria-label={labels.nav}>
          <ul>
            {items.map((i) => (
              <li key={i.href}>
                {i.external || i.href.endsWith(".pdf") ? (
                  <a href={i.href} {...(i.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onClick={() => { if (i.event) trackEvent(i.event, { cta_location: "menu" }); close(); }}>
                    {i.label}
                  </a>
                ) : (
                  <Link href={i.href} onClick={close} aria-current={i.href === pathname ? "page" : undefined}>{i.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu-foot t-label" lang={lang}>
          {foot.map((f) => <span key={f}>{f}</span>)}
        </div>
      </dialog>
    </>
  );
}
