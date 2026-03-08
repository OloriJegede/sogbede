"use client";
import React from "react";

interface ForYouProps {
  title: string;
  description: string;
}

const ForYou = ({ title, description }: ForYouProps) => {
  return (
    <div
      className={`bg-[url('/card2.svg')] bg-cover bg-center bg-no-repeat rounded-[24px] px-6 py-7 space-y-5`}
    >
      <div className="text-[#3A2B27] text-[24px] montserrat-semibold">
        {title}
      </div>
      <div className="text-[#615552] text-[16px]">{description}</div>
    </div>
  );
};

export default ForYou;
