import React from "react";
import { colors } from "../../utils/colors";
import rcglogo from "../../assets/rcglogo.webp";

const History = () => {
  return (
    <section
      className="relative py-20 px-6 md:px-20 bg-no-repeat"
      style={{
        backgroundImage: `url(${rcglogo})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    >
      {/* Soft Cream Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(253, 251, 247, 0.95)" }}
      ></div>

      <div className="relative max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: colors.deepNavy }}
          >
            Our History
          </h2>
          <div
            className="w-24 h-1 mx-auto rounded"
            style={{ backgroundColor: colors.gold }}
          ></div>
        </div>

        {/* Content */}
        <div
          className="space-y-8 text-lg leading-relaxed"
          style={{ color: colors.neutralGray }}
        >
          <p>
            In July 1909, Pa Josiah Akindayomi was born in Ondo State, Nigeria.
            Although he grew up among idol worshippers, he desired to know the
            true God. He was baptized in the Church Missionary Society in 1927
            and later joined the Cherubim and Seraphim Church in 1931. During
            this time, he repeatedly heard a divine call saying, “You will be my
            servant.” After years of struggling and failed business ventures, he
            surrendered fully to God’s will.
          </p>

          <p>
            In 1952, after leaving the Cherubim and Seraphim Church due to
            doctrinal concerns, he started a house fellowship called the Glory
            of God Fellowship in Lagos. Through a divine vision, God revealed
            the name “The Redeemed Christian Church of God (RCCG)” to him and
            established a covenant promising to meet the church’s needs if
            members remained faithful and obedient. Thus, RCCG was officially
            founded in 1952.
          </p>

          <p>
            Before his death at age 71, God revealed to Pa Akindayomi that his
            successor would be a young, educated man. When Pastor Enoch Adejare
            Adeboye, a university mathematics lecturer, joined the church in
            1973, he was ordained as pastor in 1975 and eventually became his
            successor in 1981.
          </p>

          <p>
            Since Pastor Adeboye assumed leadership, RCCG has experienced
            tremendous growth, expanding to over 40,000 parishes in Nigeria and
            many more across Africa, Europe, the United States, and other parts
            of the world. One of its major programs is the monthly Holy Ghost
            Service, which attracts hundreds of thousands of worshippers
            globally.
          </p>

          <p>
            Today, RCCG continues to grow worldwide, fulfilling its divine
            mandate to spread the gospel across nations.
          </p>
        </div>
      </div>
    </section>
  );
};

export default History;
