"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { RevenueChart } from "./revenue-chart";
import { TeacherEarningsTable } from "./teacher-earnings-table";
import { PaymentHistoryTable } from "./payment-history-table";
import { RefundsList } from "./refunds-list";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PaymentAnalytics({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Financial Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardStatCard
          label="Total Revenue"
          value={`ETB ${data.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6" />}
        />
        <DashboardStatCard
          label="Platform Revenue"
          value={`ETB ${data.platformRevenue.toLocaleString()}`}
          icon={<CreditCard className="w-6 h-6" />}
        />
        <DashboardStatCard
          label="Teacher Payouts"
          value={`ETB ${data.teacherPayouts.toLocaleString()}`}
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <DashboardStatCard
          label="Refunds"
          value={`ETB ${data.totalRefunds.toLocaleString()}`}
          icon={<AlertCircle className="w-6 h-6" />}
        />
      </div>

      {/* Detailed Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.teacherEarnings.map((teacher) => (
              <div key={teacher.userId} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{teacher.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Earnings</p>
                    <p className="font-medium">ETB {teacher.earnings.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Platform Fee (20%)</p>
                    <p className="font-medium">ETB {(teacher.earnings * 0.2).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teacher Payout (80%)</p>
                    <p className="font-medium">ETB {(teacher.earnings * 0.8).toLocaleString()}</p>
                  </div>
                </div>
                {/* Course-specific breakdown */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Course-wise Breakdown</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Platform Fee</TableHead>
                        <TableHead className="text-right">Teacher Payout</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teacher.courses?.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>{course.title}</TableCell>
                          <TableCell className="text-right">
                            ETB {course.earnings.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ETB {(course.earnings * 0.2).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ETB {(course.earnings * 0.8).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue per Course */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue per Course</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart data={data.revenuePerCourse} />
        </CardContent>
      </Card>

      {/* Teacher Earnings */}
      <Card>
        <CardHeader>
          <CardTitle>Teacher Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <TeacherEarningsTable data={data.teacherEarnings} />
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentHistoryTable data={data.paymentHistory} />
        </CardContent>
      </Card>

      {/* Refunds */}
      <Card>
        <CardHeader>
          <CardTitle>Refunds Issued</CardTitle>
        </CardHeader>
        <CardContent>
          <RefundsList data={data.refunds} />
        </CardContent>
      </Card>
    </div>
  );
}
