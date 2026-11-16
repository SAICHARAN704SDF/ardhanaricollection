"use client";
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/types/commerce";
import {
  filterProducts,
  money,
  type ProductFilters,
} from "@/lib/utils/commerce";
import { ProductCard } from "./product-card";
const baseDefaults: ProductFilters = {
  search: "",
  fabric: "",
  color: "",
  occasion: "",
  availability: "",
  maxPrice: 35000,
  sort: "featured",
};
export function Catalog({
  products,
  initialSearch = "",
}: {
  products: Product[];
  initialSearch?: string;
}) {
  const priceCeiling = Math.max(35000, ...products.map(p=>Math.ceil(p.price / 1000) * 1000));
  const defaults = {...baseDefaults, maxPrice:priceCeiling};
  const [f, setF] = useState({ ...defaults, search: initialSearch });
  const [filters, setFilters] = useState(false);
  const [limit, setLimit] = useState(12);
  const results = filterProducts(products, f);
  const change = (key: keyof ProductFilters, value: string | number) => {
    setF({ ...f, [key]: value });
    setLimit(12);
  };
  const active = Object.keys(defaults).filter(
    (k) =>
      k !== "sort" &&
      f[k as keyof ProductFilters] !== defaults[k as keyof ProductFilters],
  ).length;
  return (
    <div className="catalog">
      <div className="catalog-toolbar">
        <label className="catalog-search">
          <Search size={18} />
          <input
            type="search"
            aria-label="Search the collection"
            placeholder="Find your next favourite…"
            value={f.search}
            onChange={(e) => change("search", e.target.value)}
          />
        </label>
        <button
          className={`filter-toggle ${filters ? "active" : ""}`}
          aria-expanded={filters}
          aria-controls="catalog-filters"
          onClick={() => setFilters(!filters)}
        >
          <SlidersHorizontal size={16} /> Filter {active > 0 && `(${active})`}
        </button>
        <label className="sort-label">
          <span className="sr-only">Sort products</span>
          <select
            value={f.sort}
            onChange={(e) => change("sort", e.target.value)}
          >
            <option value="featured">The curated edit</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </label>
      </div>
      {filters && (
        <div id="catalog-filters" className="filter-panel">
          {(
            [
              {
                key: "fabric",
                title: "Fabric",
                options: [
                  "Kanjivaram Silk",
                  "Banarasi Silk",
                  "Organza",
                  "Chiffon & Georgette",
                  "Cotton Classics",
                ],
              },
              {
                key: "color",
                title: "Colour",
                options: Array.from(new Set(products.flatMap(p=>p.variants.map(v=>v.name)))).sort(),
              },
              {
                key: "occasion",
                title: "Occasion",
                options: Array.from(new Set(products.flatMap(p=>p.occasions))).sort(),
              },
              {
                key: "availability",
                title: "Availability",
                options: ["available", "unavailable"],
              },
            ] as const
          ).map((field) => (
            <label key={field.key}>
              {field.title}
              <select
                value={f[field.key]}
                onChange={(e) => change(field.key, e.target.value)}
              >
                <option value="">All {field.title.toLowerCase()}</option>
                {field.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
          ))}
          <label>
            Up to {money(f.maxPrice)}
            <input
              type="range"
              min="4000"
              max={priceCeiling}
              step="500"
              value={f.maxPrice}
              onChange={(e) => change("maxPrice", Number(e.target.value))}
            />
          </label>
          <button
            className="text-link"
            onClick={() => {
              setF(defaults);
              setLimit(12);
            }}
          >
            <X size={14} /> Clear filters
          </button>
        </div>
      )}
      <div className="catalog-count">
        <span aria-live="polite">{results.length} considered drapes</span>
        <span>Sample catalog · INR</span>
      </div>
      {results.length ? (
        <div className="product-grid">
          {results.slice(0, limit).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>A different thread to follow.</h2>
          <p>No drapes match these filters. Try a wider selection.</p>
          <button className="button secondary" onClick={() => setF(defaults)}>
            Reset filters
          </button>
        </div>
      )}
      {results.length > limit && (
        <div className="load-more">
          <button
            className="button secondary"
            onClick={() => setLimit(limit + 12)}
          >
            Discover more drapes
          </button>
          <span className="tiny">
            Showing {Math.min(limit, results.length)} of {results.length}
          </span>
        </div>
      )}
    </div>
  );
}
