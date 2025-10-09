interface ReviewDistributionProps {
  reviews: { rating: number }[];
}

const ReviewDistribution: React.FC<ReviewDistributionProps> = ({ reviews }) => {
  const reviewCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length
  }));

  const maxCount = Math.max(...reviewCounts.map(r => r.count), 1);

  return (
    <div className="w-[458.34px] h-auto rounded-[9.55px] bg-white border border-[#E5E7EB] shadow-[0px_1.19px_2.39px_0px_#0000000D] p-6">
      <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-[#111827] mb-6">
        Review Distribution
      </h3>

      {reviewCounts.map(({ star, count }) => {
        const barWidth = (count / maxCount) * 317.22; // proportional width
        return (
          <div className="flex items-center space-x-4 mt-3" key={star}>
            <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#000000] mr-8">
              {star}★
            </span>
            <div className="relative w-[317.22px] h-[9.55px] bg-[#E5E7EB] rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-[#FACC15] rounded-full transition-all duration-300"
                style={{ width: `${barWidth}px` }}
              ></div>
            </div>
            <span className="font-inter font-normal text-[16.71px] leading-[23.87px] text-[#4B5563]">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewDistribution;
