import React from "react";
import pic003 from "../../assets/pic003.jpeg";

const QuickFacts = () => {
  return (
    <section className="py-20 px-6 md:px-20 bg-white">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Image */}
        <div className="flex-shrink-0">
          <img
            src={pic003}
            alt="pic003"
            className="w-72 md:w-96 rounded-lg object-cover shadow-xl border-4 border-amber-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h2 className="text-4xl font-bold text-black mb-8 text-center md:text-left">
            Heritage Quick Facts
          </h2>

          <ul className="space-y-6 text-lg text-black">
            {/* Fact 1 */}
            <li className="flex items-start gap-3">
              <div className="w-3 h-3 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong>Founded:</strong> July 27th, 2015, by the Open Door Province.
              </span>
            </li>

            {/* Fact 2 */}
            <li className="flex items-start gap-3">
              <div className="w-3 h-3 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong>Growth:</strong> Grew from 22 to 120 members in 3 months; awarded <strong>Fastest Growing New Parish in 2015</strong>.
              </span>
            </li>

            {/* Fact 3 */}
            <li className="flex items-start gap-3">
              <div className="w-3 h-3 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong>Expansion:</strong> Became an Area Headquarters in 2017 and a <strong>Zonal Headquarters in 2023</strong>.
              </span>
            </li>

            {/* Fact 4 */}
            <li className="flex items-start gap-3">
              <div className="w-3 h-3 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong>10th Anniversary:</strong> Celebrating a decade of God's faithfulness in 2025, now established on <strong>its own land</strong>.
              </span>
            </li>

            {/* Fact 5 */}
            <li className="flex items-start gap-3">
              <div className="w-3 h-3 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong>Leadership:</strong> Oversees 6 thriving parishes across the Zone.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default QuickFacts;