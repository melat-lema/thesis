// import { StartConversation } from "@/components/chat/StartConversation";
import StartConversation from "@/components/chat/StartConversation";
import { Navbar } from "../dashboard/_components/navbar";

export default function ChatLayout({ children }) {
  return (
    <div className="h-full">
      <Navbar />
      <div className="h-[calc(100vh-4rem)] flex">
        <StartConversation />
        <main className="flex-1 h-full">{children}</main>
      </div>
    </div>
  );
}
