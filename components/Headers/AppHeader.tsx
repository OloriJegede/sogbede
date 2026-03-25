"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#about" },
  { label: "Sign up", href: "/apply" },
  { label: "KíLOWí", href: "/", bold: true },
  { label: "FAQ", href: "/#faq" },
];

const AppHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-[#E7E3DD] shadow-[0_4px_8px_0_rgba(0,0,0,0.9)]">
        <div className="max-w-7xl mx-auto px-4 md:px-0 py-2 md:py-5">
          <section className="hidden md:block">
            <div className="flex justify-between items-center">
              <div>
                <Link href="/">
                  <Image
                    src={`/logo.svg`}
                    width={151.24}
                    height={37.55}
                    alt="logo"
                  />
                </Link>
              </div>
              <div className="text-lg flex justify-center items-center space-x-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={link.bold ? "font-bold" : ""}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
          <section className="block md:hidden">
            <div className="flex justify-between items-center">
              <div>
                <Link href="/">
                  <Image
                    src={`/logo.svg`}
                    width={96.68}
                    height={24}
                    alt="logo"
                  />
                </Link>
              </div>
              <Button variant="ghost" onClick={() => setMenuOpen(true)}>
                <Image src={`/menu.svg`} width={24} height={24} alt="menu" />
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#E7E3DD] flex flex-col md:hidden">
          <div className="flex justify-between items-center px-6 py-4">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <Image src={`/logo.svg`} width={96.68} height={24} alt="logo" />
            </Link>
            <Button variant="ghost" onClick={() => setMenuOpen(false)}>
              <X className="w-6 h-6 text-[#1C1A1A]" />
            </Button>
          </div>
          <nav className="flex flex-col px-6 pt-4 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-[18px] text-[#1C1A1A] ${link.bold ? "font-bold" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default AppHeader;
