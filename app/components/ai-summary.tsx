import Image from "next/image";

export function AISummary() {
    return (
        <section className="w-full flex justify-center py-8">
            <div className="w-[90%] max-w-[1578px] h-[1274px] bg-white flex justify-center items-start p-8">
                <div className="w-[1406.57px] h-[1202.18px]  rounded-xl flex flex-col items-center p-8 space-y-12">
                    <div className="flex flex-col items-center text-center gap-4">
                        <h2 className="text-[32px] leading-[38.4px] font-jost font-bold text-black text-center">
                            Smarter Decisions with{' '}
                            <span className="text-[#C71F37]">AI Summaries</span>
                            {/* Flower icon */}
                            
                            <Image
                                src="/herbs-BCkTGihn.svg fill.png"
                                alt="flower icon"
                                width={40} // Extracted from style: width: '40px'
                                height={40} // Extracted from style: height: '40px'
                                className="absolute"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    transform: 'rotate(-7deg)',
                                    top: '2540.44px',
                                    left: '1218.13px',
                                    opacity: 1
                                }}
                                />
                        </h2>
                        <p
                            className="w-[864px] text-[18px] leading-[28px] font-inter font-normal text-gray-700 text-center"
                            style={{ letterSpacing: '0%' }}
                        >
                            Our advanced AI analyzes thousands of reviews to provide clear, concise summaries that highlight what matters most to families
                        </p>
                    </div>
                    <div className="w-full flex flex-row justify-between space-x-8">
                        <div className="w-[632.96px] h-[505.49px] rounded-[13.19px] bg-gray-100 opacity-100 flex flex-col p-8 mt-20">
                            <div className="flex items-center px-4 py-2 rounded-md w-fit mb-4">
                                <Image
                                    src="/coma.png"
                                    alt="Icon"
                                    width={24} // Rounded up from 23.08px
                                    height={27} // Rounded up from 26.37px
                                    className="w-[23.08px] h-[26.37px] mr-3"
                                    />
                                <p
                                    className="text-black font-bold"
                                    style={{
                                        fontFamily: 'Inter',
                                        fontSize: '26.37px',
                                        lineHeight: '35.16px',
                                        letterSpacing: '0%',
                                    }}
                                >
                                    Traditional Reviews
                                </p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="w-[562.63px] h-[127.47px] bg-white rounded-[8.79px] border-l-[4.4px] border-gray-300 p-4 flex flex-col">
                                    <p className="w-[523.31px] h-[62.64px] text-[#707070] italic text-[15.38px] leading-[21.98px] font-inter mb-[11.07px]">
                                        "The staff was really nice and the food was okay. My mom seemed
                                        happy there but the building is a bit old. The nurses were attentive most
                                        of the time..."
                                    </p>
                                    <p className="w-[158.25px] h-[17.58px] text-[#707070] text-[13.19px] leading-[17.58px] font-inter">
                                        - Sarah M., 2 months ago
                                    </p>

                                </div>
                                <div className="w-[562.63px] h-[105.49px] bg-white rounded-[8.79px] border-l-[4.4px] border-gray-300 p-4 flex flex-col">
                                    <p className="w-[523.31px] h-[50px] text-[#707070] italic text-[15.38px] leading-[21.98px] font-inter mb-[8px]">
                                        "Great place overall. Dad loves the activities and the physical therapy
                                        helped him a lot. Could use some updates to the rooms though..."
                                    </p>
                                    <p className="w-[158.25px] h-[17.58px] text-[#707070] text-[13.19px] leading-[17.58px] font-inter">
                                        - Michael R., 1 month ago
                                    </p>
                                </div>
                                <div className="w-[562.63px] h-[105.49px] bg-white rounded-[8.79px] border-l-[4.4px] border-gray-300 p-4 flex flex-col">
                                    <p  className="w-[523.31px] h-[50px] text-[#707070] italic text-[15.38px] leading-[21.98px] font-inter mb-[8px]">
                                        "Clean facility with caring staff. The visiting hours are flexible which is great for our family. Meals could be better but overall satisfied..."
                                    </p>
                                    <p className="w-[158.25px] h-[17.58px] text-[#707070] text-[13.19px] leading-[17.58px] font-inter">
                                        - Jennifer L., 3 weeks ago
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-[632.96px] h-[661.53px] rounded-[13.19px] bg-gradient-to-br from-[#EFF6FF] to-[#FAF5FF] opacity-100 flex flex-col items-start p-6 space-y-6">
                            <div className="flex items-center gap-3">
                                <Image
                                    src="/brain.png"
                                    alt="AI Icon"
                                    width={27} // Rounded up from 26.37px
                                    height={27} // Rounded up from 26.37px
                                    className="w-[26.37px] h-[26.37px] opacity-100"
                                    />
                                <h3 className="text-[#212121] font-inter font-bold text-[26.37px] leading-[35.16px]">
                                    AI-Powered Summary
                                </h3>
                            </div>

                            <div className="w-[558.23px] h-[245.16px] bg-[#F0FDF4] rounded-[8.79px] border border-[#BBF7D0] p-[16px_8px] flex flex-col space-y-4">
                                <div className="flex items-center gap-2 w-[520.87px] h-[26.37px] pt-[18.68px] pl-[18.68px]">
                                   <Image
                                    src="/like.png"
                                    alt="Icon"
                                    width={18} // Rounded up from 17.58px
                                    height={18} // Rounded up from 17.58px
                                    className="w-[17.58px] h-[17.58px]"
                                    />
                                    <h4
                                        className="font-inter font-bold text-[17.58px] leading-[26.37px] text-[#166534]"
                                        style={{ width: '234.29px', height: '21.98px' }}
                                    >
                                        Pros (Based on 47 reviews)
                                    </h4>
                                </div>

                                <div className="w-[520.87px] h-[158.24px] bg-[#F0FDF4] rounded-md pt-[18.68px] pl-[18.68px] flex flex-col gap-2">

                                    <div className="flex items-start gap-2 w-full h-[52.75px]">
                                       <Image
                                        src="/right.png"
                                        alt="Check Icon"
                                        width={16} // Rounded up from 15.38px
                                        height={16} // Rounded up from 15.38px
                                        className="w-[15.38px] h-[15.38px] mt-1"
                                        />
                                        <p
                                            className="text-[#15803D] font-inter font-normal text-[17.58px] leading-[26.37px]"
                                            style={{ width: '461.97px', height: '48.35px' }}
                                        >
                                            Caring and attentive nursing staff (mentioned in 89% of reviews)
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2 w-full h-[26.37px]">
                                        <Image
                                            src="/right.png"
                                            alt="Check Icon"
                                            width={16} // Rounded up from 15.38px
                                            height={16} // Rounded up from 15.38px
                                            className="w-[15.38px] h-[15.38px] mt-1"
                                            />
                                        <p
                                            className="text-[#15803D] font-inter font-normal text-[17.58px] leading-[26.37px]"
                                            style={{ width: '449.62px', height: '26.37px' }}
                                        >
                                            Excellent rehabilitation and physical therapy programs
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2 w-full h-[26.37px]">
                                        <Image
                                            src="/right.png"
                                            alt="Check Icon"
                                            width={16} // Rounded up from 15.38px
                                            height={16} // Rounded up from 15.38px
                                            className="w-[15.38px] h-[15.38px] mt-1"
                                            />
                                        <p
                                            className="text-[#15803D] font-inter font-normal text-[17.58px] leading-[26.37px]"
                                            style={{ width: '449.62px', height: '26.37px' }}
                                        >
                                            Flexible visiting hours and family-friendly policies
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2 w-full h-[26.37px]">
                                      <Image
                                        src="/right.png"
                                        alt="Check Icon"
                                        width={16} // Rounded up from 15.38px
                                        height={16} // Rounded up from 15.38px
                                        className="w-[15.38px] h-[15.38px] mt-1"
                                        />
                                        <p
                                            className="text-[#15803D] font-inter font-normal text-[17.58px] leading-[26.37px]"
                                            style={{ width: '449.62px', height: '26.37px' }}
                                        >
                                            Clean and well-maintained common areas
                                        </p>
                                    </div>

                                </div>
                            </div>
                            <div className="w-[558.23px] h-[138.46px] bg-[#FFF7ED] rounded-[8.79px] border border-[#FED7AA] p-[16px_8px]">
                                <div className="flex items-center gap-[8px] w-[520.87px] h-[26.37px] pt-[18.68px] pl-[18.68px]">
                                    <Image
                                    src="/improvement.png"
                                    alt="Improvement Icon"
                                    width={18} // Rounded up from 17.58px
                                    height={18} // Rounded up from 17.58px
                                    className="w-[17.58px] h-[17.58px] opacity-100"
                                    />
                                    <h4
                                        className="font-inter font-bold text-[17.58px] leading-[26.37px] text-[#9A3412]"
                                        style={{ width: '197.69px', height: '21.98px' }}
                                    >
                                        Areas for Improvement
                                    </h4>
                                </div>
                                <div className="w-[520.87px] pl-[18.68px] mt-[18.68px] flex flex-col gap-2">
                                    <div className="flex items-center gap-2 w-[520.87px] h-[26.37px]">
                                        <Image
                                        src="/Vector.png"
                                        alt="Item Icon"
                                        width={16} // Rounded up from 15.38px
                                        height={16} // Rounded up from 15.38px
                                        className="w-[15.38px] h-[15.38px]"
                                        />
                                        <p className="font-inter text-[17.58px] leading-[26.37px] text-[#9A3412]">
                                            Older building infrastructure needs updating
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 w-[520.87px] h-[26.37px]">
                                        <Image
                                        src="/Vector.png"
                                        alt="Item Icon"
                                        width={16} // Rounded up from 15.38px
                                        height={16} // Rounded up from 15.38px
                                        className="w-[15.38px] h-[15.38px]"
                                        />
                                        <p className="font-inter text-[17.58px] leading-[26.37px] text-[#9A3412]">
                                            Dining options could be more varied and flavorful
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-[558.23px] h-[98.90px] rounded-[8.79px] border-[1.1px] border-[#BFDBFE] bg-[#EFF6FF] opacity-100">
                                <h4 className="font-inter font-bold text-[17.58px] leading-[26.37px] text-[#198754] mt-[18.68px] ml-[18.68px]">
                                    Overall Sentiment Score
                                </h4>
                                <div className="flex items-center gap-4 mt-[20px] ml-[18.68px]">
                                    <div
                                        className="w-[395.70px] h-[13.19px] bg-[#E5E7EB] rounded-[10987.74px] overflow-hidden">
                                        <div className="h-full bg-[#198754] rounded-[10987.74px] transition-all duration-500"  style={{ width: '78%' }}
                                        />
                                    </div>
                                    <span className="font-inter font-bold text-[17.58px] leading-[26.37px] text-[#198754] ml-[5px]" style={{ width: '112.38px', height: '26.37px' }}>
                                        78% Positive
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Bottom div: third div spanning mostly full width */}
                {/* Bottom div: third div spanning mostly full width */}
                <div className="w-[984.6px] h-[268.13px] rounded-[13.19px] bg-gray-100 flex flex-col items-center justify-center gap-6 mx-auto">
                {/* Bottom div heading */}
                <h3
                    className="font-inter font-bold text-[26.37px] leading-[35.16px] text-[#212121] text-center"
                    style={{ width: '235.11px', height: '35.16px' }}
                >
                    How Our AI Works
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center max-w-[300px]">
                        <div className="w-[52.74px] h-[52.74px] rounded-full flex items-center justify-center" style={{ backgroundColor: '#FAE8EB' }}>
                            <Image
                        src="/ai_work1.png"
                        alt="Data collection"
                        width={16} // Rounded up from 15.38px
                        height={18} // Rounded up from 17.58px
                        className="w-[15.38px] h-[17.58px]"
                        />
                        </div>

                        <h4
                            className="font-inter font-semibold text-[17.58px] leading-[26.37px] text-[#212121] mt-4"
                            style={{ width: '130.21px', height: '26.37px' }}
                        >
                            Data Collection
                        </h4>

                        <p className="font-inter text-[15.38px] leading-[21.98px] text-[#707070] mt-2" style={{ width: '265.09px', height: '40.65px' }}>
                            Analyzes reviews from Google, CMS reports, and facility data
                        </p>
                        </div>

                        <div className="flex flex-col items-center text-center max-w-[300px]">
                        <div
                            className="w-[52.74px] h-[52.74px] rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#FAE8EB' }}
                        >
                            <Image 
                            src="/ai_work2.png" 
                            alt="Analysis" 
                            width={22} // Rounded up from 21.98px
                            height={18} // Rounded up from 17.58px
                            className="w-[21.98px] h-[17.58px]" 
                            />
                        </div>
                        <h4 className="font-inter font-semibold text-[17.58px] leading-[26.37px] text-[#212121] mt-4">
                            Smart Analysis
                        </h4>
                        <p className="font-inter text-[15.38px] leading-[21.98px] text-[#707070] mt-2">
                            Our AI processes data to find trends and key insights
                        </p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center max-w-[300px]">
                        <div
                            className="w-[52.74px] h-[52.74px] rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#FAE8EB' }}
                        >
                            <Image 
                            src="/ai_work3.png" 
                            alt="Summary" 
                            width={14} // Rounded up from 13.19px
                            height={18} // Rounded up from 17.58px
                            className="w-[13.19px] h-[17.58px]" 
                            />
                        </div>
                        <h4 className="font-inter font-semibold text-[17.58px] leading-[26.37px] text-[#212121] mt-4">
                            Clear Insights
                        </h4>
                        <p className="font-inter text-[15.38px] leading-[21.98px] text-[#707070] mt-2">
                            Delivers concise pros, cons, and key highlights
                        </p>
                        </div>
                    </div>
                </div>

                </div>
            </div>
        </section>


    );
};

