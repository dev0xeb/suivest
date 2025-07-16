'use client'
import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-[400px] flex flex-col items-center text-center py-10 sm:py-16 gap-4 sm:gap-6 px-2 sm:px-0 w-full overflow-hidden">
      {/* Animated gradient background using Framer Motion */}
      <motion.div
        className="absolute inset-0 -z-10 moving-gradient opacity-80"
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ backgroundSize: "200% 200%" }}
      />
      <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight max-w-3xl">
        Turn Saving Into a Streak.<br />Grow Wealth.<br />Win Rewards.
      </h1>
      <p className="text-base xs:text-lg sm:text-xl text-gray-500 font-medium mt-2 mb-2 sm:mb-4">
        Save, Win, and Grow with No-Loss Pools
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4 w-full sm:w-auto justify-center items-center">
        <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-700 transition w-full sm:w-auto">
          Explore Saving pools
        </button>
        <button className="border border-blue-600 text-blue-600 font-semibold px-6 py-3 rounded-full bg-white hover:bg-blue-50 transition w-full sm:w-auto">
          Learn more
        </button>
      </div>
    </section>
  );
};

export default HeroSection;