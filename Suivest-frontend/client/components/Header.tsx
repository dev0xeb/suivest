import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Wallet, Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress] = useState("0x1234...5678");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Pools", href: "/pools" },
    { name: "About", href: "/about" }, 
    { name: "Dashboard", href: "/dashboard" },
    { name: "Docs", href: "/docs" },
  ];

  const handleWalletConnect = () => {
    setIsWalletConnected(!isWalletConnected);
  };

  return (
    <header className="bg-web3-dark sticky top-0 z-50 w-full glass-dark border-b border-web3-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/ChatGPT_Image_Jul_23__2025__04_20_53_PM-removebg-preview.png" 
              alt="Suivest Logo" 
              className="w-[70px] h-[70px] object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-300 hover:text-electric hover:glow-blue transition-all duration-300 font-medium relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric to-purple transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Wallet Connect Button */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <div className="text-xs text-gray-400 font-mono-crypto">
              <div>Block: #2,847,391</div>
            </div> */}
            <Button
              onClick={handleWalletConnect}
              className="bg-gradient-to-r from-electric to-purple hover:from-electric/90 hover:to-purple/90 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 btn-glow border border-electric/20 hover:border-electric/40"
            >
              <Wallet className="w-4 h-4" />
              <span className="font-medium">
                {isWalletConnected ? (
                  <span className="font-mono-crypto">{walletAddress}</span>
                ) : (
                  "Connect Wallet"
                )}
              </span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-electric transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-dark border-t border-web3-border">
          <nav className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block text-gray-300 hover:text-electric transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-web3-border">
              <div className="text-xs text-gray-400 font-mono-crypto mb-3">
                Block: #2,847,391
              </div>
              <Button
                onClick={handleWalletConnect}
                className="w-full bg-gradient-to-r from-electric to-purple hover:from-electric/90 hover:to-purple/90 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 border border-electric/20"
              >
                <Wallet className="w-4 h-4" />
                <span className="font-medium">
                  {isWalletConnected ? (
                    <span className="font-mono-crypto">{walletAddress}</span>
                  ) : (
                    "Connect Wallet"
                  )}
                </span>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
