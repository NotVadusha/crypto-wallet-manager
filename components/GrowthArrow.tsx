import BoldArrowIcon from "./icons/BoldArrowIcon";

const GrowthArrow = ({ value }: { value: number }) => {
  if (value > 0) {
    return (
      <BoldArrowIcon className="w-4 h-4 inline text-profit" />
    );
  }

  if (value < 0) {
    return (
      <BoldArrowIcon className="w-4 h-4 inline rotate-180 text-loss" />
    );
  }

  return <span className="text-muted-foreground">−</span>;
};

export default GrowthArrow;
