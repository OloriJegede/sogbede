import React from "react";
import { Button } from "../ui/button";

const ContactUs = () => {
  return (
    <div className="max-w-7xl mx-auto pb-20 pt-10 px-6 md:px-0">
      <div className="bg-[#E5D5C5] rounded-[12px] flex flex-col justify-center items-center py-10 md:py-14">
        <div className=" h-auto md:h-[162px] flex-col justify-center items-center space-y-4">
          <div className="text-[#1C1A1A] text-[32px] text-center montserrat-semibold w-4/5 mx-auto">
            Still have questions?
          </div>
          <div className="text-[#615552] text-[16px] text-center">
            We're here to help! Reach out to us and we'll get back to you as
            soon as possible.
          </div>
          <div className="flex justify-center items-center">
            <Button className="px-8">Contact Us</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
