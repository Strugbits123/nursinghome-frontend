"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from 'three';
import Image from "next/image";

// Three.js Floating City Particles Component
function FloatingCityParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

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
    
    // Create floating city-themed particles
    const particleCount = 300;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Spread particles across the cities section
      positions[i3] = (Math.random() - 0.5) * 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 40;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;

      // City-themed colors (urban colors: building lights, street lights, etc.)
      const colorChoice = Math.random();
      if (colorChoice < 0.3) {
        // Warm building light (yellow/orange)
        colors[i3] = 1.0; colors[i3 + 1] = 0.8; colors[i3 + 2] = 0.4;
      } else if (colorChoice < 0.6) {
        // Cool city light (blue/white)
        colors[i3] = 0.6; colors[i3 + 1] = 0.8; colors[i3 + 2] = 1.0;
      } else if (colorChoice < 0.8) {
        // Red accent (signs, traffic)
        colors[i3] = 1.0; colors[i3 + 1] = 0.3; colors[i3 + 2] = 0.3;
      } else {
        // Green accent (parks, nature)
        colors[i3] = 0.4; colors[i3 + 1] = 0.9; colors[i3 + 2] = 0.6;
      }

      sizes[i] = Math.random() * 0.02 + 0.005;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.015,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 25;

    // Animation
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      
      // Gentle floating animation - like city lights twinkling
      particles.rotation.x = Math.sin(elapsedTime * 0.1) * 0.05;
      particles.rotation.y = elapsedTime * 0.02;
      
      // Subtle floating movement
      particles.position.y = Math.sin(elapsedTime * 0.15) * 0.1;
      
      // Pulsing effect for some particles
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        if (i % 9 === 0) { // Affect every 3rd particle for variety
          positions[i + 1] += Math.sin(elapsedTime * 2 + i) * 0.01;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      
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
      className="absolute inset-0 pointer-events-none opacity-25"
      style={{ zIndex: 0 }}
    />
  );
}

// Enhanced City Card Component with hover effects
function EnhancedCityCard({ 
  city, 
  width, 
  height, 
  titleTop,
  pillsTop,
  isLarge = false 
}: { 
  city: { name: string; image: string };
  width: string;
  height: string;
  titleTop: string;
  pillsTop: string;
  isLarge?: boolean;
}) {
  return (
    <div 
      className="relative rounded-[16px] overflow-hidden shadow hover-lift transition-all duration-500 group cursor-pointer"
      style={{ width, height }}
    >
      {/* Image with hover zoom effect */}
      <img
        src={city.image}
        alt={city.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-all duration-500"
      />

      {/* Pulsing glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500" />

      {/* City name with enhanced styling */}
      <h3
        className="absolute group-hover:scale-105 transition-transform duration-300"
        style={{
          fontFamily: "Jost",
          fontWeight: 600,
          fontSize: isLarge ? "24px" : "20px",
          lineHeight: isLarge ? "28.8px" : "24px",
          color: "#F7F7F7",
          top: titleTop,
          left: "16px",
          margin: 0,
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        {city.name.split(',')[0]}
      </h3>

      {/* Enhanced pills with hover effects */}
      <div className="absolute flex flex-wrap gap-2" style={{ top: pillsTop, left: "16px" }}>
        {["Los Angeles", "New York", "Mexico City", "Toronto"].map((pill, index) => (
          <div
            key={pill}
            className="flex items-center justify-center group-hover:scale-110 transition-all duration-300 hover:bg-white/40"
            style={{
              height: "30px",
              borderRadius: "800px",
              border: "1px solid #FFFFFF2E",
              backgroundColor: "#FFFFFF26",
              padding: "0 12px",
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <span
              style={{
                fontFamily: "Jost",
                fontWeight: 500,
                fontSize: "12px",
                lineHeight: "12px",
                color: "#FFFFFF",
                whiteSpace: "nowrap",
              }}
            >
              {pill}
            </span>
          </div>
        ))}
      </div>

      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-[16px] border-2 border-transparent group-hover:border-white/20 transition-all duration-500" />
    </div>
  );
}

export function CitiesSection() {
    const cities = [
        { name: "Los Angeles, CA", image: "/la.jpg" },
        { name: "New York, NY", image: "/ny.jpg" },
        { name: "Chicago, IL", image: "/chicago.jpg" },
        { name: "Houston, TX", image: "/houston.jpg" },
        { name: "Miami, FL", image: "/miami.jpg" },
        { name: "Seattle, WA", image: "/seattle.jpg" },
    ];

    return (
        <section
            className="relative w-full bg-gradient-to-br from-[#F9F9F9] to-gray-100/50 flex justify-center items-start overflow-hidden"
            style={{ minHeight: "958px" }}
        >
            {/* Three.js Background Particles */}
            <FloatingCityParticles />
            
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#C71F37_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

            {/* inner div */}
            <div
                className="bg-transparent mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-0 relative z-10"
                style={{
                    minHeight: "753.52px",
                    marginTop: "68px",
                }}
            >
                {/* Enhanced heading with subtle animation */}
                <div className="text-center px-4">
                    <h2
                    className="text-center font-bold px-4 relative"
                    style={{
                    fontFamily: "Jost",
                    fontSize: "clamp(24px, 5vw, 32px)",
                    lineHeight: "1.2",
                    color: "#2B2B2B",
                    marginTop: "20px",
                    }}
                >
                    Explore Listings By{" "}
                    <span className="relative inline-block" style={{ color: "#C71F37" }}>
                    Cities
                    <Image
                        src="/herbs-BCkTGihn.svg fill.png"
                        alt="herb icon"
                        className="absolute -top-1 -right-4 sm:-top-1.5 sm:-right-5.5 md:-top-3 md:-right-6.5 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 opacity-80"
                        width={40}
                        height={40}
                        style={{
                        transform: "rotate(-7deg)",
                        }}
                    />
                    </span>
                </h2>
                </div>

                {/* Enhanced description */}
                <div className="flex justify-center mt-4 px-4">
                     <p
                        className="max-w-[554px] w-full"
                        style={{
                            fontFamily: "Inter",
                            fontWeight: 400,
                            fontSize: "clamp(16px, 4vw, 18px)",
                            lineHeight: "1.56",
                            color: "#707070",
                            textAlign: "center",
                            margin: 0,
                        }}
                    >
                        Our clients love our services and give great &amp; positive reviews
                    </p>
                </div>

                {/* Enhanced custom grid */}
                <div className="relative mt-8 hidden lg:grid lg:grid-cols-[636px_306px_306px] gap-6">

                  {/* New York - Large Card */}
                  <EnhancedCityCard
                    city={{ name: "New York, NY", image: "/New York.png" }}
                    width="636px"
                    height="300px"
                    titleTop="217.2px"
                    pillsTop="252px"
                    isLarge={true}
                  />

                  {/* Los Angeles - Small Card */}
                  <EnhancedCityCard
                    city={{ name: "Los Angeles, CA", image: "/Los Angeles.png" }}
                    width="306px"
                    height="300px"
                    titleTop="179.48px"
                    pillsTop="216.48px"
                  />

                  {/* Mexico City - Small Card */}
                  <EnhancedCityCard
                    city={{ name: "Mexico City", image: "/Mexico City.png" }}
                    width="306px"
                    height="300px"
                    titleTop="179.48px"
                    pillsTop="216.48px"
                  />

                </div>

                {/* Enhanced second row */}
                <div className="mt-6 hidden lg:grid lg:grid-cols-[306px_306px_636px] gap-6">
                  
                  {/* Toronto - Small Card */}
                  <EnhancedCityCard
                    city={{ name: "Toronto, TO", image: "/Toronto.jpg" }}
                    width="306px"
                    height="300px"
                    titleTop="179.48px"
                    pillsTop="216.48px"
                  />

                  {/* Montreal - Small Card */}
                  <EnhancedCityCard
                    city={{ name: "Montreal, MO", image: "/Montreal.png" }}
                    width="306px"
                    height="300px"
                    titleTop="179.48px"
                    pillsTop="216.48px"
                  />

                  {/* Chicago - Large Card */}
                  <EnhancedCityCard
                    city={{ name: "Chicago, CG", image: "/Chicago.png" }}
                    width="636px"
                    height="300px"
                    titleTop="217.2px"
                    pillsTop="252px"
                    isLarge={true}
                  />

                </div>

                {/* Enhanced Mobile responsive grid */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6">
                    {/* New York - Mobile */}
                    <EnhancedCityCard
                      city={{ name: "New York, NY", image: "/New York.png" }}
                      width="100%"
                      height="200px"
                      titleTop="140px"
                      pillsTop="160px"
                    />

                    {/* Los Angeles - Mobile */}
                    <EnhancedCityCard
                      city={{ name: "Los Angeles, CA", image: "/Los Angeles.png" }}
                      width="100%"
                      height="200px"
                      titleTop="140px"
                      pillsTop="160px"
                    />

                    {/* Mexico City - Mobile */}
                    <EnhancedCityCard
                      city={{ name: "Mexico City", image: "/Mexico City.png" }}
                      width="100%"
                      height="200px"
                      titleTop="140px"
                      pillsTop="160px"
                    />

                    {/* Toronto - Mobile */}
                    <EnhancedCityCard
                      city={{ name: "Toronto, TO", image: "/Toronto.jpg" }}
                      width="100%"
                      height="200px"
                      titleTop="140px"
                      pillsTop="160px"
                    />

                    {/* Montreal - Mobile */}
                    <EnhancedCityCard
                      city={{ name: "Montreal, MO", image: "/Montreal.png" }}
                      width="100%"
                      height="200px"
                      titleTop="140px"
                      pillsTop="160px"
                    />

                    {/* Chicago - Mobile */}
                    <div className="sm:col-span-2">
                      <EnhancedCityCard
                        city={{ name: "Chicago, CG", image: "/Chicago.png" }}
                        width="100%"
                        height="200px"
                        titleTop="140px"
                        pillsTop="160px"
                      />
                    </div>
                </div>

                {/* Enhanced Button */}
                <div className="flex justify-center mt-10">
                  {/* <button
                      className="
                          relative
                          flex items-center justify-center gap-3
                          rounded-[8px]
                          bg-gradient-to-r from-[#C71F37] to-[#E53E3E]
                          shadow-[0_4px_12px_-2px_rgba(199,31,55,0.3),0_6px_16px_-1px_rgba(199,31,55,0.2)]
                          w-full max-w-[285px] h-[52px]
                          hover-lift
                          transition-all duration-300
                          hover:shadow-[0_8px_20px_-2px_rgba(199,31,55,0.4),0_10px_24px_-1px_rgba(199,31,55,0.3)]
                          group
                      "
                  >
                      <span
                          style={{
                              fontFamily: 'Inter',
                              fontWeight: 600,
                              fontSize: '18px',
                              lineHeight: '28px',
                              color: '#FFFFFF',
                              textAlign: 'center',
                          }}
                      >
                          View All Featured Facilities
                      </span>

                      <img
                          src="/arrow-btn.png"
                          alt="Arrow Icon"
                          className="w-[15.74px] h-[15.74px] group-hover:translate-x-1 transition-transform duration-300"
                      />

                      <div className="absolute inset-0 rounded-[8px] bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button> */}
                </div>

            </div>
        </section>
    );
}