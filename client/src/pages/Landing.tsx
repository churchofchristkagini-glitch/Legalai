import { HeroSection } from "@/components/HeroSection";
import { FeatureCard } from "@/components/FeatureCard";
import { PricingCard } from "@/components/PricingCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Brain, 
  FileText, 
  Scale, 
  Zap, 
  Users,
  BookOpen,
  TrendingUp,
  Shield
} from "lucide-react";

export default function Landing() {
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
            <Button variant="ghost" data-testid="button-login">
              Log In
            </Button>
            <Button data-testid="button-signup">Sign Up</Button>
          </div>
        </div>
      </header>

      <HeroSection />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Legal Professionals
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to research, analyze, and cite Nigerian law with confidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Search}
              title="AI-Powered Search"
              description="Search through thousands of Nigerian cases and statutes with intelligent semantic understanding"
              tier="Free"
            />
            <FeatureCard
              icon={Brain}
              title="Case Analysis"
              description="Get instant summaries, headnotes, and key principles from any Nigerian case"
              tier="Pro"
            />
            <FeatureCard
              icon={FileText}
              title="Citation Generator"
              description="Generate properly formatted citations following Nigerian legal standards"
              tier="Pro"
            />
            <FeatureCard
              icon={BookOpen}
              title="Statute Navigator"
              description="Navigate laws, sections, amendments, and cross-references with ease"
              tier="Pro"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Precedent Tracking"
              description="Track how legal principles evolve over time and identify overruled cases"
              tier="Enterprise"
            />
            <FeatureCard
              icon={Users}
              title="Team Collaboration"
              description="Research together with role-based permissions and shared folders"
              tier="Enterprise"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free, upgrade as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              name="Free"
              price="₦0"
              description="Perfect for students"
              features={[
                "100 AI queries per month",
                "Basic case search",
                "5GB document storage",
                "Community support",
                "Mobile app access"
              ]}
            />
            <PricingCard
              name="Pro"
              price="₦15,000"
              description="For legal professionals"
              features={[
                "Unlimited AI queries",
                "Advanced case search",
                "Citation generator",
                "Case summarizer & briefs",
                "50GB storage",
                "Export to PDF/DOCX",
                "Priority support"
              ]}
              recommended
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              description="For law firms & institutions"
              features={[
                "Everything in Pro",
                "Team collaboration",
                "Precedent finder",
                "AI drafting assistant",
                "Unlimited storage",
                "White-label option",
                "Dedicated account manager"
              ]}
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Get answers in seconds, not hours of manual research
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your research data is encrypted and never shared
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Always Updated</h3>
              <p className="text-muted-foreground">
                Access the latest cases and statutory amendments
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About Us</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">AI Search</a></li>
                <li><a href="#" className="hover:text-foreground">Case Analysis</a></li>
                <li><a href="#" className="hover:text-foreground">Citations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">API</a></li>
                <li><a href="#" className="hover:text-foreground">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 NaijaLaw AI Chat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
