"use client"

import { MapPin, User, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="w-full h-[78px] border-b border-[#FFFFFF1A]">
      <div className="max-w-[1856px] h-[46px] mx-auto px-[32px] flex items-center justify-between">
        {/* Logo */}
        <img
          src="/footer_icon.png"
          alt="NursingHome Logo"
          className="w-[176px] h-[47px] mt-7 ml-30"
        />

        {/* Nav – center */}
        <nav className="w-[357px] h-[65px] flex items-center space-x-8 mt-8 mr-50">
          <div className="flex flex-col items-center">
            <a
              href="#"
              className="font-inter font-black text-[14px] leading-[13px] tracking-[0.2px] capitalize text-white"
            >
              Home
            </a>
          </div>
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

        {/* Right side block */}
        <div className="w-[406.5px] h-[54px] flex items-center justify-end mt-7 mr-60 space-x-6">
  {/* Sign In */}
  <div className="flex items-center w-[90px] h-[35.2px]">
    <img
      src="/icons/header_sign.png"
      alt="Eye icon"
      className="w-[18.78px] h-[18.78px] mr-2"
    />
    <span className="font-jost font-semibold text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
      Sign In
    </span>
  </div>

  {/* Add Listing button */}
<button
  className="
    flex items-center justify-center
    w-[163.37px] h-[54px]
    bg-[#C71F37] 
    rounded-[7.04px]
    px-4
    hover:bg-[#a91a2e] 
  "
>    <img
      src="/icons/location_icon.png"
      alt="Add icon"
      className="w-[18.78px] h-[18.78px] mr-2"
    />
    <span className="font-jost font-semibold text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
      Add Listing
    </span>
  </button>
</div>

      </div>

    </header>
  )
}
