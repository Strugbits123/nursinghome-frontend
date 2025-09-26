'use client'

import * as React from "react";
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFacilities } from "../context/FacilitiesContext";
import AuthModal from "../components/AuthModal";
import toast from "react-hot-toast";

export default function FacilitySearchPage() {
  const router = useRouter();
  const { facilities } = useFacilities();
  const [openAuth, setOpenAuth] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/')
    }
  }, [router])
  

    React.useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem("token"));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        toast.success("Logged out successfully!");
    };

  return (
    <>

      <header className="w-full h-[78px] bg-[#C71F37] border-b border-[#C71F37]">
        <div className="max-w-[1856px] h-[46px] mx-auto px-[32px] flex items-center justify-between">
            {/* Logo */}
            <img
            src="/footer_icon.png"
            alt="NursingHome Logo"
            className="w-[176px] h-[47px] mt-7 ml-30"
            />

            {/* Navigation */}
            <nav className="w-[357px] h-[65px] flex items-center space-x-8 mt-8 mr-50">
            <a
                href="#"
                className="font-inter font-black text-[14px] leading-[13px] tracking-[0.2px] capitalize text-white"
            >
                Home
            </a>
            <a
                href="#"
                className="font-inter font-medium text-[16px] leading-[13px] tracking-[0.2px] capitalize text-white"
            >
                What’s New!
            </a>
            <a
                href="#"
                className="font-inter font-medium text-[16px] leading-[13px] tracking-[0.2px] capitalize text-white"
            >
                News
            </a>
            <a
                href="#"
                className="font-inter font-medium text-[16px] leading-[13px] tracking-[0.2px] capitalize text-white"
            >
                Contact
            </a>
            </nav>

            {/* Actions */}
            <div className="w-[406.5px] h-[54px] flex items-center justify-end mt-9 mr-50 space-x-6">
            {isAuthenticated ? (
                <div
                onClick={handleLogout}
                className="flex cursor-pointer items-center w-[130px] h-[35.2px] rounded-md hover:bg-[#a91a2e] px-4 py-6"
                >
                <img
                    src="/arrow-btn.png"
                    alt="Logout icon"
                    className="w-[18.78px] h-[18.78px] mr-2"
                />
                <span className="font-jost font-semibold text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
                    Logout
                </span>
                </div>
            ) : (
                <div
                onClick={() => setOpenAuth(true)}
                className="flex cursor-pointer items-center w-[130px] h-[35.2px] rounded-md hover:bg-[#a91a2e] px-4 py-6"
                >
                <img
                    src="/icons/header_sign.png"
                    alt="Sign in icon"
                    className="w-[18.78px] h-[18.78px]  mr-2"
                />
                <span className="font-jost font-semibold text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
                    Sign In
                </span>
                </div>
            )}

            <button className="flex items-center justify-center w-[163.37px] h-[54px] bg-white hover:bg-[#a91a2e] rounded-[7.04px] px-4">
                <img
                src="/icons/faciltiy_search_svg.png"
                alt="Add icon"
                className="w-[18.78px] h-[18.78px] fill-red-500  mr-2 invert"
                />
                <span className="font-jost font-semibold text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-[#c71f37]">
                Add Listing
                </span>
            </button>
            </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
            open={openAuth}
            onOpenChange={(open) => {
            setOpenAuth(open);
            if (!open) {
                setIsAuthenticated(!!localStorage.getItem("token"));
            }
            }}
        />
    </header>

   <section className="w-full h-[60px] bg-[#F5F5F5] flex items-center justify-between px-22 ">
        <div className="flex items-center gap-x-2 text-[#4B5563] mx-25 font-inter font-normal text-[16.28px] leading-[23.26px]">
            <span className="align-middle">Home</span>
            <img
                src="/icons/search_fac_right_icon.png"
                alt="Arrow"
                className="w-[8.72px] h-[13.95px] align-middle"
            />
            <span className="align-middle">Search Results</span>
            <img
                src="/icons/search_fac_right_icon.png"
                alt="Arrow"
                className="w-[8.72px] h-[13.95px] align-middle"
            />
            <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-[#111827] align-middle">
                New York, NY
            </span>
        </div>


        <button className="flex items-center gap-2 bg-[#F5F5F5] text-[#C71F37] px-4 mx-45 py-2 hover:bg-[#f5f5f5] transition">
            <img
            src="/icons/facility_search_heart_icon.png"
            alt="Save icon"
            className="w-[16.28px] h-[16.28px]"
            />
            <span className="font-inter font-normal text-[16.28px] leading-[23.26px] text-center">
            Save Search
            </span>
        </button>
    </section>

  <section className="w-[1529px] h-[148px] ml-[195px] bg-white rounded-lg shadow-md flex flex-col justify-center px-6 py-4">
  {/* First Row */}
  <div className="flex items-center justify-between w-full mb-4">
    {/* Text on left */}
    <div className="flex items-center space-x-4">
      <span
        className="font-inter font-medium text-[18px] leading-[28.67px] text-[#111827]"
        style={{ width: "340px", height: "28.67px", lineHeight: "28.67px" }}
      >
        47 facilities found in Los Angeles, CA
      </span>
      <span className="font-inter font-normal text-[16px] leading-[23.26px] text-[#6B7280]">
        Within 25 miles
      </span>
    </div>

    {/* Buttons on right */}
    <div className="flex items-center space-x-4">
      {/* First Button */}
      <button
        className="w-[233px] h-[48px] rounded-[9.56px] border border-[#E5E7EB] text-[#212121] font-inter font-medium hover:bg-gray-50 transition"
      >
        Button 1
      </button>

      {/* Second Button */}
      <button
        className="w-[98px] h-[49px] rounded-[9.3px] border border-[#D1D5DB] text-[#212121] font-inter font-medium hover:bg-gray-50 transition"
      >
        Button 2
      </button>
    </div>
  </div>

  {/* Second Row */}
  <div className="w-full flex items-center justify-start">
    <span className="font-inter text-[#4B5563] text-[16px]">
      Additional content for the second row
    </span>
  </div>
</section>



    
    </>
  )
}
