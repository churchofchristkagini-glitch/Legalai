import { FeatureCard } from '../FeatureCard';
import { Search } from 'lucide-react';

export default function FeatureCardExample() {
  return (
    <div className="p-4">
      <FeatureCard
        icon={Search}
        title="Intelligent Legal Search"
        description="Search through thousands of Nigerian cases and statutes with AI-powered semantic understanding"
        tier="Pro"
      />
    </div>
  );
}
