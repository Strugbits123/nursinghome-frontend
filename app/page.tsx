"use client";
import { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "./components/header"
import { HeroSection } from "./components/hero-section"

// Lazy sections with proper loading states
const TrustedSection = lazy(() => import("./components/trusted-section").then(m => ({ default: m.TrustedSection })));
const ResultsSection = lazy(() => import("./components/results-section").then(m => ({ default: m.ResultsSection })));
const AISummary = lazy(() => import("./components/ai-summary").then(m => ({ default: m.AISummary })));
const TopRatedFeatured = lazy(() => import("./components/top-rated-featured").then(m => ({ default: m.TopRatedFeatured })));
const CitiesSection = lazy(() => import("./components/CitiesSection").then(m => ({ default: m.CitiesSection })));
const SearchNursing = lazy(() => import("./components/SearchNursing").then(m => ({ default: m.SearchNursing })));
const Footer = lazy(() => import("./components/Footer").then(m => ({ default: m.Footer })));
const NewRescource = lazy(() => import("./components/NewsRescource").then(m => ({ default: m.NewRescource })));

export default function Home() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const trustedRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);
  const topRatedRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [gsapReady, setGsapReady] = useState(false);
  const [sectionsLoaded, setSectionsLoaded] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [navigationType, setNavigationType] = useState<'fresh' | 'back_forward' | 'refresh' | 'navigation'>('fresh');
  
  const locoScrollRef = useRef<any>(null);
  const ScrollTriggerRef = useRef<any>(null);

  // Detect navigation type and handle all scenarios
  useEffect(() => {
    console.log('🔄 Detecting navigation type...');
    
    // Check performance navigation api
    if (performance.navigation) {
      const perfNav = performance.navigation;
      if (perfNav.type === perfNav.TYPE_BACK_FORWARD) {
        console.log('🔙 Navigation: Browser back/forward');
        setNavigationType('back_forward');
      } else if (perfNav.type === perfNav.TYPE_RELOAD) {
        console.log('🔄 Navigation: Page refresh');
        setNavigationType('refresh');
      } else {
        console.log('🚀 Navigation: Fresh load or direct navigation');
        setNavigationType('fresh');
      }
    }

    // Check if page is being restored from bfcache
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        console.log('📖 Page restored from bfcache (back/forward)');
        setNavigationType('back_forward');
        // Force re-initialization
        setReady(false);
        setGsapReady(false);
        setSectionsLoaded(false);
        setTimeout(() => setReady(true), 100);
      }
    };

    // Listen for regular navigation
    const handleRouteChange = () => {
      console.log('🧭 Navigation: Client-side navigation');
      setNavigationType('navigation');
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', handleRouteChange);
    
    // Set initial ready state
    if (document.readyState === 'complete') {
      setReady(true);
    } else {
      window.addEventListener('load', () => {
        console.log('📄 Page fully loaded');
        setReady(true);
      });
    }

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Universal scroll restoration for all navigation types
  useEffect(() => {
    if (!sectionsLoaded || !locoScrollRef.current) return;

    const restoreScrollPosition = () => {
      const savedScroll = sessionStorage.getItem('pageScrollPosition');
      const savedNavigationType = sessionStorage.getItem('lastNavigationType');
      
      console.log('📊 Scroll restoration info:', {
        savedScroll,
        savedNavigationType,
        currentNavigationType: navigationType,
        isInitialLoad
      });

      // Only restore scroll for back/forward navigation or if explicitly saved
      const shouldRestoreScroll = 
        navigationType === 'back_forward' || 
        (savedNavigationType === 'back_forward' && navigationType === 'fresh');

      if (shouldRestoreScroll && savedScroll) {
        const position = parseInt(savedScroll, 10);
        console.log('🎯 Restoring scroll to:', position);
        
        const attemptScroll = (attempts = 0) => {
          if (attempts > 5) {
            console.log('❌ Max scroll restoration attempts reached');
            return;
          }

          if (locoScrollRef.current) {
            locoScrollRef.current.scrollTo(position, {
              duration: 0,
              disableLerp: true
            });
            
            // Verify scroll position
            setTimeout(() => {
              const currentScroll = locoScrollRef.current?.scroll?.instance?.scroll?.y || 0;
              console.log(`🎯 Scroll attempt ${attempts + 1}: target=${position}, current=${currentScroll}`);
              
              if (Math.abs(currentScroll - position) > 10) {
                attemptScroll(attempts + 1);
              } else {
                console.log('✅ Scroll restoration successful');
                // Final refresh
                setTimeout(() => {
                  if (locoScrollRef.current && ScrollTriggerRef.current) {
                    locoScrollRef.current.update();
                    ScrollTriggerRef.current.refresh();
                  }
                }, 100);
              }
            }, 150);
          }
        };

        attemptScroll();
      } else {
        console.log('⬆️ Starting from top - no scroll restoration needed');
        // Ensure we're at top for fresh loads
        if (locoScrollRef.current) {
          locoScrollRef.current.scrollTo(0, { duration: 0 });
        }
      }

      setIsInitialLoad(false);
    };

    const timer = setTimeout(restoreScrollPosition, 400);
    return () => clearTimeout(timer);
  }, [sectionsLoaded, navigationType, isInitialLoad]);

  // Enhanced section loading detection with better reliability
  useEffect(() => {
    if (ready && gsapReady) {
      console.log('🔍 Monitoring section loading...');
      
      let sectionsLoadedCount = 0;
      const requiredSections = 4; // trusted, results, ai, topRated
      
      const checkSections = () => {
        const sections = [
          { ref: trustedRef, name: 'TrustedSection' },
          { ref: resultsRef, name: 'ResultsSection' },
          { ref: aiRef, name: 'AISummary' },
          { ref: topRatedRef, name: 'TopRatedFeatured' }
        ];

        sections.forEach(({ ref, name }) => {
          if (ref.current && ref.current.children.length > 0) {
            if (!ref.current.dataset.loaded) {
              console.log(`✅ ${name} loaded`);
              ref.current.dataset.loaded = 'true';
              sectionsLoadedCount++;
            }
          }
        });

        if (sectionsLoadedCount >= requiredSections) {
          console.log('🎉 All main sections loaded!');
          setSectionsLoaded(true);
        } else {
          // Continue checking
          setTimeout(checkSections, 100);
        }
      };

      // Start checking
      checkSections();

      // Fallback timeout
      const fallbackTimer = setTimeout(() => {
        console.log('⏰ Fallback: Setting sections as loaded');
        setSectionsLoaded(true);
      }, 2000);

      return () => clearTimeout(fallbackTimer);
    }
  }, [ready, gsapReady]);

  // Comprehensive scroll position saving
  useEffect(() => {
    if (!locoScrollRef.current) return;

    let scrollTimeout: NodeJS.Timeout;
    
    const saveScrollPosition = () => {
      if (locoScrollRef.current?.scroll?.instance?.scroll?.y !== undefined) {
        const scrollY = locoScrollRef.current.scroll.instance.scroll.y;
        sessionStorage.setItem('pageScrollPosition', scrollY.toString());
        sessionStorage.setItem('lastNavigationType', navigationType);
        
        // Only log occasionally to avoid spam
        if (Math.random() < 0.01) { // 1% chance to log
          console.log('💾 Scroll position saved:', scrollY);
        }
      }
    };

    const throttledScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(saveScrollPosition, 100);
    };

    // Save on scroll
    if (locoScrollRef.current.scroll && locoScrollRef.current.scroll.on) {
      locoScrollRef.current.scroll.on('scroll', throttledScroll);
    }

    // Save on various page exit scenarios
    const saveBeforeExit = () => {
      saveScrollPosition();
      console.log('💾 Scroll saved before exit');
    };

    window.addEventListener('beforeunload', saveBeforeExit);
    window.addEventListener('pagehide', saveBeforeExit);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        saveBeforeExit();
      }
    });

    // Save when navigating away via Next.js router
    const originalPush = router.push;
    router.push = async (...args: any) => {
      saveBeforeExit();
      return originalPush.apply(router, args);
    };

    return () => {
      if (locoScrollRef.current?.scroll?.off) {
        locoScrollRef.current.scroll.off('scroll', throttledScroll);
      }
      window.removeEventListener('beforeunload', saveBeforeExit);
      window.removeEventListener('pagehide', saveBeforeExit);
      document.removeEventListener('visibilitychange', saveBeforeExit);
      clearTimeout(scrollTimeout);
    };
  }, [locoScrollRef.current, navigationType, router]);

  // Robust GSAP and Locomotive initialization
  useEffect(() => {
    if (!ready || gsapReady) return;

    console.log('🎬 Initializing scroll effects for navigation type:', navigationType);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loadScrollEffects = async () => {
      try {
        // Clean up any existing instances
        if (locoScrollRef.current) {
          locoScrollRef.current.destroy();
          locoScrollRef.current = null;
        }

        if (ScrollTriggerRef.current) {
          ScrollTriggerRef.current.getAll().forEach((st: any) => st.kill());
        }

        const [gsapModule, scrollTriggerModule, locomotiveModule] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("locomotive-scroll"),
        ]);

        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        
        gsap.registerPlugin(ScrollTrigger);
        ScrollTriggerRef.current = ScrollTrigger;

        const LocomotiveScroll = locomotiveModule.default;

        // Initialize with optimized smooth settings
        const locoScroll = new LocomotiveScroll({
          el: containerRef.current!,
          smooth: true,
          multiplier: 0.8, // Slower for extra smoothness
          lerp: 0.08, // Ultra-smooth interpolation
          getDirection: true,
          getSpeed: true,
          smartphone: {
            smooth: true,
            breakpoint: 768,
            lerp: 0.05 // Slightly faster on mobile
          },
          tablet: {
            smooth: true,
            breakpoint: 1024,
            lerp: 0.04
          },
          reloadOnContextChange: true,
          touchMultiplier: 1.5, // Better touch response
        });

        locoScrollRef.current = locoScroll;

        // Setup scroll proxy for GSAP ScrollTrigger
        locoScroll.on("scroll", ScrollTrigger.update);

        ScrollTrigger.scrollerProxy(containerRef.current!, {
          scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };
          },
          pinType: containerRef.current!.style.transform ? "transform" : "fixed",
        });

        // Setup animations
        if (!prefersReducedMotion) {
          setupAnimations(gsap, ScrollTrigger, locoScroll);
        }

        // Enhanced refresh handling
        ScrollTrigger.addEventListener("refresh", () => {
          locoScroll.update();
        });

        ScrollTrigger.refresh();

        // Initialize with smooth update
        const initializeWithRetry = (attempt = 0) => {
          if (attempt > 3) {
            console.log('✅ Scroll effects initialized (final attempt)');
            setGsapReady(true);
            return;
          }

          locoScroll.update();
          ScrollTrigger.refresh();
          
          setTimeout(() => {
            locoScroll.update();
            ScrollTrigger.refresh();
            
            console.log(`🔄 Smooth scroll init attempt ${attempt + 1}`);
            
            console.log('✅ Locomotive Scroll initialized with smooth scrolling');
            setGsapReady(true);
          }, 100 + (attempt * 50));
        };

        initializeWithRetry();

      } catch (error) {
        console.error("❌ Failed to load scroll effects:", error);
        // Continue without scroll effects
        setGsapReady(true);
      }
    };

    loadScrollEffects();

    return () => {
      // Cleanup on unmount
      if (ScrollTriggerRef.current) {
        ScrollTriggerRef.current.getAll().forEach((st: any) => st.kill());
      }
      if (locoScrollRef.current) {
        locoScrollRef.current.destroy();
      }
    };
  }, [ready, navigationType]);

  // Animation setup
  const setupAnimations = (gsap: any, ScrollTrigger: any, locoScroll: any) => {
    const { from } = gsap;

    const safeFrom = (element: HTMLElement | null, vars: any) => {
      if (!element) return;
      
      try {
        from(element, {
          scrollTrigger: {
            trigger: element,
            scroller: containerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
          ...vars,
        });
      } catch (error) {
        console.warn('Animation setup failed:', error);
      }
    };

    // Set up all animations
    safeFrom(resultsRef.current, {
      y: 50,
      opacity: 0,
      duration: 1.4,
      ease: "power3.out",
    });

    safeFrom(trustedRef.current, {
      x: -80,
      opacity: 0,
      filter: "blur(10px)",
      duration: 1.3,
      ease: "power3.out",
    });

    safeFrom(aiRef.current, {
      x: 80,
      opacity: 0,
      scale: 0.95,
      duration: 1.3,
      ease: "power3.out",
    });

   safeFrom(topRatedRef.current, {
      y: 30,
      opacity: 0,
      scale: 0.98,
      duration: 1.1,
      ease: "power2.out",
    });
  };

  // Responsive resize handler
  useEffect(() => {
    if (!gsapReady) return;

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (locoScrollRef.current && ScrollTriggerRef.current) {
          console.log('📱 Handling resize, updating smooth scroll');
          locoScrollRef.current.update();
          ScrollTriggerRef.current.refresh();
        }
      }, 300);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [gsapReady]);

  // Final refresh when everything is ready
  useEffect(() => {
    if (sectionsLoaded && gsapReady) {
      console.log('🎊 Everything loaded! Final smooth refresh...');
      
      const finalRefresh = () => {
        if (locoScrollRef.current && ScrollTriggerRef.current) {
          locoScrollRef.current.update();
          ScrollTriggerRef.current.refresh();
          
          // One more refresh after a brief delay
          setTimeout(() => {
            locoScrollRef.current.update();
            ScrollTriggerRef.current.refresh();
            console.log('🏁 Page fully initialized with smooth scrolling!');
          }, 200);
        }
      };

      requestAnimationFrame(finalRefresh);
    }
  }, [sectionsLoaded, gsapReady]);

  // Loading skeleton component
  const SectionSkeleton = ({ height = "h-96", rounded = true }) => (
    <div 
      className={`${height} ${rounded ? 'rounded-lg' : ''} bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse`}
    />
  );

  return (
    <div className={`${ready ? "opacity-100" : "opacity-0"} transition-opacity duration-500 ease-out`}>
      <div
        ref={containerRef}
        data-scroll-container
        className="min-h-screen bg-background"
      >
        {/* Hero Section */}
        <div
          className="relative w-full h-[947px] bg-cover bg-center bg-[#020D16] hero-bg"
          style={{
            backgroundImage: `url('/b20ba9d675afe9a11e0416efde3e22d2fb92f8a4.png')`,
          }}
        >
          <div className="absolute inset-0 bg-[#020D16] opacity-70 z-0"></div>
          <div className="relative z-10">
            <Header />
            <HeroSection />
          </div>
        </div>

        {/* Lazy Loaded Sections */}
        <div ref={trustedRef}>
          <Suspense fallback={<SectionSkeleton />}>
            <TrustedSection />
          </Suspense>
        </div>

        <div ref={resultsRef}>
          <Suspense fallback={<SectionSkeleton />}>
            <ResultsSection />
          </Suspense>
        </div>

        <div ref={aiRef}>
          <Suspense fallback={<SectionSkeleton />}>
            <AISummary />
          </Suspense>
        </div>

        <div ref={topRatedRef}>
          <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
            <TopRatedFeatured />
          </Suspense>
        </div>

        <Suspense fallback={<SectionSkeleton height="h-64" />}>
          <CitiesSection />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton height="h-64" />}>
          <NewRescource />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton height="h-64" />}>
          <SearchNursing />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton height="h-80" rounded={false} />}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}