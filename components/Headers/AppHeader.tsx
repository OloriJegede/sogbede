import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

const AppHeader = () => {
  return (
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
              <Link href={`/`}>Home</Link>
              <Link href={`/`}>About Us</Link>
              <Link href={`/`}>Apply</Link>
              <Link href={`/`}>KíLOWí</Link>
              <Link href={`/`}>FAQ</Link>
            </div>
          </div>
        </section>
        <section className="block md:hidden">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/">
                <Image src={`/logo.svg`} width={96.68} height={24} alt="logo" />
              </Link>
            </div>
            <div className="text-lg flex justify-center items-center space-x-10">
              <Button variant={`ghost`}>
                <Image
                  src={`/menu.svg`}
                  width={`24`}
                  height={`24`}
                  alt="menu"
                  className=""
                />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AppHeader;
