import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req){

    const {createdBy}= await req.json();
    const result = await db.studyMaterial.findMany({
        where: {
          createdBy: createdBy,
        },
      });
    return NextResponse.json({result:result})
}