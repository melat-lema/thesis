// app/api/webhooks/clerk/route.js
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET');
    return new NextResponse('Server configuration error', { status: 500 });
  }

  // Verify webhook signature
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error: No Svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;
  try {
    evt = wh.verify(body, { svix_id, svix_timestamp, svix_signature });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new NextResponse('Invalid signature', { status: 403 });
  }

  // Handle user creation
  if (evt.type === 'user.created') {
    try {
      const { id, email_addresses, first_name, last_name, username } = evt.data;
      const email = email_addresses[0]?.email_address;
      
      if (!email) {
        console.error('No email found in webhook payload');
        return new NextResponse('Missing email', { status: 400 });
      }

      // Enhanced role detection
      let role = 'STUDENT';
      const domain = email.split('@')[1];
      switch(domain) {
        case 'school.edu': role = 'TEACHER'; break;
        case 'admin.edu': role = 'ADMIN'; break;
        // Add other domain rules as needed
      }

      // Save to database with transaction for safety
      await db.$transaction([
        db.user.create({
          data: {
            clerkId: id,
            email,
            name: first_name && last_name 
              ? `${first_name} ${last_name}` 
              : username || email.split('@')[0],
            role,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      ]);

      // Update Clerk metadata
      await clerkClient.users.updateUser(id, {
        publicMetadata: { role },
        privateMetadata: { domain }
      });

      console.log(`User ${email} created as ${role}`);

    } catch (error) {
      console.error('Error processing user.created:', error);
      return new NextResponse('Database error', { status: 500 });
    }
  }

  // Handle user updates if needed
  if (evt.type === 'user.updated') {
    // Add your update logic here
  }

  return NextResponse.json({ success: true });
}