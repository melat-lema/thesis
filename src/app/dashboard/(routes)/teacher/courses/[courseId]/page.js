import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"; // <- fixed Clerk import
import { LayoutDashboard, ListChecks, CircleDollarSign, File } from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-forM";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Banners } from "@/components/banners";
import { Actions } from "./_components/actions";

export default async function CoursePage({ params: { courseId } }) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  // First get the user from our database
  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      teacherId: user.id,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  console.log("course :", course);
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  console.log("categories :", categories);
  console.log("course.chapters :", course.chapters);
  if (!course) {
    return redirect("/");
  }

  const hasChapters = course.chapters.length > 0;
  const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    hasChapters && hasPublishedChapter,
  ];

  console.log("Required fields check:", {
    title: !!course.title,
    description: !!course.description,
    imageUrl: !!course.imageUrl,
    price: !!course.price,
    categoryId: !!course.categoryId,
    hasChapters,
    hasPublishedChapter,
    chapters: course.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      isPublished: chapter.isPublished,
    })),
  });

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  console.log("Completion stats:", {
    completedFields,
    totalFields,
    requiredFields,
  });

  const completionText = `(${completedFields} / ${totalFields})`;

  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!course.isPublished && (
        <Banners label="This course is unpublished. It will not visible to the students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
          </div>
          <Actions disabled={!isComplete} courseId={courseId} isPublished={course.isPublished} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources and attachements</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
