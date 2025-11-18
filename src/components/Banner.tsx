"use client";

import { useEffect, useState } from "react";
import SearchBar from "./Searchbar";

const images = [
  "/image1.jpg",
  "/image5.jpg",
  "/image2.jpg",
  "/image4.jpg",
  "/image3.jpg",
  "/image6.jpg",
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center font-sans">
      {/* Sliding Background Images */}
      <div
        className="absolute inset-0 flex w-full h-full transition-transform duration-1000"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            className="w-full h-full flex-shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />

      {/* Banner Content */}
      <div className="relative z-10 text-center text-white px-4">
        <p className="text-base sm:text-lg md:text-xl uppercase tracking-[0.3em] text-gray-300 font-light mb-4">
          Welcome To
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase mb-6 
          bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-300 text-transparent bg-clip-text
          tracking-tight drop-shadow-[0_3px_10px_rgba(59,130,246,0.4)]">
          Ticketing App
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl font-light text-gray-200 leading-relaxed mb-8">
          Discover and book tickets for the most exciting concerts, sports, theatre, and live events — all in one place.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative z-10 w-full lg:max-w-2xl mt-2 px-4">
        <SearchBar />
      </div>
    </section>
  );
};

export default Banner;
