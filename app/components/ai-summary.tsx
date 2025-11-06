import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import AdUnit from "../components/AdUnit";

export function AISummary() {
    return (
        <section className="w-full flex justify-center py-4 sm:py-8">
      <div className="relative w-full min-h-fit bg-white flex justify-center items-start p-4 sm:p-8 mx-auto">

        {/* ✅ Left Skyscraper Ad — md+ screens */}
      
        {/* <div className="
            hidden md:flex left-ad
            mt-20
            w-[120px] h-[600px]       
            md:w-[120px] md:h-[900px] md:mt-20
            lg:w-[200px] lg:h-[1000px] lg:mt-20
            justify-center items-start
             border-gray-300 rounded-md 
            bg-[#fafafa] transition-all duration-300
            mr-6"
            style={{ marginTop: '10rem' }}>
        <AdUnit adSlot="3645692031" layout="skyscraperMain" />
        </div> */}


       
            <div
                className="
                w-full
                max-w-[1200px]
                mx-auto
                flex flex-col
                items-center
                p-4 sm:p-6 lg:p-8
                space-y-8 sm:space-y-12
                relative
                z-10
                "
                style={{
                marginLeft: 'max(10px, 2vw)',
                marginRight: 'max(10px, 2vw)',
                }}
            >
                {/* === HEADING === */}
                <div className="w-full mx-auto flex flex-col items-center text-center gap-4 relative px-0 sm:px-0 md:px-8 lg:px-0">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-jost font-bold text-black text-center">
                        Our Advanced{" "}
                        <span className="relative text-[#C71F37] inline-block">
                        AI Technology
                        <Image
                            src="/herbs-BCkTGihn.svg fill.png"
                            alt="herb icon"
                            width={40}
                            height={40}
                            className="absolute -top-3 -right-5 md:-top-4 md:-right-6 w-8 h-8 md:w-10 md:h-10 opacity-90 rotate-[-7deg]"
                        />
                        </span>
                    </h2>

                    <p className="max-w-[864px] text-sm sm:text-base md:text-lg lg:text-[18px] text-gray-700 text-center">
                        Our advanced AI processes thousands of reviews to deliver clear and concise summaries that focus on the most important factors for families.
                    </p>
                </div>

                {/* === MAIN CONTENT === */}
                <div
                    className="
                        w-full
                        flex
                        flex-col md:flex-row
                        justify-center
                        items-start
                        gap-8 md:gap-10 lg:gap-12
                        px-0 sm:px-[40px] md:px-[70px] lg:px-[60px]
                        mt-10
                    "
                    >
                    {/* === Traditional Reviews === */}
                    <div
                        className="
                        flex-1
                        w-full
                        sm:w-[85%]
                        md:w-[48%]
                        lg:w-[44%]
                        max-w-[540px]
                        rounded-[13.19px]
                        bg-gray-100
                        flex flex-col
                        p-4 sm:p-6 lg:p-8
                        mx-auto
                        "
                    >
                <div className="flex items-center px-2 sm:px-4 py-2 rounded-md w-fit mb-4">
                    <img
                    src="/coma.png"
                    alt="Icon"
                    className="w-5 h-6 sm:w-[23.08px] sm:h-[26.37px] mr-3"
                    />
                    <p className="text-black font-bold text-lg sm:text-xl lg:text-[26.37px] font-inter">
                    Traditional Reviews
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {[
                    {
                        text: `"The staff was really nice and the food was okay. My mom seemed happy there but the building is a bit old. The nurses were attentive most of the time..."`,
                        author: "- Sarah M., 2 months ago",
                    },
                    {
                        text: `"Great place overall. Dad loves the activities and the physical therapy helped him a lot. Could use some updates to the rooms though..."`,
                        author: "- Michael R., 1 month ago",
                    },
                    {
                        text: `"Clean facility with caring staff. The visiting hours are flexible which is great for our family. Meals could be better but overall satisfied..."`,
                        author: "- Jennifer L., 3 weeks ago",
                    },
                    ].map((review, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-[8.79px] border-l-[4.4px] border-gray-300 p-4 flex flex-col"
                    >
                        <p className="text-[#707070] italic text-[15px] leading-relaxed mb-2">
                        {review.text}
                        </p>
                        <p className="text-[#707070] text-[13px] leading-tight">
                        {review.author}
                        </p>
                    </div>
                    ))}
                </div>
                </div>

                {/* === AI-Powered Summary === */}
                 <div
                    className="
                    flex-1
                    w-full
                    sm:w-[85%]
                    md:w-[48%]
                    lg:w-[44%]
                    max-w-[540px]
                    rounded-[13.19px]
                    bg-gradient-to-br
                    from-[#EFF6FF]
                    to-[#FAF5FF]
                    flex flex-col
                    items-start
                    p-4 sm:p-6 lg:p-8
                    space-y-4 sm:space-y-6
                    mx-auto
                    "
                >
                <div className="flex items-center gap-2 sm:gap-3">
                    <img
                    src="/brain.png"
                    alt="AI Icon"
                    className="w-6 h-6 sm:w-[26.37px] sm:h-[26.37px]"
                    />
                    <h3 className="text-[#212121] font-inter font-bold text-lg sm:text-xl lg:text-[26.37px]">
                    AI-Powered Summary
                    </h3>
                </div>

                <div className="w-full bg-[#F0FDF4] rounded-[8.79px] border border-[#BBF7D0] p-3 sm:p-4 flex flex-col space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 pt-2 sm:pt-[18.68px] pl-2 sm:pl-[18.68px]">
                        <img
                            src="/like.png"
                            alt="Icon"
                            className="w-4 h-4 sm:w-[17.58px] sm:h-[17.58px]"
                        />
                        <h4 className="font-inter font-bold text-sm sm:text-base lg:text-[17.58px] text-[#166534]">
                            Pros (Based on 47 reviews)
                        </h4>
                        </div>

                        <div className="pl-4 flex flex-col gap-2">
                        {[
                            "Caring and attentive nursing staff (mentioned in 89% of reviews)",
                            "Excellent rehabilitation and physical therapy programs",
                            "Flexible visiting hours and family-friendly policies",
                            "Clean and well-maintained common areas",
                        ].map((pro, i) => (
                            <div key={i} className="flex items-start gap-2 w-full">
                            <img
                                src="/right.png"
                                alt="Check Icon"
                                className="w-4 h-4 mt-1 flex-shrink-0"
                            />
                            <p className="text-[#15803D] font-inter text-sm sm:text-base lg:text-[17.58px] leading-relaxed">
                                {pro}
                            </p>
                            </div>
                        ))}
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
                <div className="w-full max-w-[984.6px] min-h-fit rounded-[13.19px] bg-gray-100 flex flex-col items-center justify-center gap-4 sm:gap-6 mx-auto p-4 sm:p-6 sm:w-[75%]">
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
                                Data Collections
                            </h4>
                            <p className="font-inter text-xs sm:text-sm lg:text-[15.38px] leading-relaxed sm:leading-[21.98px] text-[#707070] mt-2 text-center">
                                We gather and process key data from CMS 5-Star ratings, Google Reviews, and other trusted sources to create a comprehensive profile for each facility.
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
                                Our AI analyzes all collected data to identify patterns, trends, and unique insights, giving you a clearer picture of each nursing home’s performance.
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
                                We present this data as simple, digestible summaries that highlight the pros and cons of each facility, along with key strengths and concerns.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* ✅ Right Skyscraper Ad — md+ screens */}
                    
                    {/* <div className="
                        hidden md:flex right-ad
                        mt-20
                        w-[120px] h-[600px]       
                        md:w-[120px] md:h-[900px] md:mt-20
                        lg:w-[200px] lg:h-[1000px] lg:mt-20
                        justify-center items-start
                        border-gray-300 rounded-md 
                        bg-[#fafafa] transition-all duration-300
                    ">
                    <AdUnit adSlot="3645692031" layout="skyscraper" />
                    </div> */}


            </div>
        </section>
    );
};