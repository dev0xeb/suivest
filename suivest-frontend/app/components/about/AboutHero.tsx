import React from "react";

const AboutHero = () => (
  <section className="flex flex-col items-center text-center py-12 gap-4 w-full">
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">Saving Should Feel Like Winning</h1>
    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-4">
      Suivest is a decentralized savings protocol that gamifies saving. Built on Sui, it rewards consistency and luck with no risk to your funds
    </p>
    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-full transition">Explore pools</button>
  </section>
);

export default AboutHero; 