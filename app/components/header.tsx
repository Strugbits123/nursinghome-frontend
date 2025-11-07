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
        <img
          src="/footer_icon.png"
          alt="NursingHome Logo"
          className="w-[120px] h-[32px] sm:w-[150px] sm:h-[40px] lg:w-[176px] lg:h-[47px] mt-2 sm:mt-4 lg:mt-7 md:mx-20 lg:mx-40"
        />


        {/* <nav className="hidden lg:flex w-[357px] h-[65px] items-center space-x-8 mt-8 mr-50">
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
        </nav> */}

        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
          <div className="hidden md:flex items-center space-x-2 lg:space-x-6 md:mt-8 lg:mt-8">
            {isAuthenticated ? (
              <div
                onClick={handleLogout}
                className="flex cursor-pointer items-center w-[100px] lg:w-[130px] h-[35.2px] rounded-md hover:bg-[#FFFFFF]/20 px-2 lg:px-4 py-6"
              >
                <img
                  src="/icons/arrow_btn.png"
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

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#FFFFFF]/20"
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
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/30 backdrop-blur-md border-b border-[#E5E7EB] z-50">
          {/* <nav className="max-w-[1856px] mx-auto px-4 py-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <a
                href="#"
                className="font-inter font-black text-[16px] leading-[20px] tracking-[0.2px] capitalize text-[#111827] py-2"
              >
                Home
              </a>
              <a
                href="#"
                className="font-inter font-medium text-[16px] leading-[20px] tracking-[0.2px] capitalize text-[#111827] py-2"
              >
                What's New!
              </a>
              <a
                href="#"
                className="font-inter font-medium text-[16px] leading-[20px] tracking-[0.2px] capitalize text-[#111827] py-2"
              >
                News
              </a>
              <a
                href="#"
                className="font-inter font-medium text-[16px] leading-[20px] tracking-[0.2px] capitalize text-[#111827] py-2"
              >
                Contact
              </a>

              <div className="pt-4  border-gray-200 w-full flex flex-col items-center">
                {isAuthenticated ? (
                 <div
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex cursor-pointer items-center justify-center w-[150px] h-[45px] rounded-md hover:bg-gray-100 px-4 py-3 group"
                >
                  <img
                    src="/icons/arrow_btn.png"
                    alt="Logout icon"
                    className="w-[18px] h-[18px] mr-3 transition-all duration-200 group-hover:filter group-hover:brightness-0 group-hover:saturate-100"
                  />
                  <span className="font-jost font-semibold text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-[#111827]">
                    Logout
                  </span>
                </div>
                ) : (
                  <div
                    onClick={() => {
                      setOpenAuth(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex cursor-pointer items-center justify-center w-[150px] h-[45px] rounded-md hover:bg-gray-100 px-4 py-3 group"
                  >
                    <img
                      src="/icons/header_sign.png"
                      alt="Sign in icon"
                      className="w-[18px] h-[18px] mr-3 transition-all duration-200 group-hover:filter group-hover:brightness-0 group-hover:saturate-100"
                    />
                    <span className="font-jost font-semibold text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-[#111827]">
                      Sign In
                    </span>
                  </div>
                )}
              </div>
            </div>
          </nav> */}
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
