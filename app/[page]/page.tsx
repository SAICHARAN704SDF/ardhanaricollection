import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import {
  policies,
  policyNavigation,
  policyStatus,
} from "@/lib/content/policies";
import { pageMetadata } from "@/lib/seo";
export function generateStaticParams() {
  return Object.keys(policies).map((page) => ({ page }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const p = policies[page];
  return p
    ? pageMetadata(p.title, p.intro, `/${page}`)
    : { title: "Page not found" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const policy = policies[page];
  if (!policy) notFound();
  return (
    <section className="section policy-page">
      <p className="eyebrow">{policy.eyebrow}</p>
      <h1>{policy.title}</h1>
      <p className="page-intro">{policy.intro}</p>
      <nav className="policy-navigation" aria-label="Care and service policies">
        {policyNavigation.map((p) => (
          <Link
            key={p.slug}
            href={`/${p.slug}`}
            aria-current={page === p.slug ? "page" : undefined}
          >
            {p.label}
          </Link>
        ))}
      </nav>
      <div className="demo-banner">
        {policyStatus}. No live purchases or returns are currently processed.
      </div>
      {policy.summary && (
        <div className="policy-summary">
          {policy.summary.map((s) => (
            <div key={s.label}>
              <span>{s.label}</span>
              <strong>{s.value}</strong>
            </div>
          ))}
        </div>
      )}
      <div className="policy-reading">
        <aside>
          <p className="eyebrow">IN THIS POLICY</p>
          {policy.sections.map((s, i) => (
            <a href={`#policy-${i}`} key={s.title}>
              {String(i + 1).padStart(2, "0")} · {s.title}
            </a>
          ))}
          <span className="tiny">
            Draft updated
            <br />5 November 2026
          </span>
        </aside>
        <div>
          {policy.sections.map((s, i) => (
            <section
              className="policy-section"
              id={`policy-${i}`}
              key={s.title}
            >
              <span className="policy-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2>{s.title}</h2>
              {s.body && <p>{s.body}</p>}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
      <div className="policy-help">
        <div>
          <p className="eyebrow">A LITTLE MORE GUIDANCE</p>
          <h2>Thoughtfully, at your service.</h2>
          <p>
            Official support contacts will be published before live ordering
            opens.
          </p>
        </div>
        <Link href="/contact" className="text-link">
          Visit the contact page <ArrowUpRight size={16} />
        </Link>
      </div>
      {page === "service" && (
        <p className="policy-reference">
          Complaint timing follows the{" "}
          <a
            href="https://consumeraffairs.gov.in/public/upload/files/E%20commerce%20rules_1732703966.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Consumer Protection (E-Commerce) Rules, 2020
          </a>
          . These draft procedures must be operational before launch.
        </p>
      )}
    </section>
  );
}
