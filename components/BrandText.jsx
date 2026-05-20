'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LINES = ['NOTHING', 'LASTS.', 'YOUR', 'STORY', 'STAYS.'];

export default function BrandText() {
  const sectionRef = useRef(null);
  const lineRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      lineRefs.current.forEach((line) => {
        if (!line) return;
        const words = line.querySelectorAll('.brand-word');

        gsap.fromTo(
          words,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      /* Background fade to black */
      gsap.fromTo(
        sectionRef.current,
        { backgroundColor: '#0A0A0A' },
        {
          backgroundColor: '#0A0A0A',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        background: '#0A0A0A',
        padding: '14vw 8vw',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5vw',
      }}
    >
      {/* Thin red rule */}
      <div
        style={{
          width: 40,
          height: 2,
          background: 'var(--color-red)',
          marginBottom: '4vw',
        }}
      />

      {LINES.map((word, i) => (
        <div
          key={word}
          ref={(el) => (lineRefs.current[i] = el)}
          className="word-clip"
          style={{ display: 'block', overflow: 'hidden' }}
        >
          <span
            className="brand-word"
            style={{
              display: 'block',
              fontFamily: 'var(--font-playfair)',
              fontWeight: 900,
              fontSize: 'clamp(60px, 11vw, 160px)',
              lineHeight: 0.92,
              color:
                word.endsWith('.')
                  ? 'var(--color-red)'
                  : 'var(--color-white)',
              willChange: 'transform',
            }}
          >
            {word}
          </span>
        </div>
      ))}

      <p
        style={{
          marginTop: '6vw',
          fontFamily: 'var(--font-barlow)',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(242,237,228,0.35)',
          maxWidth: 320,
        }}
      >
        Underground. Premium. Performance driven. Every piece is a limited run.
      </p>
    </section>
  );
}
