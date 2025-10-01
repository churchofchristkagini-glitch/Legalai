```typescript
import { useState } from "react"; // Import useState
import { ThemeToggle } from "@/components/ThemeToggle";
import { StatCard } from "@/components/StatCard";
import { DocumentCard } from "@/components/DocumentCard";
import { SubscriptionStatus } from "@/components/SubscriptionStatus";
import { Button } from "@/components/ui/button";
import { Scale, Search, FileText, Clock, Upload } from "lucide-react";
import { DocumentUploadDialog } from "@/components/DocumentUploadDialog"; // Import the new dialog
import { useDocuments } from "@/hooks/useDocuments"; // Import the new hook
import { useAuth } from "@/hooks/useAuth"; // Import useAuth to check if user is logged in
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading states

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth(); // Get user and auth loading state
  const { documents, loading: documentsLoading } = useDocuments(); // Use the new hook
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false); // State for dialog visibility

  if (authLoading || documentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-8 w-8 rounded-full mx-auto mb-4" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login or show a message if not authenticated
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">NaijaLaw AI</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" data-testid="button-profile">
              Profile
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your legal research activity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Queries"
            value="1,234"
            icon={Search}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Documents"
            value={documents.length.toString()} // Display actual document count
            icon={FileText}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Research Hours"
            value="127"
            icon={Clock}
            trend={{ value: 8, isPositive: false }}
          />
          <StatCard
            title="Cases Cited"
            value="342"
            icon={Scale}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Documents</h2>
              <Button variant="outline" className="gap-2" onClick={() => setIsUploadDialogOpen(true)} data-testid="button-upload">
                <Upload className="h-4 w-4" /> Upload
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.length === 0 ? (
                <p className="text-muted-foreground col-span-full">No documents uploaded yet. Click "Upload" to add one.</p>
              ) : (
                documents.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    title={doc.title}
                    type={doc.type.toUpperCase()}
                    uploadDate={new Date(doc.created_at).toLocaleDateString()}
                    size={doc.file_size ? `${(doc.file_size / 1024).toFixed(1)} KB` : 'N/A'}
                  />
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Subscription</h2>
            <SubscriptionStatus
              tier="Free"
              queriesUsed={45}
              queriesLimit={100}
              storageUsed={1.2}
              storageLimit={5}
            />
          </div>
        </div>
      </main>

      <DocumentUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
      />
    </div>
  );
}
```