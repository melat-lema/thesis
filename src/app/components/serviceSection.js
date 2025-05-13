import Link from 'next/link';

export default function ServiceSection() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-orange-500 text-3xl sm:text-4xl md:text-5xl font-semibold mb-4">
            Invest in your professional goals with Edu Assist
          </h1>
          <p className="text-lg text-gray-700">
            Get unlimited access to over 90% of courses, projects, and specializations taught by top instructors and professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Service Item 1 */}
          <div className="text-center p-6 bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:shadow-xl hover:text-orange-500 hover:-translate-y-2">
            <img src="/icon1.png" alt="Learn Anything" className="mx-auto mb-4 w-28" />
            <h5 className="text-xl font-medium mb-2">Learn anything</h5>
            <p className="text-gray-600">
              Explore any interest or trending topic, take prerequisites, and advance your skills.
            </p>
          </div>

          {/* Service Item 2 */}
          <div className="text-center p-6 bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:shadow-xl hover:text-orange-500 hover:-translate-y-2">
            <img src="/icon2.png" alt="Save Money" className="mx-auto mb-4 w-28" />
            <h5 className="text-xl font-medium mb-2">Save money</h5>
            <p className="text-gray-600">
              Spend less on your learning if you plan to take multiple courses this year.
            </p>
          </div>

          {/* Service Item 3 */}
          <div className="text-center p-6 bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:shadow-xl hover:text-orange-500 hover:-translate-y-2">
            <img src="/icon3.png" alt="Flexible Learning" className="mx-auto mb-4 w-28" />
            <h5 className="text-xl font-medium mb-2">Flexible learning</h5>
            <p className="text-gray-600">
              Learn at your own pace, switch courses anytime, and progress on your terms.
            </p>
          </div>

          {/* Service Item 4 */}
          <div className="text-center p-6 bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:shadow-xl hover:text-orange-500 hover:-translate-y-2">
            <img src="/icon4.png" alt="Community Support" className="mx-auto mb-4 w-28" />
            <h5 className="text-xl font-medium mb-2">Community support</h5>
            <p className="text-gray-600">
              Join a vibrant learning community where you can ask questions, share insights, and collaborate with peers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
