// import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
// import Stripe from "stripe";

import { db } from "@/lib/db";
import { stripe } from "@/lib/strip";
import { currentUser } from "@clerk/nextjs/server";
// import { currentUser } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    const user = await currentUser();
    const { courseId } = await params;

    //     console.log("user :", user);
    console.log("user.id :", user.id);
    console.log("user.emailAddresses[0].emailAddress :", user.emailAddresses[0].emailAddress);

    console.log("courseId :", courseId);
    //     console.log("params :", params);

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });
    console.log("course found :", course);
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const lineItems = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description,
          },
          unit_amount: Math.round(course.price * 100),
        },
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomer: true,
      },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomer: customer.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomer,
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/courses/${
        course.id
      }?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/courses/${
        course.id
      }?canceled=1`,
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
