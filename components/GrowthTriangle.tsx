import { Triangle } from "lucide-react";

const GrowthTriangle = ({ value }: { value: number }) => {
  const isGrowthPositive = value > 0;

  return isGrowthPositive ? (
    <Triangle className={`w-4 h-4 inline text-[#3CAB68]`} fill={"#3CAB68"} />
  ) : (
    <Triangle
      className={`w-4 h-4 inline rotate-180 text-[#FF5100]`}
      fill={"#FF5100"}
    />
  );
};

export default GrowthTriangle;
