'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TubesBackground from '@/components/ui/neon-flow';

gsap.registerPlugin(ScrollTrigger);

/* Countdown target — 30 days from page load */
const TARGET = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

function useCountdown() {
  const [time, setTime] = useState({ d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    const tick = () => {
      const diff = TARGET - Date.now();
      if (diff <= 0) return;
      const pad = (n) => String(Math.floor(n)).padStart(2, '0');
      setTime({
        d: pad(diff / 86400000),
        h: pad((diff % 86400000) / 3600000),
        m: pad((diff % 3600000) / 60000),
        s: pad((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function CTA() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const glowRef = useRef(null);
  const subRef = useRef(null);
  const countdownRef = useRef(null);
  const { d, h, m, s } = useCountdown();

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Pulsing red glow */
      gsap.to(glowRef.current, {
        scale: 1.35,
        opacity: 0.55,
        duration: 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      /* Headline scale in */
      gsap.fromTo(
        headlineRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* Sub + countdown */
      gsap.fromTo(
        [subRef.current, countdownRef.current],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 55%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="shop"
      style={{ position: 'relative', height: '100dvh', overflow: 'hidden' }}
    >
      {/* ── Layer 0: Neon tubes canvas ── */}
      <TubesBackground
        className="absolute inset-0 !bg-[#0A0A0A]"
        enableClickInteraction
      />

      {/* ── Layer 1: Dark scrim — keeps text readable over tubes ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10,10,10,0.68)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ── Layer 2: Brand red glow pulse ── */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(217,31,31,0.22) 0%, transparent 70%)',
          opacity: 0.35,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* ── Layer 3: Content ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 40,
        }}
      >
        {/* Label */}
        <p
          style={{
            fontFamily: 'var(--font-barlow)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--color-red)',
            marginBottom: 28,
          }}
        >
          DROP LIVE — 2025
        </p>

        {/* Main headline */}
        <h2
          ref={headlineRef}
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 900,
            fontSize: 'clamp(64px, 12vw, 180px)',
            lineHeight: 0.88,
            color: 'var(--color-white)',
            willChange: 'transform',
          }}
        >
          BUY
          <br />
          <span style={{ color: 'var(--color-red)' }}>NOW</span>
        </h2>

        {/* Sub */}
        <p
          ref={subRef}
          style={{
            marginTop: 32,
            fontFamily: 'var(--font-barlow)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(242,237,228,0.45)',
          }}
        >
          999 pieces. One colorway. No restock.
        </p>

        {/* Countdown */}
        <div
          ref={countdownRef}
          style={{ marginTop: 48, display: 'flex', gap: 32 }}
        >
          {[
            { value: d, label: 'DAYS' },
            { value: h, label: 'HRS' },
            { value: m, label: 'MIN' },
            { value: s, label: 'SEC' },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 900,
                  fontSize: 'clamp(36px, 5vw, 72px)',
                  lineHeight: 1,
                  color: 'var(--color-white)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-barlow)',
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.3em',
                  color: 'rgba(242,237,228,0.35)',
                  textTransform: 'uppercase',
                  marginTop: 6,
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          style={{
            marginTop: 56,
            padding: '18px 52px',
            background: 'var(--color-red)',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-barlow)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            border: 'none',
            transition: 'background 0.2s ease, transform 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#b01818';
            e.currentTarget.style.transform = 'scale(1.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-red)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          SHOP THE DROP
        </button>

        {/* Click hint */}
        <p
          style={{
            position: 'absolute',
            bottom: 52,
            fontFamily: 'var(--font-barlow)',
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(242,237,228,0.2)',
            animation: 'pulse 2.5s ease-in-out infinite',
          }}
        >
          CLICK BACKGROUND TO CHANGE COLORS
        </p>

        {/* Bottom brand mark */}
        <p
          style={{
            position: 'absolute',
            bottom: 32,
            fontFamily: 'var(--font-barlow)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.3em',
            color: 'rgba(242,237,228,0.12)',
            textTransform: 'uppercase',
          }}
        >
          © VT STREETWEAR 2025
        </p>
      </div>
    </section>
  );
}
