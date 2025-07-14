import React from "react";

const stats = [
  { value: "$4.5 Million", label: "Rewards paid" },
  { value: "$4.5 Million", label: "Total Saved" },
  { value: "0", label: "Losses Recorded" },
];

const StatsBar = () => {
  return (
    <section className="w-full flex justify-center py-6 sm:py-8 px-2">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 bg-[#E0F2FE] rounded-2xl px-4 sm:px-8 w-full max-w-4xl justify-between items-center h-[160px]">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center justify-center h-full gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#111827]">{stat.value}</span>
            <span className="text-gray-500 font-medium text-xs sm:text-base">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsBar; 