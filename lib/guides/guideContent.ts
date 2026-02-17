import fs from "node:fs";
import path from "node:path";
import type { GuideSlug } from "./guideTypes";

const CONTENT_ROOT = path.join(process.cwd(), "content", "guides");

export function getGuideMdxSource(slug: GuideSlug): string {
  const filePath = path.join(CONTENT_ROOT, `${slug}.mdx`);
  return fs.readFileSync(filePath, "utf8");
}
