import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Mic, Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-4 mx-auto max-w-4xl px-4">
      <div className="bg-card border border-card-border rounded-3xl shadow-2xl p-2">
        <div className="flex items-end gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="shrink-0"
            data-testid="button-attach"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Nigerian case law, statutes, or legal principles..."
            className="resize-none border-0 focus-visible:ring-0 min-h-[48px] max-h-[200px]"
            data-testid="input-chat"
          />
          
          <div className="flex gap-1 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              data-testid="button-voice"
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!message.trim()}
              data-testid="button-send"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
