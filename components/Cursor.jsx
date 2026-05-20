'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    /* quickTo for smooth lag — one call per axis */
    const moveDotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
    const moveDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
    const moveRingX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });

    const onMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      moveDotX(e.clientX);
      moveDotY(e.clientY);
      moveRingX(e.clientX);
      moveRingY(e.clientY);
    };

    const onMouseEnterLink = (e) => {
      const el = e.currentTarget;
      const isProduct = el.dataset.cursor === 'view';
      gsap.to(ring, {
        width: isProduct ? 80 : 60,
        height: isProduct ? 80 : 60,
        borderColor: 'var(--color-red)',
        duration: 0.25,
        ease: 'power2.out',
      });
      if (isProduct && label) {
        gsap.to(label, { opacity: 1, duration: 0.2 });
      }
    };

    const onMouseLeaveLink = () => {
      gsap.to(ring, {
        width: 40,
        height: 40,
        borderColor: 'rgba(242,237,228,0.6)',
        duration: 0.25,
        ease: 'power2.out',
      });
      if (label) gsap.to(label, { opacity: 0, duration: 0.15 });
    };

    window.addEventListener('mousemove', onMouseMove);

    /* Attach hover handlers dynamically */
    const links = document.querySelectorAll('a, button, [data-cursor]');
    links.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterLink);
      el.addEventListener('mouseleave', onMouseLeaveLink);
    });

    /* Initial position off-screen */
    gsap.set([dot, ring], { x: -100, y: -100, xPercent: -50, yPercent: -50 });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      links.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterLink);
        el.removeEventListener('mouseleave', onMouseLeaveLink);
      });
    };
  }, []);

  return (
    <>
      {/* Small dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          background: 'var(--color-white)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          border: '1px solid rgba(242,237,228,0.6)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          ref={labelRef}
          style={{
            opacity: 0,
            fontSize: 9,
            fontFamily: 'var(--font-barlow)',
            letterSpacing: '0.15em',
            color: 'var(--color-white)',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          VIEW
        </span>
      </div>
    </>
  );
}
