import { Marcellus, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import DeferredAnalytics from "@/components/DeferredAnalytics";

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
  display: 'swap',
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL("https://webmavien.com"),
  title: {
    default: "Web & SaaS Development Agency | 21-Day Launch | WebMavien",
    template: "%s | WebMavien"
  },
  description: "Web and SaaS development agency building custom websites, AI MVPs and Bubble.io apps in 21 days, or your money back. Book a free strategy call.",
  keywords: ["Web Development", "AI Solutions", "SaaS Development", "MVP Builder", "WebMavien", "Bubble.io", "React JS"],
  authors: [{ name: "WebMavien Team" }],
  creator: "WebMavien",
  publisher: "WebMavien",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: "/fav.png",
        type: "image/png",
      },
    ],
    shortcut: "/fav.png",
    apple: "/fav.png",
  },
  openGraph: {
    title: "Web & SaaS Development Agency | 21-Day Launch | WebMavien",
    description: "Launch your AI-powered MVP or SaaS in just 21 days with WebMavien's expert development team.",
    url: "https://webmavien.com",
    siteName: "WebMavien",
    images: [
      {
        url: "/fav.png",
        alt: "WebMavien Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web & SaaS Development Agency | 21-Day Launch | WebMavien",
    description: "Launch your AI-powered MVP or SaaS in just 21 days with WebMavien's expert development team.",
    images: ["/fav.png"],
  },

  alternates: {
    canonical: "https://webmavien.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${marcellus.variable} ${manrope.variable}`}>
      <head>
        {/* NoScript fallback for Meta Pixel */}
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }} 
            src="https://www.facebook.com/tr?id=2948429372170086&ev=PageView&noscript=1" 
          />
        </noscript>

        <meta name="google-site-verification" content="6f__qaPJK4fGfUrDK255aelCxzz7nIitsVXRAa6OycM" />

        {/* Rich @graph JSON-LD Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://webmavien.com/#website",
                  "name": "WebMavien",
                  "url": "https://webmavien.com",
                  "description": "WebMavien is a premier web development agency specializing in AI-powered MVPs, SaaS platforms, and conversion-optimized websites delivered in 21 days."
                },
                {
                  "@type": ["Organization", "ProfessionalService"],
                  "@id": "https://webmavien.com/#organization",
                  "name": "WebMavien",
                  "url": "https://webmavien.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://webmavien.com/logo.png",
                    "width": 2000,
                    "height": 671
                  },
                  "image": "https://webmavien.com/logo.png",
                  "founder": { "@id": "https://webmavien.com/about#muhammad-ahmad" },
                  "email": "team@webmavien.com",
                  "telephone": "+44 7424 672943",
                  "sameAs": [
                    "https://www.linkedin.com/company/web-mavien",
                    "https://www.instagram.com/webmavien"
                  ],
                  "areaServed": [
                    { "@type": "Country", "name": "United Kingdom" },
                    { "@type": "Country", "name": "United States" },
                    { "@type": "Country", "name": "United Arab Emirates" },
                    { "@type": "Country", "name": "Germany" },
                    "Worldwide"
                  ],
                  "knowsAbout": [
                    "React JS Development",
                    "Next.js App Router",
                    "Bubble.io No-Code Development",
                    "AI SaaS MVP Development",
                    "Custom E-Commerce Engineering",
                    "Technical SEO"
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+44 7424 672943",
                    "contactType": "sales",
                    "email": "team@webmavien.com",
                    "availableLanguage": ["English"]
                  }
                }
              ]
            }),
          }}
        />
        
      </head>
      <body className="antialiased">
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
        <DeferredAnalytics />
      </body>
    </html>
  );
}