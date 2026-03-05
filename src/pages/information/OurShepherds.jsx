import React from "react";
import pandwifey from "../../assets/pandwifey.jpeg";

const colors = {
  deepNavy: "#0B1B3F",
  secondaryNavy: "#142A5A",
  softCream: "#FFF4E1",
  gold: "#FFD700",
  offWhite: "#F8F8F8",
};

const OurLeadership = () => {
  return (
    <section
      style={{ background: colors.deepNavy }}
      className="py-24"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left - Image */}
        <div className="flex-1 relative">
          <div
            style={{ background: colors.secondaryNavy }}
            className="absolute -inset-6 rounded-3xl"
          />
          <img
            src={pandwifey}
            alt="Pastor and Wife"
            className="relative w-full max-w-md h-auto object-cover rounded-3xl shadow-2xl"
          />
        </div>

        {/* Right - Text */}
        <div className="flex-1 text-white text-center lg:text-left">
          
          <h2
            style={{ color: colors.gold }}
            className="text-4xl md:text-5xl font-bold mt-4 mb-4"
          >
            Pastor Sina Olonade & Pastor (Mrs) Olonade
          </h2>

          <p
            style={{ color: colors.gold }}
            className="font-semibold mb-6"
          >
            Pastoral Leadership — The Lord’s Heritage Zone
          </p>

          <p
            style={{ color: colors.offWhite }}
            className="mb-4 leading-relaxed"
          >
            Pastor Sina Olonade and Pastor (Mrs) Olonade faithfully lead The
            Lord’s Heritage Zone with a shared passion for raising believers
            who love God and serve others. Their ministry focuses on teaching
            God’s Word, strengthening families, and building a caring church
            community where lives are transformed through Christ.
          </p>

          <p
            style={{ color: colors.offWhite }}
            className="mb-4 leading-relaxed"
          >
            Through prayer, teaching, and compassionate leadership, they
            continue to nurture spiritual growth, love, and service in the church
            and community.
          </p>

          <p
            style={{ color: colors.gold }}
            className="mt-6 italic font-semibold"
          >
            "Where God Makes Room – this is not just our motto, it's our reality!"
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurLeadership;
