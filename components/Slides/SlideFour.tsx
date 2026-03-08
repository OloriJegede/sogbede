import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

const SlideFour = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-4 pt-14">
      <Image
        src={`/play.svg`}
        width={442}
        height={86}
        alt="logo"
        className="max-w-[80%] md:max-w-none"
      />
      <div className="text-[16px] md:text-[24px] text-center px-4 md:px-0 mb-18">
        Kílowí brings Yoruba wordplay to your table in the form of a card game
      </div>
      <div>
        <Button className="px-8 bg-[#008000]">Get Kílowí</Button>
      </div>
      <div className="flex justify-center items-center">
        <Image
          src={`/slide4.svg`}
          width={514}
          height={403}
          alt="hero image"
          className="hidden md:block"
        />
        <Image
          src={`/SlideFour-mobile.png`}
          width={584.24}
          height={363.89}
          alt="hero image"
          className="block md:hidden w-screen max-w-none"
        />
      </div>
    </div>
  );
};

export default SlideFour;
