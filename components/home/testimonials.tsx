"use client";
import { useState } from "react";
const quotes = [
  "A drape that feels as beautiful as the moment itself.",
  "The little details are what I remember most.",
  "Tradition feels personal when you make it your own.",
];
export function Testimonials() {
  const [selected, setSelected] = useState(0);
  return (
    <section className="testimonials" aria-label="Illustrative testimonials">
      <p className="eyebrow">MOMENTS IN ARDHANARI / SAMPLE TESTIMONIALS</p>
      <span className="quote-mark" aria-hidden="true">
        “
      </span>
      <h2 aria-live="polite">{quotes[selected]}</h2>
      <p>Illustrative customer voice {selected + 1} · Not a verified review</p>
      <div className="testimonial-dots">
        {quotes.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            aria-label={`Read sample testimonial ${index + 1}`}
            aria-pressed={selected === index}
            className={selected === index ? "active" : ""}
          >
            <span />
          </button>
        ))}
      </div>
    </section>
  );
}
