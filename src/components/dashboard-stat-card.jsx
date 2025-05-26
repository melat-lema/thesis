import { cn } from "@/lib/utils";

export function DashboardStatCard({ label, value, subLabel, icon }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border bg-white p-6 min-w-[250px] h-[120px] shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm font-medium">{label}</div>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="flex items-end justify-between mt-2">
        <div>
          <div className="text-3xl font-bold text-black">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{subLabel}</div>
        </div>
      </div>
    </div>
  );
}
