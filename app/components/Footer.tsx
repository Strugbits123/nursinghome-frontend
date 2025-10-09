"use client";

import React from "react";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="w-full bg-[#212529] flex flex-col items-center pt-2">
            <div className="w-[1280px] h-[315px] mt-8 bg-[#212529] flex flex-col justify-between">

                <div style={{ display: "flex", gap: "40px" }}>
                    <div style={{ width: "250px", marginRight: "220px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginLeft: "20px", marginBottom: "16px" }}>
                            <Image
                                src="/footer_icon.png"
                                alt="Logo Icon"
                                style={{ width: "176px", height: "47px" }}
                                 width={176} 
                                height={47}
                            />
                        </div>
                        <p
                            style={{
                                width: "386.01px",
                                height: "68px",
                                fontFamily: "Inter",
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: "#D1D5DB",
                                marginLeft: "25px",
                                verticalAlign: "middle",
                            }}
                        >
                            Helping families find the perfect nursing home with comprehensive data, real reviews, and AI-powered  insights.
                        </p>
                        <div style={{ display: "flex", gap: "16px", marginLeft: "25px", marginTop: "16px" }}>
                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "9999px",
                                    backgroundColor: "#2C3034",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    src="/facebook.png"
                                    alt="Facebook"
                                    width={176} 
                                    height={47}
                                    style={{ width: "10px", height: "16px" }}
                                />
                            </div>
                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "9999px",
                                    backgroundColor: "#2C3034",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    src="/twitter.png"
                                    alt="Twitter"
                                    width={16} 
                                    height={16}
                                    style={{ width: "16px", height: "16px" }}
                                />
                            </div>
                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "9999px",
                                    backgroundColor: "#2C3034",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    src="/linkedin.png"
                                    alt="LinkedIn"
                                    width={16} 
                                    height={16}
                                    style={{ width: "16px", height: "16px" }}
                                />
                            </div>
                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "9999px",
                                    backgroundColor: "#2C3034",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    src="/instagram.png"
                                    alt="Instagram"
                                    width={14} 
                                    height={16}
                                    style={{ width: "14px", height: "16px" }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col" style={{ width: "236px", height: "152px" }}>
                        <h4 className="text-white font-semibold text-[18px] leading-7  mt-2 ">
                            Discover
                        </h4>
                        <ul className="list-none mt-3 space-y-2">
                            <li className="text-[#D1D5DB] font-normal text-[16px] leading-6">Find Facilities</li>
                            <li className="text-[#D1D5DB] font-normal text-[16px] leading-6">Compare Care</li>
                            <li className="text-[#D1D5DB] font-normal text-[16px] leading-6">Resources</li>
                            <li className="text-[#D1D5DB] font-normal text-[16px] leading-6">How It Works</li>
                            <li className="text-[#D1D5DB] font-normal text-[16px] leading-6">About Us</li>
                        </ul>
                    </div>
                    <div className="flex flex-col" style={{ width: "236px", height: "152px" }}>
                        <h4 className="text-white font-semibold text-[18px] leading-7  mt-2">
                            Business
                        </h4>
                        <ul className="list-none mt-3 space-y-2">
                            <li className="text-[#D1D5DB] font-normal text-[16px] leading-6">NursingHome for Business</li>
                            <li className="text-[#D1D5DB] font-normal text-[16px] leading-6">Business Owner Login</li>
                            <li className="text-[#D1D5DB] font-normal text-[16px] leading-6">Claim your Business Page</li>
                            <li className="text-[#D1D5DB] font-normal text-[16px] leading-6">Advertise on NursingHome</li>
                            <li className="text-[#D1D5DB] font-normal text-[16px] leading-6">login Admin</li>
                        </ul>
                    </div>
                    <div className="flex flex-col" style={{ width: "236px", height: "152px" }}>
                        <h4 className="text-white font-semibold text-[18px] leading-7  mt-2">
                            Support
                        </h4>
                        <ul className="list-none mt-3 space-y-2">
                            <li className="text-[#D1D5DB] font-normal text-[16px] leading-6">Help Center</li>
                            <li className="text-[#D1D5DB] font-normal text-[16px] leading-6">Contact Us</li>
                            <li className="text-[#D1D5DB] font-normal text-[16px] leading-6">Privacy Policy</li>
                            <li className="text-[#D1D5DB] font-normal text-[16px] leading-6">Terms of Service</li>
                            <li className="text-[#D1D5DB] font-normal text-[16px] leading-6">Accessibility</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-6 pt-4 flex justify-between items-center border-t border-gray-700 w-[1216px] h-[57px] ml-8 mr-8">
                    <span className="text-[#D1D5DB] font-normal text-[16px] leading-6">
                        © 2025 NursingHome. All rights reserved.
                    </span>
                    <div className="flex items-center gap-4 text-[#D1D5DB] text-[14px] leading-6 mr-20">
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
