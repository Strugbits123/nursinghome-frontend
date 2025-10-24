"use client";

import React, { useEffect, useState  } from "react";



declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdUnitProps {
  adSlot: string;
  layout?:
    | "banner"
    | "leaderboard"
    | "square"
    | "rectangle"
    | "skyscraper"
    | "skyscraperMobile"
    | "skyscraperMain"
    | "halfpage"
    | "mobile";
}

export default function AdUnit({ adSlot, layout = "banner" }: AdUnitProps) {
  
  // ✅ Tailwind layout classes for each ad type
  const layoutClasses: Record<string, string> = {
    banner:
      "block mx-auto border border-gray-300 w-[320px] h-[50px] sm:w-[468px] sm:h-[60px] md:w-[728px] md:h-[90px] lg:w-full lg:h-[90px] max-w-[2500px]",
    leaderboard:
      "block mx-auto border border-gray-300 w-[320px] h-[50px] sm:w-[728px] sm:h-[90px] lg:w-full lg:h-[90px] max-w-[2000px]",
    square:
      "block mx-auto border border-gray-300 w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[250px]",
    rectangle:
      "block mx-auto border border-gray-300 w-[300px] h-[250px] sm:w-[336px] sm:h-[280px]",
    skyscraperMobile:
    "block mx-auto border border-gray-300 w-[320px] h-[200px] sm:w-[160px] sm:h-[200px] md:w-[300px] md:h-[600px]",
    skyscraper:
      "block mx-auto border border-gray-300 w-[120px] h-[600px] sm:w-[160px] sm:h-[600px] md:w-[300px] md:h-[600px]",
    skyscraperMain:
      "block mx-auto border border-gray-300 w-[120px] h-[600px] sm:w-[160px] sm:h-[900px] md:w-[200px] md:h-[900px] lg:h-[1000px]",  
    halfpage:
      "block mx-auto border border-gray-300 w-[300px] h-[600px] md:w-[320px] md:h-[600px]",
    mobile:
      "block mx-auto border border-gray-300 w-[320px] h-[50px] sm:w-[320px] sm:h-[100px]",
  };

useEffect(() => {
  const el = document.querySelector(`ins[data-ad-slot="${adSlot}"]`);
  if (!el) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.error("Adsense load error:", err);
        }
        observer.disconnect();
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(el);
  return () => observer.disconnect();
}, [adSlot]);


  return (
    <div
      className={`${layoutClasses[layout] || layoutClasses.banner} flex justify-center items-center bg-gray-100`}
    >
      {/* <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8855354849568036"
        data-ad-slot={adSlot}
        data-ad-format={layout === "banner" ? "auto" : undefined}
        data-full-width-responsive="true"
      ></ins> */}
     <ins
      className="adsbygoogle"
      style={{
        display: "block",
        width: "300px",
        height: "250px",
        minWidth: "120px",
        minHeight: "100px",
      }}
      data-ad-client="ca-pub-8855354849568036"
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />


      <p className="text-xs text-gray-600 absolute bg-white px-2">
        {layout.toUpperCase()} Ad 
      </p>
    </div>
  );
}