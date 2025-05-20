import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/express';

export async function GET(request) {
  try {
    console.log('Auth status check initiated');

    // 1. Verify Clerk authentication
    const { userId } = await auth(request);
    console.log('Authenticated userId:', userId);

    if (!userId) {
      console.warn('No user ID found - unauthorized');
      return NextResponse.json(
        { ready: false, error: 'NOT_AUTHENTICATED' },
        { status: 401 }
      );
    }

    // 2. Test database connection
    try {
      console.log('Testing database connection...');
      await db.$queryRaw`SELECT 1`;
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json(
        { ready: false, error: 'DATABASE_UNAVAILABLE' },
        { status: 503 }
      );
    }

    // 3. Query user data in your DB
    console.log(`Querying user data for clerkId: ${userId}`);
    let user = null;
    try {
      user = await db.user.findUnique({
        where: { clerkId: userId },
        select: { role: true }
      });
      console.log('User query result:', user);
    } catch (findError) {
      console.error('Error querying user:', findError);
    }

    // 4. If user does not exist, fetch email from Clerk and create them in your DB
    if (!user) {
      console.log('User not found in DB, attempting to create...');
      try {
        // Fetch Clerk user info
const clerkUser = await clerkClient.users.getUser(userId);
        const email = clerkUser.emailAddresses[0]?.emailAddress;

        user = await db.user.create({
          data: { clerkId: userId, email },
          select: { role: true }
        });
        console.log('User created in DB for clerkId:', userId, 'Result:', user);
      } catch (createError) {
        console.error('Error creating user in DB:', createError);
        return NextResponse.json(
          { ready: false, error: 'USER_CREATION_FAILED', details: createError.message },
          { status: 500 }
        );
      }
    } else {
      console.log('User found in DB for clerkId:', userId);
    }

    // 5. Return user status and info
    console.log('Returning response:', {
      ready: !!user,
      role: user?.role,
      clerkId: userId
    });
    return NextResponse.json({
      ready: !!user,
      role: user?.role,
      clerkId: userId
    });

  } catch (error) {
    console.error('Fatal error in status endpoint:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        ready: false, 
        error: 'INTERNAL_SERVER_ERROR',
        details: process.env.NODE_ENV === 'development' 
          ? error.message 
          : undefined
      },
      { status: 500 }
    );
  }
}