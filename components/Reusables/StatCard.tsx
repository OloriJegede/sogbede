import React from "react";

interface StatCardProps {
  value: string;
  label: string;
}

const StatCard = ({ value, label }: StatCardProps) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-[#FAFAFA] text-[48px] skranji">{value}</div>
      <div className="text-[#FAFAFA] text-[16px]">{label}</div>
    </div>
  );
};

export default StatCard;
