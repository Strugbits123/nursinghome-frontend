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

// 🌌 Floating Particle Background Component
function FloatingParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create floating particles
    const particleCount = 250;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 5;

      const r = 0.8 + Math.random() * 0.2;
      const g = 0.8 + Math.random() * 0.2;
      const b = 0.9;
      colors[i3] = r;
      colors[i3 + 1] = g;
      colors[i3 + 2] = b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 6;

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      particles.rotation.x = elapsed * 0.1;
      particles.rotation.y = elapsed * 0.05;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none opacity-30"
      style={{ zIndex: 0 }}
    />
  );
}
function AnimatedCard({
  feature,
  index,
  sectionRef,
}: {
  feature: Feature;
  index: number;
  sectionRef: React.RefObject<HTMLDivElement>;
}) {
  const IconComponent = feature.icon;
  const countUpDelay = 0.6 + index * 0.2;
  const numberRef = useCountUp(
    feature.value,
    sectionRef as React.RefObject<HTMLElement>,
    countUpDelay
  );

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-transparent shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group rounded-2xl">
      {/* Gradient background hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-gray-50/30 group-hover:from-[#fff5f6] group-hover:to-[#fdeef0] transition-all duration-500" />

      {/* Animated border glow (red tint) */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#C71F37]/40 transition-all duration-500 shadow-[0_0_25px_-5px_rgba(199,31,55,0)] group-hover:shadow-[0_0_25px_-5px_rgba(199,31,55,0.4)]" />

      <CardContent className="p-5 sm:p-6 text-center relative z-10">
        {/* Icon */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-[#FAE8EB] group-hover:bg-[#C71F37] transition-all duration-500 shadow-inner"
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
        <p className="text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed text-[#212121] opacity-70 group-hover:opacity-90 transition-all duration-500">
          {feature.description}
        </p>

        {/* Count number */}
        <div className="text-2xl sm:text-3xl font-bold text-[#C71F37] group-hover:scale-110 transition-transform duration-500">
          <span ref={numberRef}>0</span>
          {feature.suffix}
        </div>
      </CardContent>
    </Card>
  );
}

// 🌟 Trusted Section (Final Layout)
export function TrustedSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const features: Feature[] = [
    {
      icon: Shield,
      title: "Verified CMS Ratings",
      description:
        "Official government data from Centers for Medicare & Medicaid Services",
      value: 5000,
      suffix: "+",
    },
    {
      icon: Star,
      title: "Real Google Reviews",
      description:
        "Authentic reviews from families and residents across the country",
      value: 250000,
      suffix: "+",
    },
    {
      icon: Brain,
      title: "AI-Powered Summaries",
      description:
        "Smart insights that analyze reviews and data to highlight key points",
      value: 100,
      suffix: "%",
    },
    {
      icon: Building,
      title: "Facilities Listed",
      description:
        "Comprehensive database covering nursing homes nationwide",
      value: 15000,
      suffix: "+",
    },
  ];

  return (
    <section
      className="relative py-16 px-4 bg-white overflow-hidden"
      ref={sectionRef}
    >
      {/* Three.js Floating Particles */}
      <FloatingParticles />

      <div className="relative max-w-6xl mx-auto z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#212121]">
            Trusted by Families{" "}
            <span className="text-[#C71F37] relative inline-block">
              Nationwide
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
          <p className="text-lg max-w-2xl mx-auto text-[#212121] opacity-80">
            Our comprehensive database includes verified information from CMS,
            real family reviews, and AI-powered insights.
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
