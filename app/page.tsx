"use client";
// pages/index.js
import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';
import { Header } from "./components/header"
import { HeroSection } from "./components/hero-section"
import { TrustedSection } from "./components/trusted-section"
import { ResultsSection } from "./components/results-section"
import { AISummary } from './components/ai-summary';
import { TopRatedFeatured } from './components/top-rated-featured';
import { CitiesSection } from './components/CitiesSection';
import { SearchNursing } from './components/SearchNursing';
import { Footer } from './components/Footer';
import { NewRescource } from './components/NewsRescource';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);


export default function Home() {
 const containerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const trustedRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);
  const topRatedRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);

  // fade-in page when fully loaded
  useEffect(() => {
    const onLoad = () => setReady(true);
    if (typeof window !== "undefined") {
      if (document.readyState === "complete") {
        setReady(true);
      } else {
        window.addEventListener("load", onLoad);
        return () => window.removeEventListener("load", onLoad);
      }
    }
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current) return;

    let locoScroll: any;
     
    // Dynamic import of locomotive-scroll
    import("locomotive-scroll").then((mod) => {
      const LocomotiveScroll = mod.default;

      locoScroll = new LocomotiveScroll({
        el: containerRef.current!,
        smooth: true,
        multiplier: 1,
      });

      locoScroll.on("scroll", ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(containerRef.current!, {
        scrollTop(value) {
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
          };
        },
        pinType: containerRef.current!.style.transform ? "transform" : "fixed",
      });

      // GSAP animations
      if (resultsRef.current) {
        gsap.from(resultsRef.current, {
          scrollTrigger: {
            trigger: resultsRef.current,
            scroller: containerRef.current,
            start: "top 80%",
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      }

      if (trustedRef.current) {
        gsap.from(trustedRef.current, {
          scrollTrigger: {
            trigger: trustedRef.current,
            scroller: containerRef.current,
            start: "top 80%",
          },
          x: -100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      }

      if (aiRef.current) {
        gsap.from(aiRef.current, {
          scrollTrigger: {
            trigger: aiRef.current,
            scroller: containerRef.current,
            start: "top 80%",
          },
          x: 100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      }

      if (topRatedRef.current) {
        gsap.from(topRatedRef.current, {
          scrollTrigger: {
            trigger: topRatedRef.current,
            scroller: containerRef.current,
            start: "top 80%",
          },
          scale: 0.8,
          opacity: 0,
          duration: 1,
          ease: "back.out(1.7)",
        });
      }

      // refresh after setup
      const refresh = () => locoScroll.update();
      ScrollTrigger.addEventListener("refresh", refresh);
      ScrollTrigger.refresh();
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (locoScroll) locoScroll.destroy();
    };
  }, [ready]);
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
          {/* overlay */}
          <div className="absolute inset-0 bg-[#020D16] opacity-60 z-0"></div>
          {/* header + hero */}
          <div className="relative z-10">

            <Header />
            <HeroSection />
          </div>
        </div>

        <div ref={trustedRef}>
          <TrustedSection />
        </div>

        <div ref={resultsRef}>
          <ResultsSection />
        </div>


        <div ref={aiRef}>
          <AISummary />
        </div>

        <div ref={topRatedRef}>
          <TopRatedFeatured />
        </div>

        <CitiesSection />
        <NewRescource />
        <SearchNursing />
        <Footer />
      {/* </section> */}

      {/* <section
        data-scroll-section
        className="h-screen flex items-center justify-center bg-blue-200"
      >
        <h2 data-scroll data-scroll-speed="2" className="text-4xl font-bold">
          Smooth scroll & parallax
        </h2>
      </section> */}

    </div>
    </div>
  );
}