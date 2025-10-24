"use client";

import React from "react";

export function SearchNursing() {
    return (
         <section
    className="w-full pb-10 max-w-[1920px] bg-[#D02B38] flex flex-col justify-center items-center min-h-[345px] xl:h-[513px] sm:pb-10 "
>
    <div className="w-full max-w-[1280px] mx-auto mt-[35px] xl:w-[1280px] xl:h-[272px] px-4 sm:px-6 lg:px-8">
        <h2 className="font-inter font-bold text-2xl sm:text-3xl lg:text-4xl leading-8 lg:leading-10 text-white text-center mx-auto max-w-[722.5px] xl:w-[722.5px]">
            Ready to Find the Perfect Nursing Home?
        </h2>
        <p className="font-inter font-normal text-base sm:text-lg lg:text-xl leading-6 lg:leading-7 text-[#DBEAFE] text-center mx-auto mt-2 max-w-[790px] xl:w-[790px]">
            Join thousands of families who have found exceptional care through our
            platform. Start your search today.
        </p>
        
        {/* BUTTONS: Added mb-4 for vertical space on mobile only */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5 mt-8 sm:mt-10 w-full">
            {/* Start Your Search Button */}
            <button className="w-full sm:w-[200px] md:w-[220px] lg:w-[242.7px] h-12 sm:h-14 md:h-14 lg:h-16 rounded-lg bg-white shadow-sm flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02]">
                <img
                src="/vector_search_nursing.png"
                alt="Search Icon"
                className="w-4 h-4 sm:w-5 sm:h-5"
                />
                <span className="font-inter font-semibold text-base sm:text-lg leading-6 sm:leading-7 text-[#D02B38]">
                Start Your Search
                </span>
            </button>

            {/* Speak with Expert Button */}
            <button className="w-full sm:w-[200px] md:w-[220px] lg:w-[251.47px] h-12 sm:h-14 md:h-14 lg:h-16 rounded-lg bg-transparent border-2 border-white shadow-sm flex items-center justify-center gap-2.5 transition-all duration-200 hover:text-white hover:bg-[#D02B38]">
                <img
                src="/phone_search_icon.png"
                alt="Expert Icon"
                className="w-4 h-4 sm:w-5 sm:h-5"
                />
                <span className="font-inter font-semibold text-base sm:text-lg leading-6 sm:leading-7 text-white">
                Speak with Expert
                </span>
            </button>
        </div>


        {/* FEATURES: Changed to flex-col and reduced gap for better mobile stacking */}
        <div className="flex flex-col gap-2 sm:flex-row justify-center items-center sm:gap-8 lg:gap-20 mt-6 sm:mt-8 ml-0 sm:ml-5">
            <div className="flex items-center gap-1.5">
                <img
                    src="/nursing_sm_search.png"
                    alt="Free to use"
                    className="w-4 h-4"
                />
                <span className="font-inter font-normal text-base leading-6 text-[#DBEAFE]">
                    Free to use
                </span>
            </div>

            <div className="flex items-center gap-1.5">
                <img
                    src="/nursing_sm_search.png"
                    alt="Trusted platform"
                    className="w-4 h-4"
                />
                <span className="font-inter font-normal text-base leading-6 text-[#DBEAFE]">
                    No registration required
                </span>
            </div>

            <div className="flex items-center gap-1.5">
                <img
                    src="/nursing_sm_search.png"
                    alt="Fast search"
                    className="w-4 h-4"
                />
                <span className="font-inter font-normal text-base leading-6 text-[#DBEAFE]">
                    Expert support available
                </span>
            </div>
        </div>
    </div>

    {/* NEWSLETTER: Increased vertical gap between stacked elements on mobile */}
    <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-[1400px] mt-12 lg:mt-[50px] px-4 sm:px-6 lg:px-[50px] gap-6 lg:gap-0">
        <div className="max-w-[350px] text-center lg:text-left **gap-4**">
            <h4 className="font-jost font-semibold text-xl sm:text-2xl leading-8 lg:leading-9 text-white m-0">
                Subscribe Our Newsletter!
            </h4>
            <p className="font-jost font-normal text-sm sm:text-base leading-6 lg:leading-7 text-white/75 mt-3">
                Subscribe our marketing platforms for latest updates
            </p>
        </div>

        <div className="flex items-center bg-white/10 border border-white/20 rounded-[50px] w-full max-w-[526px] h-16 lg:h-[72px] px-3 lg:px-3 xl:w-[526px]">
            <input
                type="email"
                placeholder="Your Email Here..."
                className="flex-1 bg-transparent border-none outline-none text-white font-jost text-sm sm:text-base px-3 lg:px-4 placeholder-white/60"
            />
            <button className="flex items-center justify-center gap-2 w-full sm:w-[169.36px] h-12 lg:h-[54px] rounded-[50px] border border-white bg-white cursor-pointer px-4 lg:px-4 xl:w-[169.36px]">
                <img
                    src="/svg.png"
                    alt="Subscribe Icon"
                    className="w-5 h-5"
                />
                <span className="font-jost font-medium text-sm sm:text-base leading-5 lg:leading-6 text-[#212529] text-center">
                    Subscribe
                </span>
            </button>
        </div>
    </div>
</section>
    );
}
