import React from 'react';

const ShimmerLine: React.FC<{ width: string; height: string; mt?: string; }> = ({ width, height, mt = 'mt-0' }) => (
    <div className={`animated-background ${width} ${height} rounded ${mt}`} />
);

const ReviewCardSkeleton: React.FC = () => (
    <div className="flex items-start mt-8 pb-8 border-b-[1.19px] border-gray-300 last:border-b-0">
        <div className="w-12 h-12 md:w-[57.29px] md:h-[57.29px] rounded-full bg-[#eeeeee] flex-shrink-0 animated-background" />
        <div className="flex flex-col ml-4 md:ml-[20px] flex-grow">
            <ShimmerLine width="w-2/5" height="h-6" /> 
            <ShimmerLine width="w-1/4" height="h-4" mt="mt-2" />
            <ShimmerLine width="w-full" height="h-4" mt="mt-3" />
            <ShimmerLine width="w-11/12" height="h-4" mt="mt-2" />
            <ShimmerLine width="w-3/4" height="h-4" mt="mt-2" />
        </div>
    </div>
);

const FacilityReviewSkeleton: React.FC = () => {
    return (
        <section className="w-full min-h-screen bg-white p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-7xl mx-auto flex flex-col">
                {/* Header Section */}
                <div className="mb-6 md:mb-8">
                    <ShimmerLine width="w-1/2 md:w-1/4" height="h-8 md:h-10" mt="mb-3 md:mb-4" />
                    <ShimmerLine width="w-3/4 md:w-2/5" height="h-5 md:h-6" />
                </div>
                
                {/* Main Content Grid */}
                <div className="flex flex-col lg:flex-row gap-6 flex-grow">
                    {/* Left Column - Reviews */}
                    <div className="w-full lg:flex-1 bg-white rounded-lg sm:rounded-[9.55px] shadow-[0px_1.19px_2.39px_0px_#0000000D] p-4 sm:p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-4 flex-shrink-0">
                            <ShimmerLine width="w-1/2 md:w-1/4" height="h-7 md:h-8" />
                            <ShimmerLine width="w-1/3 md:w-1/5" height="h-5 md:h-6" />
                        </div>
                        <div className="flex-grow overflow-y-auto pr-2 sm:pr-4"> 
                            {[...Array(5)].map((_, i) => <ReviewCardSkeleton key={i} />)}
                        </div>
                        <div className="mt-4">
                            <ShimmerLine width="w-32 md:w-[154.57px]" height="h-7 md:h-[28.65px]" />
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="w-full lg:w-auto flex flex-col gap-6">
                        {/* Facility Info Card */}
                        <div className="w-full lg:w-[458.34px] bg-[#F5F5F5] rounded-lg sm:rounded-[9.55px] p-4 flex flex-col">
                            <ShimmerLine width="w-1/2 md:w-1/2" height="h-7 md:h-8" mt="mt-3 md:mt-5 mb-4" />
                            <ShimmerLine width="w-full" height="h-4" mt="mb-2" />
                            <ShimmerLine width="w-full" height="h-4" mt="mb-2" />
                            <ShimmerLine width="w-full" height="h-4" mt="mb-2" />
                            <ShimmerLine width="w-1/3" height="h-4" mt="mb-2" />

                            <ShimmerLine width="w-1/3 md:w-1/4" height="h-5 md:h-6" mt="mt-4 md:mt-7 mb-4" />
                            <ShimmerLine width="w-2/3" height="h-4" mt="mb-2" />
                            <ShimmerLine width="w-3/4" height="h-4" mt="mb-2" />
                            <ShimmerLine width="w-1/4" height="h-4" mt="mb-2" />
                        </div>                        
                        
                        {/* Contact Card */}
                        <div className="w-full lg:w-[458.34px] rounded-lg sm:rounded-[9.55px] bg-white border border-[#E5E7EB] shadow-[0px_1.19px_2.39px_0px_#0000000D] p-4 sm:p-6">
                            <ShimmerLine width="w-1/2 md:w-1/2" height="h-7 md:h-8" mt="mb-4 md:mb-6" />
                            <ShimmerLine width="w-full" height="h-4" mt="mt-3" />
                            <ShimmerLine width="w-full" height="h-4" mt="mt-3" />
                            <ShimmerLine width="w-full" height="h-4" mt="mt-3" />
                            <ShimmerLine width="w-full" height="h-4" mt="mt-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FacilityReviewSkeleton;