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
  title: "WebMavien",
  description: "Web Development",
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
      </head>
      <body className="antialiased">
        <Navbar />
        {children}
        <Footer/>
      </body>
    </html>
  );
}