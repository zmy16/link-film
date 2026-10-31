import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.link-film.eu.org",
      // Fixed build-time date — the content only changes when a provider is
      // added, and a lastmod that moves on every ISR refresh teaches Google to
      // ignore the field. Update by hand when the provider list changes.
      lastModified: "2026-10-31",
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
