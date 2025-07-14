import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-10 px-4 flex flex-col md:flex-row items-center md:items-end justify-between w-full mt-0 gap-6 md:gap-0">
      <div className="flex flex-col items-center md:items-start gap-2">
        <span className="text-2xl sm:text-4xl font-extrabold tracking-tight">SUIVEST</span>
        <span className="text-xs">© 2025SUIVEST. All Rights Reserved</span>
      </div>
      <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2">
        <a href="#" className="hover:underline">X/Twitter</a>
        <a href="#" className="hover:underline">Telegram</a>
        <a href="#" className="hover:underline">Discord</a>
      </div>
    </footer>
  );
};

export default Footer; 