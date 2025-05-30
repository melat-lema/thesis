"use client";

import { useEffect, useRef, useState, use } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatPage({ params }) {
  const { user } = useUser();
  const userId = use(params).userId;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const scrollRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      console.log("Fetching messages and user for ID:", userId);
      fetchMessages();
      fetchOtherUser();
    }
  }, [userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchOtherUser = async () => {
    try {
      console.log("Fetching other user with ID:", userId);
      const response = await fetch(`/api/users/${userId}`);
      console.log("User fetch response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched other user data:", data);
        setOtherUser(data);
      } else {
        console.error("Failed to fetch user:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching other user:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      console.log("Fetching messages for user ID:", userId);
      const response = await fetch(`/api/chat?userId=${userId}`);
      console.log("Messages fetch response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched messages:", data);
        setMessages(data);
      } else {
        console.error("Failed to fetch messages:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage,
          receiverId: userId,
        }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages((prev) => [...prev, message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">Invalid user ID</div>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin mr-3" />
        <div className="text-muted-foreground">Loading user information...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar>
          <AvatarImage src={otherUser.imageUrl} />
          <AvatarFallback>{otherUser.name?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{otherUser.name}</h2>
          <p className="text-sm text-muted-foreground">{otherUser.email}</p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.receiver.id === otherUser.id;

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-2 max-w-[70%] ${
                    isOwnMessage ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={isOwnMessage ? user?.imageUrl : message.sender.imageUrl} />
                    <AvatarFallback>
                      {isOwnMessage ? user?.firstName?.[0] : message.sender.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwnMessage
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted rounded-tl-none"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
