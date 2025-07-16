'use client'
import Image from "next/image";
import images from "@/app/assets/image";
import React, { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Pools", href: "/pools" },
  { label: "About", href: "/about" },
  { label: "Account", href: "#" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#E0F2FE] backdrop-blur px-4 sm:px-8 py-4 rounded-2xl mt-0 sm:mt-6 mx-auto max-w-6xl shadow-sm w-full">
      <div className="flex items-center justify-between w-full relative">
        {/* Logo (left) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Image src={images.logo} alt="Suivest Logo" width={40} height={40} />
          <span className="font-bold text-lg tracking-tight text-gray-900">suivest</span>
        </div>
        {/* Nav links (center) */}
        <ul className="hidden sm:flex flex-row items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.label === "Pools" || link.label === "Home" ? (
                <Link href={link.href} className="hover:text-blue-600 transition text-base font-medium text-[#111827]">
                  {link.label}
                </Link>
              ) : (
                <a href={link.href} className="hover:text-blue-600 transition text-base font-medium text-[#111827]">
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        {/* Connect Wallet button (right) */}
        <div className="hidden sm:flex flex-shrink-0">
          <button className="bg-[#3B82F6] text-white font-semibold px-6 py-2 rounded-full shadow">
            Connect wallet
          </button>
        </div>
        {/* Hamburger button for mobile */}
        <button
          className="sm:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
        >
          <svg className="h-6 w-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
        {/* Mobile menu */}
        {menuOpen && (
          <ul className="flex flex-col sm:hidden absolute left-0 top-full w-full bg-white/90 rounded-xl p-4 shadow z-40">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.label === "Pools" || link.label === "Home" ? (
                  <Link href={link.href} className="hover:text-blue-600 transition block py-2 text-base font-medium text-gray-800">
                    {link.label}
                  </Link>
                ) : (
                  <a href={link.href} className="hover:text-blue-600 transition block py-2 text-base font-medium text-gray-800">
                    {link.label}
                  </a>
                )}
              </li>
            ))}
            <li className="w-full mt-2">
              <button className="bg-gradient-to-r from-blue-400 to-blue-300 text-white font-semibold px-4 py-2 rounded-full shadow hover:from-blue-500 hover:to-blue-400 transition w-full">
                Connect wallet
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
