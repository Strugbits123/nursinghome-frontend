import React from 'react';
// Ensure SkeletonShimmer.css is imported somewhere globally or directly here

const ShimmerLine: React.FC<{ width: string; height: string; mt?: string; }> = ({ width, height, mt = 'mt-0' }) => (
    <div className={`animated-background ${width} ${height} rounded ${mt}`} />
);

const ReviewCardSkeleton: React.FC = () => (
    <div className="flex items-start mt-8 pb-8 border-b-[1.19px] border-gray-300 last:border-b-0">
        <div className="w-[57.29px] h-[57.29px] rounded-full bg-[#eeeeee] flex-shrink-0 animated-background" />

        <div className="flex flex-col ml-[20px] flex-grow">
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
        <section className="max-w-[1714px] h-[1314px] mx-auto bg-white p-8">
            <div className="w-[1527.8px] h-full mx-auto p-6 flex flex-col">
                <ShimmerLine width="w-1/4" height="h-10" mt="mb-4 ml-[50px]" />
                <ShimmerLine width="w-2/5" height="h-6" mt="ml-[50px] mb-8" />
                
                <div className="flex gap-6 flex-grow">
                    <div className="flex-1 w-[954.87px] h-[1097.81px] bg-white rounded-[9.55px] shadow-[0px_1.19px_2.39px_0px_#0000000D] ml-10 p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-4 flex-shrink-0">
                            <ShimmerLine width="w-1/4" height="h-8" />
                            <ShimmerLine width="w-1/5" height="h-6" />
                        </div>
                        <div className="flex-grow overflow-y-auto pr-4"> 
                            {[...Array(5)].map((_, i) => <ReviewCardSkeleton key={i} />)}
                        </div>
                        <ShimmerLine width="w-[154.57px]" height="h-[28.65px]" mt="mt-4" />
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="w-[458.34px] h-[486.98px] bg-[#F5F5F5] rounded-[9.55px] p-4 flex flex-col">
                             <ShimmerLine width="w-1/2" height="h-8" mt="mt-5 mb-4 ml-4" />
                             <ShimmerLine width="w-11/12" height="h-4" mt="mb-2 ml-4" />
                             <ShimmerLine width="w-11/12" height="h-4" mt="mb-2 ml-4" />
                             <ShimmerLine width="w-11/12" height="h-4" mt="mb-2 ml-4" />
                             <ShimmerLine width="w-1/3" height="h-4" mt="mb-2 ml-4" />

                             <ShimmerLine width="w-1/4" height="h-6" mt="mt-7 mb-4 ml-4" />
                             <ShimmerLine width="w-2/3" height="h-4" mt="mb-2 ml-4" />
                             <ShimmerLine width="w-3/4" height="h-4" mt="mb-2 ml-4" />
                             <ShimmerLine width="w-1/4" height="h-4" mt="mb-2 ml-4" />
                        </div>                        
                        <div className="w-[458.34px] h-[286.46px] rounded-[9.55px] bg-white border border-[#E5E7EB] shadow-[0px_1.19px_2.39px_0px_#0000000D] p-6">
                             <ShimmerLine width="w-1/2" height="h-8" mt="mb-6" />
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