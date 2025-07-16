import React from "react";
import PoolHeadline from "./PoolHeadline";

const PoolShowcase = () => (
  <section className="flex flex-col items-center justify-center py-12 w-full">
    <PoolHeadline />
    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-full mb-10 transition">Deposit Now</button>
    <div className="relative flex items-center justify-center w-full">
      {/* Left Arrow */}
      <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-400 absolute left-[-60px] top-1/2 -translate-y-1/2 shadow hover:bg-blue-100 transition">
        <span className="text-2xl">&#8592;</span>
      </button>
      {/* Pool Info Card */}
      <div className="bg-[#181E29] rounded-2xl px-8 py-10 w-full max-w-xl flex flex-col items-center shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-block text-blue-400 text-2xl">💧</span>
          <span className="bg-[#232B3E] text-blue-100 font-bold px-6 py-2 rounded-full text-lg tracking-wide">SUI</span>
        </div>
        <div className="w-full flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Total Deposits(TVL)</span>
            <span className="text-blue-400 font-bold flex items-center gap-1">💧 1,000,000</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Total Poolers</span>
            <span className="text-yellow-400 font-bold">500</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">7D Pool Yield</span>
            <span className="text-yellow-400 font-bold">$2,000 <span className="text-xs font-normal">(3.0% APR)</span></span>
          </div>
        </div>
      </div>
      {/* Right Arrow */}
      <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-400 absolute right-[-60px] top-1/2 -translate-y-1/2 shadow hover:bg-blue-100 transition">
        <span className="text-2xl">&#8594;</span>
      </button>
    </div>
  </section>
);

export default PoolShowcase; 