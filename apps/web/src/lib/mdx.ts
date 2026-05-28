import { readFile } from "fs/promises";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "./mdx-components";
import type { MDXComponents } from "./mdx-components";

const contentDir = path.join(process.cwd(), "src/content");

export async function loadMDX(slug: string, components?: MDXComponents) {
  const filePath = slug.startsWith("/") ? slug : path.join(contentDir, `${slug}.mdx`);
  const source = await readFile(filePath, "utf-8");
  return compileMDX({
    source,
    components: { ...mdxComponents, ...components },
    options: { parseFrontmatter: false },
  });
}
