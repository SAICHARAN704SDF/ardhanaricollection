import type { Metadata } from "next";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | Ardhanari Collection`,
      description,
      url: path,
      images: [
        {
          url: "/images/heritage-hero.jpg",
          width: 1067,
          height: 1600,
          alt: "Ardhanari Collection sample editorial",
        },
      ],
    },
  };
}
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
