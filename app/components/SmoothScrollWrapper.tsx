"use client";
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    Lenis: any;
  }
}

export default function SmoothScrollWrapper({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);
  const pathname = usePathname();
  const rafIdRef = useRef<number | null>(null); 

  useEffect(() => {
    // Only initialize on client side
    if (typeof window === 'undefined') return;

    const initSmoothScroll = async () => {
      try {
        // Import Lenis
        const Lenis = (await import('lenis')).default;
        
        // Initialize Lenis
        lenisRef.current = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
        });

        // RAF function
        const raf = (time: number) => {
          lenisRef.current?.raf(time);
          rafIdRef.current = requestAnimationFrame(raf);
        };

        rafIdRef.current = requestAnimationFrame(raf);

        // Handle route changes
        const handleRouteChange = () => {
          // Scroll to top on route change
          setTimeout(() => {
            lenisRef.current?.scrollTo(0, { immediate: true });
          }, 100);
        };

        // Handle resize
        const handleResize = () => {
          lenisRef.current?.resize();
        };

        // Handle beforeunload for scroll restoration
        const handleBeforeUnload = () => {
          const scrollY = lenisRef.current?.scroll || window.scrollY;
          sessionStorage.setItem('smoothScrollPosition', scrollY.toString());
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Restore scroll position if available
        const savedScroll = sessionStorage.getItem('smoothScrollPosition');
        if (savedScroll) {
          setTimeout(() => {
            lenisRef.current?.scrollTo(parseInt(savedScroll), { immediate: true });
            sessionStorage.removeItem('smoothScrollPosition');
          }, 150);
        }

        console.log('✅ Smooth scroll initialized with Lenis');

        return () => {
          if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
          }
          lenisRef.current?.destroy();
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      } catch (error) {
        console.error('❌ Failed to initialize smooth scroll:', error);
      }
    };

    initSmoothScroll();

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  // Handle route changes
  useEffect(() => {
    if (!lenisRef.current) return;

    // Scroll to top on route change with a slight delay
    const timer = setTimeout(() => {
      lenisRef.current?.scrollTo(0, { immediate: true });
      lenisRef.current?.resize();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div id="smooth-scroll-wrapper">
      {children}
    </div>
  );
}