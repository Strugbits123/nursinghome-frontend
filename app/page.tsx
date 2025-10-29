"use client";
import { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { Header } from "./components/header"
import { HeroSection } from "./components/hero-section"


// Lazy sections
const TrustedSection = lazy(() => import("./components/trusted-section").then(m => ({ default: m.TrustedSection })));
const ResultsSection = lazy(() => import("./components/results-section").then(m => ({ default: m.ResultsSection })));
const AISummary = lazy(() => import("./components/ai-summary").then(m => ({ default: m.AISummary })));
const TopRatedFeatured = lazy(() => import("./components/top-rated-featured").then(m => ({ default: m.TopRatedFeatured })));
const CitiesSection = lazy(() => import("./components/CitiesSection").then(m => ({ default: m.CitiesSection })));
const SearchNursing = lazy(() => import("./components/SearchNursing").then(m => ({ default: m.SearchNursing })));
const Footer = lazy(() => import("./components/Footer").then(m => ({ default: m.Footer })));
const NewRescource = lazy(() => import("./components/NewsRescource").then(m => ({ default: m.NewRescource })));


let gsap: any;
let ScrollTrigger: any;


export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const trustedRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);
  const topRatedRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  // Store refs for Locomotive and GSAP globally within the component scope
  const locoScrollRef = useRef<any>(null);
  const ScrollTriggerRef = useRef<any>(null);
// Fade-in page when fully loaded
  useEffect(() => {
    const onLoad = () => setReady(true);
    if (document.readyState === "complete") {
      setReady(true);
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  // --- Locomotive + GSAP setup ---
  useEffect(() => {
    if (!ready || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("locomotive-scroll"),
    ]).then(([gsapModule, scrollTriggerModule, locomotiveModule]) => {
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      ScrollTriggerRef.current = ScrollTrigger; // Store for global access
      gsap.registerPlugin(ScrollTrigger);

      const LocomotiveScroll = locomotiveModule.default;

      // --- Initialize Locomotive ---
      const locoScroll = new LocomotiveScroll({
        el: containerRef.current!,
        smooth: !prefersReducedMotion,
        multiplier: prefersReducedMotion ? 0 : 1,
        lerp: prefersReducedMotion ? 1 : 0.1,
        smartphone: { smooth: true },
        tablet: { smooth: true },
      });
      
      locoScrollRef.current = locoScroll; // Store for global access

      locoScroll.on("scroll", ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(containerRef.current!, {
        scrollTop(value: any) {
          return arguments.length
            ? locoScroll.scrollTo(value, 0, 0)
            : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            // height: locoScroll.el.scrollHeight, // You might need this for full-page scroller proxies
          };
        },
        // IMPORTANT: Ensure you don't overwrite pinType if it's already set by GSAP
        // If you see issues with pinned elements, try removing the conditional check.
        pinType: containerRef.current!.style.transform ? "transform" : "fixed",
      });

      // --- Animated Sections (Code is fine here, assuming selectors are correct) ---
      if (!prefersReducedMotion) {
        const { from, utils } = gsap;

        // Results Section
        if (resultsRef.current) {
          from(resultsRef.current, {
            scrollTrigger: {
              trigger: resultsRef.current,
              scroller: containerRef.current,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
            },
            y: 30,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
          });

          from(resultsRef.current.querySelectorAll(".animate-child"), {
            scrollTrigger: {
              trigger: resultsRef.current,
              scroller: containerRef.current,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play none none reverse",
            },
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1,
          });
        }

        // Trusted Section
        if (trustedRef.current) {
          from(trustedRef.current, {
            scrollTrigger: {
              trigger: trustedRef.current,
              scroller: containerRef.current,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
            },
            x: -60,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
          });

          from(trustedRef.current.querySelectorAll(".animate-child"), {
            scrollTrigger: {
              trigger: trustedRef.current,
              scroller: containerRef.current,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play none none reverse",
            },
            x: -30,
            opacity: 0,
            duration: 0.9,
            ease: "power2.out",
            stagger: 0.15,
          });
        }

        // AI Section
        if (aiRef.current) {
          from(aiRef.current, {
            scrollTrigger: {
              trigger: aiRef.current,
              scroller: containerRef.current,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
            },
            x: 60,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
          });

          from(aiRef.current.querySelectorAll(".animate-child"), {
            scrollTrigger: {
              trigger: aiRef.current,
              scroller: containerRef.current,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play none none reverse",
            },
            y: 40,
            opacity: 0,
            duration: 1.0,
            ease: "power2.out",
            stagger: 0.12,
          });
        }

        // Top Rated Section
        if (topRatedRef.current) {
          from(topRatedRef.current, {
            scrollTrigger: {
              trigger: topRatedRef.current,
              scroller: containerRef.current,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
            },
            scale: 0.9,
            opacity: 0,
            duration: 1.3,
            ease: "back.out(1.2)",
          });

          from(topRatedRef.current.querySelectorAll(".animate-child"), {
            scrollTrigger: {
              trigger: topRatedRef.current,
              scroller: containerRef.current,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play none none reverse",
            },
            scale: 0.8,
            rotation: 5,
            opacity: 0,
            duration: 1.1,
            ease: "back.out(1.4)",
            stagger: 0.2,
          });
        }

        // Hover lift effects
        utils.toArray(".hover-lift").forEach((element: any) => {
          element.addEventListener("mouseenter", () => {
            gsap.to(element, {
              y: -5,
              scale: 1.02,
              duration: 0.3,
              ease: "power2.out",
            });
          });
          element.addEventListener("mouseleave", () => {
            gsap.to(element, {
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          });
        });
      }

      // --- Keep everything synced ---
      // This is crucial, as it tells ScrollTrigger to update when Locomotive updates
      ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

      // Initial cleanup and sync
      locoScroll.scrollTo(0, 0, 0);

      // locoScroll.scrollTo(0, { duration: 0, disableLerp: true }, undefined);
      setTimeout(() => {
        locoScroll.update();
        ScrollTrigger.refresh();
      }, 300); // Increased timeout for safer initial sync

      window.addEventListener("load", () => {
        locoScroll.update();
        ScrollTrigger.refresh();
      });
    });

    return () => {
      // Cleanup: Kill all ScrollTriggers and destroy Locomotive instance
      if (ScrollTriggerRef.current) ScrollTriggerRef.current.getAll().forEach((st: any) => st.kill());
      if (locoScrollRef.current) locoScrollRef.current.destroy();
    };


  }, [ready]);

  
  useEffect(() => {
    const locoScroll = locoScrollRef.current;
    const ScrollTrigger = ScrollTriggerRef.current;
    if (!containerRef.current || !locoScroll || !ScrollTrigger) return;

    const refreshScroll = () => {
      locoScroll.update();
      ScrollTrigger.refresh();
    };

    const observer = new MutationObserver((mutationsList, observer) => {
      refreshScroll();
    });

    observer.observe(containerRef.current as Node, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [ready]);

  // --- Keep scroll smooth on resize ---
  useEffect(() => {
    const ScrollTrigger = ScrollTriggerRef.current;
    const locoScroll = locoScrollRef.current;
    if (!ScrollTrigger || !locoScroll) return;

    const handleResize = () => {
      // LocoScroll handles its own sizing, we only need to tell ScrollTrigger to recalculate
      // which is implicitly done by the refresh listeners already set up.
      // But adding this ensures an explicit refresh on resize.
      requestAnimationFrame(() => {
        locoScroll.update(); // Update dimensions
        ScrollTrigger.refresh(); // Recalculate scroll positions
      });
    };
    
    // We can rely on ScrollTrigger's internal refresh on resize, but if issues persist
    // this explicit handler can be useful.
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ready]); // Re-run when ready and dependencies are set

  return (
   <div
      className={`${
        ready ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
    >
      <div
        ref={containerRef}
        data-scroll-container
        className="min-h-screen bg-background "
      >
        {/* Hero */}
<div
  className="relative w-full h-[947px] bg-cover bg-center bg-[#020D16] hero-bg"
  style={{
    backgroundImage: `url('/b20ba9d675afe9a11e0416efde3e22d2fb92f8a4.png')`,
  }}
>
  {/* Dark Background Overlay */}
  <div className="absolute inset-0 bg-[#020D16] opacity-60 z-0"></div>
          <div className="relative z-10">

            <Header />
            <HeroSection />
          </div>
        </div>

        <div ref={trustedRef}>
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <TrustedSection />
          </Suspense>
        </div>

        <div ref={resultsRef}>
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <ResultsSection />
          </Suspense>
        </div>

        <div ref={aiRef}>
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <AISummary />
          </Suspense>
        </div>

        <div ref={topRatedRef}>
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <TopRatedFeatured />
          </Suspense>
        </div>

        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
          <CitiesSection />
        </Suspense>
        
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
          <NewRescource />
        </Suspense>
        
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
          <SearchNursing />
        </Suspense>
        
        <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-lg" />}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}