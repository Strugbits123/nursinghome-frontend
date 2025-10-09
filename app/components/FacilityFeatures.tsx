import Image from "next/image";

interface Feature {
  key: string; 
  label: string;
  icon: string;
}

interface FacilityFeaturesProps {
  title: string;
  features: Feature[];
  facilityData: Record<string, any>; // your API response object
}

const FacilityFeatures = ({ title, features, facilityData }: FacilityFeaturesProps) => {
  return (
    <div className="w-[706.6px] h-[334.2px] bg-white rounded-[9.55px] shadow-[0px_1.19px_2.39px_0px_#0000000D] p-6">
      <h3 className="font-inter font-bold text-[23.87px] leading-[33.42px] text-[#111827] mb-4">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-[#F5F5F5] rounded-[9.55px] flex items-center p-4">
            <Image
              src={feature.icon}
              alt={feature.label}
              width={21}
              height={24}
              className="w-[27px] h-[23.87px] mr-3"
            />
            <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-black">
              {facilityData[feature.key] ?? feature.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacilityFeatures;
