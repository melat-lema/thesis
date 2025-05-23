const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main() {
  try {
    // Check if categories already exist
    const existingCategories = await prisma.category.findMany();
    if (existingCategories.length > 0) {
      console.log("Categories already exist, skipping seed...");
      return;
    }

    // Create initial categories
    const categories = await prisma.category.createMany({
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

    console.log("Successfully seeded categories:", categories);
  } catch (error) {
    console.error("Error seeding the database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log("Seed completed successfully");
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
