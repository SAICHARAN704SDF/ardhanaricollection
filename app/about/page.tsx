import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Our story",
  "A brand concept exploring Indian textiles, contemporary elegance and the art of the drape.",
  "/about",
);
export default function Page() {
  return (
    <>
      <section className="about-hero">
        <div>
          <p className="eyebrow">THE HOUSE OF ARDHANARI</p>
          <h1>
            Tradition in our heart.
            <br />
            <em>Possibility in every thread.</em>
          </h1>
          <p>
            We imagine a wardrobe where heritage feels personal, where elegance
            is effortless, and where a saree belongs as much to the everyday as
            to the extraordinary.
          </p>
          <span className="sample-note">
            Editable brand-story draft · Awaiting founder approval
          </span>
        </div>
        <div className="about-image">
          <Image
            src="/images/heritage-hero.jpg"
            alt="AI-generated ivory saree concept editorial in a sandstone courtyard"
            fill
            sizes="(max-width:700px) 100vw, 50vw"
            priority
          />
        </div>
      </section>
      <section className="story-section">
        <p className="eyebrow">A STORY STILL BEING WOVEN</p>
        <h2>
          A quieter kind of <em>extraordinary.</em>
        </h2>
        <p>
          Ardhanari Collection is a space for discovering the expressive
          possibilities of the saree. Our proposed direction brings considered
          colours, beautiful textures, and clear product information into one
          thoughtful experience.
        </p>
        <p>
          This is where the founder’s own story will live: the first
          inspiration, the people behind the collection, and the values that
          guide its growth. No founding date, artisan relationship, sourcing
          promise, or certification has been asserted in this draft.
        </p>
        <blockquote>“Elegance, woven into every thread.”</blockquote>
        <Link href="/shop" className="button primary">
          Explore our world <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
