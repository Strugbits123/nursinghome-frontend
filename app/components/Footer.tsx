"use client";

import React from "react";

export function Footer() {
    return (
        // <footer className="w-full bg-[#212529] flex flex-col items-center pt-2">
          <footer className="w-full max-w-[1920px] bg-[#212529] flex flex-col items-center pt-2">

            {/* Desktop: w-[1280px] h-[315px] - Mobile: w-full h-auto */}
            <div className="w-full lg:w-[1280px] h-auto lg:h-[315px] mt-8 bg-[#212529] flex flex-col justify-between px-4 lg:px-0">

                {/* Desktop: flex with gap - Mobile: flex-col */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-[40px]">
                    {/* Logo and Description Section */}
                    <div className="w-full lg:w-[250px] lg:mr-[220px]">
                        <div className="flex items-start gap-3 lg:gap-[12px] mb-4 lg:mb-[16px]">
                            <img
                                src="/footer_icon.png"
                                alt="Logo Icon"
                                className="w-[140px] lg:w-[176px] h-[37px] lg:h-[47px]"
                            />
                        </div>
                        <p className="w-full lg:w-[386.01px] h-auto lg:h-[68px] font-['Inter'] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] text-[#D1D5DB] mb-4 lg:mb-0">
                            Helping families find the perfect nursing home with comprehensive data, real reviews, and AI-powered insights.
                        </p>
                        <div className="flex gap-4 lg:gap-[16px]">
                            <div className="w-[36px] lg:w-[40px] h-[36px] lg:h-[40px] rounded-full bg-[#2C3034] flex justify-center items-center">
                                <img
                                    src="/facebook.png"
                                    alt="Facebook"
                                    className="w-[8px] lg:w-[10px] h-[13px] lg:h-[16px]"
                                />
                            </div>
                            <div className="w-[36px] lg:w-[40px] h-[36px] lg:h-[40px] rounded-full bg-[#2C3034] flex justify-center items-center">
                                <img
                                    src="/twitter.png"
                                    alt="Twitter"
                                    className="w-[14px] lg:w-[16px] h-[14px] lg:h-[16px]"
                                />
                            </div>
                            <div className="w-[36px] lg:w-[40px] h-[36px] lg:h-[40px] rounded-full bg-[#2C3034] flex justify-center items-center">
                                <img
                                    src="/linkedin.png"
                                    alt="LinkedIn"
                                    className="w-[14px] lg:w-[16px] h-[14px] lg:h-[16px]"
                                />
                            </div>
                            <div className="w-[36px] lg:w-[40px] h-[36px] lg:h-[40px] rounded-full bg-[#2C3034] flex justify-center items-center">
                                <img
                                    src="/instagram.png"
                                    alt="Instagram"
                                    className="w-[12px] lg:w-[14px] h-[14px] lg:h-[16px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Links Sections - Desktop: flex-row - Mobile: grid 2 columns */}
                    <div className="grid grid-cols-2 lg:flex lg:flex-row gap-8 lg:gap-0">
                        <div className="flex flex-col w-full lg:w-[236px] lg:h-[152px]">
                            <h4 className="text-white font-semibold text-[16px] lg:text-[18px] leading-[24px] lg:leading-7 mt-2">
                                Discover
                            </h4>
                            <ul className="list-none mt-3 space-y-2">
                                <li className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6">Find Facilities</li>
                                <li className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6">Compare Care</li>
                                <li className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6">Resources</li>
                                <li className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6">How It Works</li>
                                <li className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6">About Us</li>
                            </ul>
                        </div>
                        <div className="flex flex-col w-full lg:w-[236px] lg:h-[152px]">
                            <h4 className="text-white font-semibold text-[16px] lg:text-[18px] leading-[24px] lg:leading-7 mt-2">
                                Business
                            </h4>
                            <ul className="list-none mt-3 space-y-2">
                                <li className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6">NursingHome for Business</li>
                                <li className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6">Business Owner Login</li>
                                <li className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6">Claim your Business Page</li>
                                <li className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6">Advertise on NursingHome</li>
                                <li className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6">login Admin</li>
                            </ul>
                        </div>
                        <div className="flex flex-col w-full lg:w-[236px] lg:h-[152px] col-span-2 lg:col-span-1">
                            <h4 className="text-white font-semibold text-[16px] lg:text-[18px] leading-[24px] lg:leading-7 mt-2">
                                Support
                            </h4>
                            <ul className="list-none mt-3 space-y-2">
                                <li className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6">Help Center</li>
                                <li className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6">Contact Us</li>
                                <li className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6">Privacy Policy</li>
                                <li className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6">Terms of Service</li>
                                <li className="text-[#D1D5DB] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-6">Accessibility</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom Section */}
                <div className="mt-6 pt-4 flex flex-col lg:flex-row justify-between items-start lg:items-center border-t border-gray-700 w-full lg:w-[1216px] h-auto lg:h-[57px] gap-4 lg:gap-0">
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
