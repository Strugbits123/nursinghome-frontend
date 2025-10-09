"use client";

import React from "react";
import Image from "next/image";

export function NewRescource () {
  return (
    <section className="w-full h-[870px] bg-[#F9F9F9] flex justify-center items-start">
        <div className="w-[1320px] h-[735.73px] mt-[54px] flex flex-col items-center gap-4">
            <h2 className="text-center font-jost font-bold text-[32px] leading-[38.4px] w-[382px] h-[46px]">Latest News &
                <span className="text-[#C71F37]"> Resources</span>
            </h2>
            <p className="text-center font-inter font-normal text-[18px] leading-[28px] text-[#707070] w-[790px] h-[28px]">
                Stay informed with the latest healthcare news and helpful resources for senior care.
            </p>

            <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="bg-white w-[416px] h-[606.22px] rounded-[16px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.07)] flex flex-col">
                {/* Image */}
                <div className="relative w-[416px] h-[277.22px] rounded-t-[16px] overflow-hidden">
                  <Image
                    src="/modern_healthcare.png"
                    alt="Card image"
                    width={500} // Placeholder width for w-full
                    height={300} // Placeholder height for h-full
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.15)] to-[rgba(255,255,255,0)]" />
                </div>

                <div className="flex-1 px-8 pt-6">
                  <h4 className="font-inter font-bold text-[20px] leading-[28px] text-[#212121] w-[376px]">
                    How Technology is Revolutionizing Nursing Home Care
                  </h4>
                  <p className="mt-4 font-inter font-normal text-[16px] leading-[24px] text-[#707070] w-[376px]">
                    Explore the latest technological advances that are improving quality of life and care outcomes for nursing home residents across the country.
                  </p>
                  <button className="mt-6 inline-flex items-center justify-center w-[134.42px] h-[30px] rounded-[800px] bg-[#FAE8EB]">
                    <span className="font-jost font-medium text-[14px] leading-[14px] text-center text-[#C71F37]">
                      Continue Reading
                    </span>
                  </button>
                </div>

                <div className="mt-auto w-[416px] h-[54px] bg-white border-t border-[#EFEFEF] rounded-b-[16px] flex items-center px-8 justify-between">
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/icons/date.png" 
                      alt="Date icon"
                      width={14}
                      height={14}
                      className="w-[14px] h-[14px]"
                    />
                    <span className="font-jost font-medium text-[14px] leading-[21px] text-[#212529]">
                      13th Sept 2025
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Image
                      src="/icons/eye.png"
                      alt="Eye icon"
                      width={14}
                      height={10} 
                      className="
                        w-[14px]      
                        h-[9.625px]   
                        opacity-100   
                      "
                    />
                    <span className="font-jost font-normal text-[14px] leading-[21px] text-[#212529]">
                      12k Views
                    </span>
                  </div>
                </div>

              </div>


               <div className="bg-white w-[416px] h-[606.22px] rounded-[16px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.07)] flex flex-col">
                {/* Image */}
                <div className="relative w-[416px] h-[277.22px] rounded-t-[16px] overflow-hidden">
                  <Image
                    src="/elderly_residents.png"
                    alt="Card image"
                    width={500} // Placeholder width for w-full
                    height={300} // Placeholder height for h-full
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.15)] to-[rgba(255,255,255,0)]" />
                </div>

                <div className="flex-1 px-8 pt-6">
                  <h4 className="font-inter font-bold text-[20px] leading-[28px] text-[#212121] w-[376px]">
                    The Importance of Social Activities in Senior Care
                  </h4>
                  <p className="mt-4 font-inter font-normal text-[16px] leading-[24px] text-[#707070] w-[376px]">
                    Research shows that engaging social programs significantly improve mental health and overall well-being for nursing home residents.
                  </p>
                  <button className="mt-6 inline-flex items-center justify-center w-[134.42px] h-[30px] rounded-[800px] bg-[#FAE8EB]">
                    <span className="font-jost font-medium text-[14px] leading-[14px] text-center text-[#C71F37]">
                      Continue Reading
                    </span>
                  </button>
                </div>


                <div className="mt-auto w-[416px] h-[54px] bg-white border-t border-[#EFEFEF] rounded-b-[16px] flex items-center px-8 justify-between">
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/icons/date.png" 
                      alt="Date icon"
                      width={14}
                      height={14}
                      className="w-[14px] h-[14px]"
                    />
                    <span className="font-jost font-medium text-[14px] leading-[21px] text-[#212529]">
                      29th AUG 2025
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Image
                      src="/icons/eye.png"
                      alt="Eye icon"
                      width={14}
                      height={10}
                      className="
                        w-[14px]      
                        h-[9.625px]   
                        opacity-100   
                      "
                    />
                    <span className="font-jost font-normal text-[14px] leading-[21px] text-[#212529]">
                      33k Views
                    </span>
                  </div>
                </div>

              </div>

               <div className="bg-white w-[416px] h-[606.22px] rounded-[16px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.07)] flex flex-col">
                {/* Image */}
                <div className="relative w-[416px] h-[277.22px] rounded-t-[16px] overflow-hidden">
                  <Image
                    src="/family members visiting elderly relative in bright modern nursing home room.png"
                    alt="Card image"
                    width={500}
                    height={300} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.15)] to-[rgba(255,255,255,0)]" />
                </div>

                <div className="flex-1 px-8 pt-6">
                  <h4 className="font-inter font-bold text-[20px] leading-[28px] text-[#212121] w-[376px]">
                    Choosing the Right Time for Nursing Home Care
                  </h4>
                  <p className="mt-4 font-inter font-normal text-[16px] leading-[24px] text-[#707070] w-[376px]">
                    A comprehensive guide for families navigating the difficult decision of when to transition a loved one to professional care.
                  </p>
                  <button className="mt-6 inline-flex items-center justify-center w-[134.42px] h-[30px] rounded-[800px] bg-[#FAE8EB]">
                    <span className="font-jost font-medium text-[14px] leading-[14px] text-center text-[#C71F37]">
                      Continue Reading
                    </span>
                  </button>
                </div>

                <div className="mt-auto w-[416px] h-[54px] bg-white border-t border-[#EFEFEF] rounded-b-[16px] flex items-center px-8 justify-between">
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/icons/date.png" 
                      alt="Date icon"
                      width={14}
                      height={14}
                      className="w-[14px] h-[14px]"
                    />
                    <span className="font-jost font-medium text-[14px] leading-[21px] text-[#212529]">
                      13th AUG 2025
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Image
                      src="/icons/eye.png"
                      alt="Eye icon"
                      width={14}
                      height={10} 
                      className="
                        w-[14px]      
                        h-[9.625px]   
                        opacity-100   
                      "
                    />
                    <span className="font-jost font-normal text-[14px] leading-[21px] text-[#212529]">
                      15k Views
                    </span>
                  </div>
                </div>

              </div>
            </div>

         </div>
    </section>

  );
};

