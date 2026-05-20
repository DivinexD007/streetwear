'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/* Generate n random hex colors */
const randomColors = (count) =>
  Array.from({ length: count }, () =>
    '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  );

/**
 * TubesBackground
 *
 * Renders an animated Three.js neon-tube canvas via threejs-components CDN.
 * Click anywhere to randomize the tube + light colors.
 *
 * Props:
 *   children              — content rendered above the canvas
 *   className             — extra classes on the root wrapper
 *   enableClickInteraction — toggle color-randomize on click (default true)
 */
export function TubesBackground({
  children,
  className,
  enableClickInteraction = true,
}) {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const tubesRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    let removeResize;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        /* CDN import — loads the exact tube-cursor build from threejs-components */
        // eslint-disable-next-line import/no-extraneous-dependencies
        const module = await import(
          /* webpackIgnore: true */
          'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
        );
        const TubesCursor = module.default;

        if (!mounted) return;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ['#f967fb', '#53bc28', '#6958d5'],
            lights: {
              intensity: 200,
              colors: ['#83f36e', '#fe8a2e', '#ff008a', '#60aed5'],
            },
          },
        });

        tubesRef.current = app;
        setIsLoaded(true);

        const handleResize = () => {};
        window.addEventListener('resize', handleResize);
        removeResize = () => window.removeEventListener('resize', handleResize);
      } catch (err) {
        console.error('TubesCursor failed to load:', err);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      removeResize?.();
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    tubesRef.current.tubes.setColors(randomColors(3));
    tubesRef.current.tubes.setLightsColors(randomColors(4));
  };

  return (
    <div
      className={cn(
        'relative w-full h-full min-h-[400px] overflow-hidden bg-background',
        className
      )}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ touchAction: 'none' }}
      />

      {/* Content above canvas */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export default TubesBackground;
