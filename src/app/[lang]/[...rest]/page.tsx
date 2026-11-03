import { notFound } from "next/navigation";
// Catch-all so unknown URLs inside a locale render the localized layout's not-found page with status 404.
export default function CatchAll() { notFound(); }
