'use client';

import { useEffect } from 'react';
import Cursor from '@/components/Cursor';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BrandText from '@/components/BrandText';
import ProductGrid from '@/components/ProductGrid';
import PosterScroll from '@/components/PosterScroll';
import DetailSection from '@/components/DetailSection';
import CTA from '@/components/CTA';

export default function Home() {
  useEffect(() => {
    /* Prevent scroll during loader */
    document.body.style.overflow = 'hidden';

    const handleLoaderComplete = () => {
      document.body.style.overflow = '';
    };

    window.addEventListener('loaderComplete', handleLoaderComplete, { once: true });

    return () => {
      window.removeEventListener('loaderComplete', handleLoaderComplete);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <Cursor />
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <BrandText />
        <ProductGrid />
        <PosterScroll />
        <DetailSection />
        <CTA />
      </main>
    </>
  );
}
