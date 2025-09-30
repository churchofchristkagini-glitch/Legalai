import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Scale, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sendMessage, sending, currentSession, createSession } = useChat();
  const { user, signOut } = useAuth();

  const handleSend = async (message: string) => {
    if (!currentSession) {
      // Create a new session if none exists
      const newSession = await createSession();
      if (!newSession) return;
    }
    await sendMessage(message);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex h-screen">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <ChatSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur-lg bg-background/80 border-b">
          <div className="px-4 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                data-testid="button-menu"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="flex items-center gap-2">
                <Scale className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold hidden sm:inline">NaijaLaw AI</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {user && (
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{user.email}</span>
                </div>
              )}
              <ThemeToggle />
              {user && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSignOut}
                  data-testid="button-sign-out"
                >
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatMessages />
          <div className="shrink-0">
            <ChatInput 
              onSend={handleSend} 
              disabled={sending}
              placeholder={
                currentSession 
                  ? "Ask about Nigerian case law, statutes, or legal principles..."
                  : "Start a new conversation about Nigerian law..."
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}