'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PosterScroll() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      /* Horizontal scroll */
      const totalScroll = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      /* Individual element parallax within the scroll */
      const parallaxEls = track.querySelectorAll('[data-speed]');
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.speed);
        gsap.to(el, {
          x: speed * totalScroll * 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => `+=${totalScroll}`,
            scrub: true,
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        height: '100dvh',
        overflow: 'hidden',
        background: '#0A0A0A',
      }}
    >
      {/* Track — wider than viewport */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          width: 'max-content',
          willChange: 'transform',
        }}
      >
        {/* ── Panel 1: Section label */}
        <div
          style={{
            width: '30vw',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '6vw',
            flexShrink: 0,
          }}
        >
          <span
            data-speed="-0.2"
            style={{
              fontFamily: 'var(--font-barlow)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--color-red)',
              marginBottom: 16,
            }}
          >
            POSTER SERIES
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 900,
              fontSize: 'clamp(40px, 6vw, 86px)',
              lineHeight: 0.9,
              color: 'var(--color-white)',
            }}
          >
            THE
            <br />
            ART
            <br />
            OF
            <br />
            DROP
          </h2>
        </div>

        {/* ── Panel 2: Main poster image */}
        <div
          style={{
            width: '55vw',
            height: '85%',
            position: 'relative',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <Image
            src="/images/poster.png"
            alt="Poster collage"
            fill
            sizes="55vw"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
          {/* Grain overlay on poster */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              mixBlendMode: 'overlay',
              opacity: 0.15,
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
            }}
          />

          {/* Flicker text over poster */}
          <div
            data-speed="0.1"
            style={{
              position: 'absolute',
              bottom: 32,
              left: 28,
            }}
          >
            <p
              className="flicker"
              style={{
                fontFamily: 'var(--font-barlow)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.3em',
                color: 'var(--color-red)',
                textTransform: 'uppercase',
              }}
            >
              #407 IN THE WORLD, 2025
            </p>
          </div>
        </div>

        {/* ── Panel 3: Stats / text */}
        <div
          style={{
            width: '28vw',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '6vw 4vw',
            gap: 40,
            flexShrink: 0,
          }}
        >
          {[
            { label: 'PIECES', value: '999' },
            { label: 'COLORWAYS', value: '01' },
            { label: 'YEAR', value: '2025' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p
                style={{
                  fontFamily: 'var(--font-barlow)',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  color: 'rgba(242,237,228,0.35)',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 900,
                  fontSize: 'clamp(48px, 6vw, 90px)',
                  lineHeight: 0.9,
                  color: 'var(--color-white)',
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Panel 4: Fabric close-up */}
        <div
          style={{
            width: '40vw',
            height: '70%',
            position: 'relative',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <Image
            src="/images/hero-red.jpg"
            alt="Fabric detail"
            fill
            sizes="40vw"
            style={{ objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(10,10,10,0.6), transparent)',
            }}
          />
        </div>

        {/* ── Panel 5: End spacer */}
        <div style={{ width: '20vw', flexShrink: 0 }} />
      </div>

      {/* Horizontal scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          opacity: 0.35,
        }}
      >
        <div style={{ width: 32, height: 1, background: 'var(--color-white)' }} />
        <span
          style={{
            fontFamily: 'var(--font-barlow)',
            fontSize: 9,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}
        >
          DRAG
        </span>
        <div style={{ width: 32, height: 1, background: 'var(--color-white)' }} />
      </div>
    </section>
  );
}
