import { auth } from "@clerk/nextjs/server";
import { getCourses } from "actions/get-courses";
import { Categories } from "@/app/dashboard/(routes)/search/_components/categories";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CoursesList } from "@/components/courses-list";
import { SearchInput } from "@/components/search-input";

export default async function BrowsePage({ searchParams }) {
  const { userId } = await auth();
  
  if (!userId) {
    return redirect("/");
  }

  // Ensure searchParams is properly destructured
  const { title, categoryId } = await searchParams || {};

  // Fetch data in parallel
  const [categories, courses] = await Promise.all([
    db.category.findMany({
      orderBy: { name: "asc" }
    }),
    getCourses({
      userId,
      ...(title && { title }),
      ...(categoryId && { categoryId })
    })
  ]);

  return (
    <>
      <div className="px-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
}