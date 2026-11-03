import Link from "next/link";
// Rendered for notFound() inside [lang]; texts are bilingual because not-found receives no params.
export default function NotFound() {
  return (
    <>
    <header className="bar"><div className="bar-in"><span /><Link href="/en" className="wordmark">Sebastiano Nicoras</Link><span /></div></header>
    <main id="main" tabIndex={-1} className="focus:outline-none">
    <section className="container-book py-24 md:py-32">
      <p className="t-label">404</p>
      <h1 className="t-display mt-4 text-[clamp(2.25rem,1.5rem+3vw,4.25rem)]">
        Page not found <span className="block not-italic text-ink-muted" lang="ro">Pagina nu există</span>
      </h1>
      <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
        <Link className="link-underline" href="/en">Back to the book</Link>
        <Link className="link-underline" href="/ro" lang="ro">Înapoi la book</Link>
      </p>
    </section>
    </main>
    </>
  );
}
