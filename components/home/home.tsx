import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Sparkles,
  Flower2,
  Layers3,
} from "lucide-react";
import { Crest } from "@/components/layout/crest";
import { publicCatalog } from "@/lib/catalog/repository";
import { ProductCard } from "@/components/products/product-card";
import { SignaturePhoto } from "@/components/animations/editorial-art";
import { FadeIn } from "@/components/animations/reveal";
import { Testimonials } from "./testimonials";
import { Newsletter } from "./newsletter";
import { Quiz } from "./quiz";
export async function Home() {
  const { products, collections } = await publicCatalog();
  return (
    <>
      <section className="heritage-hero">
        <Image
          src="/images/heritage-hero.jpg"
          alt="AI-generated concept editorial: an ivory and gold saree in a sandstone courtyard, not a catalog product"
          fill
          priority
          sizes="(max-width:540px) 1200px, (max-width:1100px) 1100px, 100vw"
          className="heritage-hero-image"
        />
        <div className="heritage-hero-shade" />
        <div className="heritage-hero-copy">
          <p className="eyebrow">THE ART OF TIMELESS DRAPES</p>
          <h1>
            Elegance,
            <br />
            <em>Woven Into</em>
            <br />
            Every Thread.
          </h1>
          <p>
            Discover sarees that carry the soul of tradition
            <br className="desktop-break" /> and the beauty of modern elegance.
          </p>
          <div className="hero-actions">
            <Link href="/shop" className="button light">
              Explore the collection <ArrowUpRight size={16} />
            </Link>
            <Link href="/about" className="text-link">
              Discover our story <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <div className="heritage-hero-bottom">
          <a href="#collections">
            <span className="hero-line" /> THE COLLECTION, UNFOLDED{" "}
            <ArrowDown size={14} />
          </a>
          <span>THE ARDHANARI EDIT · AI CONCEPT EDITORIAL</span>
        </div>
        <div className="hero-vertical">A QUIETER EXPRESSION OF LUXURY</div>
      </section>
      <section className="house-introduction">
        <Crest />
        <p className="eyebrow">THE HOUSE OF ARDHANARI</p>
        <h2>
          Some things are not simply worn.
          <br />
          <em>They become part of you.</em>
        </h2>
        <p>
          A familiar fold. A beautifully considered border. The way silk catches
          the light.
          <br />
          We celebrate the quiet details that make a saree feel timeless—and
          entirely your own.
        </p>
        <Link href="/about" className="text-link">
          Step inside our world <ArrowUpRight size={15} />
        </Link>
      </section>
      <section id="collections" className="section collections-section">
        <FadeIn>
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE COLLECTIONS</p>
              <h2>
                Many expressions.
                <br />
                <em>One timeless elegance.</em>
              </h2>
            </div>
            <Link href="/collections" className="text-link">
              Discover all collections <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="editorial-collections">
            {collections.slice(0, 3).map((c, i) => (
              <Link
                href={`/collections/${c.slug}`}
                key={c.slug}
                className={`collection-card collection-${i}`}
              >
                <Image
                  src={c.image}
                  alt={c.sample ? `AI-generated concept imagery for the ${c.name} collection` : c.name}
                  fill
                  sizes="(max-width: 700px) 90vw, 33vw"
                />
                <div className="collection-card-copy">
                  <span>0{i + 1} / THE COLLECTION</span>
                  <h3>{c.name}</h3>
                  <span className="collection-arrow">
                    <ArrowUpRight size={22} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="collection-index">
            {collections.slice(3).map((c) => (
              <Link href={`/collections/${c.slug}`} key={c.slug}>
                {c.name}
                <ArrowUpRight size={13} />
              </Link>
            ))}
          </div>
        </FadeIn>
      </section>
      <section className="section">
        <FadeIn>
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE CONSIDERED SELECTION</p>
              <h2>
                Find your <em>forever favourite.</em>
              </h2>
            </div>
            <Link href="/shop" className="text-link">
              Shop all sarees <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="product-grid">
            {products
              .filter((p) => p.featured)
              .map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
          </div>
          <p className="catalog-disclaimer">
            Sample items are labelled AI concept. Store-supplied items are labelled Ardhanari collection. Checkout remains in demo mode.
          </p>
        </FadeIn>
      </section>
      <section className="signature-edit">
        <SignaturePhoto />
        <div className="signature-shade" />
        <div className="signature-copy">
          <p className="eyebrow">THE SIGNATURE EDIT</p>
          <h2>
            Not Just Worn.
            <br />
            <em>Remembered.</em>
          </h2>
          <p>For the moments you carry with you.</p>
          <Link href="/collections/wedding" className="button light">
            Explore the wedding edit <ArrowUpRight size={16} />
          </Link>
        </div>
        <span className="signature-footnote">
          AN EDITORIAL STUDY / AI-GENERATED CONCEPT
        </span>
      </section>
      <section className="section quiz-section">
        <Quiz />
      </section>
      <section className="craft-section section">
        <div className="craft-image">
          <Image
            src="/images/heritage-textiles.jpg"
            alt="AI-generated textile still life with ivory, rose and burgundy fabrics; concept imagery"
            fill
            sizes="(max-width: 700px) 100vw, 45vw"
          />
          <span>THE TEXTILE STUDY / CONCEPT EDITORIAL</span>
        </div>
        <div className="craft-copy">
          <p className="eyebrow">A CLOSER LOOK</p>
          <h2>
            Every detail.
            <br />
            <em>A quiet distinction.</em>
          </h2>
          <p>
            Look beyond the first impression. Discover the texture, the fall,
            and the considered details that make each drape feel different.
          </p>
          <div className="craft-feature">
            <Layers3 size={24} strokeWidth={1} />
            <div>
              <h3>The weave</h3>
              <p>
                From crisp structure to fluid movement, begin with the fabric.
              </p>
            </div>
          </div>
          <div className="craft-feature">
            <Flower2 size={24} strokeWidth={1} />
            <div>
              <h3>The motif</h3>
              <p>A rhythm of botanicals, geometry, and decorative detail.</p>
            </div>
          </div>
          <div className="craft-feature">
            <Sparkles size={24} strokeWidth={1} />
            <div>
              <h3>The finish</h3>
              <p>Explore the border and pallu in our signature Saree Reveal.</p>
            </div>
          </div>
          <Link href="/shop" className="text-link">
            Explore the details <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <Testimonials />
      <Newsletter />
    </>
  );
}
