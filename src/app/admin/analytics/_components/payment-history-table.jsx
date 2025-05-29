"use client";

import { useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function PaymentHistoryTable({ data }) {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-gray-500">No payment history available</div>;
  }

  const handleRowClick = (payment) => {
    setSelectedTransaction(payment);
  };

  return (
    <>
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
              <TableRow
                key={payment.id}
                onClick={() => handleRowClick(payment)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleRowClick(payment);
                  }
                }}
              >
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

      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-medium">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(selectedTransaction.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Course</p>
                  <p className="font-medium">{selectedTransaction.courseTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student</p>
                  <p className="font-medium">{selectedTransaction.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">ETB {selectedTransaction.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{selectedTransaction.status}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Revenue Split</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Platform Fee (20%)</p>
                    <p className="font-medium">
                      ETB {(selectedTransaction.amount * 0.2).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teacher Payout (80%)</p>
                    <p className="font-medium">
                      ETB {(selectedTransaction.amount * 0.8).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
