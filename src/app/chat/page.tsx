import { ChatClient } from "@/components/chat-client";
import { MessageCircle } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-4 mb-8">
        <MessageCircle className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Companion</h1>
          <p className="text-muted-foreground">Your personal AI for supportive and empathetic conversations.</p>
        </div>
      </header>
      <div className="flex-grow flex flex-col">
        <ChatClient />
      </div>
    </div>
  );
}
