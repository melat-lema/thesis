"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function ChatList() {
  const { user } = useUser();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chat/list");
      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  return (
    <div className="p-2">
      <h2 className="text-sm font-medium text-muted-foreground mb-2 ">Continue Conversation</h2>
      {chats.map((chat) => (
        <Link
          key={chat.id}
          href={`/chat/${chat.id}`}
          className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors"
        >
          <Avatar>
            <AvatarImage src={chat.imageUrl} />
            <AvatarFallback>{chat.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{chat.name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {chat.lastMessage?.content || "No messages yet"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
