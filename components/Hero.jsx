'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = ['SWEET', 'DREAMS'];

export default function Hero() {
  const sectionRef = useRef(null);
  const redRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const glowRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const red = redRef.current;
    const glow = glowRef.current;

    /* Mouse glow */
    const onMouseMove = (e) => {
      if (!glow) return;
      glow.style.background = `radial-gradient(700px circle at ${e.clientX}px ${e.clientY}px, rgba(217,31,31,0.09), transparent 60%)`;
    };
    section.addEventListener('mousemove', onMouseMove);

    /* Entrance animation — fires after loader */
    const startEntrance = () => {
      const words = titleRef.current?.querySelectorAll('.hero-word');
      if (!words) return;

      gsap.fromTo(
        words,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.14,
          ease: 'power3.out',
          delay: 0.15,
        }
      );

      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.5 }
      );
    };

    window.addEventListener('loaderComplete', startEntrance, { once: true });

    /* ScrollTrigger: pin + image crossfade */
    const ctx = gsap.context(() => {
      /* Image crossfade neutral → red */
      gsap.to(red, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=60%',
          scrub: true,
        },
      });

      /* Parallax on model */
      gsap.to(modelRef.current, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      /* Pin hero */
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
      });
    }, section);

    /* Set initial state */
    gsap.set(red, { opacity: 0 });

    return () => {
      section.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('loaderComplete', startEntrance);
      ctx.revert();
    };
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
      {/* Glow layer */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          transition: 'background 0.1s ease',
        }}
      />

      {/* Neutral image */}
      <div
        ref={modelRef}
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      >
        <Image
          src="/images/hero-neutral.jpg"
          alt="Model"
          fill
          sizes="100vw"
          priority
          loading="eager"
          fetchPriority="high"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
        {/* Vignette */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.1) 50%, rgba(10,10,10,0.3) 100%), linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 40%)',
          }}
        />
      </div>

      {/* Red image — crossfades in on scroll */}
      <div
        ref={redRef}
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      >
        <Image
          src="/images/hero-red.jpg"
          alt="Model — red"
          fill
          sizes="100vw"
          priority
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(10,10,10,0.65) 0%, rgba(10,10,10,0.05) 50%, rgba(10,10,10,0.3) 100%), linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 40%)',
          }}
        />
      </div>

      {/* Text content */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 48,
          zIndex: 3,
        }}
      >
        <h1
          ref={titleRef}
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 900,
            fontSize: 'clamp(80px, 13vw, 180px)',
            lineHeight: 0.9,
            color: 'var(--color-white)',
            mixBlendMode: 'difference',
            userSelect: 'none',
          }}
        >
          {HEADLINE.map((word) => (
            <span key={word} className="word-clip" style={{ display: 'block' }}>
              <span
                className="hero-word"
                style={{ display: 'block', willChange: 'transform' }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        <p
          ref={subRef}
          style={{
            marginTop: 20,
            fontFamily: 'var(--font-barlow)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(242,237,228,0.55)',
            opacity: 0,
          }}
        >
          I MAY STOP, BUT MY MIND NEVER DOES
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          right: 40,
          bottom: 40,
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          opacity: 0.4,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-barlow)',
            fontSize: 9,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            writingMode: 'vertical-lr',
          }}
        >
          SCROLL
        </span>
        <div
          style={{
            width: 1,
            height: 48,
            background:
              'linear-gradient(to bottom, var(--color-red), transparent)',
          }}
        />
      </div>
    </section>
  );
}
