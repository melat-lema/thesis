import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content, receiverId } = await req.json();

    if (!content || !receiverId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get the sender's database ID
    const sender = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!sender) {
      return new NextResponse("Sender not found", { status: 404 });
    }

    const message = await db.message.create({
      data: {
        content,
        senderId: sender.id,
        receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Map image to imageUrl for frontend
    const formattedMessage = {
      ...message,
      sender: {
        ...message.sender,
        imageUrl: message.sender.image,
      },
      receiver: {
        ...message.receiver,
        imageUrl: message.receiver.image,
      },
    };

    return NextResponse.json(formattedMessage);
  } catch (error) {
    console.error("[CHAT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get("userId");

    if (!otherUserId) {
      return new NextResponse("Missing user ID", { status: 400 });
    }

    // Get the current user's database ID
    const currentUser = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const messages = await db.message.findMany({
      where: {
        OR: [
          {
            AND: [{ senderId: currentUser.id }, { receiverId: otherUserId }],
          },
          {
            AND: [{ senderId: otherUserId }, { receiverId: currentUser.id }],
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Map image to imageUrl for frontend
    const formattedMessages = messages.map((message) => ({
      ...message,
      sender: {
        ...message.sender,
        imageUrl: message.sender.image,
      },
      receiver: {
        ...message.receiver,
        imageUrl: message.receiver.image,
      },
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("[CHAT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
