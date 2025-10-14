import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";

export function AISummary() {
    return (
        <section className="w-full flex justify-center py-4 sm:py-8">
            <div className="w-[90%] max-w-[1578px] min-h-fit bg-white flex justify-center items-start p-4 sm:p-8">
                <div className="w-full max-w-[1406.57px] rounded-xl flex flex-col items-center p-4 sm:p-8 space-y-8 sm:space-y-12">
                    <div className="flex flex-col items-center text-center gap-4 relative">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] leading-tight sm:leading-[38.4px] font-jost font-bold text-black text-center px-4">
                            Smarter Decisions with{' '}
                            <span className="text-[#C71F37]">AI Summaries</span>
                            <img
                                src="/herbs-BCkTGihn.svg fill.png"
                                alt="flower icon"
                                className="absolute top-0 right-2 sm:right-4 md:right-6 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 opacity-80"
                                style={{
                                    transform: 'rotate(-7deg)',  
                                }}
                            />
                        </h2>
                        <p className="w-full max-w-[864px] text-sm sm:text-base md:text-lg lg:text-[18px] leading-relaxed sm:leading-[28px] font-inter font-normal text-gray-700 text-center px-4">
                            Our advanced AI analyzes thousands of reviews to provide clear, concise summaries that highlight what matters most to families
                        </p>
                    </div>

                    <div className="w-full flex flex-col lg:flex-row justify-between gap-8 lg:space-x-8">
                        <div className="w-full lg:w-[632.96px] min-h-fit lg:h-[505.49px] rounded-[13.19px] bg-gray-100 opacity-100 flex flex-col p-4 sm:p-6 lg:p-8 mt-8 lg:mt-20">
                            <div className="flex items-center px-2 sm:px-4 py-2 rounded-md w-fit mb-4">
                                <img
                                    src="/coma.png" 
                                    alt="Icon"
                                    className="w-5 h-6 sm:w-[23.08px] sm:h-[26.37px] mr-3"
                                />
                                <p className="text-black font-bold text-lg sm:text-xl lg:text-[26.37px] leading-tight sm:leading-[35.16px] font-inter">
                                    Traditional Reviews
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:gap-4">
                                <div className="w-full bg-white rounded-[8.79px] border-l-[4.4px] border-gray-300 p-3 sm:p-4 flex flex-col">
                                    <p className="w-full text-[#707070] italic text-sm sm:text-[15.38px] leading-relaxed sm:leading-[21.98px] font-inter mb-2 sm:mb-[11.07px]">
                                        "The staff was really nice and the food was okay. My mom seemed
                                        happy there but the building is a bit old. The nurses were attentive most
                                        of the time..."
                                    </p>
                                    <p className="w-fit text-[#707070] text-xs sm:text-[13.19px] leading-tight sm:leading-[17.58px] font-inter">
                                        - Sarah M., 2 months ago
                                    </p>
                                </div>
                                <div className="w-full bg-white rounded-[8.79px] border-l-[4.4px] border-gray-300 p-3 sm:p-4 flex flex-col">
                                    <p className="w-full text-[#707070] italic text-sm sm:text-[15.38px] leading-relaxed sm:leading-[21.98px] font-inter mb-2 sm:mb-[8px]">
                                        "Great place overall. Dad loves the activities and the physical therapy
                                        helped him a lot. Could use some updates to the rooms though..."
                                    </p>
                                    <p className="w-fit text-[#707070] text-xs sm:text-[13.19px] leading-tight sm:leading-[17.58px] font-inter">
                                        - Michael R., 1 month ago
                                    </p>
                                </div>
                                <div className="w-full bg-white rounded-[8.79px] border-l-[4.4px] border-gray-300 p-3 sm:p-4 flex flex-col">
                                    <p className="w-full text-[#707070] italic text-sm sm:text-[15.38px] leading-relaxed sm:leading-[21.98px] font-inter mb-2 sm:mb-[8px]">
                                        "Clean facility with caring staff. The visiting hours are flexible which is great for our family. Meals could be better but overall satisfied..."
                                    </p>
                                    <p className="w-fit text-[#707070] text-xs sm:text-[13.19px] leading-tight sm:leading-[17.58px] font-inter">
                                        - Jennifer L., 3 weeks ago
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* AI-Powered Summary Section */}
                        <div className="w-full lg:w-[632.96px] min-h-fit lg:h-[661.53px] rounded-[13.19px] bg-gradient-to-br from-[#EFF6FF] to-[#FAF5FF] opacity-100 flex flex-col items-start p-4 sm:p-6 space-y-4 sm:space-y-6">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <img
                                    src="/brain.png"
                                    alt="AI Icon"
                                    className="w-6 h-6 sm:w-[26.37px] sm:h-[26.37px] opacity-100"
                                />
                                <h3 className="text-[#212121] font-inter font-bold text-lg sm:text-xl lg:text-[26.37px] leading-tight sm:leading-[35.16px]">
                                    AI-Powered Summary
                                </h3>
                            </div>

                            {/* Pros Section */}
                            <div className="w-full bg-[#F0FDF4] rounded-[8.79px] border border-[#BBF7D0] p-3 sm:p-4 flex flex-col space-y-3 sm:space-y-4">
                                <div className="flex items-center gap-2 pt-2 sm:pt-[18.68px] pl-2 sm:pl-[18.68px]">
                                    <img
                                        src="/like.png"
                                        alt="Icon"
                                        className="w-4 h-4 sm:w-[17.58px] sm:h-[17.58px]"
                                    />
                                    <h4 className="font-inter font-bold text-sm sm:text-base lg:text-[17.58px] leading-tight sm:leading-[26.37px] text-[#166534]">
                                        Pros (Based on 47 reviews)
                                    </h4>
                                </div>

                                <div className="w-full bg-[#F0FDF4] rounded-md pt-2 sm:pt-[18.68px] pl-2 sm:pl-[18.68px] flex flex-col gap-2">
                                    <div className="flex items-start gap-2 w-full">
                                        <img
                                            src="/right.png"
                                            alt="Check Icon"
                                            className="w-4 h-4 sm:w-[15.38px] sm:h-[15.38px] mt-1 flex-shrink-0"
                                        />
                                        <p className="text-[#15803D] font-inter font-normal text-sm sm:text-base lg:text-[17.58px] leading-relaxed sm:leading-[26.37px]">
                                            Caring and attentive nursing staff (mentioned in 89% of reviews)
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2 w-full">
                                        <img
                                            src="/right.png"
                                            alt="Check Icon"
                                            className="w-4 h-4 sm:w-[15.38px] sm:h-[15.38px] mt-1 flex-shrink-0"
                                        />
                                        <p className="text-[#15803D] font-inter font-normal text-sm sm:text-base lg:text-[17.58px] leading-relaxed sm:leading-[26.37px]">
                                            Excellent rehabilitation and physical therapy programs
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2 w-full">
                                        <img
                                            src="/right.png"
                                            alt="Check Icon"
                                            className="w-4 h-4 sm:w-[15.38px] sm:h-[15.38px] mt-1 flex-shrink-0"
                                        />
                                        <p className="text-[#15803D] font-inter font-normal text-sm sm:text-base lg:text-[17.58px] leading-relaxed sm:leading-[26.37px]">
                                            Flexible visiting hours and family-friendly policies
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2 w-full">
                                        <img
                                            src="/right.png"
                                            alt="Check Icon"
                                            className="w-4 h-4 sm:w-[15.38px] sm:h-[15.38px] mt-1 flex-shrink-0"
                                        />
                                        <p className="text-[#15803D] font-inter font-normal text-sm sm:text-base lg:text-[17.58px] leading-relaxed sm:leading-[26.37px]">
                                            Clean and well-maintained common areas
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Areas for Improvement Section */}
                            <div className="w-full bg-[#FFF7ED] rounded-[8.79px] border border-[#FED7AA] p-3 sm:p-4">
                                <div className="flex items-center gap-2 pt-2 sm:pt-[18.68px] pl-2 sm:pl-[18.68px]">
                                    <img
                                        src="/improvement.png"
                                        alt="Improvement Icon"
                                        className="w-4 h-4 sm:w-[17.58px] sm:h-[17.58px] opacity-100"
                                    />
                                    <h4 className="font-inter font-bold text-sm sm:text-base lg:text-[17.58px] leading-tight sm:leading-[26.37px] text-[#9A3412]">
                                        Areas for Improvement
                                    </h4>
                                </div>
                                <div className="w-full pl-2 sm:pl-[18.68px] mt-2 sm:mt-[18.68px] flex flex-col gap-2">
                                    <div className="flex items-start gap-2 w-full">
                                        <img
                                            src="/Vector.png"
                                            alt="Item Icon"
                                            className="w-4 h-4 sm:w-[15.38px] sm:h-[15.38px] mt-1 flex-shrink-0"
                                        />
                                        <p className="font-inter text-sm sm:text-base lg:text-[17.58px] leading-relaxed sm:leading-[26.37px] text-[#9A3412]">
                                            Older building infrastructure needs updating
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2 w-full">
                                        <img
                                            src="/Vector.png"
                                            alt="Item Icon"
                                            className="w-4 h-4 sm:w-[15.38px] sm:h-[15.38px] mt-1 flex-shrink-0"
                                        />
                                        <p className="font-inter text-sm sm:text-base lg:text-[17.58px] leading-relaxed sm:leading-[26.37px] text-[#9A3412]">
                                            Dining options could be more varied and flavorful
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Overall Sentiment Score Section */}
                            <div className="w-full rounded-[8.79px] border-[1.1px] border-[#BFDBFE] bg-[#EFF6FF] opacity-100 p-3 sm:p-4">
                                <h4 className="font-inter font-bold text-sm sm:text-base lg:text-[17.58px] leading-tight sm:leading-[26.37px] text-[#198754] mt-2 sm:mt-[18.68px]">
                                    Overall Sentiment Score
                                </h4>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-3 sm:mt-[20px]">
                                    <div className="w-full sm:w-[395.70px] h-[13.19px] bg-[#E5E7EB] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#198754] rounded-full transition-all duration-500" style={{ width: '78%' }} />
                                    </div>
                                    <span className="font-inter font-bold text-sm sm:text-base lg:text-[17.58px] leading-tight sm:leading-[26.37px] text-[#198754]">
                                        78% Positive
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How Our AI Works Section */}
                    <div className="w-full max-w-[984.6px] min-h-fit rounded-[13.19px] bg-gray-100 flex flex-col items-center justify-center gap-4 sm:gap-6 mx-auto p-4 sm:p-6">
                        <h3 className="font-inter font-bold text-lg sm:text-xl lg:text-[26.37px] leading-tight sm:leading-[35.16px] text-[#212121] text-center">
                            How Our AI Works
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center max-w-[300px] mx-auto">
                                <div className="w-12 h-12 sm:w-[52.74px] sm:h-[52.74px] rounded-full flex items-center justify-center" style={{ backgroundColor: '#FAE8EB' }}>
                                    <img
                                        src="/ai_work1.png"
                                        alt="Data collection"
                                        className="w-4 h-4 sm:w-[15.38px] sm:h-[17.58px]"
                                    />
                                </div>
                                <h4 className="font-inter font-semibold text-sm sm:text-base lg:text-[17.58px] leading-tight sm:leading-[26.37px] text-[#212121] mt-3 sm:mt-4">
                                    Data Collection
                                </h4>
                                <p className="font-inter text-xs sm:text-sm lg:text-[15.38px] leading-relaxed sm:leading-[21.98px] text-[#707070] mt-2 text-center">
                                    Analyzes reviews from Google, CMS reports, and facility data
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center max-w-[300px] mx-auto">
                                <div className="w-12 h-12 sm:w-[52.74px] sm:h-[52.74px] rounded-full flex items-center justify-center" style={{ backgroundColor: '#FAE8EB' }}>
                                    <img src="/ai_work2.png" alt="Analysis" className="w-5 h-4 sm:w-[21.98px] sm:h-[17.58px]" />
                                </div>
                                <h4 className="font-inter font-semibold text-sm sm:text-base lg:text-[17.58px] leading-tight sm:leading-[26.37px] text-[#212121] mt-3 sm:mt-4">
                                    Smart Analysis
                                </h4>
                                <p className="font-inter text-xs sm:text-sm lg:text-[15.38px] leading-relaxed sm:leading-[21.98px] text-[#707070] mt-2 text-center">
                                    Our AI processes data to find trends and key insights
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center max-w-[300px] mx-auto">
                                <div className="w-12 h-12 sm:w-[52.74px] sm:h-[52.74px] rounded-full flex items-center justify-center" style={{ backgroundColor: '#FAE8EB' }}>
                                    <img src="/ai_work3.png" alt="Summary" className="w-3 h-4 sm:w-[13.19px] sm:h-[17.58px]" />
                                </div>
                                <h4 className="font-inter font-semibold text-sm sm:text-base lg:text-[17.58px] leading-tight sm:leading-[26.37px] text-[#212121] mt-3 sm:mt-4">
                                    Clear Insights
                                </h4>
                                <p className="font-inter text-xs sm:text-sm lg:text-[15.38px] leading-relaxed sm:leading-[21.98px] text-[#707070] mt-2 text-center">
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