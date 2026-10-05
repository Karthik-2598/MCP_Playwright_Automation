// Category pages verified against the live site (Oct 2026).
// Headings contain the current year ("...to try in 2026"), so the patterns
// deliberately leave the year out; otherwise every test breaks on Jan 1.
// Note: some obvious slugs (developer-tools, marketing, no-code) return 404.
module.exports = [
  { slug: 'productivity', heading: /best productivity tools/i },
  { slug: 'design-tools', heading: /best interface design tools/i },
  { slug: 'ai-agents', heading: /best AI agents/i },
  { slug: 'finance', heading: /best tools in finance/i },
  { slug: 'engineering-development', heading: /best engineering & development tools/i },
  { slug: 'llms', heading: /LLMs/i },
];
