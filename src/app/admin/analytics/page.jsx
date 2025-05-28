"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Users, BookOpen, MessageSquare, DollarSign, CreditCard } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { PlatformInsights } from "./_components/platform-insights";
import { PaymentAnalytics } from "./_components/payment-analytics";
import { useEffect, useState } from "react";

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/admin/analytics");
        if (!response.ok) throw new Error("Failed to fetch analytics");
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            Platform Insights
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Payment Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <PlatformInsights data={analytics?.platform} />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentAnalytics data={analytics?.payments} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
