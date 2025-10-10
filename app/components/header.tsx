"use client"

import * as React from "react";
import { Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import AuthModal from "../components/AuthModal";

export function Header() {
  const [openAuth, setOpenAuth] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
  };

  const handleAuthClick = () => {
    setOpenAuth(true);
    setMenuOpen(false);
  };

  return (
    // <header className="w-full h-[78px] border-b border-[#FFFFFF1A] relative z-50 ">
    //   <div className="max-w-[1856px] h-[46px] mx-auto px-[32px] flex items-center justify-between">
    //     {/* Logo */}
    //     <Image
    //       src="/footer_icon.png"
    //       alt="NursingHome Logo"
    //       width={176}
    //       height={147}
    //       className="mt-7 ml-30"
    //     />

    //     {/* Desktop Nav */}
    //     <nav className="hidden md:flex w-[357px] h-[65px] items-center space-x-8 mt-8 mr-50">
    //       <a href="#" className="font-inter font-black text-[14px] text-white capitalize">Home</a>
    //       <a href="#" className="font-inter font-medium text-[16px] text-white capitalize">What’s New!</a>
    //       <a href="#" className="font-inter font-medium text-[16px] text-white capitalize">News</a>
    //       <a href="#" className="font-inter font-medium text-[16px] text-white capitalize">Contact</a>
    //     </nav>

    //     {/* Right side (desktop only) */}
    //     <div className="hidden md:flex w-[406.5px] h-[54px] items-center justify-end mt-9 mr-50 space-x-6">
    //       {isAuthenticated ? (
    //         <div
    //           onClick={handleLogout}
    //           className="flex cursor-pointer items-center w-[130px] h-[35.2px] rounded-md hover:bg-[#FFFFFF]/20 px-4 py-6"
    //         >
    //           <Image
    //             src="/arrow_btn.png"
    //             alt="Logout icon"
    //             width={19}
    //             height={19}
    //             className="mr-2"
    //           />
    //           <span className="font-jost font-semibold text-[16px] text-white">Logout</span>
    //         </div>
    //       ) : (
    //         <div
    //           onClick={() => setOpenAuth(true)}
    //           className="flex cursor-pointer items-center w-[130px] h-[35.2px] rounded-md hover:bg-[#FFFFFF]/20 px-4 py-6"
    //         >
    //           <Image
    //             src="/icons/header_sign.png"
    //             alt="Sign in icon"
    //             width={19}
    //             height={19}
    //             className="mr-2"
    //           />
    //           <span className="font-jost font-semibold text-[16px] text-white">Sign In</span>
    //         </div>
    //       )}
    //     </div>

    //     {/* Mobile Menu Toggle */}
    //     <button
    //       onClick={() => setMenuOpen(!menuOpen)}
    //       className="md:hidden flex items-center justify-center p-2 rounded-md text-white hover:bg-[#FFFFFF1A]"
    //     >
    //       {menuOpen ? <X size={26} /> : <Menu size={26} />}
    //     </button>
    //   </div>

    //   {/* Mobile Dropdown Menu */}
    //   {menuOpen && (
    //     <div className="absolute top-[78px] left-0 w-full border-t border-[#FFFFFF1A] flex flex-col items-center text-white py-6 md:hidden">
    //       <div className="flex flex-col space-y-5 w-full text-center">
    //         <a href="#" className="text-[16px] font-medium hover:text-gray-300 transition-colors">Home</a>
    //         <a href="#" className="text-[16px] font-medium hover:text-gray-300 transition-colors">What’s New!</a>
    //         <a href="#" className="text-[16px] font-medium hover:text-gray-300 transition-colors">News</a>
    //         <a href="#" className="text-[16px] font-medium hover:text-gray-300 transition-colors">Contact</a>
    //       </div>

    //       {/* Bottom section like your provided design */}
    //       <div className="pt-4 border-t border-[#FFFFFF1A] w-full mt-5">
    //         {isAuthenticated ? (
    //           <div
    //             onClick={() => {
    //               handleLogout();
    //               setMenuOpen(false);
    //             }}
    //             className="flex cursor-pointer items-center space-x-2 text-white hover:text-gray-300 transition-colors justify-center"
    //           >
    //             <Image src="/arrow_btn.png" alt="Logout icon" width={19} height={19} />
    //             <span>Logout</span>
    //           </div>
    //         ) : (
    //           <div
    //             onClick={handleAuthClick}
    //             className="flex cursor-pointer items-center space-x-2 text-white hover:text-gray-300 transition-colors justify-center"
    //           >
    //             <Image
    //               src="/icons/header_sign.png"
    //               alt="Sign in icon"
    //               width={19}
    //               height={19}
    //             />
    //             <span>Sign In</span>
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   )}

    //   {/* Auth Modal */}
    //   <AuthModal
    //     open={openAuth}
    //     onOpenChange={(open) => {
    //       setOpenAuth(open);
    //       if (!open) {
    //         setIsAuthenticated(!!localStorage.getItem("token"));
    //       }
    //     }}
    //   />
    // </header>
  );
}
