import { StatCard } from '../StatCard';
import { Search } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <StatCard
        title="Total Queries"
        value="1,234"
        icon={Search}
        trend={{ value: 12, isPositive: true }}
      />
    </div>
  );
}
