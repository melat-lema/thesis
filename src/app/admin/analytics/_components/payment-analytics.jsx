"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { RevenueChart } from "./revenue-chart";
import { TeacherEarningsTable } from "./teacher-earnings-table";
import { PaymentHistoryTable } from "./payment-history-table";
import { RefundsList } from "./refunds-list";

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
