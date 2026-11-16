import { writeFileSync } from "node:fs";
import { policies, policyStatus } from "../lib/content/policies";
const pages = ["brand-standards", "returns", "care", "service", "shipping"];
let text = `# ARDHANARI COLLECTION\n## Brand standards and customer policies\n\n${policyStatus}.\n\nUpdated 5 November 2026. The store is currently a demo; no live purchases, returns or enquiries are processed.\n\n`;
for (const slug of pages) {
  const p = policies[slug];
  text += `# ${p.title}\n\n${p.intro}\n\n`;
  if (p.summary)
    text +=
      p.summary.map((s) => `- **${s.label}:** ${s.value}`).join("\n") + "\n\n";
  for (const s of p.sections) {
    text += `## ${s.title}\n\n`;
    if (s.body) text += s.body + "\n\n";
    if (s.bullets) text += s.bullets.map((b) => `- ${b}`).join("\n") + "\n\n";
  }
}
text +=
  "See [policy editorial notes](./docs/policy-editorial-notes.md) for source references and operational decisions still to be completed.\n";
writeFileSync("BRAND_POLICIES.md", text);
console.log("Exported BRAND_POLICIES.md from the website policy source.");
