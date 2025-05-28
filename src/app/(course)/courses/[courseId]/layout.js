import { redirect } from "next/navigation";
import CourseSidebar from "./_components/course-sidebar";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { getProgress } from "actions/get-progress";
import { CourseNavbar } from "./_components/course-navbar";

const Layout = async ({ children, params }) => {
  const { userId: clerkUserId } = await auth();
  const courseId = (await params).courseId;

  if (!clerkUserId) {
    return redirect("/");
  }

  // Find the local user by Clerk userId
  const user = await db.user.findUnique({ where: { clerkId: clerkUserId } });
  if (!user) {
    console.log("User not found");
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId: user.id, // Use local DB user ID
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    console.log("Course not found");
    return redirect("/");
  }

  const progressCount = await getProgress(user.id, course.id);
  console.log("Progress Count : ", user.id, course.id);
  console.log("Get Progress : ", progressCount);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="md:pl-80 h-full pt-[80px]">{children}</main>
    </div>
  );
};

export default Layout;

// const Layout = ({ children }) => {
//   return (
//     <html lang="en">
//       <head>
//         <title>Your App Title</title>
//         <meta charSet="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         {/* You can add global stylesheets or meta tags here */}
//       </head>
//       <body>
//         <header>
//           <nav>
//             {/* Put your nav links here */}
//             <a href="/">Home</a>
//             <a href="/courses">Courses</a>
//           </nav>
//         </header>

//         <main>{children}</main>

//         <footer>
//           <p>© 2025 Your Company Name</p>
//         </footer>
//       </body>
//     </html>
//   );
// };

// export default Layout;
