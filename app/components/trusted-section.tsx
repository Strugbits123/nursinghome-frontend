"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Shield, Star, Brain, Building } from "lucide-react";
import { useRef, useEffect } from "react";
import { useCountUp } from "../hooks/useCountUp";
import * as THREE from "three";
import Image from "next/image";

// Type for each feature card
type Feature = {
  icon: React.ElementType;
  title: string;
  description: string;
  value: number;
  suffix?: string;
};


function AnimatedCard({
  feature,
  index,
  sectionRef,
}: {
  feature: Feature;
  index: number;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}) {
  const IconComponent = feature.icon;
  const countUpDelay = 0.6 + index * 0.2;
  const numberRef = useCountUp(
    feature.value,
    sectionRef as React.RefObject<HTMLElement>,
    countUpDelay
  );

  return (
    <Card className="bg-white/95 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/80 group-hover:from-white group-hover:via-white/95 group-hover:to-white/90 transition-all duration-500" />
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#C71F37]/20 transition-all duration-500 shadow-[0_0_30px_-10px_rgba(199,31,55,0.1)] group-hover:shadow-[0_0_40px_-15px_rgba(199,31,55,0.3)]" />

      <CardContent className="p-5 sm:p-6 text-center relative z-10">
        <div className="flex justify-center mb-3 sm:mb-4">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-[#FAE8EB] group-hover:bg-[#C71F37] transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:shadow-[#C71F37]/20"
          >
            <IconComponent
              className="w-6 h-6 sm:w-7 sm:h-7 text-[#C71F37] group-hover:text-white transition-all duration-500 transform group-hover:scale-110"
            />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold mb-1 sm:mb-2 text-[#212121] text-sm sm:text-base group-hover:text-[#C71F37] transition-colors duration-500">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed text-[#212121] opacity-80 group-hover:opacity-100 transition-all duration-500">
          {feature.description}
        </p>

        {/* Count number */}
        <div className="text-2xl sm:text-3xl font-bold text-[#C71F37] group-hover:scale-110 transition-transform duration-500 drop-shadow-sm">
          <span ref={numberRef}>0</span>
          {feature.suffix}
        </div>
      </CardContent>
    </Card>
  );
}

// 🌟 Trusted Section (Red-Themed Layout)
export function TrustedSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const features: Feature[] = [
    {
      icon: Shield,
      title: "Verified CMS 5-Star Ratings",
      description:
        "Our platform pulls data from the Centers for Medicare and Medicaid Services (CMS), offering trustworthy 5-Star ratings for each facility.",
      value: 5000,
      suffix: "+",
    },
    {
      icon: Star,
      title: "Google Reviews from Real Familie",
      description:
        "You can read reviews from residents and their families on Google, providing a real-world perspective on each nursing home.",
      value: 250000,
      suffix: "+",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Our advanced AI technology summarizes strengths and weaknesses of each facility, so you can get a quick overview before making any decisions.",
      value: 100,
      suffix: "%",
    },
    {
      icon: Building,
      title: "Location-Based Searches",
      description:
        "We allow you to search by city and state, making it easy to find the best nursing homes near me in your area.",
      value: 15000,
      suffix: "+",
    },
  ];

  return (
    <section
      className="relative py-16 px-4 bg-white overflow-hidden"
      ref={sectionRef}
    >

      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />

      <div className="relative max-w-6xl mx-auto z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#212121]">
            Why Families Trust{" "}
            <span className="text-[#C71F37] relative inline-block">
              Care Nav
              <Image
                src="/herbs-BCkTGihn.svg fill.png"
                alt="flower icon"
                className="absolute -top-1 -right-5 w-8 h-8 opacity-80"
                width={40}
                height={40}
                style={{ transform: "rotate(-7deg)" }}
              />
            </span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-[#212121] opacity-90">
           At CareNav, we know every family’s journey is unique. That’s why we offer tailored recommendations based on your specific needs, whether that’s short-term rehabilitation or long-term skilled nursing care. Here’s why families trust CareNav.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {features.map((feature, index) => (
            <AnimatedCard
              key={index}
              feature={feature}
              index={index}
              sectionRef={sectionRef}
            />
          ))}
        </div>
      </div>
    </section>
  );
}