import React from "react";
import StatCard from "../Reusables/StatCard";

const Stat = () => {
  const statsData = [
    { value: "100%", label: "Fun Guranteed" },
    { value: "$2,000", label: "Win Up To" },
    { value: "100%", label: "Cultural Collaboration" },
    { value: "Amazing", label: "Experience Every Time" },
  ];
  return (
    <div className="stats-bg">
      <div className="max-w-7xl mx-auto flex flex-col justify-center items-center h-[706px] md:h-[244px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <StatCard key={index} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stat;
