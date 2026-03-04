import React from "react";
import { colors } from "../../utils/colors";
import rcglogo from "../../assets/rcglogo.webp";

const MissionVision = () => {
  return (
    <section
      className="relative py-20 px-6 md:px-20 bg-no-repeat"
      style={{
        backgroundImage: `url(${rcglogo})`,
        backgroundSize: "contain",   // makes image smaller
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(13, 43, 82, 0.88)" }}
      ></div>

      <div className="relative max-w-5xl mx-auto text-center text-white">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold mb-12">
          Our Mission & Vision
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Vision */}
          <div className="p-6">
            <h3
              className="text-3xl font-semibold mb-4"
              style={{ color: colors.gold }}
            >
              Our Vision
            </h3>
            <p className="text-2xl font-medium">To make Heaven.</p>
          </div>

          {/* Mission */}
          <div className="p-6 text-left">
            <h3
              className="text-3xl font-semibold mb-4"
              style={{ color: colors.gold }}
            >
              Our Mission
            </h3>
            <ul className="space-y-4 text-lg leading-relaxed">
              <li>• To take as many people with us.</li>
              <li>• To have a member of RCCG in every family of all nations.</li>
              <li>• Holiness will be our lifestyle.</li>
              <li>
                • To plant churches within five minutes walking distance in
                developing countries and five minutes driving distance in
                developed countries.
              </li>
              <li>
                • To pursue these objectives until every nation is reached for
                the Lord Jesus Christ.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
