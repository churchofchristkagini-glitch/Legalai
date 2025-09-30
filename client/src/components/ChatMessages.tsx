import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ChatMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import { useChat } from "@/hooks/useChat";

interface ChatMessagesProps {
  className?: string;
}

export function ChatMessages({ className }: ChatMessagesProps) {
  const { messages, loading, currentSession } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!currentSession) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">Welcome to NaijaLaw AI</h3>
          <p className="text-muted-foreground mb-4">
            Your AI-powered legal research assistant for Nigerian law. 
            Start a new conversation to begin researching cases, statutes, and legal principles.
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Ask about Nigerian case law and precedents</p>
            <p>• Search through legal statutes and regulations</p>
            <p>• Get help with legal research and citations</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <MessageSkeleton isUser={false} />
          <MessageSkeleton isUser={true} />
          <MessageSkeleton isUser={false} />
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">Start the conversation</h3>
            <p className="text-muted-foreground">
              Ask me anything about Nigerian law, legal precedents, or statutes.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                citations={message.sources}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </ScrollArea>
  );
}

function MessageSkeleton({ isUser }: { isUser: boolean }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        <div
          className={`px-6 py-4 rounded-2xl ${
            isUser
              ? 'bg-primary/10'
              : 'bg-card border border-card-border'
          }`}
        >
          <Skeleton className="h-4 w-64 mb-2" />
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}