import React from "react";

const features = [
  {
    icon: "💧",
    title: "No-Loss Model",
    desc: "Your funds stay safe. We only use yield to reward winners.",
  },
  {
    icon: "🔥",
    title: "Streak Rewards",
    desc: "Keep saving, and earn $SVT even if you don't win.",
  },
  {
    icon: "🪐",
    title: "Gamified Savings",
    desc: "Boost your odds, hit streaks, climb leaderboards.",
  },
  {
    icon: "🌐",
    title: "Built on Sui",
    desc: "Fast, low-fee, and scalable infrastructure for the future.",
  },
];

const AboutWhySuivestGrid = () => (
  <section className="w-full max-w-5xl mx-auto py-12">
    <h2 className="text-2xl font-bold mb-8">Why SUIVEST?</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {features.map((feature) => (
        <div key={feature.title} className="bg-blue-100 rounded-2xl p-6 flex flex-col items-center text-center gap-2">
          <span className="text-3xl">{feature.icon}</span>
          <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
          <p className="text-gray-700 text-sm">{feature.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default AboutWhySuivestGrid; 