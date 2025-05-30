import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChatList from "@/components/chat/ChatList";
import StartConversation from "@/components/chat/StartConversation";

export default async function ChatPage() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  return (
    <div className="flex h-screen">
      <div className="flex">
        {/* <ChatList /> */}
        {/* <StartConversation /> */}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <h2 className="text-2xl font-semibold mb-2">Select a chat</h2>
          <p>Choose a conversation from the list or start a new one</p>
        </div>
      </div>
    </div>
  );
}
