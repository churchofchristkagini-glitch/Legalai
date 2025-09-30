import { PricingCard } from '../PricingCard';

export default function PricingCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <PricingCard
        name="Pro"
        price="₦15,000"
        description="For legal professionals"
        features={[
          "Unlimited AI queries",
          "Advanced case search",
          "Citation generator",
          "Case summarizer",
          "Export to PDF/DOCX"
        ]}
        recommended
      />
    </div>
  );
}
