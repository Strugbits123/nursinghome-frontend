"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Shield, Star, Brain, Building } from "lucide-react";
import { useRef } from "react";
import { useCountUp } from "../hooks/useCountUp";
import Image from "next/image";

type Feature = {
  icon: React.ElementType;
  title: string;
  description: string;
  value: number; 
  suffix?: string;
};

export function TrustedSection() {

  const features: Feature[] = [
    {
      icon: Shield,
      title: "Verified CMS Ratings",
      description: "Official government data from Centers for Medicare & Medicaid Services",
      value: 5000,
      suffix: "+",
    },
    {
      icon: Star,
      title: "Real Google Reviews",
      description: "Authentic reviews from families and residents across the country",
      value: 250000,
      suffix: "+",
    },
    {
      icon: Brain,
      title: "AI-Powered Summaries",
      description: "Smart insights that analyze reviews and data to highlight key points",
      value: 100,
      suffix: "%", 
    },
    {
      icon: Building,
      title: "Facilities Listed",
      description: "Comprehensive database covering nursing homes nationwide",
      value: 15000,
      suffix: "+",
    },
  ];

  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-12 sm:py-16 px-4 bg-white" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-12 animate-child">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-[#212121]">
            Trusted by Families <span className="text-[#C71F37]">Nationwide</span>
          </h2>
          <p className="text-sm sm:text-lg max-w-2xl mx-auto text-[#212121]">
            Our comprehensive database includes verified information from CMS, real family reviews, and AI-powered insights.
          </p>
          <Image
              src="/herbs-BCkTGihn.svg fill.png"
              alt="flower icon"
              className="absolute top-0 right-2 sm:right-4 md:right-6 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 opacity-80"
              width={40}
              height={40}
              style={{
                  transform: 'rotate(-7deg)',  
              }}
          />
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            // Add staggered delay for count-up animation
            const countUpDelay = 0.6 + (index * 0.2);
            const numberRef = useCountUp(feature.value, sectionRef as React.RefObject<HTMLElement>, countUpDelay);

            return (
              <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow hover-lift animate-child">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#FAE8EB" }}
                    >
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#C71F37" }} />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1 sm:mb-2 text-[#212121] text-sm sm:text-base">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed text-[#212121] opacity-70">
                    {feature.description}
                  </p>
                  <div className="text-2xl sm:text-3xl font-bold text-[#C71F37]">
                    <span ref={numberRef}>0</span>{feature.suffix}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
