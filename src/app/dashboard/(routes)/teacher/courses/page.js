import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
// Correct Import

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";


const CoursesPage = async () => {
  const {userId}= await auth();

  if(!userId){
    return redirect("/dashboard")
    

  }
  console.log("userId:", userId);
  const courses= await db.course.findMany({
    where: {
        userId,
    },
    orderBy:{
        createdAt: "desc",
    }
  })
  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
      
    </div>
  );
};

export default CoursesPage;
