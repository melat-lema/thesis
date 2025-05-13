'use client';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function AboutSection() {
  return (
    <div className="py-16 bg-white" id='about'>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <div className="relative h-[600px]">
            <img
              className="w-full h-full object-cover rounded-lg shadow-lg"
              src="/img.jpg"
              alt="About Us"
            />
          </div>

          {/* Content Column */}
          <div>
            <h6 className="bg-white text-start text-xl font-semibold py-1 px-3 inline-block mb-4">
              About Us
            </h6>
            <h1 className="text-3xl sm:text-4xl font-semibold text-orange-500 mb-4">
              Welcome to Edu Assist
            </h1>
            <p className="text-lg text-gray-700 mb-4">
              At Edu Assist, we believe in accessible, innovative learning experiences that adapt to your schedule and
              learning style. Join us in embracing the future of education and unlock your potential with our immersive
              online courses.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              We are dedicated to democratizing education, offering a diverse range of courses taught by industry experts.
              Our mission is to empower learners worldwide through a platform where knowledge knows no limits.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-lg text-gray-700">
                <FaArrowRight className="text-orange-500 mr-2" />
                <p>Expert Instructors</p>
              </div>
              <div className="flex items-center text-lg text-gray-700">
                <FaArrowRight className="text-orange-500 mr-2" />
                <p>Comprehensive Course Catalog</p>
              </div>
              <div className="flex items-center text-lg text-gray-700">
                <FaArrowRight className="text-orange-500 mr-2" />
                <p>Community Engagement</p>
              </div>
              <div className="flex items-center text-lg text-gray-700">
                <FaArrowRight className="text-orange-500 mr-2" />
                <p>Personalized Learning Paths</p>
              </div>
            </div>

            {/* Read More Button */}
            <Link href="/about">
              <div className="bg-orange-500 text-white py-3 px-5 inline-block rounded-lg hover:bg-orange-600 transition-all duration-300">
                Read More
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
