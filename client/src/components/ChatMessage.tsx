import { Card } from "@/components/ui/card";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  citations?: Array<{
    caseName: string;
    year: string;
    court: string;
  }>;
}

export function ChatMessage({ role, content, citations }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        <div
          className={`px-6 py-4 rounded-2xl ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-card-border'
          }`}
          data-testid={`message-${role}`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
        
        {citations && citations.length > 0 && (
          <div className="space-y-2 w-full">
            {citations.map((citation, idx) => (
              <Card
                key={idx}
                className="p-4 border-l-4 border-l-primary hover-elevate cursor-pointer transition-all"
                data-testid={`citation-${idx}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-sm font-medium">{citation.caseName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {citation.year} • {citation.court}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
