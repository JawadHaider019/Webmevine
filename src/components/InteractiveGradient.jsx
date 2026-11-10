"use client";

import { useEffect, useRef, useState } from "react";

export default function InteractiveGradient() {
  const containerRef = useRef(null);
  const interactiveRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  // Pause off-screen Hero glow & RAF loop once user scrolls past Hero
  useEffect(() => {
    const target = containerRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const checkTouchOrReduced = () => {
      if (typeof window === "undefined") return true;
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      const touch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;
      return reduced || touch;
    };

    if (checkTouchOrReduced()) return;

    const el = interactiveRef.current;
    if (!el) return;

    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;
    let rafId = null;

    const move = () => {
      const dx = tgX - curX;
      const dy = tgY - curY;
      curX += dx / 20;
      curY += dy / 20;

      el.style.transform = `translate3d(${Math.round(curX)}px, ${Math.round(curY)}px, 0)`;

      // Stop 60fps RAF loop when pointer settles to eliminate idle CPU usage
      if (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4) {
        rafId = window.requestAnimationFrame(move);
      } else {
        rafId = null;
      }
    };

    const handleMouseMove = (e) => {
      tgX = e.clientX;
      tgY = e.clientY;
      if (!rafId) {
        rafId = window.requestAnimationFrame(move);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  const playState = isVisible ? "running" : "paused";

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0 overflow-hidden pointer-events-none"
      style={{ contain: "strict" }}
    >
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className="relative w-full h-full"
        style={{
          filter: "url(#goo) blur(40px)",
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      >
        {/* g1 */}
        <div
          className="absolute rounded-full mix-blend-hard-light"
          style={{
            width: "60%",
            height: "60%",
            top: "20%",
            left: "20%",
            background:
              "radial-gradient(circle at center, rgba(220,20,20,0.8) 0, rgba(220,20,20,0) 50%)",
            willChange: "transform",
            animation: "heroBlobVertical 30s ease infinite",
            animationPlayState: playState,
          }}
        />

        {/* g2 */}
        <div
          className="absolute rounded-full mix-blend-hard-light"
          style={{
            width: "60%",
            height: "60%",
            top: "20%",
            left: "20%",
            background:
              "radial-gradient(circle at center, rgba(220,0,0,0.8) 0, rgba(220,0,0,0) 50%)",
            transformOrigin: "calc(50% - 200px)",
            willChange: "transform",
            animation: "heroBlobRotate 20s linear infinite",
            animationPlayState: playState,
          }}
        />

        {/* g3 */}
        <div
          className="absolute rounded-full mix-blend-hard-light"
          style={{
            width: "60%",
            height: "60%",
            top: "calc(20% + 50px)",
            left: "calc(20% - 100px)",
            background:
              "radial-gradient(circle at center, rgba(220,40,40,0.8) 0, rgba(220,40,40,0) 50%)",
            transformOrigin: "calc(50% + 200px)",
            willChange: "transform",
            animation: "heroBlobRotate 40s linear infinite",
            animationPlayState: playState,
          }}
        />

        {/* g4 */}
        <div
          className="absolute rounded-full mix-blend-hard-light"
          style={{
            width: "60%",
            height: "60%",
            top: "20%",
            left: "20%",
            background:
              "radial-gradient(circle at center, rgba(220,0,0,0.8) 0, rgba(220,0,0,0) 50%)",
            willChange: "transform",
            animation: "heroBlobHorizontal 40s ease infinite",
            animationPlayState: playState,
          }}
        />

        {/* g5 */}
        <div
          className="absolute rounded-full mix-blend-hard-light"
          style={{
            width: "100%",
            height: "100%",
            top: "-10%",
            left: "-10%",
            background:
              "radial-gradient(circle at center, rgba(220,0,0,0.8) 0, rgba(220,0,0,0) 50%)",
            willChange: "transform",
            animation: "heroBlobRotate 25s linear infinite",
            animationPlayState: playState,
          }}
        />

        {/* Interactive */}
        <div
          ref={interactiveRef}
          className="hidden lg:block absolute pointer-events-none mix-blend-hard-light"
          style={{
            width: "80%",
            height: "80%",
            top: "-30%",
            left: "-30%",
            background:
              "radial-gradient(circle at center, rgba(255,60,60,0.8) 0, rgba(255,60,60,0) 50%)",
            opacity: 0.7,
            willChange: "transform",
          }}
        />
      </div>
    </div>
  );
}
