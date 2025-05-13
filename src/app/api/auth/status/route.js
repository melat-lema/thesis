// app/api/auth/status/route.js
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

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

    // 3. Query user data
    console.log(`Querying user data for clerkId: ${userId}`);
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { role: true }
    });

    console.log('User query result:', user ? 'Found' : 'Not found');
    
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