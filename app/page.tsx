"use client";
// pages/index.js
import Head from 'next/head';
import { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { Header } from "./components/header"
import { HeroSection } from "./components/hero-section"

// Lazy load heavy components
// const TrustedSection = lazy(() => import("./components/trusted-section").then(module => ({ default: module.TrustedSection })));
// const ResultsSection = lazy(() => import("./components/results-section").then(module => ({ default: module.ResultsSection })));
// const AISummary = lazy(() => import('./components/ai-summary').then(module => ({ default: module.AISummary })));
// const TopRatedFeatured = lazy(() => import('./components/top-rated-featured').then(module => ({ default: module.TopRatedFeatured })));
// const CitiesSection = lazy(() => import('./components/CitiesSection').then(module => ({ default: module.CitiesSection })));
// const SearchNursing = lazy(() => import('./components/SearchNursing').then(module => ({ default: module.SearchNursing })));
// const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));
// const NewRescource = lazy(() => import('./components/NewsRescource').then(module => ({ default: module.NewRescource })));



// Lazy-loaded heavy components
const TrustedSection = lazy(() => import("./components/trusted-section").then(m => ({ default: m.TrustedSection })));
const ResultsSection = lazy(() => import("./components/results-section").then(m => ({ default: m.ResultsSection })));
const AISummary = lazy(() => import('./components/ai-summary').then(m => ({ default: m.AISummary })));
const TopRatedFeatured = lazy(() => import('./components/top-rated-featured').then(m => ({ default: m.TopRatedFeatured })));
const CitiesSection = lazy(() => import('./components/CitiesSection').then(m => ({ default: m.CitiesSection })));
const SearchNursing = lazy(() => import('./components/SearchNursing').then(m => ({ default: m.SearchNursing })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
const NewRescource = lazy(() => import('./components/NewsRescource').then(m => ({ default: m.NewRescource })));



// Dynamic imports for GSAP/ScrollTrigger
let gsap: any;
let ScrollTrigger: any;
let LocomotiveScroll: any;

export default function Home() {
 const containerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const trustedRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);
  const topRatedRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);

  // Fade-in page immediately
  useEffect(() => {
    setReady(true);
  }, []);

  // Preload lazy components in background
  useEffect(() => {
    import("./components/trusted-section");
    import("./components/results-section");
    import("./components/ai-summary");
    import("./components/top-rated-featured");
    import("./components/CitiesSection");
    import("./components/SearchNursing");
    import("./components/Footer");
    import("./components/NewsRescource");
  }, []);


  // Initialize GSAP + LocomotiveScroll immediately
  useEffect(() => {
    if (!ready || !containerRef.current) return;

    let locoScroll: any;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initScroll = async () => {
      const [gsapModule, scrollTriggerModule, locomotiveModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("locomotive-scroll")
      ]);

      gsap = gsapModule.gsap;
      ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      LocomotiveScroll = locomotiveModule.default;

      locoScroll = new LocomotiveScroll({
        el: containerRef.current!,
        smooth: !prefersReducedMotion,
        multiplier: prefersReducedMotion ? 0 : 1,
        lerp: prefersReducedMotion ? 1 : 0.1,
      });

      locoScroll.on("scroll", ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(containerRef.current!, {
        scrollTop(value: any) {
          return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: containerRef.current!.style.transform ? "transform" : "fixed",
      });

      // Your original GSAP animations
      if (!prefersReducedMotion) {
        // Results section
        if (resultsRef.current) {
          gsap.from(resultsRef.current, {
            scrollTrigger: {
              trigger: resultsRef.current,
              scroller: containerRef.current,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
            delay: 0.1
          });

          gsap.from(resultsRef.current.querySelectorAll('.animate-child'), {
            scrollTrigger: {
              trigger: resultsRef.current,
              scroller: containerRef.current,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play none none reverse"
            },
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1,
            delay: 0.3
          });
        }

        // Trusted section
        if (trustedRef.current) {
          gsap.from(trustedRef.current, {
            scrollTrigger: {
              trigger: trustedRef.current,
              scroller: containerRef.current,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse"
            },
            x: -60,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.2
          });

          gsap.from(trustedRef.current.querySelectorAll('.animate-child'), {
            scrollTrigger: {
              trigger: trustedRef.current,
              scroller: containerRef.current,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play none none reverse"
            },
            x: -30,
            opacity: 0,
            duration: 0.9,
            ease: "power2.out",
            stagger: 0.15,
            delay: 0.4
          });
        }

        // AI section
        if (aiRef.current) {
          gsap.from(aiRef.current, {
            scrollTrigger: {
              trigger: aiRef.current,
              scroller: containerRef.current,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse"
            },
            x: 60,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.3
          });

          gsap.from(aiRef.current.querySelectorAll('.animate-child'), {
            scrollTrigger: {
              trigger: aiRef.current,
              scroller: containerRef.current,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 1.0,
            ease: "power2.out",
            stagger: 0.12,
            delay: 0.5
          });
        }

        // Top rated section
        if (topRatedRef.current) {
          gsap.from(topRatedRef.current, {
            scrollTrigger: {
              trigger: topRatedRef.current,
              scroller: containerRef.current,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse"
            },
            scale: 0.9,
            opacity: 0,
            duration: 1.3,
            ease: "back.out(1.2)",
            delay: 0.4
          });

          gsap.from(topRatedRef.current.querySelectorAll('.animate-child'), {
            scrollTrigger: {
              trigger: topRatedRef.current,
              scroller: containerRef.current,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play none none reverse"
            },
            scale: 0.8,
            rotation: 5,
            opacity: 0,
            duration: 1.1,
            ease: "back.out(1.4)",
            stagger: 0.2,
            delay: 0.6
          });
        }

        // Hover effects
        gsap.utils.toArray('.hover-lift').forEach((element: any) => {
          element.addEventListener('mouseenter', () => {
            gsap.to(element, { y: -5, scale: 1.02, duration: 0.3, ease: "power2.out" });
          });
          element.addEventListener('mouseleave', () => {
            gsap.to(element, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
          });
        });
      } else {
        // Reduced motion: simple fade in
        const sections = [resultsRef.current, trustedRef.current, aiRef.current, topRatedRef.current];
        sections.forEach((el, i) => {
          if (el) gsap.from(el, { opacity: 0, duration: 0.5, delay: i * 0.1 });
        });
      }
    };

    initScroll();

    return () => {
      ScrollTrigger?.getAll()?.forEach((st: any) => st.kill());
      if (locoScroll) locoScroll.destroy();
    };
  }, [ready]);
  // // fade-in page when fully loaded
  // useEffect(() => {
  //   const onLoad = () => setReady(true);
  //   if (typeof window !== "undefined") {
  //     if (document.readyState === "complete") {
  //       setReady(true);
  //     } else {
  //       window.addEventListener("load", onLoad);
  //       return () => window.removeEventListener("load", onLoad);
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!ready || !containerRef.current) return;

  //   let locoScroll: any;
    
  //   // Check for reduced motion preference
  //   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
  //   // Dynamic imports for both GSAP and locomotive-scroll
  //   Promise.all([
  //     import("gsap"),
  //     import("gsap/ScrollTrigger"),
  //     import("locomotive-scroll")
  //   ]).then(([gsapModule, scrollTriggerModule, locomotiveModule]) => {
  //     gsap = gsapModule.gsap;
  //     ScrollTrigger = scrollTriggerModule.ScrollTrigger;
  //     gsap.registerPlugin(ScrollTrigger);
      
  //     const LocomotiveScroll = locomotiveModule.default;

  //     locoScroll = new LocomotiveScroll({
  //       el: containerRef.current!,
  //       smooth: !prefersReducedMotion,
  //       multiplier: prefersReducedMotion ? 0 : 1,
  //       lerp: prefersReducedMotion ? 1 : 0.1,
  //     });

  //     locoScroll.on("scroll", ScrollTrigger.update);

  //     ScrollTrigger.scrollerProxy(containerRef.current!, {
  //       scrollTop(value: any) {
  //         return arguments.length
  //           ? locoScroll.scrollTo(value, 0, 0)
  //           : locoScroll.scroll.instance.scroll.y;
  //       },
  //       getBoundingClientRect() {
  //         return {
  //           top: 0,
  //           left: 0,
  //           width: window.innerWidth,
  //           height: window.innerHeight,
  //         };
  //       },
  //       pinType: containerRef.current!.style.transform ? "transform" : "fixed",
  //     });

  //     // Enhanced GSAP animations with realistic timing and easing
  //     // Skip animations if user prefers reduced motion
  //     if (!prefersReducedMotion) {
  //       // Create a master timeline for coordinated animations
  //       const masterTimeline = gsap.timeline();
        
  //       // Results section - subtle upward slide with fade
  //       if (resultsRef.current) {
  //         gsap.from(resultsRef.current, {
  //           scrollTrigger: {
  //             trigger: resultsRef.current,
  //             scroller: containerRef.current,
  //             start: "top 85%",
  //             end: "bottom 15%",
  //             toggleActions: "play none none reverse"
  //           },
  //           y: 30,
  //           opacity: 0,
  //           duration: 1.2,
  //           ease: "power2.out",
  //           delay: 0.1
  //         });
          
  //         // Add subtle parallax effect to child elements
  //         gsap.from(resultsRef.current.querySelectorAll('.animate-child'), {
  //           scrollTrigger: {
  //             trigger: resultsRef.current,
  //             scroller: containerRef.current,
  //             start: "top 90%",
  //             end: "bottom 10%",
  //             toggleActions: "play none none reverse"
  //           },
  //           y: 20,
  //           opacity: 0,
  //           duration: 0.8,
  //           ease: "power2.out",
  //           stagger: 0.1,
  //           delay: 0.3
  //         });
  //       }

  //       // Trusted section - left slide with subtle bounce
  //       if (trustedRef.current) {
  //         gsap.from(trustedRef.current, {
  //           scrollTrigger: {
  //             trigger: trustedRef.current,
  //             scroller: containerRef.current,
  //             start: "top 85%",
  //             end: "bottom 15%",
  //             toggleActions: "play none none reverse"
  //           },
  //           x: -60,
  //           opacity: 0,
  //           duration: 1.1,
  //           ease: "power3.out",
  //           delay: 0.2
  //         });
          
  //         // Animate child elements with stagger
  //         gsap.from(trustedRef.current.querySelectorAll('.animate-child'), {
  //           scrollTrigger: {
  //             trigger: trustedRef.current,
  //             scroller: containerRef.current,
  //             start: "top 90%",
  //             end: "bottom 10%",
  //             toggleActions: "play none none reverse"
  //           },
  //           x: -30,
  //           opacity: 0,
  //           duration: 0.9,
  //           ease: "power2.out",
  //           stagger: 0.15,
  //           delay: 0.4
  //         });
  //       }

  //       // AI section - right slide with smooth entrance
  //       if (aiRef.current) {
  //         gsap.from(aiRef.current, {
  //           scrollTrigger: {
  //             trigger: aiRef.current,
  //             scroller: containerRef.current,
  //             start: "top 85%",
  //             end: "bottom 15%",
  //             toggleActions: "play none none reverse"
  //           },
  //           x: 60,
  //           opacity: 0,
  //           duration: 1.1,
  //           ease: "power3.out",
  //           delay: 0.3
  //         });
          
  //         // Add floating animation to AI elements
  //         gsap.from(aiRef.current.querySelectorAll('.animate-child'), {
  //           scrollTrigger: {
  //             trigger: aiRef.current,
  //             scroller: containerRef.current,
  //             start: "top 90%",
  //             end: "bottom 10%",
  //             toggleActions: "play none none reverse"
  //           },
  //           y: 40,
  //           opacity: 0,
  //           duration: 1.0,
  //           ease: "power2.out",
  //           stagger: 0.12,
  //           delay: 0.5
  //         });
  //       }

  //       // Top rated section - scale with gentle bounce
  //       if (topRatedRef.current) {
  //         gsap.from(topRatedRef.current, {
  //           scrollTrigger: {
  //             trigger: topRatedRef.current,
  //             scroller: containerRef.current,
  //             start: "top 85%",
  //             end: "bottom 15%",
  //             toggleActions: "play none none reverse"
  //           },
  //           scale: 0.9,
  //           opacity: 0,
  //           duration: 1.3,
  //           ease: "back.out(1.2)",
  //           delay: 0.4
  //         });
          
  //         // Add rotation and scale to child elements
  //         gsap.from(topRatedRef.current.querySelectorAll('.animate-child'), {
  //           scrollTrigger: {
  //             trigger: topRatedRef.current,
  //             scroller: containerRef.current,
  //             start: "top 90%",
  //             end: "bottom 10%",
  //             toggleActions: "play none none reverse"
  //           },
  //           scale: 0.8,
  //           rotation: 5,
  //           opacity: 0,
  //           duration: 1.1,
  //           ease: "back.out(1.4)",
  //           stagger: 0.2,
  //           delay: 0.6
  //         });
  //       }
        
  //       // Add smooth hover effects for interactive elements
  //       gsap.utils.toArray('.hover-lift').forEach((element: any) => {
  //         element.addEventListener('mouseenter', () => {
  //           gsap.to(element, {
  //             y: -5,
  //             scale: 1.02,
  //             duration: 0.3,
  //             ease: "power2.out"
  //           });
  //         });
          
  //         element.addEventListener('mouseleave', () => {
  //           gsap.to(element, {
  //             y: 0,
  //             scale: 1,
  //             duration: 0.3,
  //             ease: "power2.out"
  //           });
  //         });
  //       });
  //     } else {
  //       // For users who prefer reduced motion, just fade in elements
  //       const elements = [resultsRef.current, trustedRef.current, aiRef.current, topRatedRef.current];
  //       elements.forEach((element, index) => {
  //         if (element) {
  //           gsap.from(element, {
  //             opacity: 0,
  //             duration: 0.5,
  //             delay: index * 0.1
  //           });
  //         }
  //       });
  //     }

  //     const refresh = () => locoScroll.update();
  //     ScrollTrigger.addEventListener("refresh", refresh);
  //     ScrollTrigger.refresh();
  //   });

  //   return () => {
  //     ScrollTrigger.getAll().forEach((st: any) => st.kill());
  //     if (locoScroll) locoScroll.destroy();
  //   };
  // }, [ready]);
  return (
    <div
      className={`${
        ready ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
    >
      <div
        ref={containerRef}
        data-scroll-container
        className="min-h-screen bg-background"
      >
        {/* Hero */}
        <div
          className="relative w-full h-[947px] bg-cover bg-center bg-no-repeat hero-bg"
          style={{
            backgroundImage: `url('/b20ba9d675afe9a11e0416efde3e22d2fb92f8a4.png')`,
          }}
        >
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