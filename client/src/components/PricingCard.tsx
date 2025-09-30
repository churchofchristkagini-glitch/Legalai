import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export function PricingCard({ name, price, description, features, recommended }: PricingCardProps) {
  return (
    <Card 
      className={`p-8 relative ${recommended ? 'border-primary border-2' : ''}`}
      data-testid={`card-pricing-${name.toLowerCase()}`}
    >
      {recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
            Recommended
          </span>
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <div className="mb-2">
          <span className="text-4xl font-bold">{price}</span>
          {price !== "Custom" && <span className="text-muted-foreground">/month</span>}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        className="w-full" 
        variant={recommended ? "default" : "outline"}
        data-testid={`button-select-${name.toLowerCase()}`}
      >
        Get Started
      </Button>
    </Card>
  );
}
