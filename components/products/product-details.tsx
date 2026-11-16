"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Heart,
  ArrowRight,
  ScanSearch,
  ChevronLeft,
  ChevronRight,
  Truck,
  PackageCheck,
} from "lucide-react";
import type { Product } from "@/types/commerce";
import { money } from "@/lib/utils/commerce";
import { useShoppingAuth } from "@/components/auth/shopping-auth";
import { useShop } from "@/stores/shop";
import { Modal, Quantity } from "@/components/layout/primitives";
export function ProductDetails({
  product: p,
  overlay = false,
}: {
  product: Product;
  overlay?: boolean;
}) {
  const [selected, setSelected] = useState(0);
  const [variant, setVariant] = useState(p.variants[0].id);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [detail, setDetail] = useState("Body");
  const [scale, setScale] = useState(2);
  const [origin, setOrigin] = useState("50% 50%");
  const { add, pending, ready } = useShoppingAuth();
  const toggle = useShop((s) => s.toggleWish);
  const saved = useShop((s) => s.wishlist.includes(p.id));
  const router = useRouter();
  const available = p.inventory === "available" && p.variants.find((v) => v.id === variant)?.available;
  const startX = useRef(0);
  return (
    <div className={`product-details ${overlay ? "in-reveal" : ""}`}>
      <div className="product-gallery">
        <motion.div
          layoutId={`product-${p.id}`}
          className={`main-product-image crop-${selected}`}
          onTouchStart={(e) => {
            startX.current = e.changedTouches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const delta = e.changedTouches[0].clientX - startX.current;
            if (Math.abs(delta) > 45)
              setSelected((selected + (delta < 0 ? 1 : p.images.length - 1)) % p.images.length);
          }}
        >
          <Image
            src={p.images[selected].src}
            alt={p.images[selected].alt}
            fill
            sizes="(max-width: 800px) 100vw, 60vw"
            priority
            style={{ objectPosition: p.images[selected].position ?? "center" }}
          />
          <span className="image-caption">
            THE SAREE REVEAL / {String(selected + 1).padStart(2, "0")}
          </span>
          <button className="weave-button" onClick={() => setZoom(true)}>
            <ScanSearch size={17} /> Explore the weave
          </button>
          <div className="gallery-arrows">
            <button
              className="icon-button"
              aria-label="Previous image"
              onClick={() => setSelected((selected + p.images.length - 1) % p.images.length)}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="icon-button"
              aria-label="Next image"
              onClick={() => setSelected((selected + 1) % p.images.length)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
        <div className="thumbnail-row">
          {p.images.map((img, i) => (
            <button
              key={i}
              className={selected === i ? "active" : ""}
              onClick={() => setSelected(i)}
              aria-label={`View photo ${i + 1}`}
              aria-pressed={selected === i}
            >
              <Image
                src={img.src}
                alt=""
                width={70}
                height={90}
                style={{
                  objectPosition: img.position,
                  transform: p.sample && i ? "scale(1.4)" : "none",
                }}
              />
            </button>
          ))}
          <p>
            {p.sample ? "AI-generated sample imagery." : "Product photographs supplied by Ardhanari."}
            <br />
            {p.sample ? "Detail views are illustrative crops." : "Select a photograph to inspect the details."}
          </p>
        </div>
      </div>
      <div className="product-information">
        <p className="eyebrow">{p.fabric} / THE ARDHANARI EDIT</p>
        <h1>{p.name}</h1>
        <p className="product-description">{p.shortDescription}</p>
        <div className="price-line">
          {money(p.price)}
          <span>INR · Demo price</span>
        </div>
        <p className="sample-note">
          {p.sample ? "Sample catalog. AI-generated images, colours and specifications illustrate the experience and are not verified inventory." : "Catalog entry supplied by Ardhanari. Checkout is currently a demonstration; no real payments or orders."}
        </p>
        <div className="variant-header">
          <span>Colour</span>
          <span>{p.variants.find((v) => v.id === variant)?.name}</span>
        </div>
        <div className="variant-options">
          {p.variants.map((v) => (
            <button
              key={v.id}
              className={variant === v.id ? "selected" : ""}
              onClick={() => setVariant(v.id)}
              aria-label={`${v.name}${v.available ? "" : " — unavailable"}`}
              aria-pressed={variant === v.id}
            >
              <span style={{ background: v.hex }} />
              {v.name}
            </button>
          ))}
        </div>
        {variant !== "original" && (
          <p className="tiny">
            Concept colour only; photography does not change.
          </p>
        )}
        <div className="purchase-row">
          <Quantity value={qty} onChange={setQty} />
          <button
            className="button primary"
            disabled={!available || pending || !ready}
            onClick={() => add(p.id, variant, qty)}
          >
            {available ? "Add to bag" : "Unavailable"}
            <ArrowRight size={17} />
          </button>
          <button
            className={`icon-button wishlist-detail ${saved ? "saved" : ""}`}
            onClick={() => toggle(p.id)}
            aria-label="Toggle wishlist"
            aria-pressed={saved}
          >
            <Heart size={19} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <button
          className="button buy-now"
          disabled={!available || pending || !ready}
          onClick={() => void add(p.id, variant, qty, true)}
        >
          Try demo checkout
        </button>
        <div className="delivery-notes">
          <p>
            <Truck size={17} /> Delivery estimates will appear with live
            shipping.
          </p>
          <p>
            <PackageCheck size={17} /> 7-day returns for unused, unaltered
            sarees. Pre-launch policy. <Link href="/returns">Read draft</Link>
          </p>
        </div>
        <div className="product-accordions">
          <details open>
            <summary>The fabric & the feeling</summary>
            <ul>
              <li>{p.composition}</li>
              <li>
                {p.feel} · {p.drape.toLowerCase()} drape
              </li>
              <li>{p.weave}</li>
              <li>
                {p.dimensions}{p.weight ? ` · Approx. ${p.weight} g` : ""}
              </li>
            </ul>
          </details>
          <details>
            <summary>Design, border & pallu</summary>
            <ul>
              <li>{p.design}</li>
              <li>{p.border}</li>
              <li>{p.pallu}</li>
              <li>Embroidery and zari composition unverified.</li>
              <li>{p.blouse}</li>
              <li>Suggested occasions: {p.occasions.join(", ")}</li>
              <li>Manufacturing origin: not yet verified.</li>
            </ul>
          </details>
          <details>
            <summary>A story in every drape</summary>
            <p>{p.story}</p>
          </details>
          <details>
            <summary>Keeping it beautiful</summary>
            <ul>
              {p.care.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </details>
        </div>
        <a className="text-link" href={`/products/${p.slug}`}>
          Open standalone product page <ArrowRight size={14} />
        </a>
      </div>
      <Modal
        open={zoom}
        onClose={() => setZoom(false)}
        title="Explore the weave"
        className="weave-modal"
      >
        <div className="weave-toolbar">
          <p className="eyebrow">THE TEXTILE STUDY</p>
          <h2>Explore the weave</h2>
          <p>
            {p.sample ? "Illustrative crops of sample photography." : "Zoom into the selected product photograph."}
          </p>
          <div className="detail-tabs">
            {p.macroImages.map((m) => (
              <button
                key={m.detail}
                className={detail === m.detail ? "active" : ""}
                onClick={() => {
                  setDetail(m.detail);
                  setOrigin(
                    m.detail === "Border"
                      ? "75% 70%"
                      : m.detail === "Pallu"
                        ? "25% 50%"
                        : "50% 50%",
                  );
                }}
              >
                {m.detail}
              </button>
            ))}
          </div>
          <label>
            Magnification · {scale.toFixed(1)}×
            <input
              type="range"
              min="1"
              max="4"
              step=".1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
            />
          </label>
          <p className="tiny">
            Move your pointer to inspect. On touch screens, select a detail and
            adjust magnification.
          </p>
        </div>
        <div
          className="macro-image"
          onPointerMove={(e) => {
            if (e.pointerType === "mouse") {
              const r = e.currentTarget.getBoundingClientRect();
              setOrigin(
                `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`,
              );
            }
          }}
        >
          <Image
            src={p.images[selected].src}
            alt={`Magnified ${detail.toLowerCase()} crop`}
            fill
            sizes="80vw"
            style={{ transform: `scale(${scale})`, transformOrigin: origin }}
          />
          <span>{p.sample ? `${detail} / SAMPLE CROP` : "PRODUCT DETAIL"}</span>
        </div>
      </Modal>
    </div>
  );
}
