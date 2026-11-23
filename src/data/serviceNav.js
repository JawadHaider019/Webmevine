// Lightweight service list for the navbar mega menu and footer (loaded on every page).
// Keep slugs in sync with src/data/services.js.
export const serviceNav = [
  { slug: "react-nextjs-development", name: "React & Next.js Development", category: "Development" },
  { slug: "bubble-io-development", name: "Bubble.io Development", category: "Development" },
  { slug: "mvp-development", name: "MVP Development", category: "Startups & AI" },
  { slug: "ai-saas-development", name: "AI SaaS Development", category: "Startups & AI" },
  { slug: "nextjs-ecommerce-development", name: "Next.js E-Commerce", category: "E-Commerce & Marketplaces" },
  { slug: "marketplace-development", name: "Marketplace Development", category: "E-Commerce & Marketplaces" },
  { slug: "custom-crm-development", name: "Custom CRM Development", category: "Business Solutions" },
  { slug: "business-process-automation", name: "Business Process Automation", category: "Business Solutions" },
];

// Services grouped into mega-menu columns, in display order.
export const serviceNavGroups = serviceNav.reduce((groups, s) => {
  let group = groups.find((g) => g.category === s.category);
  if (!group) {
    group = { category: s.category, items: [] };
    groups.push(group);
  }
  group.items.push(s);
  return groups;
}, []);
