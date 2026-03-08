import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

const About = () => {
  return (
    <div id="about" className="home-about-back">
      <section className="max-w-7xl mx-auto py-20 px-6 md:px-0">
        <div className="text-[48px] text-[#FAFAFA] skranji md:text-center">
          About Us
        </div>
        <div className="block md:hidden">
          <Image
            src={`/aboutus.png`}
            width={342}
            height={190}
            alt="aboutus"
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 pt-18">
          <div className="md:w-[90%] space-y-5">
            <div className="text-[#FAFAFA] text-[32px] montserrat-semibold">
              What is ȘO GBÉDÈ{" "}
            </div>
            <div className="text-[16px] text-[#FAFAFA] space-y-5">
              <div>
                ȘO GBÉDÈ is a Yoruba cultural game show that turns language,
                expressions, idioms, history, and everyday wisdom into
                fast-paced, playful challenges. Think smart questions and witty
                banter.
              </div>
              <div>
                From fluent speakers to those just starting to learn or test
                their skills, this is a space for everyone to play, learn, and
                reconnect with Yoruba culture in a way that feels natural and
                fun.
              </div>
            </div>
            <Button className="bg-[#CCAB8C] text-[#3A2B27] px-10">
              Join in the fun{" "}
            </Button>
          </div>
          <div className="hidden md:block">
            <Image src={`/aboutus.png`} width={623} height={40} alt="aboutus" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
