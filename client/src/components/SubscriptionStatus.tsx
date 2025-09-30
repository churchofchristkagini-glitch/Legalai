import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";

interface SubscriptionStatusProps {
  tier: "Free" | "Pro" | "Enterprise";
  queriesUsed: number;
  queriesLimit: number;
  storageUsed: number;
  storageLimit: number;
}

export function SubscriptionStatus({
  tier,
  queriesUsed,
  queriesLimit,
  storageUsed,
  storageLimit,
}: SubscriptionStatusProps) {
  const isFreeTier = tier === "Free";
  const queriesPercentage = (queriesUsed / queriesLimit) * 100;
  const storagePercentage = (storageUsed / storageLimit) * 100;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Current Plan</h3>
          <p className="text-2xl font-bold text-primary mt-1" data-testid="text-subscription-tier">
            {tier}
          </p>
        </div>
        {isFreeTier && (
          <Button variant="default" size="sm" className="gap-2" data-testid="button-upgrade">
            Upgrade <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">AI Queries</span>
            <span className="font-medium" data-testid="text-queries-used">
              {queriesUsed} / {queriesLimit}
            </span>
          </div>
          <Progress value={queriesPercentage} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Storage</span>
            <span className="font-medium" data-testid="text-storage-used">
              {storageUsed}GB / {storageLimit}GB
            </span>
          </div>
          <Progress value={storagePercentage} className="h-2" />
        </div>
      </div>
    </Card>
  );
}
