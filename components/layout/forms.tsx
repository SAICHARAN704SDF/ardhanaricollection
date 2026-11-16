"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useShop } from "@/stores/shop";
import { money } from "@/lib/utils/commerce";
export function ContactForm() {
  const [done, setDone] = useState(false);
  return (
    <form
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <div className="form-grid">
        <label>
          Your name
          <input required minLength={2} autoComplete="name" />
        </label>
        <label>
          Email address
          <input type="email" required autoComplete="email" />
        </label>
        <label className="full-width">
          What can we help with?
          <select>
            <option>Finding the right drape</option>
            <option>Fabric & care</option>
            <option>Delivery & returns</option>
            <option>Something else</option>
          </select>
        </label>
        <label className="full-width">
          Your message
          <textarea required minLength={10} rows={5} />
        </label>
      </div>
      <button className="button primary">
        Preview submission <ArrowRight size={16} />
      </button>
      <p role="status" className="sample-note">
        {done
          ? "Demo message received on this screen only. Nothing was sent or stored."
          : "Demo form. Messages are not delivered to the brand."}
      </p>
    </form>
  );
}
export function AccountPanel({ section = "profile" }: { section?: string }) {
  const orders = useShop((s) => s.orders);
  const [notice, setNotice] = useState("");
  if (section === "sign-in" || section === "sign-up")
    return (
      <div className="auth-card">
        <p className="eyebrow">WELCOME TO THE HOUSE</p>
        <h1>
          {section === "sign-in" ? "Welcome back." : "Make yourself at home."}
        </h1>
        <p className="sample-note">
          Interface preview only. Authentication is not connected. Do not enter
          a real password.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setNotice(
              "Preview complete. No account was created and you are not signed in.",
            );
          }}
        >
          {section === "sign-up" && (
            <label>
              Name
              <input required placeholder="Sample name" />
            </label>
          )}
          <label>
            Email
            <input type="email" required placeholder="sample@example.com" />
          </label>
          <label>
            Password preview
            <input
              disabled
              placeholder="Available with secure authentication"
            />
          </label>
          <button className="button primary">
            Preview {section === "sign-in" ? "sign in" : "sign up"}{" "}
            <ArrowRight size={16} />
          </button>
          <p role="status">{notice}</p>
        </form>
        <Link
          className="text-link"
          href={section === "sign-in" ? "/account/sign-up" : "/account/sign-in"}
        >
          {section === "sign-in"
            ? "New here? Preview registration"
            : "Already a member? Preview sign in"}
        </Link>
      </div>
    );
  return (
    <section className="section account-page">
      <p className="eyebrow">YOUR PERSONAL ATELIER</p>
      <h1>
        A space for <em>you.</em>
      </h1>
      <div className="demo-banner">
        Signed in with Clerk. Addresses and orders below remain local demo features.
      </div>
      <div className="account-layout">
        <nav>
          {[
            ["Profile", "profile"],
            ["Saved addresses", "addresses"],
            ["Demo orders", "orders"],
            ["Wishlist", "wishlist"],
            ["Manage account", "profile"],
          ].map(([label, key]) => (
            <Link
              key={key}
              className={section === key ? "active" : ""}
              href={key === "wishlist" ? "/wishlist" : `/account/${key}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div>
          {section === "orders" ? (
            <>
              <h2>Your demo orders</h2>
              {orders.length ? (
                orders.map((o) => (
                  <article className="order-record" key={o.id}>
                    <div>
                      <h3>{o.id}</h3>
                      <p>
                        {new Date(o.createdAt).toLocaleDateString("en-IN")} ·
                        Simulation only
                      </p>
                    </div>
                    <span>{money(o.total)}</span>
                  </article>
                ))
              ) : (
                <p>
                  No simulated orders yet. Explore demo checkout to see an order
                  here.
                </p>
              )}
            </>
          ) : section === "addresses" ? (
            <>
              <h2>Somewhere beautiful to arrive.</h2>
              <p>
                Saved addresses will be available after secure customer accounts
                are connected.
              </p>
              <div className="placeholder-address">
                Sample address layout
                <br />
                Customer name · Street · City · PIN
                <br />
                <span className="tiny">No personal information is stored.</span>
              </div>
            </>
          ) : (
            <>
              <h2>Your profile</h2>
              <p>
                A thoughtful home for your details, favourite drapes, and future
                orders.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setNotice("Preview only. Profile changes are not saved.");
                }}
              >
                <label>
                  Display name
                  <input placeholder="Your name" />
                </label>
                <label>
                  Email
                  <input type="email" placeholder="you@example.com" />
                </label>
                <button className="button secondary">
                  Preview profile update
                </button>
                <p role="status">{notice}</p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
