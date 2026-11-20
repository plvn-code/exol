import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/fiat", "/rates", "/faq", "/aml", "/terms", "/privacy"].map((p) => ({ url: SITE.url + p, changeFrequency: "weekly", priority: p ? 0.7 : 1 }));
}
