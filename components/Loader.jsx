'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

export default function Loader() {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    const text = textRef.current;
    const line = lineRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        window.dispatchEvent(new Event('loaderComplete'));
        if (overlay) overlay.style.display = 'none';
      },
    });

    /* Entrance */
    tl.fromTo(
      logo,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }
    )
      .fromTo(
        line,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: 'power3.out', transformOrigin: 'left center' },
        '-=0.3'
      )
      .fromTo(
        text,
        { opacity: 0, letterSpacing: '0.5em' },
        { opacity: 1, letterSpacing: '0.3em', duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      )
      /* Glow pulse */
      .to(logo, {
        filter: 'drop-shadow(0 0 30px rgba(217,31,31,0.5))',
        duration: 0.4,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1,
      })
      /* Exit */
      .to([text, line], { opacity: 0, duration: 0.3, ease: 'power2.in' }, '+=0.3')
      .to(logo, { scale: 0.1, opacity: 0, duration: 0.5, ease: 'power3.in' }, '-=0.1')
      .to(overlay, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
      });

    return () => tl.kill();
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0A0A0A',
        zIndex: 9990,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
      }}
    >
      <div ref={logoRef} style={{ width: 100, height: 80, position: 'relative' }}>
        <Image
          src="/images/logo.png"
          alt="VT"
          fill
          sizes="100px"
          style={{ objectFit: 'contain', filter: 'invert(0)' }}
          priority
        />
      </div>

      <div
        ref={lineRef}
        style={{
          width: 1,
          height: 60,
          background: 'rgba(217,31,31,0.6)',
          transformOrigin: 'top center',
          scaleX: 1,
        }}
      />

      <p
        ref={textRef}
        style={{
          fontFamily: 'var(--font-barlow)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.3em',
          color: 'rgba(242,237,228,0.7)',
          textTransform: 'uppercase',
        }}
      >
        ENTER SYSTEM
      </p>
    </div>
  );
}
