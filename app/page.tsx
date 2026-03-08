import About from "@/components/Home/About";
import ContactUs from "@/components/Home/ContactUs";
import Faq from "@/components/Home/Faq";
import { Metadata } from "next";
import GuestSay from "@/components/Home/GuestSay";
import Hero from "@/components/Home/Hero";
import Sogbede from "@/components/Home/Sogbede";
import Stat from "@/components/Home/Stat";
import React from "react";

export const metadata: Metadata = {
  title: "SoGbédè",
  description: "Yoruba language game show",
};
const page = () => {
  return (
    <div className="">
      <Hero />
      <About />
      <Sogbede />
      <Stat />
      <GuestSay />
      <div className="md:bg-[#F2EDE7]">
        <div className="faq-bg">
          <Faq />
          <ContactUs />
        </div>
      </div>
    </div>
  );
};

export default page;
