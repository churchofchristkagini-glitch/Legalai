import { ThemeToggle } from "@/components/ThemeToggle";
import { StatCard } from "@/components/StatCard";
import { DocumentCard } from "@/components/DocumentCard";
import { SubscriptionStatus } from "@/components/SubscriptionStatus";
import { Button } from "@/components/ui/button";
import { Scale, Search, FileText, Clock, Upload } from "lucide-react";

export default function Dashboard() {
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
            value="48"
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
              <Button variant="outline" className="gap-2" data-testid="button-upload">
                <Upload className="h-4 w-4" /> Upload
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DocumentCard
                title="Constitution of Nigeria 1999"
                type="PDF"
                uploadDate="Jan 15, 2024"
                size="2.4 MB"
              />
              <DocumentCard
                title="Evidence Act 2011"
                type="PDF"
                uploadDate="Jan 12, 2024"
                size="1.8 MB"
              />
              <DocumentCard
                title="Criminal Procedure Act"
                type="DOCX"
                uploadDate="Jan 10, 2024"
                size="956 KB"
              />
              <DocumentCard
                title="Companies Act 2020"
                type="PDF"
                uploadDate="Jan 8, 2024"
                size="3.2 MB"
              />
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
    </div>
  );
}
