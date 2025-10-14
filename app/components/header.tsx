"use client"

import * as React from "react";
import { MapPin, User, Plus, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthModal from "../components/AuthModal";
import toast from "react-hot-toast";

export function Header() {
  const [openAuth, setOpenAuth] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
  };

  return (
    <header className="w-full h-[78px] border-b border-[#FFFFFF1A] relative">
      <div className="max-w-[1856px] h-[46px] mx-auto px-4 sm:px-8 lg:px-[32px] flex items-center justify-between">
        {/* Logo */}
        <img
          src="/footer_icon.png"
          alt="NursingHome Logo"
          className="w-[120px] h-[32px] sm:w-[150px] sm:h-[40px] lg:w-[176px] lg:h-[47px] mt-2 sm:mt-4 lg:mt-7"
        />

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden lg:flex w-[357px] h-[65px] items-center space-x-8 mt-8 mr-50">
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
            What's New!
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
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
          {/* Desktop buttons - Hidden on mobile */}
          <div className="hidden sm:flex items-center space-x-2 lg:space-x-6">
            {isAuthenticated ? (
              <div
                onClick={handleLogout}
                className="flex cursor-pointer items-center w-[100px] lg:w-[130px] h-[35.2px] rounded-md hover:bg-[#FFFFFF]/20 px-2 lg:px-4 py-6"
              >
                <img
                  src="/arrow-btn.png"
                  alt="Logout icon"
                  className="w-[16px] h-[16px] lg:w-[18.78px] lg:h-[18.78px] mr-2"
                />
                <span className="font-jost font-semibold text-[14px] lg:text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
                  Logout
                </span>
              </div>
            ) : (
              // SIGN IN BUTTON
              <div
                onClick={() => setOpenAuth(true)}
                className="flex cursor-pointer items-center w-[100px] lg:w-[130px] h-[35.2px] rounded-md hover:bg-[#FFFFFF]/20 px-2 lg:px-4 py-6"
              >
                <img
                  src="/icons/header_sign.png"
                  alt="Sign in icon"
                  className="w-[16px] h-[16px] lg:w-[18.78px] lg:h-[18.78px] mr-2"
                />
                <span className="font-jost font-semibold text-[14px] lg:text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
                  Sign In
                </span>
              </div>
            )}
          </div>

          {/* Add Listing button - Responsive sizing */}
          {/* <button
            className="flex items-center justify-center w-[120px] h-[40px] sm:w-[140px] sm:h-[45px] lg:w-[163.37px] lg:h-[54px] bg-[#C71F37] rounded-[7.04px] px-2 lg:px-4 hover:bg-[#a91a2e]">
            <img
              src="/icons/location_icon.png"
              alt="Add icon"
              className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] lg:w-[18.78px] lg:h-[18.78px] mr-1 lg:mr-2"
            />
            <span className="font-jost font-semibold text-[12px] sm:text-[14px] lg:text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
              <span className="hidden sm:inline">Add Listing</span>
              <span className="sm:hidden">Add</span>
            </span>
          </button> */}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#FFFFFF]/20"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-[#FFFFFF1A] z-50">
          <nav className="max-w-[1856px] mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              <a
                href="#"
                className="font-inter font-black text-[16px] leading-[20px] tracking-[0.2px] capitalize text-white py-2"
              >
                Home
              </a>
              <a
                href="#"
                className="font-inter font-medium text-[16px] leading-[20px] tracking-[0.2px] capitalize text-white py-2"
              >
                What's New!
              </a>
              <a
                href="#"
                className="font-inter font-medium text-[16px] leading-[20px] tracking-[0.2px] capitalize text-white py-2"
              >
                News
              </a>
              <a
                href="#"
                className="font-inter font-medium text-[16px] leading-[20px] tracking-[0.2px] capitalize text-white py-2"
              >
                Contact
              </a>
              
              {/* Mobile Auth Button */}
              <div className="pt-4 border-t border-[#FFFFFF1A]">
                {isAuthenticated ? (
                  <div
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex cursor-pointer items-center w-full h-[45px] rounded-md hover:bg-[#FFFFFF]/20 px-4 py-3"
                  >
                    <img
                      src="/arrow-btn.png"
                      alt="Logout icon"
                      className="w-[18px] h-[18px] mr-3"
                    />
                    <span className="font-jost font-semibold text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
                      Logout
                    </span>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setOpenAuth(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex cursor-pointer items-center w-full h-[45px] rounded-md hover:bg-[#FFFFFF]/20 px-4 py-3"
                  >
                    <img
                      src="/icons/header_sign.png"
                      alt="Sign in icon"
                      className="w-[18px] h-[18px] mr-3"
                    />
                    <span className="font-jost font-semibold text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
                      Sign In
                    </span>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}

      <AuthModal 
        open={openAuth}
        onOpenChange={(open) => {
          setOpenAuth(open);
          if (!open) {
            // after closing modal, re-check token to update button
            setIsAuthenticated(!!localStorage.getItem("token"));
          }
        }} 
      />
    </header>
  )
}
