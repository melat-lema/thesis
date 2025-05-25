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
    description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript",
    price: 490.99,
    categoryName: "Computer Science",
    imageQuery: "web development coding",
    chapters: [
      {
        title: "HTML Basics",
        description: "Learn the building blocks of web pages",
        videoUrl: "https://8dg1as0ubv.ufs.sh/f/iWf3XgLUDu2KpJsjadvUrteNHQ98LcPka17M4ngiIFRjyAKE",
        isFree: true,
      },
      {
        title: "CSS Styling",
        description: "Make your websites beautiful with CSS",
        videoUrl: "https://8dg1as0ubv.ufs.sh/f/iWf3XgLUDu2KLElGytw9d1YObhIBMNTJnzPFAjvxGCDZlqom",
      },
    ],
  },
  {
    title: "Digital Photography Masterclass",
    description: "Master the art of digital photography from basics to advanced techniques",
    price: 7990.99,
    categoryName: "Photography",
    imageQuery: "camera photography",
    chapters: [
      {
        title: "Understanding Your Camera",
        description: "Learn about camera settings and modes",
        videoUrl: "https://8dg1as0ubv.ufs.sh/f/iWf3XgLUDu2KjcB8zaD8ly0wJrKOg62FPXj34hckstxHiAWb",
        isFree: true,
      },
      {
        title: "Composition Techniques",
        description: "Create stunning compositions",
        videoUrl: "https://8dg1as0ubv.ufs.sh/f/iWf3XgLUDu2KMv0KN3HrSkdunaYUKWgAviq9J1fO2sMFcZ83",
      },
    ],
  },
  {
    title: "Music Theory 101",
    description: "Understanding the fundamentals of music theory",
    price: 39.99,
    categoryName: "Music",
    imageQuery: "music notes piano",
    chapters: [
      {
        title: "Notes and Scales",
        description: "Learn about musical notes and scales",
        videoUrl: "https://8dg1as0ubv.ufs.sh/f/iWf3XgLUDu2K8mMqcw7bXUCAYDjq4ur2JmTcMiPlHzwFZ81n",
        isFree: true,
      },
    ],
  },
  {
    title: "Fitness Fundamentals",
    description: "Get in shape with this comprehensive fitness course",
    price: 59.99,
    categoryName: "Fitness",
    imageQuery: "fitness workout gym",
    chapters: [
      {
        title: "Warm-up Routines",
        description: "Essential warm-up exercises",
        videoUrl: "https://8dg1as0ubv.ufs.sh/f/iWf3XgLUDu2KccwuB944YWuV9anUGjPOy1Cbr0fRkJSNIzlL",
        isFree: true,
      },
    ],
  },
  {
    title: "Financial Accounting Basics",
    description: "Master the fundamentals of accounting and bookkeeping",
    price: 69.99,
    categoryName: "Accounting",
    imageQuery: "accounting finance",
    chapters: [
      {
        title: "Basic Bookkeeping",
        description: "Learn bookkeeping fundamentals",
        videoUrl: "https://8dg1as0ubv.ufs.sh/f/iWf3XgLUDu2KccwuB944YWuV9anUGjPOy1Cbr0fRkJSNIzlL",
        isFree: true,
      },
    ],
  },
  {
    title: "Videography for Beginners",
    description: "Start your journey in video production",
    price: 89.99,
    categoryName: "Filming",
    imageQuery: "videography camera",
    chapters: [
      {
        title: "Camera Basics",
        description: "Understanding your video camera",
        videoUrl: "https://youtu.be/sample8",
        isFree: true,
      },
    ],
  },
  {
    title: "Engineering Mathematics",
    description: "Essential mathematics for engineers",
    price: 79.99,
    categoryName: "Engineering",
    imageQuery: "engineering mathematics",
    chapters: [
      {
        title: "Calculus Fundamentals",
        description: "Basic calculus concepts",
        videoUrl: "https://youtu.be/sample9",
        isFree: true,
      },
    ],
  },
  {
    title: "Portrait Photography",
    description: "Master the art of portrait photography",
    price: 69.99,
    categoryName: "Photography",
    imageQuery: "portrait photography",
    chapters: [
      {
        title: "Lighting Basics",
        description: "Understanding portrait lighting",
        videoUrl: "https://youtu.be/sample10",
        isFree: true,
      },
    ],
  },
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

      // Create course
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
              videoUrl: chapter.videoUrl,
              position: index + 1,
              isPublished: true,
              isFree: chapter.isFree || false,
            })),
          },
        },
      });

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
