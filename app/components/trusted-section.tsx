"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Shield, Star, Brain, Building } from "lucide-react";
import { useRef, useEffect, useMemo } from "react";
import { useCountUp } from "../hooks/useCountUp";
import * as THREE from 'three';

type Feature = {
  icon: React.ElementType;
  title: string;
  description: string;
  value: number; 
  suffix?: string;
};

function FloatingParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: false
    });

    // Optimized settings
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Create floating particles
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Spread particles across the section area
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 5;

      // Soft healthcare-themed colors (light blue, soft pink, light green)
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i3] = 0.7; colors[i3 + 1] = 0.8; colors[i3 + 2] = 0.9; // Light blue
      } else if (colorChoice < 0.66) {
        colors[i3] = 0.9; colors[i3 + 1] = 0.8; colors[i3 + 2] = 0.8; // Soft pink
      } else {
        colors[i3] = 0.8; colors[i3 + 1] = 0.9; colors[i3 + 2] = 0.8; // Light green
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 5;

    // Animation
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      
      // Gentle floating animation
      particles.rotation.x = elapsedTime * 0.1;
      particles.rotation.y = elapsedTime * 0.05;
      
      // Subtle position movement
      particles.position.y = Math.sin(elapsedTime * 0.2) * 0.1;
      
      renderer.render(scene, camera);
    };

    mountRef.current.appendChild(renderer.domElement);
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      mountRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 pointer-events-none opacity-40"
      style={{ zIndex: 0 }}
    />
  );
}

function AnimatedCard({ feature, index, sectionRef }: { 
  feature: Feature; 
  index: number; 
  sectionRef: React.RefObject<HTMLDivElement>;
}) {
  const IconComponent = feature.icon;
  const countUpDelay = 0.6 + (index * 0.2);
  const numberRef = useCountUp(feature.value, sectionRef as React.RefObject<HTMLElement>, countUpDelay);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover-lift animate-child relative overflow-hidden group">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-gray-50/30 group-hover:from-white group-hover:to-gray-100 transition-all duration-300" />
      
      {/* Animated border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C71F37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="p-4 sm:p-6 text-center relative z-10">
        <div className="flex justify-center mb-3 sm:mb-4">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: "#FAE8EB" }}
          >
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" style={{ color: "#C71F37" }} />
          </div>
        </div>
        <h3 className="font-semibold mb-1 sm:mb-2 text-[#212121] text-sm sm:text-base group-hover:text-[#C71F37] transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed text-[#212121] opacity-70 group-hover:opacity-90 transition-opacity duration-300">
          {feature.description}
        </p>
        <div className="text-2xl sm:text-3xl font-bold text-[#C71F37] group-hover:scale-105 transition-transform duration-300">
          <span ref={numberRef}>0</span>{feature.suffix}
        </div>
      </CardContent>
    </Card>
  );
}

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
    <section className="py-12 sm:py-16 px-4 relative overflow-hidden" ref={sectionRef}>
      {/* Three.js Background Particles */}
      <FloatingParticles />
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 " />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-12 animate-child">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-[#212121]">
            Trusted by Families <span className="text-[#C71F37]">Nationwide</span>
          </h2>
          <p className="text-sm sm:text-lg max-w-2xl mx-auto text-[#212121] opacity-80">
            Our comprehensive database includes verified information from CMS, real family reviews, and AI-powered insights.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
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