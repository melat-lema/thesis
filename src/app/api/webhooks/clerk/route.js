import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, public_metadata } = evt.data;

    // Get the role from metadata or default to STUDENT
    const role = public_metadata?.role || "STUDENT";

    // Create user in database
    await db.user.create({
      data: {
        userId: id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`.trim(),
        role: role,
      },
    });

    return NextResponse.json({ message: "User created" });
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, public_metadata } = evt.data;

    // Get the role from metadata or keep existing role
    const role = public_metadata?.role;

    // Update user in database
    await db.user.update({
      where: { userId: id },
      data: {
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`.trim(),
        ...(role && { role }), // Only update role if it exists in metadata
      },
    });

    return NextResponse.json({ message: "User updated" });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    // Delete user from database
    await db.user.delete({
      where: { userId: id },
    });

    return NextResponse.json({ message: "User deleted" });
  }

  return NextResponse.json({ message: "Webhook received" });
}
