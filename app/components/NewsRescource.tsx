"use client";

import React from "react";
import Image from "next/image";

export function NewRescource() {
  return (
 <section className="w-full h-auto pb-5 bg-[#F9F9F9] flex justify-center items-start px-4 sm:px-6 md:px-10 lg:px-20">
  <div className="w-full h-auto mt-[54px] flex flex-col items-center gap-4 relative max-w-[1320px]">
    {/* Heading */}
    <h2 className="text-center font-jost font-bold text-[24px] sm:text-[32px] leading-[28.8px] sm:leading-[38.4px] w-auto sm:w-[382px] h-auto sm:h-[46px] relative">
      Latest News &{" "}
      <span className="text-[#C71F37] relative inline-block">
        Resources
        <Image
          src="/herbs-BCkTGihn.svg fill.png"
          alt="herb icon"
          className="absolute -top-1 -right-4 sm:-top-2 sm:-right-5 md:-top-3 md:-right-6 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 opacity-80"
          width={40}
          height={40}
          style={{ transform: "rotate(-7deg)" }}
        />
      </span>
    </h2>

    <p className="text-center font-inter font-normal text-[16px] sm:text-[18px] leading-[24px] sm:leading-[28px] text-[#707070] w-full sm:w-[790px] px-4 sm:px-0">
      Stay informed with the latest healthcare news and helpful resources for senior care.
    </p>

    {/* Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full">
      {/* Each Card */}
      <div className="bg-white w-full h-auto sm:h-[606.22px] rounded-[16px] shadow-[0_2px_4px_rgba(0,0,0,0.07)] flex flex-col">
        {/* Image */}
        <div className="relative w-full h-[200px] sm:h-[277.22px] rounded-t-[16px] overflow-hidden">
          <img
            src="/modern_healthcare.png"
            alt="Card image"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.15)] to-[rgba(255,255,255,0)]" />
        </div>

        {/* Content */}
        <div className="flex-1 px-4 sm:px-6 pt-4 sm:pt-6">
          <h4 className="font-inter font-bold text-[18px] sm:text-[20px] leading-[24px] sm:leading-[28px] text-[#212121]">
            How Technology is Revolutionizing Nursing Home Care
          </h4>
          <p className="mt-3 sm:mt-4 font-inter font-normal text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-[#707070]">
            Explore the latest technological advances that are improving quality of life and care outcomes for nursing home residents across the country.
          </p>
          <button className="mt-4 mb-2 sm:mt-6 sm:mb-2 inline-flex items-center justify-center w-[134.42px] h-[30px] rounded-[800px] bg-[#FAE8EB]">
            <span className="font-jost font-medium text-[14px] leading-[14px] text-center text-[#C71F37]">
              Continue Reading
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto w-full h-[50px] sm:h-[54px] bg-white border-t border-[#EFEFEF] rounded-b-[16px] flex items-center px-4 sm:px-6 justify-between">
          <div className="flex items-center space-x-2">
            <img src="/icons/date.png" alt="Date icon" className="w-[14px] h-[14px]" />
            <span className="font-jost font-medium text-[14px] leading-[21px] text-[#212529]">
              13th Sept 2025
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <img src="/icons/eye.png" alt="Eye icon" className="w-[14px] h-[9.625px]" />
            <span className="font-jost font-normal text-[14px] leading-[21px] text-[#212529]">
              12k Views
            </span>
          </div>
        </div>
      </div>



          {/* Each Card */}
          <div className="bg-white w-full h-auto sm:h-[606.22px] rounded-[16px] shadow-[0_2px_4px_rgba(0,0,0,0.07)] flex flex-col">
        {/* Image */}
        <div className="relative w-full h-[200px] sm:h-[277.22px] rounded-t-[16px] overflow-hidden">
          <img
            src="/modern_healthcare.png"
            alt="Card image"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.15)] to-[rgba(255,255,255,0)]" />
        </div>

        {/* Content */}
        <div className="flex-1 px-4 sm:px-6 pt-4 sm:pt-6">
          <h4 className="font-inter font-bold text-[18px] sm:text-[20px] leading-[24px] sm:leading-[28px] text-[#212121]">
            How Technology is Revolutionizing Nursing Home Care
          </h4>
          <p className="mt-3 sm:mt-4 font-inter font-normal text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-[#707070]">
            Explore the latest technological advances that are improving quality of life and care outcomes for nursing home residents across the country.
          </p>
          <button className="mt-4 mb-2 sm:mt-6 sm:mb-2 inline-flex items-center justify-center w-[134.42px] h-[30px] rounded-[800px] bg-[#FAE8EB]">
            <span className="font-jost font-medium text-[14px] leading-[14px] text-center text-[#C71F37]">
              Continue Reading
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto w-full h-[50px] sm:h-[54px] bg-white border-t border-[#EFEFEF] rounded-b-[16px] flex items-center px-4 sm:px-6 justify-between">
          <div className="flex items-center space-x-2">
            <img src="/icons/date.png" alt="Date icon" className="w-[14px] h-[14px]" />
            <span className="font-jost font-medium text-[14px] leading-[21px] text-[#212529]">
              13th Sept 2025
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <img src="/icons/eye.png" alt="Eye icon" className="w-[14px] h-[9.625px]" />
            <span className="font-jost font-normal text-[14px] leading-[21px] text-[#212529]">
              12k Views
            </span>
          </div>
        </div>
      </div>
          <div className="bg-white w-full h-auto sm:h-[606.22px] rounded-[16px] shadow-[0_2px_4px_rgba(0,0,0,0.07)] flex flex-col">
        {/* Image */}
        <div className="relative w-full h-[200px] sm:h-[277.22px] rounded-t-[16px] overflow-hidden">
          <img
            src="/modern_healthcare.png"
            alt="Card image"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.15)] to-[rgba(255,255,255,0)]" />
        </div>

        {/* Content */}
        <div className="flex-1 px-4 sm:px-6 pt-4 sm:pt-6">
          <h4 className="font-inter font-bold text-[18px] sm:text-[20px] leading-[24px] sm:leading-[28px] text-[#212121]">
            How Technology is Revolutionizing Nursing Home Care
          </h4>
          <p className="mt-3 sm:mt-4 font-inter font-normal text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-[#707070]">
            Explore the latest technological advances that are improving quality of life and care outcomes for nursing home residents across the country.
          </p>
          <button className="mt-4 mb-2 sm:mt-6 sm:mb-2 inline-flex items-center justify-center w-[134.42px] h-[30px] rounded-[800px] bg-[#FAE8EB]">
            <span className="font-jost font-medium text-[14px] leading-[14px] text-center text-[#C71F37]">
              Continue Reading
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto w-full h-[50px] sm:h-[54px] bg-white border-t border-[#EFEFEF] rounded-b-[16px] flex items-center px-4 sm:px-6 justify-between">
          <div className="flex items-center space-x-2">
            <img src="/icons/date.png" alt="Date icon" className="w-[14px] h-[14px]" />
            <span className="font-jost font-medium text-[14px] leading-[21px] text-[#212529]">
              13th Sept 2025
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <img src="/icons/eye.png" alt="Eye icon" className="w-[14px] h-[9.625px]" />
            <span className="font-jost font-normal text-[14px] leading-[21px] text-[#212529]">
              12k Views
            </span>
          </div>
        </div>
      </div>
        </div>


      </div>
    </section>

  );
};

