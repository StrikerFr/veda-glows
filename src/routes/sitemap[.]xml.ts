import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = process.env.VITE_APP_URL || "https://vedaglows.com";

interface SitemapEntry {
  path: string;
  changefreq?: "weekly" | "monthly" | "yearly";
  priority?: string;
  lastmod?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split('T')[0];
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0", lastmod: today },
          { path: "/about", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/faqs", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/support", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/refund", changefreq: "yearly", priority: "0.4", lastmod: today },
          { path: "/privacy", changefreq: "yearly", priority: "0.3", lastmod: today },
          { path: "/terms", changefreq: "yearly", priority: "0.3", lastmod: today },
        ];

        const urls = entries.map(
          (e) =>
            `  <url>\n    <loc>\${BASE_URL}\${e.path}</loc>\n    <lastmod>\${e.lastmod}</lastmod>\n    <changefreq>\${e.changefreq}</changefreq>\n    <priority>\${e.priority}</priority>\n  </url>`,
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});