"use client";

import { useState } from "react";
import { BsCalendarCheck } from "react-icons/bs";

export default function CalendlyEmbed() {

  const [loaded, setLoaded] = useState(false);

  const calendlyUrl =
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    "https://calendly.com/webmavein/30min";

  return (
    <div className="relative w-full h-[700px] bg-white rounded-2xl overflow-hidden">

      {/* Loader UI */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">

            <div className="w-20 h-20 mx-auto mb-6 bg-red-600/10 rounded-full flex items-center justify-center animate-pulse">
              <BsCalendarCheck className="w-8 h-8 text-red-600" />
            </div>

            <p className="text-gray-600 font-medium animate-pulse">
              Preparing your meeting experience...
            </p>

          </div>
        </div>
      )}

      {/* Calendly iframe */}
      <iframe
        src={calendlyUrl}
        className="w-full h-full border-0 transition-opacity duration-500"
        style={{
          opacity: loaded ? 1 : 0
        }}
        loading="eager"
        onLoad={() => setLoaded(true)}
        allow="camera; microphone; fullscreen"
      />

    </div>
  );
}