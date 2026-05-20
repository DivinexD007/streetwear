'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CartButton from './CartButton';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

/**
 * Items with `route` are real navigation. Items with `anchor` smooth-scroll to a
 * homepage section — only valid on `/`. On other pages they fall back to `/#anchor`.
 */
const NAV_ITEMS = [
  { label: 'Shop', route: '/shop' },
  { label: 'Drop', anchor: '#drop' },
  { label: 'About', anchor: '#about' },
];

export default function Navbar() {
  const navRef = useRef(null);
  const pathname = usePathname();
  const onHome = pathname === '/';

  useEffect(() => {
    const nav = navRef.current;
    /* On non-home routes, navbar is always visible — no loader gate. */
    if (!onHome) {
      gsap.set(nav, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(nav, { opacity: 0, y: -10 });
    const handleLoaderComplete = () => {
      gsap.to(nav, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 });
    };
    window.addEventListener('loaderComplete', handleLoaderComplete, { once: true });
    return () => window.removeEventListener('loaderComplete', handleLoaderComplete);
  }, [onHome]);

  const handleAnchor = (e, anchor) => {
    if (!onHome) return; /* Let browser navigate to /#anchor */
    e.preventDefault();
    const el = document.querySelector(anchor);
    if (!el) return;
    gsap.to(window, {
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTo: { y: el, autoKill: true },
    });
  };

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 40px',
        mixBlendMode: onHome ? 'difference' : 'normal',
      }}
    >
      <Link
        href="/"
        aria-label="Home"
        style={{ width: 42, height: 34, position: 'relative', display: 'block' }}
      >
        <Image
          src="/images/logo.png"
          alt="VT"
          fill
          sizes="42px"
          style={{ objectFit: 'contain' }}
          priority
        />
      </Link>

      <ul
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          listStyle: 'none',
          fontFamily: 'var(--font-barlow)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-white)',
        }}
      >
        {NAV_ITEMS.map(({ label, route, anchor }) => (
          <li key={label}>
            {route ? (
              <Link
                href={route}
                style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-red)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
              >
                {label}
              </Link>
            ) : (
              <a
                href={onHome ? anchor : `/${anchor}`}
                onClick={(e) => handleAnchor(e, anchor)}
                style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-red)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
              >
                {label}
              </a>
            )}
          </li>
        ))}
        <li>
          <CartButton />
        </li>
      </ul>
    </nav>
  );
}
