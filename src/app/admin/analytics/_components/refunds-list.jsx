"use client";

import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function RefundsList({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-gray-500">No refunds available</div>;
  }

  return (
    <div className="space-y-4">
      {data.map((refund) => (
        <div key={refund.id} className="flex flex-col space-y-2 p-4 rounded-lg border bg-card">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Refund for {refund.courseTitle}</p>
              <p className="text-sm text-muted-foreground">User: {refund.userName}</p>
            </div>
            <Badge variant="destructive">ETB {refund.amount.toLocaleString()}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Reason: {refund.reason}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(refund.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
