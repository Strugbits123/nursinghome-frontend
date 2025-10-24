"use client";

import React from "react";

export function Footer() {
    return (
        // <footer className="w-full bg-[#212529] flex flex-col items-center pt-2">
          <footer className="w-full bg-[#212529] flex flex-col items-center pt-2">
  {/* Container */}
  <div className="w-full max-w-[1280px] lg:max-w-[1280px] h-auto lg:h-[315px] mt-8 flex flex-col justify-between px-4 sm:px-6 lg:px-0">
    
    {/* Top Section */}
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-[40px] w-full">
      {/* Logo & Description */}
      <div className="w-full lg:w-[250px] flex-shrink-0 lg:mr-[220px]">
        <div className="flex items-start gap-3 lg:gap-[12px] mb-4 lg:mb-[16px]">
          <img
            src="/footer_icon.png"
            alt="Logo Icon"
            className="w-[140px] sm:w-[150px] lg:w-[176px] h-[37px] sm:h-[42px] lg:h-[47px]"
          />
        </div>
        <p className="w-full lg:w-[386px] h-auto font-['Inter'] font-normal text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] text-[#D1D5DB] mb-4 lg:mb-0">
          Helping families find the perfect nursing home with comprehensive data, real reviews, and AI-powered insights.
        </p>
        <div className="flex gap-4 lg:gap-[16px]">
          {['facebook','twitter','linkedin','instagram'].map((icon) => (
            <div key={icon} className="w-[36px] lg:w-[40px] h-[36px] lg:h-[40px] rounded-full bg-[#2C3034] flex justify-center items-center">
              <img
                src={`/${icon}.png`}
                alt={icon.charAt(0).toUpperCase() + icon.slice(1)}
                className={`w-[${icon==='facebook'?8:icon==='instagram'?12:14}px] lg:w-[${icon==='facebook'?10:icon==='instagram'?14:16}px] h-[${icon==='facebook'?13:14}px] lg:h-[${icon==='facebook'?16:16}px]`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Links Sections */}
      <div className="grid grid-cols-2 lg:flex lg:flex-row gap-8 lg:gap-0 w-full">
        {[
          { title: 'Discover', links: ['Find Facilities','Compare Care','Resources','How It Works','About Us'] },
          { title: 'Business', links: ['NursingHome for Business','Business Owner Login','Claim your Business Page','Advertise on NursingHome','Login Admin'] },
          { title: 'Support', links: ['Help Center','Contact Us','Privacy Policy','Terms of Service','Accessibility'] },
        ].map((section) => (
          <div key={section.title} className="flex flex-col w-full lg:w-[236px] lg:h-[152px]">
            <h4 className="text-white font-semibold text-[16px] lg:text-[18px] leading-[24px] lg:leading-7 mt-2">{section.title}</h4>
            <ul className="list-none mt-3 space-y-2">
              {section.links.map((link) => (
                <li key={link} className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6">{link}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Footer Bottom Section */}
    <div className="mt-6 pt-4 pb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center border-t border-gray-700 w-full lg:w-[1216px] gap-4 lg:gap-0">
      <span className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6 order-2 lg:order-1">
        © 2025 NursingHome. All rights reserved.
      </span>
      <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-[#D1D5DB] text-[12px] lg:text-[14px] leading-[16px] lg:leading-6 order-1 lg:order-2">
        <span>CMS Certified Data</span>
        <span>•</span>
        <span>HIPAA Compliant</span>
        <span>•</span>
        <span>SOC 2 Certified</span>
      </div>
    </div>
  </div>
</footer>

    );
}
