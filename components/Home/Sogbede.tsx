import Image from "next/image";
import React from "react";
import ForYou from "../Reusables/ForYou";

const Sogbede = () => {
  const forYouData = [
    {
      title: "Yoruba enthusiast",
      description:
        "Whether you are fluent in Yoruba, still learning, or grew up hearing it but never quite spoke it, this space is for you. There is no pressure to be perfect. Just come ready to try, laugh, and learn.",
    },
    {
      title: "Diaspora Roots",
      description:
        "If you live outside Nigeria and feel a little disconnected from the language or culture, Șo Gbédè offers a fun, welcoming way to reconnect without judgment or embarrassment.",
    },
    {
      title: "Culture Curious",
      description:
        "You do not have to be Yoruba to enjoy Șo Gbédè. If you are curious about the culture, connected through family or community, or simply interested in learning something new, you are welcome here.",
    },
    {
      title: "Young Explorer",
      description:
        "Șo Gbédè makes the Yoruba language and culture playful, relatable, and engaging for young people, especially those who need learning to feel fun, not serious or intimidating",
    },
    {
      title: "Fun Lovers",
      description:
        "If you enjoy lively conversations, smart humour, friendly competition, and cultural gist, you will fit right in. This is learning with laughter, not lectures.",
    },
    {
      title: "Community Builder",
      description:
        "From schools and cultural programs to media brands and event organisers, Șo Gbédè is built for people and platforms that believe culture should be shared, modern, and alive",
    },
  ];

  return (
    <div className="pb-14">
      <div className="max-w-7xl mx-auto px-6 md:px-0">
        <section className="hidden md:block">
          <div className="flex justify-center items-center py-10 md:py-20">
            <Image
              src={`/sogbede.svg`}
              width={438}
              height={61}
              alt="sogbede"
              className=""
            />
          </div>
        </section>
        <section className="block md:hidden">
          <div className="flex justify-center items-center py-10 md:py-20">
            <Image
              src={`/sogbede.svg`}
              width={438}
              height={61}
              alt="sogbede"
              className=""
            />
          </div>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forYouData.map((item, index) => (
            <ForYou
              key={index}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
        <div
          className="pt-8 pb-14 text-center text-[24px] montserrat-semibold text-[#3A2B27] italic"
          style={{ fontStyle: "italic" }}
        >
          À wa kẹ́ kọ́ — We all came to learn.
        </div>
      </div>
    </div>
  );
};

export default Sogbede;
