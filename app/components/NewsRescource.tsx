"use client";

import React from "react";

export function NewRescource () {
  return (
    <section className="w-full h-auto sm:h-[870px] bg-[#F9F9F9] flex justify-center items-start px-4 sm:px-0">
        <div className="w-full max-w-[1320px] h-auto sm:h-[735.73px] mt-[54px] flex flex-col items-center gap-4">
            <h2 className="text-center font-jost font-bold text-[24px] sm:text-[32px] leading-[28.8px] sm:leading-[38.4px] w-auto sm:w-[382px] h-auto sm:h-[46px]">Latest News &
                <span className="text-[#C71F37]"> Resources</span>
            </h2>
            <p className="text-center font-inter font-normal text-[16px] sm:text-[18px] leading-[24px] sm:leading-[28px] text-[#707070] w-full sm:w-[790px] h-auto sm:h-[28px] px-4 sm:px-0">
                Stay informed with the latest healthcare news and helpful resources for senior care.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 w-full">
              <div className="bg-white w-full max-w-[416px] mx-auto sm:w-[416px] h-auto sm:h-[606.22px] rounded-[16px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.07)] flex flex-col">
                {/* Image */}
                <div className="relative w-full h-[200px] sm:h-[277.22px] rounded-t-[16px] overflow-hidden">
                  <img
                    src="/modern_healthcare.png"
                    alt="Card image"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.15)] to-[rgba(255,255,255,0)]" />
                </div>

                <div className="flex-1 px-4 sm:px-8 pt-4 sm:pt-6">
                  <h4 className="font-inter font-bold text-[18px] sm:text-[20px] leading-[24px] sm:leading-[28px] text-[#212121] w-full">
                    How Technology is Revolutionizing Nursing Home Care
                  </h4>
                  <p className="mt-3 sm:mt-4 font-inter font-normal text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-[#707070] w-full">
                    Explore the latest technological advances that are improving quality of life and care outcomes for nursing home residents across the country.
                  </p>
                  <button className="mt-4 sm:mt-6 inline-flex items-center justify-center w-[134.42px] h-[30px] rounded-[800px] bg-[#FAE8EB]">
                    <span className="font-jost font-medium text-[14px] leading-[14px] text-center text-[#C71F37]">
                      Continue Reading
                    </span>
                  </button>
                </div>

                <div className="mt-auto w-full h-[50px] sm:h-[54px] bg-white border-t border-[#EFEFEF] rounded-b-[16px] flex items-center px-4 sm:px-8 justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/icons/date.png" 
                      alt="Date icon"
                      className="w-[14px] h-[14px]"
                    />
                    <span className="font-jost font-medium text-[14px] leading-[21px] text-[#212529]">
                      13th Sept 2025
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <img
                      src="/icons/eye.png"
                      alt="Eye icon"
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


               <div className="bg-white w-full max-w-[416px] mx-auto sm:w-[416px] h-auto sm:h-[606.22px] rounded-[16px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.07)] flex flex-col">
                {/* Image */}
                <div className="relative w-full h-[200px] sm:h-[277.22px] rounded-t-[16px] overflow-hidden">
                  <img
                    src="/elderly_residents.png"
                    alt="Card image"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.15)] to-[rgba(255,255,255,0)]" />
                </div>

                <div className="flex-1 px-4 sm:px-8 pt-4 sm:pt-6">
                  <h4 className="font-inter font-bold text-[18px] sm:text-[20px] leading-[24px] sm:leading-[28px] text-[#212121] w-full">
                    The Importance of Social Activities in Senior Care
                  </h4>
                  <p className="mt-3 sm:mt-4 font-inter font-normal text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-[#707070] w-full">
                    Research shows that engaging social programs significantly improve mental health and overall well-being for nursing home residents.
                  </p>
                  <button className="mt-4 sm:mt-6 inline-flex items-center justify-center w-[134.42px] h-[30px] rounded-[800px] bg-[#FAE8EB]">
                    <span className="font-jost font-medium text-[14px] leading-[14px] text-center text-[#C71F37]">
                      Continue Reading
                    </span>
                  </button>
                </div>


                <div className="mt-auto w-full h-[50px] sm:h-[54px] bg-white border-t border-[#EFEFEF] rounded-b-[16px] flex items-center px-4 sm:px-8 justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/icons/date.png" 
                      alt="Date icon"
                      className="w-[14px] h-[14px]"
                    />
                    <span className="font-jost font-medium text-[14px] leading-[21px] text-[#212529]">
                      29th AUG 2025
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <img
                      src="/icons/eye.png"
                      alt="Eye icon"
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

               <div className="bg-white w-full max-w-[416px] mx-auto sm:w-[416px] h-auto sm:h-[606.22px] rounded-[16px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.07)] flex flex-col">
                {/* Image */}
                <div className="relative w-full h-[200px] sm:h-[277.22px] rounded-t-[16px] overflow-hidden">
                  <img
                    src="/family members visiting elderly relative in bright modern nursing home room.png"
                    alt="Card image"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.15)] to-[rgba(255,255,255,0)]" />
                </div>

                <div className="flex-1 px-4 sm:px-8 pt-4 sm:pt-6">
                  <h4 className="font-inter font-bold text-[18px] sm:text-[20px] leading-[24px] sm:leading-[28px] text-[#212121] w-full">
                    Choosing the Right Time for Nursing Home Care
                  </h4>
                  <p className="mt-3 sm:mt-4 font-inter font-normal text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-[#707070] w-full">
                    A comprehensive guide for families navigating the difficult decision of when to transition a loved one to professional care.
                  </p>
                  <button className="mt-4 sm:mt-6 inline-flex items-center justify-center w-[134.42px] h-[30px] rounded-[800px] bg-[#FAE8EB]">
                    <span className="font-jost font-medium text-[14px] leading-[14px] text-center text-[#C71F37]">
                      Continue Reading
                    </span>
                  </button>
                </div>

                <div className="mt-auto w-full h-[50px] sm:h-[54px] bg-white border-t border-[#EFEFEF] rounded-b-[16px] flex items-center px-4 sm:px-8 justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/icons/date.png" 
                      alt="Date icon"
                      className="w-[14px] h-[14px]"
                    />
                    <span className="font-jost font-medium text-[14px] leading-[21px] text-[#212529]">
                      13th AUG 2025
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <img
                      src="/icons/eye.png"
                      alt="Eye icon"
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

