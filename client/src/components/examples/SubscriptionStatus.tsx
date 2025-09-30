import { SubscriptionStatus } from '../SubscriptionStatus';

export default function SubscriptionStatusExample() {
  return (
    <div className="p-4 max-w-md">
      <SubscriptionStatus
        tier="Free"
        queriesUsed={45}
        queriesLimit={100}
        storageUsed={1.2}
        storageLimit={5}
      />
    </div>
  );
}
