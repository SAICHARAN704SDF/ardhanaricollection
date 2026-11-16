import Link from "next/link";
import { Brand } from "./header";
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div>
          <Brand />
          <p>
            Elegance, woven into every thread.
            <br />A considered collection of timeless drapes.
          </p>
          <span className="tiny">
            An independent brand concept · Demo storefront
          </span>
        </div>
        <div>
          <h3>Explore</h3>
          <Link href="/shop">All sarees</Link>
          <Link href="/collections">The collections</Link>
          <Link href="/collections/new-arrivals">New arrivals</Link>
          <Link href="/wishlist">Your wishlist</Link>
        </div>
        <div>
          <h3>At your service</h3>
          <Link href="/contact">Contact us</Link>
          <Link href="/faq">Frequently asked</Link>
          <Link href="/shipping">Shipping & delivery</Link>
          <Link href="/returns">Returns & exchanges</Link>
          <Link href="/care">Saree care</Link>
          <Link href="/service">Customer service</Link>
        </div>
        <div>
          <h3>The house</h3>
          <Link href="/about">Our story</Link>
          <Link href="/brand-standards">The Ardhanari standard</Link>
          <Link href="/account">My account</Link>
          <Link href="/admin">Catalog studio</Link>
          <span className="tiny">
            Instagram · Coming soon
            <br />
            Pinterest · Coming soon
          </span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Ardhanari Collection</span>
        <span>Thoughtfully composed. Beautifully draped.</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
