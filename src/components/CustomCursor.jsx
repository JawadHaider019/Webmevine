"use client";

import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const glowRef = useRef(null);
    const [isTouchDevice, setIsTouchDevice] = useState(true);

    useEffect(() => {
        const checkTouchDevice = () => {
            return 'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                (navigator).msMaxTouchPoints > 0;
        };

        setIsTouchDevice(checkTouchDevice());

        if (isTouchDevice || !cursorRef.current) return;

        const moveCursor = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            if (cursorRef.current) {
                cursorRef.current.style.left = x + 'px';
                cursorRef.current.style.top = y + 'px';
            }
            if (glowRef.current) {
                glowRef.current.style.left = x + 'px';
                glowRef.current.style.top = y + 'px';
            }
        };

        const handleMouseDown = () => {
            if (cursorRef.current) cursorRef.current.style.transform = 'translate(-50%, -50%) scale(0.7)';
            if (glowRef.current) glowRef.current.style.transform = 'translate(-50%, -50%) scale(0.7)';
        };

        const handleMouseUp = () => {
            if (cursorRef.current) cursorRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
            if (glowRef.current) glowRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.onclick || target.classList.contains('cursor-pointer') || target.closest('a') || target.closest('button')) {
                if (cursorRef.current) {
                    cursorRef.current.style.width = '64px';
                    cursorRef.current.style.height = '64px';
                }
                if (glowRef.current) {
                    glowRef.current.style.width = '90px';
                    glowRef.current.style.height = '90px';
                    glowRef.current.style.opacity = '1';
                }
            }
        };

        const handleMouseOut = (e) => {
            const target = e.target;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.onclick || target.classList.contains('cursor-pointer') || target.closest('a') || target.closest('button')) {
                if (cursorRef.current) {
                    cursorRef.current.style.width = '32px';
                    cursorRef.current.style.height = '32px';
                }
                if (glowRef.current) {
                    glowRef.current.style.width = '52px';
                    glowRef.current.style.height = '52px';
                    glowRef.current.style.opacity = '0.6';
                }
            }
        };

        document.addEventListener('mousemove', moveCursor);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            document.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, [isTouchDevice]);

    if (isTouchDevice) return null;

    return (
        <>
            {/* Outer Red Glow */}
            <div
                ref={glowRef}
                className="fixed pointer-events-none z-[9998] rounded-full hidden lg:block"
                style={{
                    width: '52px',
                    height: '52px',
                    background: 'radial-gradient(circle, rgba(255, 0, 0, 0.4) 0%, rgba(255, 0, 0, 0.1) 60%, transparent 80%)',
                    filter: 'blur(4px)',
                    left: '0px',
                    top: '0px',
                    transform: 'translate(-50%, -50%)',
                    opacity: '0.6',
                    transition: 'width 0.3s ease-out, height 0.3s ease-out, background 0.3s ease-out, opacity 0.3s ease-out',
                }}
            />

            {/* Monochrome Inverting Core */}
            <div
                ref={cursorRef}
                className="fixed pointer-events-none z-[9999] rounded-full hidden lg:block"
                style={{
                    width: '32px',
                    height: '32px',
                    backdropFilter: 'grayscale(1) invert(1) brightness(1.5)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    left: '0px',
                    top: '0px',
                    transform: 'translate(-50%, -50%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'width 0.2s ease-out, height 0.2s ease-out, background 0.2s ease-out, transform 0.2s ease-out',
                }}
            />

            <style jsx global>{`
        @media (min-width: 1024px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
        </>
    );
};

export default CustomCursor;
