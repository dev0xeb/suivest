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
    { name: "Dashboard", href: "/dashboard" },
    { name: "About", href: "/about" },
    { name: "Docs", href: "/docs" },
  ];

  const handleWalletConnect = () => {
    setIsWalletConnected(!isWalletConnected);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-electric to-teal rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Suivest</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-600 hover:text-electric transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Wallet Connect Button */}
          <div className="hidden md:flex items-center">
            <Button
              onClick={handleWalletConnect}
              className="bg-electric hover:bg-electric/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
            >
              <Wallet className="w-4 h-4" />
              <span>
                {isWalletConnected ? walletAddress : "Connect Wallet"}
              </span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block text-gray-600 hover:text-electric transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Button
              onClick={handleWalletConnect}
              className="w-full bg-electric hover:bg-electric/90 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 mt-4"
            >
              <Wallet className="w-4 h-4" />
              <span>
                {isWalletConnected ? walletAddress : "Connect Wallet"}
              </span>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
