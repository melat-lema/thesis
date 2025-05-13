'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

export default function Carousel() {
  const slides = [
    {
      src: '/carousel2.jpg',
      title: 'WELCOME TO EDU-ASSIST',
      subtitle: 'Interactive Learning Experience',
      subsubtitles:
        'Engage with interactive lessons, quizzes and projects. Experience hands-on learning that keeps you motivated and inspired.',
    },
    {
      src: '/image.png',
      title: 'BEST E-LEARNING PLATFORM',
      subtitle: 'Access top-notch educational content anytime and anywhere.',
      subsubtitles:
        'Explore a wide range of courses designed to enhance your expertise in technology, business, art, and more. Start learning today!',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideCount = slides.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[700px] mb-6 overflow-hidden">
      {/* Slide Container */}
      <div
        className="flex transition-transform duration-1000 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-full h-full relative flex-shrink-0"
          >
            <img
              src={slide.src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-[rgba(24,29,56,0.7)] flex items-center">
              <div className="max-w-screen-xl mx-auto px-4">
                <div className="w-full sm:w-10/12 lg:w-8/12 py-12 md:py-20">
                  <h5 className="text-orange-500 text-xl mb-3 font-medium">
                    {slide.title}
                  </h5>
                  <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 font-serif">
                    {slide.subtitle}
                  </h1>
                  <p className="text-white text-base md:text-lg mb-6 leading-relaxed font-light">
                    {slide.subsubtitles}
                  </p>
                  <div className="flex gap-4">
                    <Link href="/about">
                      <div className="bg-orange-500 text-white py-3 px-5 rounded-md shadow-md hover:bg-orange-600 transition">
                        Read More
                      </div>
                    </Link>
                    <Link href="/sign-up">
                      <div className="bg-white text-black py-3 px-5 rounded-md shadow-md hover:bg-gray-200 transition">
                        Join Now
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows on Right */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-3 z-10">
        <button
          onClick={prevSlide}
          className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-800 transition"
          aria-label="Previous"
        >
          <SlArrowLeft />
        </button>
        <button
          onClick={nextSlide}
          className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-800 transition"
          aria-label="Next"
        >
          <SlArrowRight />
        </button>
      </div>
    </div>
  );
}
