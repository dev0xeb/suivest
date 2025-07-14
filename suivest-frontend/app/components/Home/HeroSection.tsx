import React from "react";

const HeroSection = () => {
  return (
    <section className="flex flex-col items-center text-center py-10 sm:py-16 gap-4 sm:gap-6 px-2 sm:px-0 w-full">
      <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#111827] leading-tight max-w-3xl">
        Turn Savings Into a Streak. <br />Grow Wealth.<br />Win Rewards.
      </h1>
      <p className="text-base xs:text-lg sm:text-xl text-gray-500 font-bold mt-2 mb-2 sm:mb-4">
        Save, Win, and Grow with No-Loss Pools
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4 w-full sm:w-auto justify-center items-center">
        <button className="bg-[#111827] text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-800 transition w-full sm:w-auto">Explore Saving pools</button>
        <button className="border border-[#111827] text-[#111827] font-semibold px-6 py-3 rounded-full bg-white hover:bg-gray-50 transition w-full sm:w-auto">Learn more</button>
      </div>
    </section>
  );
};

export default HeroSection; 