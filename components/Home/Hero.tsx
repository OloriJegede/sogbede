"use client";
import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Fade from "embla-carousel-fade";
import Autoplay from "embla-carousel-autoplay";
import SlideOne from "../Slides/SlideOne";
import type { CarouselApi } from "@/components/ui/carousel";
import SlideTwo from "../Slides/SlideTwo";
import SlideThree from "../Slides/SlideThree";
import SlideFour from "../Slides/SlideFour";

const Hero = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const slideCount = 3;

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="home-hero-back flex flex-col overflow-hidden max-h-[693px] md:max-h-none">
      <div className="max-w-7xl w-full md:w-[80%] mx-auto">
        <Carousel
          opts={{
            align: "center",
            loop: true,
            duration: 40,
          }}
          plugins={[Fade(), Autoplay({ delay: 10000 })]}
          setApi={setApi}
          className="flex-1 w-full"
        >
          <CarouselContent className="h-full">
            <CarouselItem className="basis-full h-full flex items-center justify-center">
              <div className="w-full mx-auto">
                <SlideOne />
              </div>
            </CarouselItem>
            <CarouselItem className="basis-full h-full flex items-center justify-center">
              <div className="w-full mx-auto">
                <SlideTwo />
              </div>
            </CarouselItem>
            <CarouselItem className="basis-full h-full flex items-center justify-center">
              <div className="w-full mx-auto">
                <SlideThree />
              </div>
            </CarouselItem>
            <CarouselItem className="basis-full h-full flex items-center justify-center">
              <div className="w-full mx-auto">
                <SlideFour />
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <div className="flex gap-2 justify-center items-center absolute -mt-16 md:-mt-14 left-1/2 -translate-x-1/2">
            {Array.from({ length: slideCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-[12px] w-[12px] rounded-full transition-all ${
                  current === index
                    ? "bg-[#E5D5C5] w-[48px] h-[12px]"
                    : "bg-[#E5D5C5]/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default Hero;
