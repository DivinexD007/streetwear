'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DETAILS = ['HEAVY COTTON', 'OVERSIZED FIT', 'LIMITED RUN'];

export default function DetailSection() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Slow zoom on fabric image */
      gsap.fromTo(
        imageRef.current,
        { scale: 1 },
        {
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      /* Text lines stagger in */
      textRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none none',
              delay: i * 0.12,
            },
            delay: i * 0.12,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '100dvh',
        overflow: 'hidden',
        background: '#0A0A0A',
      }}
    >
      {/* Fabric image with slow zoom */}
      <div
        ref={imageRef}
        style={{
          position: 'absolute',
          inset: '-5%',
          willChange: 'transform',
        }}
      >
        <Image
          src="/images/model-cutout.png"
          alt="Heavy cotton fabric"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Dark overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.4) 60%, rgba(10,10,10,0.65) 100%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          bottom: 64,
          left: 52,
          zIndex: 2,
        }}
      >
        {/* Label */}
        <p
          style={{
            fontFamily: 'var(--font-barlow)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--color-red)',
            marginBottom: 28,
          }}
        >
          MATERIAL
        </p>

        {/* Detail lines */}
        {DETAILS.map((line, i) => (
          <div
            key={line}
            ref={(el) => (textRefs.current[i] = el)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 24,
                height: 1,
                background: 'var(--color-red)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-barlow)',
                fontSize: 'clamp(24px, 3.5vw, 48px)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--color-white)',
                lineHeight: 1.1,
              }}
            >
              {line}
            </span>
          </div>
        ))}
      </div>

      {/* Top-right: product code */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 40,
          zIndex: 2,
          textAlign: 'right',
          opacity: 0.3,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-barlow)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--color-white)',
          }}
        >
          SKU / VT-407-BLK
          <br />
          DROP 01 — 2025
        </p>
      </div>
    </section>
  );
}
