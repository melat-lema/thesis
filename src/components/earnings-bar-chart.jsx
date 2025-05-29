"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function EarningsBarChart({ data, title }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-[400px] bg-white rounded-xl shadow p-4 flex items-center justify-center">
        <p className="text-gray-500">No chart data available.</p>
      </div>
    );
  }
  console.log("data :", data);

  // Sort data by earnings in descending order
  const sortedData = [...data].sort((a, b) => b.earnings - a.earnings);

  return (
    <div className="w-full h-[400px] bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-4">{title || "Earnings per Course"}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="title"
            angle={-15}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 12 }}
            height={60}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `ETB ${value.toLocaleString()}`}
          />
          <Tooltip
            formatter={(value) => [`ETB ${Number(value).toLocaleString()}`, "Earnings"]}
            labelFormatter={(label) => `Course: ${label}`}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
          <Legend />
          <Bar
            dataKey="earnings"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
            name="Earnings"
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
