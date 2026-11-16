"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  UserRound,
  ArrowUpRight,
} from "lucide-react";
import { useShop } from "@/stores/shop";
import { Modal } from "./primitives";
import { CustomerButton } from "@/components/auth/shopping-auth";
import { CartContents } from "@/components/cart/cart";
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Ardhanari Collection home">
      <Image
        src="/images/brand/ardhanari-original.png"
        alt="ARDHANARI — original gold lotus emblem and wordmark"
        width={1578}
        height={997}
        className="brand-original-logo"
        loading="eager"
        sizes="(max-width: 540px) 138px, 180px"
      />
    </Link>
  );
}
export function Header() {
  const [menu, setMenu] = useState(false);
  const count = useShop((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const bag = useShop((s) => s.bagOpen);
  const setBag = useShop((s) => s.setBag);
  const pathname = usePathname();
  const links = [
    ["All sarees", "/shop"],
    ["The collections", "/collections"],
    ["The wedding edit", "/collections/wedding"],
    ["New arrivals", "/collections/new-arrivals"],
    ["The house", "/about"],
  ];
  return (
    <>
      <div className="announcement">
        <span>Elegance, woven into every thread.</span>
        <span>EXPLORE OUR DEMO ATELIER · NO LIVE ORDERS</span>
      </div>
      <header className="header heritage-header">
        <div className="masthead">
          <button
            className="icon-button mobile-menu"
            aria-label="Open menu"
            onClick={() => setMenu(true)}
          >
            <Menu size={21} />
          </button>
          <div className="masthead-note">
            <span>THE ART OF THE DRAPE</span>
            <Link href="/service">
              A considered experience <ArrowUpRight size={12} />
            </Link>
          </div>
          <Brand />
          <div className="header-actions">
            <Link
              className="icon-button"
              href="/shop?search="
              aria-label="Search sarees"
            >
              <Search size={18} />
            </Link>
            <Link
              className="icon-button wishlist-nav"
              href="/wishlist"
              aria-label="Wishlist"
            >
              <Heart size={18} />
            </Link>
            <CustomerButton />
            <button
              className="icon-button bag-button"
              onClick={() => setBag(true)}
              aria-label={`Open shopping bag, ${count} items`}
            >
              <ShoppingBag size={18} />
              <span>{count}</span>
            </button>
          </div>
        </div>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, url]) => (
            <Link
              key={url}
              href={url}
              aria-current={pathname === url ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <Modal
        open={menu}
        onClose={() => setMenu(false)}
        title="Navigation"
        className="navigation-panel"
      >
        <Brand />
        <p className="eyebrow">WELCOME TO THE HOUSE</p>
        <nav>
          {[
            ...links,
            ["Your wishlist", "/wishlist"],
            ["Your account", "/account"],
            ["Care & service", "/service"],
          ].map(([name, url]) => (
            <Link key={url} href={url} onClick={() => setMenu(false)}>
              {name}
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </nav>
      </Modal>
      <Modal
        open={bag}
        onClose={() => setBag(false)}
        title="Your shopping bag"
        className="cart-drawer"
      >
        <CartContents drawer />
      </Modal>
    </>
  );
}
