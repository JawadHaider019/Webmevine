import Script from "next/script";
import { Marcellus, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

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
        url: "/fav.png",
        alt: "WebMavien Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebMavien | Website in 21 days Or Money Back",
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
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-NB5ZFSMPG5"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-NB5ZFSMPG5');
            `,
          }}
        />
        
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s) {
                if(f.fbq)return;
                n=f.fbq=function(){
                  n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
                };
                if(!f._fbq)f._fbq=n;
                n.push=n;
                n.loaded=!0;
                n.version='2.0';
                n.queue=[];
                t=b.createElement(e);
                t.async=!0;
                t.src=v;
                s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)
              }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2948429372170086');
              fbq('track', 'PageView');
            `,
          }}
        />

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
                  "logo": "https://webmavien.com/fav.png",
                  "email": "team@webmavien.com",
                  "telephone": "+44 7424 672943",
                  "sameAs": [
                    "https://www.linkedin.com/company/web-mavien",
                    "https://www.instagram.com/webmavien"
                  ],
                  "areaServed": ["US", "GB", "DE", "EU", "Worldwide"],
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
        
        {/* Microsoft Clarity */}
        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "xctd5nmdo6");
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}