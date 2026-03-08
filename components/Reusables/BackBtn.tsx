import Image from "next/image";
import React from "react";

const BackBtn = () => {
  return (
    <div className="flex justify-start items-center space-x-2">
      <Image src={`/move-left.svg`} width={24} height={24} alt="move left" />
      <div className="underline text-[#000000] text-[16px]">Back Home</div>
    </div>
  );
};

export default BackBtn;
