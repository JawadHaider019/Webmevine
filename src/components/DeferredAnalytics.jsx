"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

// Loads Google Analytics, Meta Pixel and Microsoft Clarity only after the visitor
// first interacts (scroll, pointer, touch, key) or after a short fallback delay.
// This keeps ~200 KB of third-party JavaScript off the critical path, which is the
// main cause of Total Blocking Time in PageSpeed / Lighthouse.
const FALLBACK_DELAY_MS = 5000;
const EVENTS = ["scroll", "pointerdown", "pointermove", "touchstart", "keydown"];

export default function DeferredAnalytics() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    const trigger = () => setReady(true);
    const timer = window.setTimeout(trigger, FALLBACK_DELAY_MS);
    EVENTS.forEach((e) => window.addEventListener(e, trigger, { once: true, passive: true }));
    return () => {
      window.clearTimeout(timer);
      EVENTS.forEach((e) => window.removeEventListener(e, trigger));
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      {/* Google Analytics */}
      <Script
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

      {/* Meta Pixel */}
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
    </>
  );
}
