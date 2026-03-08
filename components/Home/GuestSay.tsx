"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Testimonial from "../Reusables/Testimonial";

const GuestSay = () => {
  const testimonials = [
    {
      name: "Adewale O",
      location: "Lagos, Nigeria",
      feedback:
        "I grew up hearing Yoruba but never spoke it fluently. Ṣo Gbédè gave me the confidence to try without fear of judgment. It was the most fun I've had learning!",
    },
    {
      name: "Funmi K.",
      location: "London, UK",
      feedback:
        "Being in the diaspora, I felt disconnected from my culture. This show brought me back home in the best way. Plus, I won $500!",
    },
    {
      name: "Tunde A",
      location: "Toronto, Canada",
      feedback:
        "The questions were challenging but fair, and the atmosphere was so welcoming. I learned so much and made friends who share my passion for Yoruba culture!",
    },
    {
      name: "Maria S",
      location: "Barcelona, Spain",
      feedback:
        "The experience was transformative. The discussions ignited my creativity, and I left feeling inspired and connected to a vibrant community.",
    },
  ];
  return (
    <div className="md:pl-24 py-14 ">
      <div className="text-[#1C1A1A] text-[32px] md:text-[48px] skranji md:text-center px-6 md:px-0">
        What Our Guest Say
      </div>
      <section className="mt-8 pl-6 md:pl-0">
        <Carousel
          className="w-full"
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent className="-ml-4 lg:-ml-1">
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className="basis-full pl-4 lg:basis-1/3 lg:pl-1"
              >
                <div className="p-1">
                  <Testimonial
                    name={testimonial.name}
                    location={testimonial.location}
                    feedback={testimonial.feedback}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious />
          <CarouselNext /> */}
        </Carousel>
      </section>
    </div>
  );
};

export default GuestSay;
