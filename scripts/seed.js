const { PrismaClient } = require("@prisma/client");
const { createApi } = require("unsplash-js");
const nodeFetch = require("node-fetch");

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// Initialize Unsplash - you'll need to add UNSPLASH_ACCESS_KEY to your .env
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch: nodeFetch,
});

const TEACHER_ID = "cmb1v2o3s0000u61svb5byvhh"; // We'll use this constant ID for seeding
const VIDEO_URL = "https://8dg1as0ubv.ufs.sh/f/iWf3XgLUDu2KccwuB944YWuV9anUGjPOy1Cbr0fRkJSNIzlL";

async function getRandomUnsplashImage(query) {
  const result = await unsplash.search.getPhotos({
    query,
    perPage: 1,
  });

  if (result.response?.results?.length > 0) {
    return result.response.results[0].urls.regular;
  }
  return "https://images.unsplash.com/photo-1497633762265-9d179a990aa6"; // Fallback image
}

const courses = [
  {
    title: "Introduction to Web Development",
    description: `Learn the fundamentals of web development including HTML, CSS, and JavaScript. This course will guide you through the basics of building modern, responsive websites from scratch. You'll gain hands-on experience with real-world projects, understand the structure of web pages, and learn how to style and add interactivity. By the end, you'll be able to create your own portfolio site and have a solid foundation for further learning in web technologies. No prior experience required!`,
    price: 490.99,
    categoryName: "Computer Science",
    imageQuery: "web development coding",
    chapters: [
      {
        title: "HTML Basics",
        description:
          "Learn the building blocks of web pages, including elements, tags, and document structure. You'll create your first web page!",
        videoUrl: VIDEO_URL,
        isFree: true,
      },
      {
        title: "CSS Styling",
        description:
          "Make your websites beautiful with CSS. Learn about selectors, properties, and how to create responsive layouts.",
        videoUrl: VIDEO_URL,
      },
    ],
  },
  {
    title: "Digital Photography Masterclass",
    description: `Master the art of digital photography from basics to advanced techniques. This course covers camera settings, composition, lighting, and post-processing. You'll learn how to take stunning photos in any situation, understand the science behind great images, and develop your own creative style. Perfect for beginners and enthusiasts looking to take their skills to the next level!`,
    price: 7990.99,
    categoryName: "Photography",
    imageQuery: "camera photography",
    chapters: [
      {
        title: "Understanding Your Camera",
        description:
          "Learn about camera settings and modes, including ISO, aperture, and shutter speed. Get out of auto mode!",
        videoUrl: VIDEO_URL,
        isFree: true,
      },
      {
        title: "Composition Techniques",
        description:
          "Create stunning compositions using the rule of thirds, leading lines, and framing. Make your photos stand out!",
        videoUrl: VIDEO_URL,
      },
    ],
  },
  {
    title: "Music Theory 101",
    description: `Understanding the fundamentals of music theory. This course will help you read music, understand scales and chords, and unlock the secrets behind your favorite songs. Whether you play an instrument or just love music, you'll gain valuable insights and practical skills to improve your musicality.`,
    price: 39.99,
    categoryName: "Music",
    imageQuery: "music notes piano",
    chapters: [
      {
        title: "Notes and Scales",
        description:
          "Learn about musical notes, scales, and how melodies are constructed. Start playing simple tunes!",
        videoUrl: VIDEO_URL,
        isFree: true,
      },
    ],
  },
  {
    title: "Fitness Fundamentals",
    description: `Get in shape with this comprehensive fitness course. Learn about exercise routines, nutrition, and how to set achievable goals. This course is designed for all fitness levels and will help you build strength, improve flexibility, and boost your overall health. Includes guided workouts and expert tips!`,
    price: 59.99,
    categoryName: "Fitness",
    imageQuery: "fitness workout gym",
    chapters: [
      {
        title: "Warm-up Routines",
        description:
          "Essential warm-up exercises to prevent injury and prepare your body for workouts.",
        videoUrl: VIDEO_URL,
        isFree: true,
      },
    ],
  },
  {
    title: "Financial Accounting Basics",
    description: `Master the fundamentals of accounting and bookkeeping. This course covers financial statements, debits and credits, and the accounting cycle. You'll learn how to keep accurate records, understand business finances, and prepare for more advanced accounting topics. Ideal for students, entrepreneurs, and anyone interested in finance.`,
    price: 69.99,
    categoryName: "Accounting",
    imageQuery: "accounting finance",
    chapters: [
      {
        title: "Basic Bookkeeping",
        description:
          "Learn bookkeeping fundamentals, including journals, ledgers, and balancing accounts.",
        videoUrl: VIDEO_URL,
        isFree: true,
      },
    ],
  },
  {
    title: "Videography for Beginners",
    description: `Start your journey in video production. Learn about camera operation, shot composition, lighting, and editing. This course will help you create professional-looking videos for YouTube, social media, or personal projects. No prior experience needed!`,
    price: 89.99,
    categoryName: "Filming",
    imageQuery: "videography camera",
    chapters: [
      {
        title: "Camera Basics",
        description:
          "Understanding your video camera, settings, and how to shoot high-quality footage.",
        videoUrl: VIDEO_URL,
        isFree: true,
      },
    ],
  },
  {
    title: "Engineering Mathematics",
    description: `Essential mathematics for engineers. This course covers calculus, linear algebra, and differential equations with practical engineering applications. Strengthen your problem-solving skills and gain confidence in tackling complex math problems.`,
    price: 79.99,
    categoryName: "Engineering",
    imageQuery: "engineering mathematics",
    chapters: [
      {
        title: "Calculus Fundamentals",
        description:
          "Basic calculus concepts, including limits, derivatives, and integrals, with engineering examples.",
        videoUrl: VIDEO_URL,
        isFree: true,
      },
    ],
  },
  {
    title: "Portrait Photography",
    description: `Master the art of portrait photography. Learn about lighting, posing, and editing to create stunning portraits. This course is perfect for aspiring photographers who want to capture the personality and beauty of their subjects. Includes practical assignments and feedback!`,
    price: 69.99,
    categoryName: "Photography",
    imageQuery: "portrait photography",
    chapters: [
      {
        title: "Lighting Basics",
        description:
          "Understanding portrait lighting, natural vs. studio light, and how to flatter your subject.",
        videoUrl: VIDEO_URL,
        isFree: true,
      },
    ],
  },
];

const dummyComments = [
  "This course is amazing! Highly recommended.",
  "Very informative and well structured.",
  "I learned a lot, thank you!",
  "Great content and easy to follow.",
  "Perfect for beginners!",
  "The instructor explains everything clearly.",
  "Loved the practical examples.",
  "Helped me improve my skills a lot!",
];

async function main() {
  try {
    // Create teacher if doesn't exist
    const teacher = await prisma.user.upsert({
      where: { id: TEACHER_ID },
      update: {},
      create: {
        id: TEACHER_ID,
        name: "Yeabsira Tarekegn",
        email: "yabahane5@gmail.com",
        clerkId: "user_2xTpVzpaE8jyI3vaQATvXPFao48",
        role: "TEACHER",
      },
    });

    // Create categories if they don't exist
    const existingCategories = await prisma.category.findMany();
    if (existingCategories.length === 0) {
      await prisma.category.createMany({
        data: [
          { name: "Computer Science" },
          { name: "Music" },
          { name: "Fitness" },
          { name: "Accounting" },
          { name: "Filming" },
          { name: "Engineering" },
          { name: "Photography" },
        ],
      });
    }

    // Get all categories
    const categories = await prisma.category.findMany();

    // Create courses
    for (const courseData of courses) {
      const category = categories.find((c) => c.name === courseData.categoryName);
      if (!category) continue;

      // Get image from Unsplash
      const imageUrl = await getRandomUnsplashImage(courseData.imageQuery);

      // Create course with chapters
      const course = await prisma.course.create({
        data: {
          title: courseData.title,
          description: courseData.description,
          price: courseData.price,
          imageUrl: imageUrl,
          isPublished: true,
          teacherId: teacher.id,
          categoryId: category.id,
          chapters: {
            create: courseData.chapters.map((chapter, index) => ({
              title: chapter.title,
              description: chapter.description,
              videoUrl: VIDEO_URL,
              position: index + 1,
              isPublished: true,
              isFree: chapter.isFree || false,
            })),
          },
        },
        include: { chapters: true },
      });

      // Add dummy comments
      for (let i = 0; i < 3; i++) {
        await prisma.comment.create({
          data: {
            content: dummyComments[Math.floor(Math.random() * dummyComments.length)],
            userId: teacher.id,
            courseId: course.id,
          },
        });
      }

      console.log(`Created course: ${course.title}`);
    }

    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Error seeding the database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
