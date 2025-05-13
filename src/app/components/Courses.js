import Link from 'next/link';
import Image from 'next/image';

export default function CoursesList() {
  const courses = [
    {
      img: 'course-1.jpg',
      title: 'HTML Course for Beginners',
      rating: 4.55,
      learners: '5.8L+',
      level: 'Beginner',
      duration: '2.0 Hrs',
      price: 'FREE',
      link: '#',
    },
    {
      img: 'course-2.jpg',
      title: 'Front End Development - CSS',
      rating: 4.55,
      learners: '5.2L+',
      level: 'Beginner',
      duration: '4.0 Hrs',
      price: 'PAID',
      link: '#',
    },
    {
      img: 'course-3.jpg',
      title: 'JavaScript Basics',
      rating: 4.8,
      learners: '3.5L+',
      level: 'Intermediate',
      duration: '3.5 Hrs',
      price: 'FREE',
      link: '#',
    },
    {
      img: 'course-4.jpg',
      title: 'Python Programming',
      rating: 4.9,
      learners: '8.2L+',
      level: 'Beginner',
      duration: '5.0 Hrs',
      price: 'PAID',
      link: '#',
    },
    {
      img: 'course-5.jpg',
      title: 'Web Development with React',
      rating: 4.75,
      learners: '7.4L+',
      level: 'Intermediate',
      duration: '6.0 Hrs',
      price: 'FREE',
      link: '#',
    },
    {
      img: 'course-6.jpg',
      title: 'Advanced JavaScript',
      rating: 4.85,
      learners: '4.1L+',
      level: 'Advanced',
      duration: '7.0 Hrs',
      price: 'PAID',
      link: '#',
    },
    {
      img: 'course-7.jpg',
      title: 'Node.js for Beginners',
      rating: 4.7,
      learners: '3.9L+',
      level: 'Beginner',
      duration: '3.0 Hrs',
      price: 'FREE',
      link: '#',
    },
    {
      img: 'course-8.jpg',
      title: 'Mastering CSS Flexbox',
      rating: 4.6,
      learners: '2.7L+',
      level: 'Intermediate',
      duration: '4.0 Hrs',
      price: 'PAID',
      link: '#',
    },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h6 className="inline-block text-sm uppercase bg-white shadow px-4 py-2 font-semibold tracking-wide text-gray-600">
            Popular Courses
          </h6>
          <h1 className="text-3xl sm:text-4xl font-bold text-orange-500 mt-4">
            Explore new and trending free online courses
          </h1>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-xl hover:-translate-y-1 transform duration-300"
            >
              {/* Image */}
              <div className="relative">
                <Image
                  src={`/img/${course.img}`}
                  alt={course.title}
                  width={400}
                  height={250}
                  className="w-full h-52 object-cover"
                />
                <span
                  className={`absolute top-4 left-4 px-2 py-1 text-xs font-bold rounded ${
                    course.price === 'FREE' ? 'bg-orange-500' : 'bg-green-600'
                  } text-white`}
                >
                  {course.price}
                </span>
              </div>

              {/* Course Info */}
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 hover:text-orange-500 transition">
                  <Link href={course.link}>{course.title}</Link>
                </h3>

                <div className="text-sm text-gray-600 mb-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <i className="fa fa-star text-yellow-500" />
                    {course.rating} Rating
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa fa-user-graduate" />
                    {course.learners} Learners
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa fa-user" />
                    Level: {course.level}
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa fa-clock" />
                    Duration: {course.duration}
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="font-bold text-gray-800">
                    {course.price === 'FREE' ? 'ETB 0' : 'ETB 199'}
                  </span>
                  <Link href={course.link}>
                    <div className="text-sm font-bold text-orange-500 hover:underline flex items-center gap-2">
                      Enroll Now <i className="fa fa-chevron-right" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
