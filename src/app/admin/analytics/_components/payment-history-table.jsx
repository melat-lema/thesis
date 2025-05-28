"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export function PaymentHistoryTable({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-gray-500">No payment history available</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Course</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="whitespace-nowrap">
                {formatDistanceToNow(new Date(payment.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>{payment.userName}</TableCell>
              <TableCell className="max-w-[200px] truncate">{payment.courseTitle}</TableCell>
              <TableCell className="text-right">ETB {payment.amount.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <Badge
                  variant={
                    payment.status === "completed"
                      ? "success"
                      : payment.status === "pending"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {payment.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
