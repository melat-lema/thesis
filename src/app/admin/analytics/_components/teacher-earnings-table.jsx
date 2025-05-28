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

export function TeacherEarningsTable({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-gray-500">No earnings data available</div>;
  }

  // Sort data by earnings in descending order
  const sortedData = [...data].sort((a, b) => b.earnings - a.earnings);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Teacher ID</TableHead>
            <TableHead className="text-right">Earnings</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((teacher) => (
            <TableRow key={teacher.userId}>
              <TableCell className="font-medium">{teacher.userId}</TableCell>
              <TableCell className="text-right">ETB {teacher.earnings.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <Badge
                  variant={
                    teacher.earnings > 10000
                      ? "success"
                      : teacher.earnings > 1000
                      ? "warning"
                      : "default"
                  }
                >
                  {teacher.earnings > 10000
                    ? "High Earner"
                    : teacher.earnings > 1000
                    ? "Mid Earner"
                    : "New Teacher"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
