import Link from 'next/link';
import Image from 'next/image';

export default function Categories() {
  const categories = [
    { img: 'cat1.jpg', title: 'Microsoft Excel' },
    { img: 'cat2.jpg', title: 'AWS' },
    { img: 'cat3.jpg', title: 'Python' },
    { img: 'cat3.jpg', title: 'Java' },
    { img: 'cat4.jpg', title: 'Web Design' },
    { img: 'cat5.jpg', title: 'Web Development' },
    { img: 'cat6.jpg', title: 'MySQL' },
    { img: 'cat7.jpg', title: 'UI/UX Design' },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h6 className="bg-white text-sm uppercase tracking-wider font-semibold text-gray-600 px-4 py-2 inline-block shadow-md">
            Categories
          </h6>
          <h1 className="text-3xl sm:text-4xl font-bold text-orange-500 mt-4">
            Popular Topics to Explore
          </h1>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-orange-50"
            >
              <div className="mb-4">
                <Image
                  src={`/${category.img}`}
                  alt={category.title}
                  width={120}
                  height={120}
                  className="mx-auto rounded-full object-cover"
                />
              </div>
              <Link href="#">
                <h5 className="text-lg font-semibold text-gray-700 hover:text-orange-500 transition">
                  {category.title}
                </h5>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
