import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const reviews = [
  {
    name: "Muhammad Bilal",
    time: "3 years ago",
    text: "SAIS is the Best SEO Company in Gujranwala. I am 100% satisfied from this seo agency.",
    img: "https://i.pravatar.cc/100?img=11",
  },
  {
    name: "F2F AsHu",
    time: "3 years ago",
    text: "Best Digital Marketing agency in GRW.",
    img: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Dark Mind",
    time: "3 years ago",
    text: "I have worked with this marketing agency. My experience is so Good 👍",
    img: "https://i.pravatar.cc/100?img=13",
  },
  {
    name: "Ali Raza",
    time: "2 years ago",
    text: "Very professional team and great support.",
    img: "https://i.pravatar.cc/100?img=14",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setSlidesPerView(1);
      else if (window.innerWidth < 1024) setSlidesPerView(2);
      else setSlidesPerView(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(1, reviews.length - slidesPerView + 1);

  const next = () => {
    setIndex((prev) => (prev + 1) % maxIndex);
  };

  const prev = () => {
    setIndex((prev) => (prev === 0 ? maxIndex - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slidesPerView]);

  return (
    <section className="py-32 bg-background relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            What Our <span className="text-primary">Client say&apos;s</span>
          </h2>
        </AnimatedSection>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT INFO */}
          <AnimatedSection className="flex-shrink-0 lg:w-1/3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center font-bold">
                SAIS
              </div>
              <h4 className="font-bold text-sm text-foreground">
                Digital Marketing Agency <br /> SEO Company In Gujranwala
              </h4>
            </div>

            <div className="flex text-yellow-400 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-yellow-400" />
              ))}
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              <strong className="text-foreground">30</strong> Google reviews
            </p>

            <a
              href="https://www.google.com/maps/search/?api=1&query_place_id=0x391f29775356e6cf:0x548ca11b1fa38dcb"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-foreground px-5 py-2 text-sm rounded hover:bg-primary hover:text-primary-foreground transition"
            >
              Write a Google Review
            </a>
          </AnimatedSection>

          {/* RIGHT SLIDER */}
          <AnimatedSection className="relative lg:w-2/3 overflow-hidden">
            <button
              onClick={prev}
              className="absolute top-1/2 -translate-y-1/2 left-2 bg-primary text-primary-foreground shadow-lg p-3 rounded-full z-20 hover:scale-110 transition"
              aria-label="Previous reviews"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={next}
              className="absolute top-1/2 -translate-y-1/2 right-2 bg-primary text-primary-foreground shadow-lg p-3 rounded-full z-20 hover:scale-110 transition"
              aria-label="Next reviews"
            >
              <ChevronRight size={16} />
            </button>

            <div
              className="flex transition-transform duration-500"
              style={{
                transform: `translateX(-${(index * 100) / slidesPerView}%)`,
                width: `${(reviews.length * 100) / slidesPerView}%`,
              }}
            >
              {reviews.map((item, i) => (
                <div key={i} className="px-3" style={{ flex: `0 0 ${100 / reviews.length}%` }}>
                  <div className="bg-surface rounded-xl p-6 relative shadow-sm h-full border border-border">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                      className="w-6 absolute top-4 right-4"
                      alt="Google"
                    />

                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={item.img}
                        className="w-10 h-10 rounded-full"
                        alt={`${item.name} avatar`}
                      />
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>

                    <div className="flex text-yellow-400 mb-3">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star key={si} size={14} className="fill-yellow-400" />
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

