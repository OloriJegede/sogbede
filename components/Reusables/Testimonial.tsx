import React from "react";

interface TestimonialProps {
  name: string;
  location: string;
  feedback: string;
}

const Testimonial = ({ name, location, feedback }: TestimonialProps) => {
  // Get first letter of name for avatar
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="bg-[url('/card3.svg')] rounded-[16px] px-5 py-6  w-full max-w-[420px] h-[260px]">
      <div className="flex justify-start items-start space-x-4">
        <div className="w-[40px] h-[40px] rounded-full bg-[#DBC4AF] flex justify-center items-center text-[#FAFAFA] text-[16px] montserrat-bold">
          {initial}
        </div>
        <div className="flex-1">
          <div className="text-[#3A2B27] text-[24px] montserrat-semibold">
            {name}
          </div>
          <div className="text-[12px] text-[#605F5F]">{location}</div>
          <div className="text-[#333131] text-[16px] mt-4">{`"${feedback}"`}</div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
