import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

const SlideOne = () => {
  return (
    <div className="flex flex-col justify-between md:justify-center items-center md:space-y-4 pt-10 md:pt-14 min-h-[85vh] md:min-h-0">
      {/* Top content group */}
      <div className="flex flex-col items-center space-y-4 w-full px-6 md:px-0">
        <Image src={`/meetsogbede.svg`} width={516} height={91} alt="logo" />
        <div className="text-[16px] md:text-[24px] text-center md:px-0">
          Regardless of your Yoruba level, you are welcome to play this game.
        </div>
        <Button asChild className="px-8 w-[138px] w-auto">
          <Link href={`/#about`}>Explore ṢoGbédè</Link>
        </Button>
      </div>
      {/* Bottom image */}
      <div className="w-full pt-4">
        <Image
          src={`/5hero1.png`}
          width={1154}
          height={558}
          alt="hero image"
          className="hidden md:block"
        />
        <Image
          src={`/SlideOne-mobile.png`}
          width={445.77}
          height={363.89}
          alt="hero image"
          className="block md:hidden w-screen max-w-none"
        />
      </div>
    </div>
  );
};

export default SlideOne;
