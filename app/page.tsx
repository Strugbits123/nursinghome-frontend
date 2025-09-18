"use client";
// pages/index.js
import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';
import { Header } from "./components/header"
import { HeroSection } from "./components/hero-section"
import LocomotiveScroll from 'locomotive-scroll';
import { TrustedSection } from "./components/trusted-section"
import { ResultsSection } from "./components/results-section"
import { AISummary } from './components/ai-summary';
import { TopRatedFeatured } from './components/top-rated-featured';
import { CitiesSection } from './components/CitiesSection';
import { SearchNursing } from './components/SearchNursing';
import { Footer } from './components/Footer';
import { NewRescource } from './components/NewsRescource';

export default function Home() {
  const [location, setLocation] = useState('');
  const containerRef = useRef(null);



   // Init Locomotive
    // useEffect(() => {
    // if (!containerRef.current) return;

    // const scroll = new LocomotiveScroll({
    //     el: containerRef.current,
    //     smooth: true,
    //     lerp: 0.08,
    // });

    // return () => {
    //     scroll.destroy();
    // };
    // }, []);

    // const handleSearch = (e) => {
    //     e.preventDefault();
    //     console.log('Searching for:', location);
    //     alert(`Searching for nursing homes near: ${location}`);
    // };
  return (
    <div ref={containerRef} data-scroll-container  className="min-h-screen bg-background">
      {/* Full background wrapper */}
      <div
          className="relative w-full h-[947px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/b20ba9d675afe9a11e0416efde3e22d2fb92f8a4.png')`,
          }}
        >
        {/* overlay */}
        <div className="absolute inset-0 bg-[#020D16] opacity-60 z-0"></div>

        {/* wrap header + hero in a relative container with higher z-index */}
        <div className="relative z-10">
          <Header />
          <HeroSection />
        </div>
      </div>
       
        <ResultsSection />
        <TrustedSection />
        <AISummary />
        <TopRatedFeatured />
        <CitiesSection />
        <NewRescource/>
        <SearchNursing />
        <Footer/>
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
  );
}