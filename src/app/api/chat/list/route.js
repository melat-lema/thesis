import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First get the user's database ID
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

    // Get all users who have exchanged messages with the current user
    const chats = await db.user.findMany({
      where: {
        OR: [
          {
            sentMessages: {
              some: {
                receiverId: currentUser.id,
              },
            },
          },
          {
            receivedMessages: {
              some: {
                senderId: currentUser.id,
              },
            },
          },
        ],
        NOT: {
          id: currentUser.id,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        sentMessages: {
          where: {
            receiverId: currentUser.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        receivedMessages: {
          where: {
            senderId: currentUser.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    // Format the response to include the last message
    const formattedChats = chats.map((chat) => {
      const lastSentMessage = chat.sentMessages[0];
      const lastReceivedMessage = chat.receivedMessages[0];
      let lastMessage = null;

      if (lastSentMessage && lastReceivedMessage) {
        lastMessage =
          lastSentMessage.createdAt > lastReceivedMessage.createdAt
            ? lastSentMessage
            : lastReceivedMessage;
      } else {
        lastMessage = lastSentMessage || lastReceivedMessage;
      }

      return {
        id: chat.id,
        name: chat.name,
        imageUrl: chat.image, // Map image to imageUrl for frontend
        lastMessage,
      };
    });

    return NextResponse.json(formattedChats);
  } catch (error) {
    console.error("[CHAT_LIST_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
