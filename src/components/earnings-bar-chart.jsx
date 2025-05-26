"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function EarningsBarChart({ data }) {
  if (!Array.isArray(data)) return <div>No chart data.</div>;

  return (
    <div className="w-full h-full bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Earnings per Course</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data || []} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="title"
            angle={-15}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `ETB ${Number(value).toLocaleString()}`} />
          <Bar dataKey="earnings" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
