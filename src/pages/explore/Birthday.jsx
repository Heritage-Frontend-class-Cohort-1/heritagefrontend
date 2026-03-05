import { useEffect, useState } from "react";


const Birthday = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const birthdayMessages = [
    "Happy Birthday, {name}! 🎉🎂",
    "Wishing you a fantastic birthday, {name}! 🥳",
    "Many happy returns, {name}! 🎈",
    "Joyful birthday wishes to you, {name}! 🌟",
    "Happy Birthday, {name}! May your day be filled with love and blessings! 🙏"
  ];

  const fetchBirthdays = async () => {
    try {
      const res = await fetch("https://backend-heritage-1.onrender.com/api/birthdays/upcoming");
      if (!res.ok) throw new Error("Failed to fetch birthdays");
      const data = await res.json();

      const birthdaysWithMessage = data.data.map((bday) => {
        const randomIndex = Math.floor(Math.random() * birthdayMessages.length);
        const message = birthdayMessages[randomIndex].replace("{name}", bday.memberName);

        // Construct a safe date string for display
        let displayDate = "Birthday not available";
        if (bday.birthDay && bday.birthMonth) {
          const date = new Date();
          date.setMonth(bday.birthMonth - 1, bday.birthDay);
          displayDate = date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
        }

        return { ...bday, message, displayDate };
      });

      setBirthdays(birthdaysWithMessage);
    } catch (err) {
      console.error(err);
      setError("Unable to load birthdays");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBirthdays();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Upcoming Birthdays 🎂</h2>

      {loading ? (
        <p className="text-center">Loading birthdays...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : birthdays.length === 0 ? (
        <p className="text-center text-gray-600">No upcoming birthdays.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {birthdays.map((bday) => (
            <div key={bday._id} className="bg-white p-4 rounded-lg shadow text-center">
              <img
                src={bday.imageUrl}
                alt={bday.memberName}
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold">{bday.memberName}</h3>
              <p className="text-gray-600">{bday.displayDate}</p>
              <p className="mt-2 text-green-600 font-medium">{bday.message}</p>
              <p className="text-gray-500">{bday.daysLeft === 0 ? "Today" : `${bday.daysLeft} day(s) left`}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Birthday;