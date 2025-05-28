import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { teacherId, isVerified } = await req.json();
    if (!teacherId) {
      return new NextResponse("Missing teacherId", { status: 400 });
    }
    const updated = await db.user.update({
      where: { id: teacherId },
      data: { emailVerified: isVerified ? new Date() : null },
      select: {
        id: true,
        emailVerified: true,
      },
    });
    return NextResponse.json({
      id: updated.id,
      isVerified: !!updated.emailVerified,
    });
  } catch (error) {
    console.error("[ADMIN_DASHBOARD_TEACHERS_VERIFY]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
