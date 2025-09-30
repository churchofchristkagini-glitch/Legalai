import { useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Scale, Plus, Menu } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: Array<{
    caseName: string;
    year: string;
    court: string;
  }>;
}

export default function Chat() {
  // todo: remove mock functionality
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI legal research assistant for Nigerian law. How can I help you today?",
    },
  ]);

  const handleSend = (content: string) => {
    setMessages([...messages, { role: "user", content }]);
    
    // todo: remove mock functionality - Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I understand your question about Nigerian law. Let me search through the relevant cases and statutes to provide you with an accurate answer...",
        citations: [
          {
            caseName: "FRN v. Osahon",
            year: "2006",
            court: "Supreme Court"
          }
        ]
      }]);
    }, 1000);
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
        <div className="px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" data-testid="button-menu">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold hidden sm:inline">NaijaLaw AI</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" data-testid="button-new-chat">
              <Plus className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} {...msg} />
            ))}
          </div>
        </ScrollArea>
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
}
