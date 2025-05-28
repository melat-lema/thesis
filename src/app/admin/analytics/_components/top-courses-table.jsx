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

export function TopCoursesTable({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-gray-500">No course data available</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Title</TableHead>
            <TableHead className="text-right">Students</TableHead>
            <TableHead className="text-right">Comments</TableHead>
            <TableHead className="text-right">Engagement Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((course) => {
            // Calculate engagement score (weighted average of students and comments)
            const engagementScore =
              Math.round((course.students * 0.7 + course.comments * 0.3) * 10) / 10;

            return (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell className="text-right">{course.students}</TableCell>
                <TableCell className="text-right">{course.comments}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      engagementScore > 50
                        ? "success"
                        : engagementScore > 20
                        ? "warning"
                        : "destructive"
                    }
                  >
                    {engagementScore}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
