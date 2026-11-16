"use client";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowLeft,
  ArrowUpRight,
  ImagePlus,
  Package,
  Layers3,
  Search,
  Save,
  Eye,
} from "lucide-react";
import {
  slugify,
  type CatalogData,
  type ProductEntry,
  type CollectionEntry,
  type Publication,
} from "@/lib/catalog/model";
import { useCatalog } from "@/stores/catalog";
import { money } from "@/lib/utils/commerce";
import type { Fabric } from "@/types/commerce";
const fabrics: Fabric[] = [
  "Kanjivaram Silk",
  "Banarasi Silk",
  "Organza",
  "Chiffon & Georgette",
  "Cotton Classics",
];
const blankProduct = (): ProductEntry => ({
  id: crypto.randomUUID(),
  slug: "",
  name: "",
  shortDescription: "",
  story: "",
  price: 0,
  currency: "INR",
  collections: [],
  category: "Saree",
  fabric: "Kanjivaram Silk",
  composition: "",
  feel: "",
  weave: "",
  design: "",
  border: "",
  pallu: "",
  blouse: "",
  dimensions: "",
  care: [],
  occasions: [],
  style: "Traditional",
  drape: "Lightweight",
  variants: [
    { id: crypto.randomUUID(), name: "", hex: "#b99a63", available: true },
  ],
  images: [],
  macroImages: [],
  videos: [],
  inventory: "available",
  featured: false,
  newArrival: true,
  sample: false,
  publication: "draft",
  seo: { title: "", description: "" },
});
const blankCollection = (): CollectionEntry => ({
  slug: "",
  name: "",
  description: "",
  image: "",
  sample: false,
  publication: "draft",
});
async function photo(file: File): Promise<string> {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 10 * 1024 * 1024
  )
    throw new Error("Choose JPG, PNG or WebP photos under 10 MB each.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not prepare this photo.");
  ctx.fillStyle = "#f8f5ef";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const result = canvas.toDataURL("image/jpeg", 0.86);
  if (result.length > 1600000)
    throw new Error(
      "This photo is too detailed. Please choose a smaller photo.",
    );
  return result;
}
export function Dashboard() {
  const router = useRouter();
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [tab, setTab] = useState<"products" | "collections">("products");
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all");
  const [product, setProduct] = useState<ProductEntry | null>(null),
    [collection, setCollection] = useState<CollectionEntry | null>(null);
  const [existing, setExisting] = useState(false),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [uploading, setUploading] = useState(false);
  const [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  async function load() {
    try {
      const r = await fetch("/api/admin/catalog", { cache: "no-store" });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setCatalog(data);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load catalog.");
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    const guard = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);
  const changeProduct = (patch: Partial<ProductEntry>) => {
    setProduct((p) => (p ? { ...p, ...patch } : null));
    setDirty(true);
  };
  const changeCollection = (patch: Partial<CollectionEntry>) => {
    setCollection((c) => (c ? { ...c, ...patch } : null));
    setDirty(true);
  };
  function close() {
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    setProduct(null);
    setCollection(null);
    setDirty(false);
    setError("");
  }
  function begin(kind: "products" | "collections") {
    setTab(kind);
    setExisting(false);
    setDirty(false);
    setError("");
    setNotice("");
    if (kind === "products") setProduct(blankProduct());
    else setCollection(blankCollection());
  }
  async function upload(
    e: ChangeEvent<HTMLInputElement>,
    kind: "product" | "collection",
  ) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      if (
        kind === "product" &&
        (product?.images.length ?? 0) + files.length > 6
      )
        throw new Error("Use up to six photos per saree.");
      const images = await Promise.all(files.map(photo));
      if (kind === "product")
        changeProduct({
          images: [
            ...(product?.images ?? []),
            ...images.map((src) => ({
              src,
              alt: product?.name || "Saree photograph",
            })),
          ],
        });
      else changeCollection({ image: images[0] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read this photo.");
    } finally {
      setUploading(false);
    }
  }
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!catalog || uploading) return;
    setBusy(true);
    setError("");
    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;
    const publication = (submitter?.value || "draft") as Publication;
    const entry = product
      ? {
          ...product,
          publication,
          images: product.images.map((i) => ({
            ...i,
            alt: i.alt || product.name,
          })),
        }
      : { ...collection!, publication };
    try {
      const response = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: product ? "product" : "collection",
          entry,
          revision: catalog.revision,
          existing,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setCatalog(data);
      setProduct(null);
      setCollection(null);
      setDirty(false);
      setNotice(
        publication === "published"
          ? `${entry.name} is published on the local storefront.`
          : publication === "archived"
            ? `${entry.name} is archived and hidden from the storefront.`
            : `${entry.name} saved as a draft. Customers cannot see it yet.`,
      );
      await useCatalog
        .getState()
        .refresh()
        .catch(() => {});
      window.dispatchEvent(new Event("catalog-updated"));
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not save. Your edits are still here.",
      );
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    if (error)
      document
        .querySelector(".studio-error")
        ?.scrollIntoView({ block: "center", behavior: "instant" });
  }, [error]);
  const editing = !!product || !!collection;
  return (
    <section className="studio-page">
      <header className="studio-heading">
        <div>
          <p className="eyebrow">ARDHANARI / CATALOG STUDIO</p>
          <h1>
            {editing
              ? existing
                ? "Refine your edit."
                : "A new chapter."
              : "Your collection, beautifully managed."}
          </h1>
          <p>
            {editing
              ? "Add the details your customers need to choose with confidence."
              : "Create collections. Add your sarees. Publish when everything feels right."}
          </p>
        </div>
        <Link className="button secondary" href="/shop" target="_blank">
          View storefront <ArrowUpRight size={16} />
        </Link>
      </header>
      <aside className="studio-mode">
        <strong>Local catalog workspace</strong>
        <span>
          Saved on this computer and shared with its running storefront.
          Payments remain in demo mode. Editing is disabled in production until
          secure admin access is connected.
        </span>
      </aside>
      {error && (
        <div role="alert" className="studio-error">
          {error}
          {!editing && (
            <button onClick={() => void load()}>Retry loading catalog</button>
          )}
        </div>
      )}
      {notice && (
        <div role="status" className="studio-success">
          {notice}
        </div>
      )}
      {!catalog && !error && <p role="status">Loading your catalog…</p>}
      {catalog && !editing && (
        <>
          <div className="studio-stats">
            <article>
              <span>Published sarees</span>
              <strong>
                {
                  catalog.products.filter((p) => p.publication === "published")
                    .length
                }
              </strong>
            </article>
            <article>
              <span>Draft sarees</span>
              <strong>
                {
                  catalog.products.filter((p) => p.publication === "draft")
                    .length
                }
              </strong>
            </article>
            <article>
              <span>Published collections</span>
              <strong>
                {
                  catalog.collections.filter(
                    (c) => c.publication === "published",
                  ).length
                }
              </strong>
            </article>
          </div>
          <div className="studio-guide">
            <div>
              <span>01</span>
              <strong>Create a collection</strong>
              <p>Give your edit a name, story and cover photo.</p>
            </div>
            <div>
              <span>02</span>
              <strong>Add your sarees</strong>
              <p>Upload photos, set prices and describe the fabric.</p>
            </div>
            <div>
              <span>03</span>
              <strong>Publish & review</strong>
              <p>Publish the collection first, then its sarees.</p>
            </div>
          </div>
          <div className="studio-toolbar">
            <div className="studio-tabs" role="group" aria-label="Catalog type">
              <button
                aria-pressed={tab === "products"}
                onClick={() => {
                  setTab("products");
                  setQuery("");
                  setFilter("all");
                }}
              >
                <Package size={17} /> Sarees
              </button>
              <button
                aria-pressed={tab === "collections"}
                onClick={() => {
                  setTab("collections");
                  setQuery("");
                  setFilter("all");
                }}
              >
                <Layers3 size={17} /> Collections
              </button>
            </div>
            <button className="button primary" onClick={() => begin(tab)}>
              <Plus size={17} /> Add{" "}
              {tab === "products" ? "saree" : "collection"}
            </button>
          </div>
          <div className="studio-search">
            <label>
              <Search size={16} />
              <input
                type="search"
                aria-label="Search catalog"
                placeholder="Search by name…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <select
              aria-label="Filter visibility"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All visibility</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="studio-list">
            {(tab === "products" ? catalog.products : catalog.collections)
              .filter(
                (v) =>
                  v.name.toLowerCase().includes(query.toLowerCase()) &&
                  (filter === "all" || v.publication === filter),
              )
              .map((item) => (
                <article key={"id" in item ? item.id : item.slug}>
                  {("images" in item ? item.images[0]?.src : item.image) ? (
                    <img
                      src={"images" in item ? item.images[0]?.src : item.image}
                      alt=""
                    />
                  ) : (
                    <span className="studio-list-placeholder">
                      <ImagePlus size={24} />
                    </span>
                  )}
                  <div>
                    <span className={`studio-status ${item.publication}`}>
                      {item.publication}
                    </span>
                    <h3>{item.name}</h3>
                    <p>
                      {"price" in item
                        ? `${money(item.price)} · ${item.fabric} · ${item.inventory === "available" ? "Available" : "Sold out"}`
                        : `${catalog.products.filter((p) => p.collections.includes(item.slug)).length} sarees assigned`}
                    </p>
                    {item.sample && <small>Sample catalog content</small>}
                  </div>
                  <div className="studio-row-actions">
                    <button
                      className="button secondary"
                      onClick={() => {
                        setExisting(true);
                        setDirty(false);
                        setError("");
                        setNotice("");
                        if ("id" in item) setProduct(structuredClone(item));
                        else setCollection(structuredClone(item));
                      }}
                    >
                      Edit
                    </button>
                    {item.publication === "published" && (
                      <Link
                        href={`/${"id" in item ? "products" : "collections"}/${item.slug}`}
                        target="_blank"
                        aria-label={`View ${item.name}`}
                      >
                        <Eye size={18} />
                      </Link>
                    )}
                  </div>
                </article>
              ))}
          </div>
          {(tab === "products" ? catalog.products : catalog.collections).filter(
            (v) =>
              v.name.toLowerCase().includes(query.toLowerCase()) &&
              (filter === "all" || v.publication === filter),
          ).length === 0 && (
            <div className="empty-state">
              <h2>No matches yet.</h2>
              <p>
                Try another search or add your first{" "}
                {tab === "products" ? "saree" : "collection"}.
              </p>
            </div>
          )}
        </>
      )}
      {catalog && editing && (
        <form onSubmit={save} className="studio-editor">
          <button type="button" className="text-link" onClick={close}>
            <ArrowLeft size={16} /> Back to catalog
          </button>
          <div className="studio-editor-grid">
            <div>
              <section className="studio-card">
                <p className="eyebrow">01 / THE ESSENTIALS</p>
                <h2>
                  {product ? "Introduce your saree" : "Create your collection"}
                </h2>
                <label>
                  {product ? "Saree name" : "Collection name"} *
                  <input
                    required
                    maxLength={120}
                    value={product?.name ?? collection?.name ?? ""}
                    onChange={(e) =>
                      product
                        ? changeProduct({
                            name: e.target.value,
                            ...(!existing
                              ? { slug: slugify(e.target.value) }
                              : {}),
                          })
                        : changeCollection({
                            name: e.target.value,
                            ...(!existing
                              ? { slug: slugify(e.target.value) }
                              : {}),
                          })
                    }
                  />
                </label>
                <label>
                  Storefront URL
                  <input
                    required
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    readOnly={existing}
                    value={product?.slug ?? collection?.slug ?? ""}
                    onChange={(e) =>
                      product
                        ? changeProduct({ slug: e.target.value })
                        : changeCollection({ slug: e.target.value })
                    }
                  />
                  <small>
                    /{product ? "products" : "collections"}/
                    {product?.slug ?? collection?.slug}{" "}
                    {existing ? "· Kept stable for shared links." : ""}
                  </small>
                </label>
                <label>
                  {product ? "Short description" : "Collection story"} *
                  <textarea
                    required
                    rows={3}
                    maxLength={3000}
                    value={
                      product?.shortDescription ?? collection?.description ?? ""
                    }
                    onChange={(e) =>
                      product
                        ? changeProduct({ shortDescription: e.target.value })
                        : changeCollection({ description: e.target.value })
                    }
                  />
                </label>
                {product && (
                  <div className="studio-fields">
                    <label>
                      Price (₹) *
                      <input
                        required
                        type="number"
                        min="0.01"
                        max="10000000"
                        step="0.01"
                        value={product.price || ""}
                        onChange={(e) =>
                          changeProduct({ price: Number(e.target.value) })
                        }
                      />
                    </label>
                    <label>
                      Fabric
                      <select
                        value={product.fabric}
                        onChange={(e) =>
                          changeProduct({ fabric: e.target.value as Fabric })
                        }
                      >
                        {fabrics.map((f) => (
                          <option key={f}>{f}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Availability
                      <select
                        value={product.inventory}
                        onChange={(e) =>
                          changeProduct({
                            inventory: e.target
                              .value as ProductEntry["inventory"],
                            variants: product.variants.map((v) => ({
                              ...v,
                              available: e.target.value === "available",
                            })),
                          })
                        }
                      >
                        <option value="available">Available</option>
                        <option value="unavailable">Sold out</option>
                      </select>
                    </label>
                  </div>
                )}
              </section>
              <section className="studio-card">
                <p className="eyebrow">02 / PHOTOGRAPHY</p>
                <h2>{product ? "Show every detail" : "Set the mood"}</h2>
                <p>
                  {product
                    ? "First photo is the cover. Add up to six photos, including border and pallu details."
                    : "Choose a cover photograph that represents this collection."}
                </p>
                <label className="studio-upload">
                  <ImagePlus size={25} />
                  <span>
                    {uploading ? "Preparing photos…" : "Choose photos"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple={!!product}
                    disabled={uploading || busy}
                    onChange={(e) =>
                      void upload(e, product ? "product" : "collection")
                    }
                  />
                  <small>
                    JPG, PNG or WebP · up to 10 MB each · optimised
                    automatically
                  </small>
                </label>
                <div className="studio-photos">
                  {(product
                    ? product.images
                    : collection?.image
                      ? [{ src: collection.image, alt: collection.name }]
                      : []
                  ).map((img, i) => (
                    <div key={i}>
                      <img src={img.src} alt={`Photo ${i + 1}`} />
                      <span>{i === 0 ? "Cover" : `Photo ${i + 1}`}</span>
                      {product && (
                        <>
                          <label className="sr-only" htmlFor={`alt-${i}`}>
                            Photo {i + 1} description
                          </label>
                          <input
                            id={`alt-${i}`}
                            placeholder="Describe this photo"
                            value={img.alt}
                            onChange={(e) =>
                              changeProduct({
                                images: product.images.map((v, n) =>
                                  n === i ? { ...v, alt: e.target.value } : v,
                                ),
                              })
                            }
                          />
                          {i > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                changeProduct({
                                  images: [
                                    img,
                                    ...product.images.filter((_, n) => n !== i),
                                  ],
                                })
                              }
                            >
                              Make cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              changeProduct({
                                images: product.images.filter(
                                  (_, n) => n !== i,
                                ),
                              })
                            }
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </section>
              {product && (
                <section className="studio-card">
                  <p className="eyebrow">03 / FABRIC & CRAFT</p>
                  <h2>Details that inspire confidence</h2>
                  <div className="studio-fields">
                    {(
                      [
                        "composition",
                        "dimensions",
                        "feel",
                        "weave",
                        "design",
                        "border",
                        "pallu",
                        "blouse",
                      ] as const
                    ).map((key) => (
                      <label key={key}>
                        {
                          {
                            composition: "Fabric composition",
                            dimensions: "Saree dimensions",
                            feel: "Texture & feel",
                            weave: "Weaving technique",
                            design: "Motifs & design",
                            border: "Border details",
                            pallu: "Pallu details",
                            blouse: "Blouse piece",
                          }[key]
                        }
                        <input
                          value={product[key]}
                          maxLength={3000}
                          onChange={(e) =>
                            changeProduct({ [key]: e.target.value })
                          }
                        />
                      </label>
                    ))}
                    <label>
                      Weight in grams (optional)
                      <input
                        type="number"
                        min="1"
                        value={product.weight ?? ""}
                        onChange={(e) =>
                          changeProduct({
                            weight: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                      />
                    </label>
                    <label>
                      Drape
                      <select
                        value={product.drape}
                        onChange={(e) =>
                          changeProduct({
                            drape: e.target.value as ProductEntry["drape"],
                          })
                        }
                      >
                        <option>Lightweight</option>
                        <option>Structured</option>
                      </select>
                    </label>
                    <label>
                      Style
                      <select
                        value={product.style}
                        onChange={(e) =>
                          changeProduct({
                            style: e.target.value as ProductEntry["style"],
                          })
                        }
                      >
                        <option>Traditional</option>
                        <option>Contemporary</option>
                      </select>
                    </label>
                  </div>
                  <label>
                    Care instructions · one per line
                    <textarea
                      rows={3}
                      value={product.care.join("\n")}
                      onChange={(e) =>
                        changeProduct({ care: e.target.value.split("\n") })
                      }
                    />
                  </label>
                  <label>
                    Occasions · comma separated
                    <input
                      value={product.occasions.join(",")}
                      onChange={(e) =>
                        changeProduct({ occasions: e.target.value.split(",") })
                      }
                      placeholder="Wedding, Festive, Evening"
                    />
                  </label>
                  <label>
                    The saree story
                    <textarea
                      rows={3}
                      value={product.story}
                      onChange={(e) => changeProduct({ story: e.target.value })}
                    />
                  </label>
                </section>
              )}
            </div>
            <aside>
              <section className="studio-card">
                <p className="eyebrow">STOREFRONT PREVIEW</p>
                <div className="studio-preview">
                  {product?.images[0]?.src || collection?.image ? (
                    <img
                      src={product?.images[0]?.src || collection?.image}
                      alt="Cover preview"
                    />
                  ) : (
                    <div className="studio-placeholder">
                      <ImagePlus size={32} />
                      <p>Your cover photo appears here</p>
                    </div>
                  )}
                  <h3>
                    {product?.name || collection?.name || "Your new edit"}
                  </h3>
                  <p>
                    {product ? money(product.price) : collection?.description}
                  </p>
                </div>
              </section>
              {product && (
                <>
                  <section className="studio-card">
                    <h3>Collections</h3>
                    <p>Choose at least one published collection.</p>
                    {catalog.collections
                      .filter((c) => c.publication !== "archived")
                      .map((c) => (
                        <label className="studio-check" key={c.slug}>
                          <input
                            type="checkbox"
                            checked={product.collections.includes(c.slug)}
                            onChange={(e) =>
                              changeProduct({
                                collections: e.target.checked
                                  ? [...product.collections, c.slug]
                                  : product.collections.filter(
                                      (s) => s !== c.slug,
                                    ),
                              })
                            }
                          />
                          {c.name} {c.publication === "draft" ? "(draft)" : ""}
                        </label>
                      ))}
                  </section>
                  <section className="studio-card">
                    <h3>Colours</h3>
                    {product.variants.map((v, i) => (
                      <div className="studio-colour" key={v.id}>
                        <input
                          type="color"
                          aria-label={`Colour ${i + 1} swatch`}
                          value={v.hex}
                          onChange={(e) =>
                            changeProduct({
                              variants: product.variants.map((x, n) =>
                                n === i ? { ...x, hex: e.target.value } : x,
                              ),
                            })
                          }
                        />
                        <input
                          required
                          aria-label={`Colour ${i + 1} name`}
                          placeholder="Colour name"
                          value={v.name}
                          onChange={(e) =>
                            changeProduct({
                              variants: product.variants.map((x, n) =>
                                n === i ? { ...x, name: e.target.value } : x,
                              ),
                            })
                          }
                        />
                        {i > 0 && (
                          <button
                            type="button"
                            aria-label={`Remove colour ${i + 1}`}
                            onClick={() =>
                              changeProduct({
                                variants: product.variants.filter(
                                  (_, n) => n !== i,
                                ),
                              })
                            }
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    {product.variants.length < 12 && (
                      <button
                        type="button"
                        className="text-link"
                        onClick={() =>
                          changeProduct({
                            variants: [
                              ...product.variants,
                              {
                                id: crypto.randomUUID(),
                                name: "",
                                hex: "#b99a63",
                                available: product.inventory === "available",
                              },
                            ],
                          })
                        }
                      >
                        Add colour
                      </button>
                    )}
                  </section>
                  <section className="studio-card">
                    <h3>Merchandising</h3>
                    <label className="studio-check">
                      <input
                        type="checkbox"
                        checked={product.featured}
                        onChange={(e) =>
                          changeProduct({ featured: e.target.checked })
                        }
                      />
                      Feature on homepage
                    </label>
                    <label className="studio-check">
                      <input
                        type="checkbox"
                        checked={product.newArrival}
                        onChange={(e) =>
                          changeProduct({ newArrival: e.target.checked })
                        }
                      />
                      Mark as new arrival
                    </label>
                  </section>
                </>
              )}
              <section className="studio-card">
                <h3>Before you publish</h3>
                <p>
                  {product
                    ? "Add photos, a price, colour, a published collection, composition, dimensions and care instructions."
                    : "Add a name, story and cover photograph."}
                </p>
                <p>
                  Drafts and archived entries stay hidden. Publish makes this
                  entry visible on the running storefront.
                </p>
                {(product?.sample || collection?.sample) && (
                  <p className="tiny">
                    This entry retains its sample-content label. Create a new
                    entry for your own inventory.
                  </p>
                )}
              </section>
            </aside>
          </div>
          <div className="studio-savebar">
            <span>
              {dirty ? "Unsaved changes" : "Ready to edit"}
              {uploading ? " · Preparing photos" : ""}
            </span>
            <button
              type="button"
              className="button secondary"
              onClick={close}
              disabled={busy}
            >
              Cancel
            </button>
            <button
              className="button secondary"
              type="submit"
              formNoValidate
              value="draft"
              disabled={busy || uploading}
            >
              <Save size={16} />
              Save draft
            </button>
            {existing && (
              <button
                className="button secondary"
                type="submit"
                formNoValidate
                value="archived"
                disabled={busy || uploading}
              >
                Archive
              </button>
            )}
            <button
              className="button primary"
              type="submit"
              value="published"
              disabled={busy || uploading}
            >
              {busy ? "Saving…" : "Publish to storefront"}
              <ArrowUpRight size={16} />
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
