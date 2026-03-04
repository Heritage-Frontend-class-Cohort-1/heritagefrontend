import { useState } from "react";

const slides = [
  {
    content: [
      {
        title: "THE SECOND COMING OF JESUS CHRIST",
        text:
          "That Jesus Christ will come again to earth in glory and in power. Those dead in Christ will rise first and those alive in Christ will be in the presence of God for eternity.",
      },
      {
        title: "THE HOLY BIBLE",
        text:
          "Is the infallible and authoritative Word of God, given directly to all men and women for salvation.",
      },
      {
        title: "THE MANDATE",
        text:
          "That man was created in the image and likeness of God to be fruitful, multiply, replenish the earth, subdue it, and have dominion over it.",
      },
    ],
  },
  {
    content: [
      {
        title: "THE DEATH AND RESURRECTION OF JESUS CHRIST",
        text:
          "That Jesus Christ died on the cross at Calvary for the sins of mankind. He rose from the dead on the third day and ascended into heaven.",
      },
      {
        title: "THE BLOOD OF JESUS CHRIST",
        text:
          "Which was shed for us at Calvary. It cleanses us of all sin and grants access into the presence of God.",
      },
      {
        title: "SALVATION",
        text:
          "It is a gift from God through grace and faith in Christ Jesus.",
      },
    ],
  },
  {
    content: [
      {
        title: "THE HOLY SPIRIT",
        text:
          "The Holy Spirit empowers believers to live a godly life and walk in obedience to God.",
      },
      {
        title: "THE CHURCH",
        text:
          "The Church is the body of Christ, called to worship, serve, and spread the Gospel.",
      },
      {
        title: "ETERNAL LIFE",
        text:
          "Eternal life is God's gift to all who believe in Jesus Christ.",
      },
    ],
  },
];

// Color theme
const colors = {
  deepNavy: "#0B1B3F",
  secondaryNavy: "#142A5A",
  softCream: "#FFF4E1",
  gold: "#FFD700",
  offWhite: "#F8F8F8",
};

const WhatWeBelieve = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const nextSlide = () =>
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  return (
    <section
      style={{ background: colors.deepNavy }}
      className="py-16 px-5 text-center text-offWhite"
    >
      <h1
        style={{ color: colors.gold }}
        className="text-4xl md:text-5xl font-bold mb-10"
      >
        WHAT WE BELIEVE
      </h1>

      <div className="relative max-w-[850px] mx-auto">
        {/* Slide content */}
        {slides[current].content.map((item, index) => (
          <div key={index} className="mb-6">
            <h3
              style={{ color: colors.softCream }}
              className="text-lg font-semibold mt-5"
            >
              {item.title}
            </h3>
            <p
              style={{ color: colors.offWhite }}
              className="text-base leading-relaxed mt-2"
            >
              {item.text}
            </p>
          </div>
        ))}

        {/* Arrows */}
        <button
          onClick={prevSlide}
          style={{ color: colors.gold }}
          className="absolute left-[-40px] top-1/2 -translate-y-1/2 text-2xl hover:opacity-80"
        >
          &#10094;
        </button>

        <button
          onClick={nextSlide}
          style={{ color: colors.gold }}
          className="absolute right-[-40px] top-1/2 -translate-y-1/2 text-2xl hover:opacity-80"
        >
          &#10095;
        </button>
      </div>

      {/* Dots */}
      <div className="mt-9 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            style={{
              backgroundColor:
                current === index ? colors.gold : colors.softCream,
            }}
            className="w-3 h-3 rounded-full border border-offWhite"
          />
        ))}
      </div>
    </section>
  );
};

export default WhatWeBelieve;
