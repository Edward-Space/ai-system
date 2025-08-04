"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Pricing", href: "#pricing" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Dynamic Island Header */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className={`
          transition-all duration-500 ease-out
          ${isScrolled 
            ? 'bg-black/10 backdrop-blur-xl border border-white/10' 
            : 'bg-transparent backdrop-blur-md border border-white/5'
          }
          rounded-full px-6 py-3 shadow-2xl
          ${isMenuOpen ? 'rounded-3xl px-8 py-6' : ''}
        `}>
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">C</span>
              </div>
              <span className="font-bold text-white text-lg hidden sm:block">CDS AI</span>
            </Link>

            {/* Desktop Navigation - Hidden in collapsed state */}
            <nav className={`
              hidden lg:flex items-center space-x-6
              transition-all duration-300
              ${isMenuOpen ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
            `}>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-white/80 hover:text-white transition-colors duration-200 font-medium text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA - Compact */}
            <div className={`
              hidden md:flex items-center gap-3
              transition-all duration-300
              ${isMenuOpen ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
            `}>
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="font-medium text-white/80 hover:text-white hover:bg-white/10 border-0"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  size="sm"
                  className="font-medium bg-white text-black hover:bg-white/90 rounded-full px-4"
                >
                  Try Free
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Expanded Mobile/Tablet Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-6 pt-6 border-t border-white/10">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-white/80 hover:text-white transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                  <Link href="/login">
                    <Button 
                      variant="ghost" 
                      className="w-full font-medium text-white/80 hover:text-white hover:bg-white/10"
                    >
                      Đăng Nhập
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full font-medium bg-white text-black hover:bg-white/90">
                      Dùng Thử Miễn Phí
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Spacer to prevent content overlap */}
      <div className="h-20"></div>
    </>
  );
};