import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPayment } from "@/lib/chapa";

export async function POST(req) {
  const body = await req.text();
  const hdrs = await headers();
  const signature = hdrs.get("Chapa-Signature");

  try {
    // Parse webhook payload
    const data = JSON.parse(body);
    const { tx_ref } = data;

    // Defensive: check verifyPayment is a function
    if (typeof verifyPayment !== "function") {
      console.error("verifyPayment is not a function", verifyPayment);
      return new NextResponse("Internal Server Error: verifyPayment not a function", {
        status: 500,
      });
    }

    // Verify the payment status
    const verification = await verifyPayment(tx_ref);

    console.log("verification", verification);
    if (verification.status === "success") {
      const transaction = await db.chapaTransaction.findUnique({
        where: {
          tx_ref: tx_ref,
        },
      });

      console.log("transaction", transaction);
      if (!transaction) {
        return new NextResponse("Transaction not found", { status: 404 });
      }

      // Ensure courseId is present in the transaction (should be stored at creation)
      const courseId = transaction.courseId;
      if (!courseId) {
        return new NextResponse("courseId missing in transaction", { status: 400 });
      }

      // Check if purchase already exists
      const existingPurchase = await db.purchase.findUnique({
        where: {
          userId_courseId: {
            userId: transaction.userId,
            courseId: courseId,
          },
        },
      });

      if (!existingPurchase) {
        // Create purchase record
        await db.purchase.create({
          data: {
            userId: transaction.userId,
            courseId: courseId,
          },
        });
      }

      // Update transaction status
      await db.chapaTransaction.update({
        where: {
          tx_ref: tx_ref,
        },
        data: {
          status: "completed",
        },
      });

      return new NextResponse("Success", { status: 200 });
    }

    return new NextResponse("Payment not verified", { status: 400 });
  } catch (error) {
    console.log("[CHAPA_WEBHOOK_ERROR]", error);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}
