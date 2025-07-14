import React from "react";
import icons from '../../assets/icons'

const features = [
  {
    icon: icons.gamePad,
    title: "Gamified Savings Pools",
    desc: "Participate in interactive savings pools with exciting challenges and rewards, making saving fun and engaging.",
  },
  {
    icon: icons.tokens,
    title: "Token Rewards",
    desc: "Earn tokens as you reach your savings goals, incentivizing consistent saving habits within the Web3 ecosystem.",
  },
  {
    icon: icons.shield,
    title: "Secure and Transparent",
    desc: "Leverage the security of blockchain technology to ensure the safety and transparency of your savings.",
  },
  {
    icon: icons.chart,
    title: "Decentralized Finance",
    desc: "Experience the benefits of DeFi with higher yields and greater control over your financial assets.",
  },
];

const Features = () => {
  return (
    <section className="py-10 sm:py-16 max-w-5xl mx-auto w-full px-2 sm:px-0">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 sm:mb-10 text-left">Features of Suivest</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
        {features.map((feature) => (
          <div key={feature.title} className="flex items-start  gap-3 sm:gap-4">
            <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center bg-[#1E3A8A] rounded-xl text-xl sm:text-2xl">
              <img src={feature.icon.src} alt={feature.title + ' icon'} className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-1">{feature.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-snug">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features; 