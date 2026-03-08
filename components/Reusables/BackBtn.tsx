"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const BackBtn = () => {
  const router = useRouter();
  return (
    <Button
      variant={`ghost`}
      className="flex justify-start items-center space-x-2"
      onClick={() => router.back()}
    >
      <Image src={`/move-left.svg`} width={24} height={24} alt="move left" />
      <div className="underline text-[#000000] text-[16px]">Back Home</div>
    </Button>
  );
};

export default BackBtn;
