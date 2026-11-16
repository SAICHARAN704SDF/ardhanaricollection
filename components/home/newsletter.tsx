"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
export function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <section className="newsletter">
      <div>
        <p className="eyebrow">LET BEAUTY FIND YOU</p>
        <h2>
          A little inspiration.
          <br />
          <em>Once in a while.</em>
        </h2>
      </div>
      <div>
        <p>New collections, stories of textiles, and considered edits.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="Your email address"
            required
            autoComplete="email"
          />
          <button aria-label="Try newsletter signup">
            <ArrowRight size={22} />
          </button>
        </form>
        <p className="tiny" role="status">
          {done
            ? "Demo signup received. Your email was not sent or stored."
            : "Demo signup only. No emails will be sent."}
        </p>
      </div>
    </section>
  );
}
