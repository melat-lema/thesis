export default function Banner() {
  return (
    <>
      {/* Banner-1 */}
      <div className="py-20 flex justify-center bg-neutral-100">
        <div className="w-full max-w-7xl bg-blue-100 px-6 py-16 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="animate__animated animate__fadeInUp">
              <h1 className="text-4xl sm:text-5xl font-bold text-orange-500 mb-6">
                Explore Free Courses
              </h1>
              <p className="text-lg text-gray-800 mb-6">
                Start your online learning journey at Edu Assist with short-term, in-demand domain courses.
              </p>
              <a
                href="/signup"
                className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-all duration-300"
              >
                Start For Free
              </a>
            </div>
            <div className="h-[400px] animate__animated animate__fadeInUp">
              <img
                className="w-full h-full object-cover rounded-lg shadow-md"
                src="/img1.jpg"
                alt="Banner Image"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Banner-2 */}
      <div className="py-20 flex justify-center bg-neutral-100">
        <div
          className="w-full max-w-7xl bg-cover bg-center px-6 py-16 rounded-xl shadow-lg text-white"
          
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="h-[400px] animate__animated animate__fadeInUp">
              <img
                className="w-full h-full object-cover rounded-lg shadow-md"
                src="/img.jpg"
                alt="Instructor Banner"
              />
            </div>
            <div className="animate__animated animate__fadeInUp">
              <h1 className="text-4xl sm:text-5xl font-bold text-orange-400 mb-6">
                Become an Instructor
              </h1>
              <p className="text-lg mb-6 text-black">
                Share your knowledge globally. Edu Assist gives you all the tools you need to teach what you love.
              </p>
              <a
                href="/instructor"
                className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-all duration-300"
              >
                Start Teaching Today
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
