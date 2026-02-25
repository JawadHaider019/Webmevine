import { Marcellus, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTA from '@/components/CTA'

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
  title: "Ahmtech",
  description: "Software Development",
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
        <link rel="icon" href="/fav.png" type="image/png" />
        <link rel="shortcut icon" href="/fav.png" type="image/png" />
        <link rel="apple-touch-icon" href="/fav.png" />
      </head>
      <body className="antialiased">
        <Navbar />
        {children}
         <CTA/>
        <Footer/>
      </body>
    </html>
  );
}