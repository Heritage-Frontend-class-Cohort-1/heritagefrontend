import React from "react";
import { Heart, User, Gift } from "lucide-react";

const colors = {
  deepNavy: "#0B1B3F",
  secondaryNavy: "#142A5A",
  softCream: "#FFF4E1",
  gold: "#FFD700",
  offWhite: "#F8F8F8",
};

const iCarePrograms = [
  {
    icon: <Heart className="h-8 w-8" style={{ color: colors.gold }} />,
    title: "Emergency Support",
    description:
      "Immediate help for families and individuals in crisis situations, providing relief and care when it matters most.",
  },
  {
    icon: <Gift className="h-8 w-8" style={{ color: colors.gold }} />,
    title: "Food & Essentials Distribution",
    description:
      "Providing nourishment and daily necessities to those in need, ensuring no one goes hungry.",
  },
  {
    icon: <User className="h-8 w-8" style={{ color: colors.gold }} />,
    title: "Counseling & Mentorship",
    description:
      "Offering emotional support, guidance, and mentorship to help individuals and families grow spiritually and emotionally.",
  },
  {
    icon: <Heart className="h-8 w-8" style={{ color: colors.gold }} />,
    title: "Medical Assistance",
    description:
      "Supporting healthcare needs through partnerships, referrals, and assistance for medical treatments.",
  },
  {
    icon: <Gift className="h-8 w-8" style={{ color: colors.gold }} />,
    title: "Community Empowerment",
    description:
      "Providing skills training, education support, and resources to empower individuals for sustainable living.",
  },
];

const ICare = () => {
  return (
    <div style={{ backgroundColor: colors.offWhite }} className="min-h-screen">
      {/* Hero Section */}
      <section
        className="py-24 text-center px-4"
        style={{ backgroundColor: colors.deepNavy, color: colors.offWhite }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">iCare – Compassion in Action</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
          At iCare, we express our faith through love and service. Our welfare initiatives provide practical help, emotional support, and spiritual encouragement to those in need.
        </p>
      </section>

      {/* Programs Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-12"
            style={{ color: colors.deepNavy }}
          >
            Our Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {iCarePrograms.map((program, index) => (
              <div
                key={index}
                className="p-8 rounded-3xl shadow-lg transition hover:shadow-2xl"
                style={{ backgroundColor: colors.softCream }}
              >
                <div className="mb-4 flex justify-center">{program.icon}</div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: colors.deepNavy }}
                >
                  {program.title}
                </h3>
                <p style={{ color: colors.deepNavy, opacity: 0.85 }}>
                  {program.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        className="py-24 text-center px-4"
        style={{ backgroundColor: colors.secondaryNavy, color: colors.offWhite }}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Join Us in Making a Difference
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-lg md:text-xl">
          Your involvement can change lives. Whether through donations, volunteering, or prayers, you can partner with iCare to bring hope and practical help to those who need it most.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <button
            className="py-4 px-8 rounded-lg font-bold transition"
            style={{ backgroundColor: colors.gold, color: colors.deepNavy }}
          >
            Donate Now
          </button>
          <button
            className="py-4 px-8 rounded-lg font-bold border-2 transition"
            style={{ borderColor: colors.gold, color: colors.offWhite }}
          >
            Volunteer
          </button>
        </div>
      </section>
    </div>
  );
};

export default ICare;
