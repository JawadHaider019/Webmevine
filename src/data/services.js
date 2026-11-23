// Dedicated service landing pages (/services/[slug]).
// Each page targets one search intent. Keep metaTitle <= 60 chars and
// metaDescription <= 155 chars. Never add price figures (see project rules).

export const services = [
  {
    slug: "mvp-development",
    name: "MVP Development",
    metaTitle: "MVP Development Company for Startups | WebMavien",
    metaDescription:
      "MVP development company for startups. We scope, design and launch revenue-ready MVPs in 21 days with React, Next.js or Bubble.io. You own all the code.",
    kicker: "MVP Development Company for Startups",
    heading: "Launch Your MVP in",
    headingAccent: "21 Days",
    subheading:
      "From idea to a product real customers can use and pay for, built by senior engineers with a money-back guarantee.",
    intro:
      "WebMavien is an MVP development company that helps founders turn a validated idea into a working product in about 21 days. We scope the one workflow customers will pay for, design it, build it in React, Next.js or Bubble.io, and launch it with analytics, so you learn from real users instead of guessing.",
    highlights: [
      "Fixed scope and launch date agreed before we start",
      "Senior engineers only, no juniors learning on your budget",
      "React, Next.js or Bubble.io, chosen for your goals",
      "100% code and account ownership on delivery",
    ],
    deliverables: [
      { title: "Product Scoping", desc: "We cut your feature list to the core workflow a paying customer needs, with written acceptance criteria." },
      { title: "UX & UI Design", desc: "Wireframes and a clean interface for the main user journey, reviewed with you before build." },
      { title: "Full-Stack Build", desc: "Front end, back end, database, authentication and the integrations your MVP depends on." },
      { title: "Payments & Subscriptions", desc: "Stripe checkout and subscriptions when you charge from day one." },
      { title: "Analytics & Launch", desc: "Deployment, monitoring, analytics and SEO basics so you can measure traction from launch day." },
      { title: "Handover & Support", desc: "Source code, documentation and accounts handed over, plus post-launch support." },
    ],
    stack: ["React", "Next.js", "Node.js", "Bubble.io", "PostgreSQL", "MongoDB", "Stripe", "Vercel"],
    caseStudies: ["zola", "campuna", "fivup-ai"],
    guides: [
      "mvp-development-agency-for-startups-21-days",
      "startup-mvp-scoping-and-bubble-to-nextjs-migration",
      "saas-application-development-cost-2026",
    ],
    faqs: [
      { q: "How long does it take to build an MVP?", a: "Most focused MVPs launch in about 21 days. Larger scopes with several integrations take 21 to 28 days. We agree the timeline in writing before the build starts." },
      { q: "What should be included in an MVP?", a: "Only what a customer needs to complete the core job and pay for it: sign-up, the main workflow, payments if you charge from day one, and basic analytics. Everything else waits for version two." },
      { q: "Should my MVP be built with Bubble.io or React?", a: "Bubble.io is usually faster for validating workflows and marketplaces. React and Next.js are better when SEO, performance, complex logic or investor due diligence matter. We recommend one on your free strategy call." },
      { q: "Do I own the code of my MVP?", a: "Yes. You receive full ownership of the source code, design files, database and every account we set up." },
      { q: "How much does MVP development cost?", a: "It depends on your scope, integrations and stack. After a free strategy call we send a written scope, timeline and tailored quote." },
    ],
  },
  {
    slug: "bubble-io-development",
    name: "Bubble.io Development",
    metaTitle: "Bubble.io Development Agency | WebMavien",
    metaDescription:
      "Bubble.io development agency building SaaS MVPs, marketplaces and internal tools in 21 days, with clean data design, Stripe and API integrations.",
    kicker: "Bubble.io Development Agency",
    heading: "No-Code Apps Built",
    headingAccent: "Like Real Software",
    subheading:
      "SaaS MVPs, marketplaces and business tools on Bubble.io, engineered for performance, clean data and growth.",
    intro:
      "WebMavien is a Bubble.io development agency that builds SaaS MVPs, two-sided marketplaces and internal business tools on Bubble.io in about 21 days. We design the data model, privacy rules and workflows like a software engineering team, so your app stays fast, secure and easy to extend, and can migrate to custom code later if you need it.",
    highlights: [
      "Launch on Bubble.io in about 21 days",
      "Clean database design and privacy rules from day one",
      "Stripe, OpenAI and third-party API integrations",
      "A clear path to React and Next.js when you outgrow no-code",
    ],
    deliverables: [
      { title: "Bubble.io SaaS MVPs", desc: "Subscription products with user accounts, roles, dashboards and Stripe billing." },
      { title: "Marketplaces", desc: "Listings, search, bookings, reviews and split payments for two-sided platforms." },
      { title: "AI-Powered Apps", desc: "OpenAI workflows connected through the API Connector with structured outputs." },
      { title: "Internal Tools & Portals", desc: "Client portals, CRMs and operations dashboards that replace spreadsheets." },
      { title: "Performance Optimisation", desc: "Faster pages and lower workload usage through better data structure and workflows." },
      { title: "Bubble to Code Migration", desc: "A phased move to React and Next.js when SEO, scale or costs require it." },
    ],
    stack: ["Bubble.io", "API Connector", "Stripe", "OpenAI", "Zapier / Make", "Xano", "Next.js (marketing sites)"],
    caseStudies: ["campuna", "zola", "fintalio"],
    guides: [
      "react-vs-bubble-io-for-saas-mvp-2026",
      "startup-mvp-scoping-and-bubble-to-nextjs-migration",
      "two-sided-marketplace-development-guide",
    ],
    faqs: [
      { q: "Is Bubble.io good for building a SaaS or marketplace?", a: "Yes. Bubble.io is well suited to validating SaaS workflows, marketplaces and internal tools quickly. It is less suited to products that depend heavily on SEO, very large data volumes or complex real-time features." },
      { q: "How long does a Bubble.io app take to build?", a: "Most focused Bubble.io MVPs launch in about 21 days. Marketplaces with payments and more complex workflows can take up to 28 days." },
      { q: "Can a Bubble.io app scale?", a: "Bubble.io apps can serve many users when the data model, privacy rules and workflows are designed well. When performance, platform costs or SEO become limits, we migrate to React and Next.js in phases." },
      { q: "Can you fix or improve an existing Bubble.io app?", a: "Yes. We audit existing apps, fix slow workflows and data structure problems, tighten privacy rules and add new features." },
      { q: "Do I own my Bubble.io app?", a: "Yes. The app is built in your own Bubble.io account and you keep full ownership of it, its data and all connected accounts." },
    ],
  },
  {
    slug: "custom-crm-development",
    name: "Custom CRM Development",
    metaTitle: "Custom CRM Development Company | WebMavien",
    metaDescription:
      "Custom CRM development for growing teams: pipelines, client portals, automation and integrations built around your process, with no per-seat licences.",
    kicker: "Custom CRM Development Company",
    heading: "A CRM Built Around",
    headingAccent: "How You Work",
    subheading:
      "Replace spreadsheets, scattered tools and rising per-seat licences with one system your team actually uses.",
    intro:
      "WebMavien builds custom CRMs for growing businesses whose process no longer fits spreadsheets or off-the-shelf tools like HubSpot and Salesforce. We combine your customer records, pipelines, client portal, automations and reports in one system designed around your workflow, with no per-seat licence fees and full ownership of your data.",
    highlights: [
      "Built around your real sales and operations process",
      "No per-seat licences as your team grows",
      "Client and partner portals included where needed",
      "Integrations with email, calendars, WhatsApp, Stripe and accounting tools",
    ],
    deliverables: [
      { title: "Unified Customer Record", desc: "Contacts, conversations, deals, bookings, documents and payments in one profile." },
      { title: "Pipelines & Workflows", desc: "Stages, tasks and approvals that match how your team actually sells and delivers." },
      { title: "Client & Partner Portals", desc: "Secure logins where customers upload files, book slots, approve work and track progress." },
      { title: "Automation", desc: "Lead routing, reminders, follow-ups, invoices and review requests that run on their own." },
      { title: "Reporting Dashboards", desc: "Live pipeline, revenue and team metrics without manual spreadsheet exports." },
      { title: "Data Migration", desc: "Clean import of contacts, deals and history from spreadsheets, HubSpot or Salesforce." },
    ],
    stack: ["React", "Next.js", "Node.js", "Bubble.io", "PostgreSQL", "Google Workspace / Microsoft 365", "WhatsApp Business", "Stripe", "Xero / QuickBooks"],
    caseStudies: ["zola", "united-mercy"],
    guides: [
      "custom-crm-development-vs-hubspot-salesforce-cost",
      "when-to-build-custom-crm-workflows-automation",
    ],
    faqs: [
      { q: "When is a custom CRM better than HubSpot or Salesforce?", a: "When your workflows do not fit standard deal stages, you need a client portal, or per-seat licences and add-on tools keep growing. Small teams with standard sales processes are often better served by off-the-shelf CRMs." },
      { q: "How long does it take to build a custom CRM?", a: "A focused first version with customer records, pipelines, automations and one portal or integration typically takes about 3 to 6 weeks." },
      { q: "Can you migrate our data from HubSpot, Salesforce or spreadsheets?", a: "Yes. We export, clean and import contacts, companies, deals, notes and activity history so your team starts with complete records." },
      { q: "Can a custom CRM integrate with our existing tools?", a: "Yes. Common integrations include Gmail, Outlook, Google Calendar, Slack, WhatsApp, Stripe and accounting tools such as Xero and QuickBooks." },
      { q: "Do we own the CRM and our data?", a: "Yes. Your company owns the source code, database and infrastructure, with no licence fees per user." },
    ],
  },
  {
    slug: "nextjs-ecommerce-development",
    name: "Next.js E-Commerce Development",
    metaTitle: "Next.js E-Commerce Development Agency | WebMavien",
    metaDescription:
      "Next.js e-commerce agency building fast custom and headless stores with Apple Pay, Stripe, Product schema and strong Core Web Vitals for higher sales.",
    kicker: "Next.js E-Commerce Development Agency",
    heading: "Online Stores Built",
    headingAccent: "to Convert",
    subheading:
      "Fast custom and headless storefronts that rank, load instantly on mobile and turn visitors into customers.",
    intro:
      "WebMavien is a Next.js e-commerce agency that builds fast custom and headless online stores for growing brands. We design mobile-first storefronts with express wallet checkout, complete Product structured data and strong Core Web Vitals, so your store ranks better in search and converts more of the traffic you already pay for.",
    highlights: [
      "Fast mobile pages that pass Core Web Vitals",
      "Apple Pay, Google Pay and Stripe express checkout",
      "Custom or headless Shopify on a Next.js front end",
      "Technical SEO and Product schema built in",
    ],
    deliverables: [
      { title: "Custom Storefronts", desc: "Distinctive Next.js stores designed around your brand, products and buying journey." },
      { title: "Headless Shopify", desc: "Keep Shopify's admin and checkout with a faster, fully custom Next.js front end." },
      { title: "Checkout Optimisation", desc: "Guest checkout, wallet payments, clear delivery costs and shorter forms." },
      { title: "E-Commerce SEO", desc: "Clean URLs, Product and Breadcrumb schema, crawlable categories and fast pages." },
      { title: "Order Automation", desc: "Automatic confirmations, stock updates and delivery integrations." },
      { title: "Migrations", desc: "Move from Shopify themes, WooCommerce or social DM selling without losing SEO." },
    ],
    stack: ["Next.js", "React", "Node.js", "Shopify Storefront API", "Stripe", "Apple Pay / Google Pay", "MongoDB", "Vercel"],
    caseStudies: ["pure-clay"],
    guides: [
      "shopify-vs-custom-nextjs-ecommerce-2026",
      "ecommerce-seo-and-checkout-conversion-optimization",
      "instagram-dm-to-automated-ecommerce-website-cost",
    ],
    faqs: [
      { q: "Is Next.js good for e-commerce?", a: "Yes. Next.js supports fast server-rendered and static pages, image optimisation and full control over metadata and structured data, which improve both conversion rates and search rankings." },
      { q: "Should I use Shopify or a custom Next.js store?", a: "Shopify is great for launching quickly with standard products. A custom or headless Next.js store makes sense when speed, SEO control, custom product logic or app fees start limiting growth." },
      { q: "What is headless Shopify?", a: "Headless Shopify uses Shopify for products, inventory, orders and checkout while a separate Next.js front end renders the storefront through Shopify's Storefront API." },
      { q: "Can you migrate my store without losing SEO?", a: "Yes. We map and redirect every product, collection and content URL, carry over metadata and structured data, and monitor Search Console after launch." },
      { q: "How long does it take to build a custom online store?", a: "A focused custom or headless storefront typically launches in about 3 to 6 weeks, depending on catalogue size, integrations and checkout requirements." },
    ],
  },
  {
    slug: "ai-saas-development",
    name: "AI SaaS Development",
    metaTitle: "AI SaaS Development Company | WebMavien",
    metaDescription:
      "AI SaaS development company building defensible AI products: RAG on your data, structured AI workflows, integrations and Stripe billing, in weeks.",
    kicker: "AI SaaS Development Company",
    heading: "AI Products Customers",
    headingAccent: "Keep Paying For",
    subheading:
      "Not another chatbot wrapper: AI workflows grounded in your customers' data, built to retain users and protect margins.",
    intro:
      "WebMavien is an AI SaaS development company that builds AI products around a real workflow, not a chat box. We combine retrieval over your customers' data, structured AI outputs, integrations with the tools they already use and cost controls that protect your margins, and we launch a focused AI MVP in about 21 to 28 days.",
    highlights: [
      "Retrieval-augmented generation (RAG) on your customers' data",
      "Structured, validated AI outputs instead of plain chat",
      "OpenAI, Anthropic or Google models, swappable by design",
      "Usage tracking and cost controls from day one",
    ],
    deliverables: [
      { title: "AI MVPs", desc: "A focused AI product built around one painful, repeated job for one type of customer." },
      { title: "RAG Pipelines", desc: "Document ingestion, embeddings and vector search with pgvector or a vector database." },
      { title: "AI Workflow Automation", desc: "Multi-step workflows that extract, decide, write back and notify." },
      { title: "AI Features in Existing Products", desc: "Add summarisation, classification, drafting or search to your current app." },
      { title: "Billing & Usage Limits", desc: "Stripe subscriptions with per-plan usage limits that match model costs." },
      { title: "Evaluation & Monitoring", desc: "Test sets, quality checks and cost dashboards so results stay reliable." },
    ],
    stack: ["Next.js", "Node.js", "OpenAI", "Anthropic", "PostgreSQL + pgvector", "Bubble.io", "Stripe", "Vercel"],
    caseStudies: ["fintalio", "fivup-ai"],
    guides: [
      "how-to-build-ai-saas-mvp-in-21-days",
      "ai-wrapper-vs-defensible-ai-saas-2026",
      "multi-tenant-saas-stripe-billing-architecture",
    ],
    faqs: [
      { q: "How long does it take to build an AI SaaS MVP?", a: "A focused AI SaaS MVP with retrieval, one structured workflow, one integration and billing typically launches in about 21 to 28 days." },
      { q: "What makes an AI product defensible?", a: "Proprietary context from your customers' data, structured workflows that complete a job, deep integrations with existing tools and unit economics that stay profitable as usage grows." },
      { q: "Do I need to train my own AI model?", a: "Usually not. Hosted models combined with retrieval over your data and well-designed structured outputs are enough for most products. Custom training only makes sense later, with proprietary data and a proven use case." },
      { q: "Which AI models do you use?", a: "We work with OpenAI, Anthropic and Google models and design products so models can be swapped or mixed as quality and pricing change." },
      { q: "How do you keep AI costs under control?", a: "We cache repeated requests, route simple tasks to smaller models, limit context to relevant data, set usage caps per plan and track cost per customer." },
    ],
  },
  {
    slug: "react-nextjs-development",
    name: "React & Next.js Development",
    metaTitle: "React & Next.js Development Agency | WebMavien",
    metaDescription:
      "React and Next.js development agency building fast, SEO-friendly websites and web apps in 21 days, with clean code you own and strong Core Web Vitals.",
    kicker: "React & Next.js Development Agency",
    heading: "Fast Websites & Apps",
    headingAccent: "Built in Next.js",
    subheading:
      "Custom-coded React and Next.js websites, SaaS platforms and dashboards that load fast, rank well and scale.",
    intro:
      "WebMavien is a React and Next.js development agency building custom websites, SaaS platforms and web applications for startups and growing businesses. Every project is custom-coded, server-rendered for SEO and tuned for Core Web Vitals, and you receive a clean, documented codebase that any React developer can extend.",
    highlights: [
      "Custom code, no page builders or bloated themes",
      "Server rendering and structured data for SEO and AI search",
      "Core Web Vitals tuned for mobile",
      "Clean, documented code you fully own",
    ],
    deliverables: [
      { title: "Marketing Websites", desc: "Fast, conversion-focused company websites with a CMS or content files your team can edit." },
      { title: "SaaS Platforms", desc: "Multi-tenant apps with authentication, roles, dashboards and Stripe billing." },
      { title: "Web Applications", desc: "Portals, dashboards and internal tools with real-time features and integrations." },
      { title: "API & Back End", desc: "Node.js APIs, databases, background jobs and third-party integrations." },
      { title: "Performance & SEO", desc: "Server rendering, image optimisation, metadata and schema for search and AI engines." },
      { title: "Rebuilds & Migrations", desc: "Move from WordPress, page builders or Bubble.io to Next.js without losing rankings." },
    ],
    stack: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL", "MongoDB", "Vercel"],
    caseStudies: ["pure-clay"],
    guides: [
      "react-vs-bubble-io-for-saas-mvp-2026",
      "multi-tenant-saas-stripe-billing-architecture",
      "how-to-choose-web-development-agency",
    ],
    faqs: [
      { q: "Why choose Next.js for a website or web app?", a: "Next.js combines React with server rendering, static generation, routing and API routes, which gives fast pages, strong SEO and one codebase for front end and back end." },
      { q: "How long does a React or Next.js website take?", a: "A focused business website or web app typically launches in about 21 days. Larger platforms with many integrations take longer and are delivered in milestones." },
      { q: "Can you migrate my WordPress site to Next.js?", a: "Yes. We rebuild the site in Next.js, move your content, keep or redirect every URL and carry over metadata so you keep your search rankings." },
      { q: "Will my team be able to update the website?", a: "Yes. We set up a content management option that fits your team, from a headless CMS to simple content files." },
      { q: "Do I own the code?", a: "Yes. You receive the full source code, documentation and access to every account on delivery." },
    ],
  },
  {
    slug: "marketplace-development",
    name: "Marketplace Development",
    metaTitle: "Marketplace Development Company | WebMavien",
    metaDescription:
      "Marketplace development company building two-sided platforms with listings, bookings, reviews and Stripe Connect split payments, launched in weeks.",
    kicker: "Two-Sided Marketplace Development Company",
    heading: "Marketplaces Where",
    headingAccent: "Both Sides Win",
    subheading:
      "Listings, search, bookings, reviews and split payments, built so buyers and sellers have a reason to stay.",
    intro:
      "WebMavien builds two-sided marketplaces that connect buyers and sellers, or customers and service providers. We launch with the five modules every marketplace needs (accounts, listings and search, booking or ordering, split payments and reviews) on Bubble.io or Next.js, with Stripe Connect handling seller onboarding and payouts.",
    highlights: [
      "The five core marketplace modules in your first release",
      "Stripe Connect split payments and seller payouts",
      "Trust features that reduce platform leakage",
      "Bubble.io for speed or Next.js for SEO and scale",
    ],
    deliverables: [
      { title: "Buyer & Seller Accounts", desc: "Separate onboarding flows, verification and public profiles." },
      { title: "Listings & Search", desc: "Listing creation with photos and availability, plus filters by location, category, date or price." },
      { title: "Bookings & Orders", desc: "Instant booking, request-to-book, quotes or cart checkout, depending on your model." },
      { title: "Split Payments", desc: "Stripe Connect payments, platform fees, refunds and automated payouts." },
      { title: "Reviews & Messaging", desc: "Two-way reviews, on-platform messaging and notifications that build trust." },
      { title: "Admin & Moderation", desc: "Tools to approve listings, resolve disputes and view transactions." },
    ],
    stack: ["Bubble.io", "Next.js", "Node.js", "Stripe Connect", "PostgreSQL", "Google Maps", "Algolia / search"],
    caseStudies: ["campuna", "united-mercy"],
    guides: [
      "two-sided-marketplace-development-guide",
      "react-vs-bubble-io-for-saas-mvp-2026",
    ],
    faqs: [
      { q: "What features does a marketplace MVP need?", a: "Accounts and profiles for both sides, listings with search, a booking or ordering flow, split payments and payouts, and reviews and messaging, plus a simple admin panel." },
      { q: "How do marketplace payments work?", a: "Most marketplaces use Stripe Connect, which collects the buyer's payment, deducts the platform fee and pays the seller's connected account, while handling seller verification and payouts." },
      { q: "How long does it take to build a marketplace?", a: "A focused marketplace MVP with the five core modules typically takes about 4 to 8 weeks, depending on payment complexity and integrations." },
      { q: "Should I build my marketplace on Bubble.io or Next.js?", a: "Bubble.io is a strong choice for validating a marketplace quickly. Next.js is better when SEO for listing pages, performance and complex logic are central to growth." },
      { q: "How do you stop buyers and sellers going around the platform?", a: "By giving both sides value they only get on the platform: payment protection, reviews that count only for on-platform transactions, useful seller tools and contact details revealed after booking." },
    ],
  },
];

export function getServiceBySlug(slug) {
  return services.find((s) => s.slug === slug) || null;
}
