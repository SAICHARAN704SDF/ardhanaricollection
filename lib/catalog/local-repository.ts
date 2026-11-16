import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { products, collections } from "@/lib/mock-data/catalog";
import { storefront, validateEntry, type CatalogData } from "./model";
const directory =
  process.env.CATALOG_DATA_DIRECTORY || path.join(process.cwd(), ".local");
const filename = path.join(directory, "catalog.json");
export async function readCatalog(): Promise<CatalogData> {
  try {
    return JSON.parse(await readFile(filename, "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return {
      revision: 0,
      products: products.map((p) => ({ ...p, publication: "published" })),
      collections: collections.map((c) => ({
        ...c,
        sample: true,
        publication: "published",
      })),
    };
  }
}
export async function publicCatalog() {
  return storefront(await readCatalog());
}
let queue: Promise<unknown> = Promise.resolve();
export function saveEntry(
  kind: "product" | "collection",
  input: unknown,
  revision: number,
  existing = true,
) {
  const task = queue.then(async () => {
    const data = await readCatalog();
    if (data.revision !== revision)
      throw new Error(
        "Catalog changed in another tab. Reload the catalog before saving.",
      );
    const entry = validateEntry(kind, input);
    if (kind === "product") {
      const p = entry as CatalogData["products"][number];
      if (data.products.some((v) => v.slug === p.slug && v.id !== p.id))
        throw new Error("A saree already uses this URL.");
      if (
        p.collections.some((s) => !data.collections.some((c) => c.slug === s))
      )
        throw new Error("Choose existing collections.");
      if (
        p.publication === "published" &&
        !p.collections.some((s) =>
          data.collections.some(
            (c) => c.slug === s && c.publication === "published",
          ),
        )
      )
        throw new Error("Publish at least one selected collection first.");
      data.products = [...data.products.filter((v) => v.id !== p.id), p];
    } else {
      const c = entry as CatalogData["collections"][number];
      if (!existing && data.collections.some((v) => v.slug === c.slug))
        throw new Error(
          "A collection already uses this URL. Choose another name or URL.",
        );
      data.collections = [
        ...data.collections.filter((v) => v.slug !== c.slug),
        c,
      ];
    }
    data.revision++;
    await mkdir(directory, { recursive: true });
    const temp = `${filename}.${crypto.randomUUID()}.tmp`;
    await writeFile(temp, JSON.stringify(data), "utf8");
    await rename(temp, filename);
    return data;
  });
  queue = task.catch(() => {});
  return task;
}
