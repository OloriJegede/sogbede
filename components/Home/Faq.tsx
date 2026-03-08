import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const Faq = () => {
  return (
    <div className="max-w-7xl mx-auto py-14 px-6 md:px-0">
      <div className="text-[#1C1A1A] text-[32px] md:text-[48px] skranji text-center">
        Frequently Asked Questions
      </div>
      <div className="text-center text-[16px] text-[#615552]">
        Everything you need to know about Ṣo Gbédè
      </div>
      <section className="mt-8">
        <Accordion
          type="single"
          collapsible
          defaultValue="shipping"
          className="max-w-[904px] mx-auto space-y-4"
        >
          <AccordionItem
            value="a"
            className="border-2 border-[#E8E8E8] bg-white rounded-[8px] py-5 px-7"
          >
            <AccordionTrigger className="text-[#1C1A1A] text-[16px] montserrat-semibold">
              Where is the show based?
            </AccordionTrigger>
            <AccordionContent>
              Șo Gbédè is currently based in Dallas, Texas. However, we are not
              stopping there. We have plans to take the show to other locations,
              including Nigeria, Canada, and beyond.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="b"
            className="border-2 border-[#E8E8E8] bg-white rounded-[8px] py-5 px-7"
          >
            <AccordionTrigger className="text-[#1C1A1A] text-[16px] montserrat-semibold">
              Do I need to be fluent in Yoruba to participate?
            </AccordionTrigger>
            <AccordionContent>
              Not at all!. Șo Gbédè welcomes everyone, from beginners just
              learning their first Yoruba words to fluent speakers who grew up
              with the language. The show celebrates your journey with Yoruba,
              not perfection. À wa kẹ́ kọ́. We all came to learn.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="c"
            className="border-2 border-[#E8E8E8] bg-white rounded-[8px] py-5 px-7"
          >
            <AccordionTrigger className="text-[#1C1A1A] text-[16px] montserrat-semibold">
              What kind of questions can I expect?
            </AccordionTrigger>
            <AccordionContent>
              Our questions explore Yoruba culture in all its richness. Expect
              topics around language, traditions, music, food, proverbs,
              history, and everyday expressions. Some questions are light and
              playful, others more challenging, but every round is designed to
              be fun, engaging, and educational.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="d"
            className="border-2 border-[#E8E8E8] bg-white rounded-[8px] py-5 px-7"
          >
            <AccordionTrigger className="text-[#1C1A1A] text-[16px] montserrat-semibold">
              How much can I win?
            </AccordionTrigger>
            <AccordionContent>
              You can win up to $2,000 depending on the round and your
              performance. But beyond the money, many contestants leave with new
              connections, lots of laughs, and unforgettable moments.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="e"
            className="border-2 border-[#E8E8E8] bg-white rounded-[8px] py-5 px-7"
          >
            <AccordionTrigger className="text-[#1C1A1A] text-[16px] montserrat-semibold">
              How long does filming take?
            </AccordionTrigger>
            <AccordionContent>
              Plan to spend about 1.5 to 2 hours in total. This includes
              preparation, makeup touch-ups, production photos, and post-show
              interviews. The actual episode recording lasts about 45 minutes.
              Refreshments are provided throughout, and our team makes sure you
              feel relaxed, confident, and camera-ready.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="f"
            className="border-2 border-[#E8E8E8] bg-white rounded-[8px] py-5 px-7"
          >
            <AccordionTrigger className="text-[#1C1A1A] text-[16px] montserrat-semibold">
              Can I apply if I live in a different country?
            </AccordionTrigger>
            <AccordionContent>
              Yes, absolutely! Șo Gbédè is building a global community. While we
              are currently based in Dallas, we plan to film in other countries,
              including Nigeria, Canada, and more. When you apply, you will be
              prioritized when the show comes to your region.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
};

export default Faq;
