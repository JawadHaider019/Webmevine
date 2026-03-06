"use client";

import { useState, useEffect, useRef } from "react";
import { BsCalendarCheck } from "react-icons/bs";

export default function CalendlyEmbed() {
  const [loaded, setLoaded] = useState(false);
  const [cached, setCached] = useState(false);
  const iframeRef = useRef(null);
  
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 
    "https://calendly.com/webmavein/30min";

  // Add embed parameters for better performance
  const embedParams = new URLSearchParams({
    hide_gdpr_banner: '1',
    primary_color: 'ff0000',
    embed_domain: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
    background_color: 'ffffff',
    text_color: '1f2937'
  });

  const fullUrl = `${calendlyUrl}?${embedParams.toString()}`;

  // Check if iframe is already in browser cache
  useEffect(() => {
    if ('caches' in window) {
      caches.match(calendlyUrl).then(response => {
        if (response) setCached(true);
      });
    }
  }, [calendlyUrl]);

  // Preconnect to Calendly domains immediately
  useEffect(() => {
    const domains = ['https://assets.calendly.com', 'https://calendly.com'];
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });

    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'script';
    preload.href = 'https://assets.calendly.com/assets/external/widget.js';
    document.head.appendChild(preload);
  }, []);

  return (
    <>
      {/* Regular style tag - no random class names */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .loader-spin {
          animation: spin 1.5s linear infinite;
        }
        .loader-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="relative w-full md:h-[700px] h-[800px] bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        
        {/* Loader with pointer-events-none to allow scrolling through */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white z-10 pointer-events-none">
            <div className="text-center px-6">
              
              {/* Animated calendar icon */}
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-600/10 to-black/10 rounded-2xl flex items-center justify-center loader-pulse">
                  <BsCalendarCheck className="w-12 h-12 text-red-600" />
                </div>
                
                {/* Spinning ring */}
                <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl border-2 border-red-600/20 border-t-red-600 loader-spin" />
                
                {/* Cache indicator */}
                {cached && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              
              {/* Custom loading message */}
              <h3 className="text-xl font-['Marcellus'] text-gray-800 mb-2">
                {cached ? 'Almost there!' : 'Getting things ready'}
              </h3>
              
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                {cached 
                  ? 'Your calendar is loading ...' 
                  : 'Please wait while we prepare your meeting scheduler'}
              </p>
              
              {/* Custom progress bar */}
              <div className="mt-6 w-64 h-2 bg-gray-100 rounded-full mx-auto overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-black rounded-full animate-progress"
                  style={{ width: '70%' }} 
                />
              </div>
              
         
            </div>
          </div>
        )}

        {/* Calendly iframe */}
        <iframe
          ref={iframeRef}
          src={fullUrl}
          className="w-full h-full border-0 transition-opacity duration-300"
          style={{
            opacity: loaded ? 1 : 0
          }}
          loading="eager"
          fetchPriority="high"
          onLoad={() => setLoaded(true)}
          onError={() => {
            console.error('Failed to load calendar');
            setLoaded(true);
          }}
          allow="camera; microphone; fullscreen; payment"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads allow-modals allow-popups-to-escape-sandbox"
          title="Schedule a meeting with Web Mavein"
        />
      </div>
    </>
  );
}