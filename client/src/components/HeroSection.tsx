import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@assets/generated_images/Nigerian_Supreme_Court_hero_image_592186bd.png";

export function HeroSection() {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          AI-Powered Legal Research <br className="hidden sm:block" />
          for Nigerian Lawyers
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
          Access comprehensive Nigerian case law, statutes, and legal precedents 
          with intelligent AI assistance. Research faster, cite accurately, win more cases.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 gap-2"
            data-testid="button-start-free"
          >
            Start Free <ArrowRight className="h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm gap-2"
            data-testid="button-see-demo"
          >
            <Play className="h-5 w-5" /> See Demo
          </Button>
        </div>
        <p className="mt-8 text-sm text-white/80">
          Trusted by 500+ Legal Professionals across Nigeria
        </p>
      </div>
    </div>
  );
}
