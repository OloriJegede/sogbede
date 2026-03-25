import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

const SlideTwo = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-4 pt-14">
      <Image
        src={`/guest.svg`}
        width={340}
        height={86}
        alt="logo"
        className="max-w-[80%] md:max-w-none"
      />
      <div className="text-[16px] md:text-[24px] text-center px-4 md:px-0 mb-18">
        Show off your Yoruba language skills and win big while having fun!
      </div>
      <div>
        <Button asChild className="px-8 bg-[#CCAB8C]">
          <Link href={`/apply`}>Apply Now</Link>
        </Button>
      </div>
      <div className="flex justify-center md:mt-4 items-center pt-4 w-full">
        <Image
          src={`/slide2.png`}
          width={1154}
          height={491}
          alt="hero image"
          className="hidden md:block"
        />
        <Image
          src={`/SlideTwo-mobile.png`}
          width={445.77}
          height={363.89}
          alt="hero image"
          className="block md:hidden w-screen max-w-none"
        />
      </div>
    </div>
  );
};

export default SlideTwo;
