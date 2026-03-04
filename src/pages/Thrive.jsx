<section className="py-20 bg-gray-100">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-500">
      CONNECT, GROW & THRIVE
    </h2>
    <p className="text-gray-700 mb-12 max-w-3xl mx-auto">
      "Rather, you must grow in the grace and knowledge of our Lord and Savior Jesus Christ. All glory to him, both now and forever! Amen."
      <br />
      <span className="font-semibold">2 Peter 3:18 (NLT)</span>
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {[
        { title: "Youth & Adult", icon: Users, link: "youth-and-adult" },
        { title: "Teenagers", icon: UserCheck, link: "teenagers" },
        { title: "Women Fellowship", icon: Heart, link: "women-fellowship" },
        { title: "Men Fellowship", icon: Speaker, link: "men-fellowship" }
      ].map((group, idx) => {
        const Icon = group.icon;
        return (
          <Link
            key={idx}
            to={`/fellowships/${group.link}`}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition hover:scale-105 duration-300"
          >
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Icon className="h-7 w-7 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
          </Link>
        );
      })}
    </div>
  </div>
</section>