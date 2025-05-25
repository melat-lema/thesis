import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { initializePayment } from "@/lib/chapa";
import { v4 as uuidv4 } from "uuid";

export async function POST(req, { params }) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    const course = await db.course.findUnique({ where: { id: courseId } });
    console.log("user", user);

    if (!user) {
      console.log("user not found");
      return new NextResponse("User not found", { status: 404 });
    }

    console.log("course", course);

    if (!course) {
      console.log("course not found");
      return new NextResponse("Course not found", { status: 404 });
    }

    console.log("Clerk userId:", userId);
    console.log("DB user.id:", user.id);
    console.log("Checking for purchase:", { userId: user.id, courseId });

    const existingPurchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    console.log("existingPurchase", existingPurchase);

    if (existingPurchase) {
      return new NextResponse("You already purchased this course", {
        status: 400,
      });
    }

    const tx_ref = uuidv4();

    // Create ChapaTransaction record
    await db.chapaTransaction.create({
      data: {
        userId: user.id,
        courseId,
        tx_ref,
        amount: Number(course.price),
        status: "pending",
      },
    });

    const fullName = user.name?.trim() || "User Name";
    const [first_name, ...rest] = fullName.split(" ");
    const last_name = rest.join(" ") || "Name";

    const paymentPayload = {
      amount: Number(course.price).toFixed(2), // "100.00"
      currency: "ETB",
      email: user.email || "example@example.com", // fallback
      first_name,
      last_name,
      tx_ref,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/chapa/webhook`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?payment=success`,
      customization: {
        title: course.title.slice(0, 16), // Ensure max 16 chars
        description: `Enroll to ${course.title}`,
      },
    };

    const chapaResponse = await initializePayment(paymentPayload);

    return NextResponse.json({ url: chapaResponse.data.checkout_url });
  } catch (error) {
    console.error("[COURSE_CHECKOUT] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
