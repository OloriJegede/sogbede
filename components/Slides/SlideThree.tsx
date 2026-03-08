import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

const SlideThree = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-4 pt-14">
      <Image
        src={`/laugh.svg`}
        width={661}
        height={86}
        alt="logo"
        className="max-w-[90%] md:max-w-none"
      />
      <div className="text-[16px] md:text-[24px] text-center px-4 md:px-0 mb-18">
        See episodes, highlights and cultural moments from the show
      </div>
      <div>
        <Button className="px-8 bg-[#1C1A1A]">Watch on Youtube</Button>
      </div>
      <div className="flex justify-center items-center mt-5 md:-mt-18">
        <Image
          src={`/slide3.png`}
          width={853}
          height={563}
          alt="hero image"
          className="hidden md:block"
        />
        <Image
          src={`/SlideThree-mobile.png`}
          width={853}
          height={563}
          alt="hero image"
          className="hidden md:block"
        />
        <Image
          src={`/slideThree-mobile.png`}
          width={445.77}
          height={363.89}
          alt="hero image"
          className="block md:hidden w-screen max-w-none"
        />
      </div>
    </div>
  );
};

export default SlideThree;
