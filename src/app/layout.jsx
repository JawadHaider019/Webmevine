import { Marcellus, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata = {
  metadataBase: new URL("https://webmavien.com"),
  title: {
    default: "WebMavien | Website in 21 days Or Money Back",
    template: "%s | WebMavien"
  },
  description: "WebMavien is a premier web development agency specializing in AI-powered MVPs, SaaS platforms, and conversion-optimized websites. Launch your vision in 21 days.",
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
    title: "WebMavien | Website in 21 days Or Money Back",
    description: "Launch your AI-powered MVP or SaaS in just 21 days with WebMavien's expert development team.",
    url: "https://webmavien.com",
    siteName: "WebMavien",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WebMavien - Building Momentum",
      },
    ],
    locale: "en_US",
    type: "website",
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
        <link rel="preconnect" href="https://assets.calendly.com" />
        <link rel="preconnect" href="https://calendly.com" />
        <link rel="dns-prefetch" href="https://assets.calendly.com" />
        <link rel="dns-prefetch" href="https://calendly.com" />
        <link rel="icon" href="/fav.png" type="image/png" />
        <link rel="shortcut icon" href="/fav.png" type="image/png" />
        <link rel="apple-touch-icon" href="/fav.png" />
        <meta name="google-site-verification" content="6f__qaPJK4fGfUrDK255aelCxzz7nIitsVXRAa6OycM" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "WebMavien",
              "url": "https://webmavien.com",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "WebMavien",
              "url": "https://webmavien.com",
              "logo": "https://webmavien.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+44 7424 672943",
                "contactType": "customer service",
                "email": "team@webmavein.com"
              }
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}