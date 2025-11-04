"use client";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal"; // ✅ adjust the import if your modal path differs
import Image from "next/image";
import Link from "next/link";

export default function HeaderFacility() {
  const [openAuth, setOpenAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔒 check login state once on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <header className="w-full h-[78px] bg-[#C71F37] border-b border-[#C71F37]">
      <div className="max-w-[1856px] h-full px-4 sm:px-6 sm:px-[12px] flex items-center justify-between">
        
        {/* ✅ Logo links to Home */}
        <Link href="/" className="flex items-center">
          <Image
            src="/footer_icon.png"
            alt="NursingHome Logo"
            width={176}
            height={47}
            className="w-[120px] h-[32px] sm:w-[176px] sm:h-[47px] sm:ml-[60px] md:mx-37 lg:mx-37"
          />
        </Link>

        {/* ✅ Right Side Buttons */}
        <div className="flex items-center justify-end space-x-2 sm:space-x-6">
          {isAuthenticated ? (
            <div
              onClick={handleLogout}
              className="flex cursor-pointer items-center w-[100px] sm:w-[130px] h-[35.2px] rounded-md hover:bg-[#a91a2e] px-2 sm:px-4"
            >
              <Image
                src="/icons/arrow_btn.png"
                alt="Logout icon"
                width={18}
                height={18}
                className="mr-2"
              />
              <span className="font-jost font-semibold text-[14px] sm:text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
                Logout
              </span>
            </div>
          ) : (
            <div
              onClick={() => setOpenAuth(true)}
              className="flex cursor-pointer items-center w-[100px] sm:w-[130px] h-[35.2px] rounded-md hover:bg-[#a91a2e] px-2 sm:px-4"
            >
              <Image
                src="/icons/header_sign.png"
                alt="Sign in icon"
                width={18}
                height={18}
                className="mr-2"
              />
              <span className="font-jost font-semibold text-[14px] sm:text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
                Sign In
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Auth Modal */}
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
  );
}
