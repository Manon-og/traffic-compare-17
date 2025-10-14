import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useState } from "react";

interface TimeSeriesData {
  cycle_id: number;
  run_id: string;
  value: number;
  timestamp_step?: number;
}

interface LaneBreakdownData {
  lane_id: string;
  Fixed_Time: number;
  D3QN_Single_Agent?: number;
  D3QN_Multi_Agent?: number;
  rl_01?: number; // Legacy compatibility
}

interface TrafficChartProps {
  timeSeriesData: TimeSeriesData[];
  laneData: LaneBreakdownData[];
  selectedCycle?: number;
  onCycleSelect?: (cycle: number) => void;
  metric?: string;
}

export const TrafficChart = ({
  timeSeriesData,
  laneData,
  selectedCycle,
  onCycleSelect,
  metric = "",
}: TrafficChartProps) => {
  const [smoothing, setSmoothing] = useState(false);

  // Group time series data by run_id
  const groupedData = timeSeriesData.reduce((acc, item) => {
    if (!acc[item.cycle_id]) {
      acc[item.cycle_id] = { cycle_id: item.cycle_id };
    }
    acc[item.cycle_id][item.run_id] = item.value;
    return acc;
  }, {} as Record<number, any>);

  const chartData = Object.values(groupedData).sort(
    (a, b) => a.cycle_id - b.cycle_id
  );

  // Apply simple smoothing if enabled
  const processedData = smoothing ? applySmoothing(chartData) : chartData;

  const handleChartClick = (data: any) => {
    if (data && data.activeLabel && onCycleSelect) {
      onCycleSelect(parseInt(data.activeLabel));
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Series Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>{metric} Over Time</CardTitle>
              <InfoTooltip content="Shows how passenger throughput changes across traffic cycles. Click any point to see detailed lane breakdown for that specific cycle. Higher values indicate better passenger service and system efficiency." />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="smoothing"
                checked={smoothing}
                onCheckedChange={setSmoothing}
              />
              <Label htmlFor="smoothing" className="text-sm">
                Smooth
              </Label>
              <InfoTooltip content="Applies moving average smoothing to reduce noise and show clearer trends in the data." />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="cycle_id" height={50} />
              <YAxis
                label={{
                  value: metric,
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    textAnchor: "middle",
                    fontSize: "12px",
                    padding: "0 15px",
                  },
                }}
              />
              <Tooltip
                labelFormatter={(value) => `Cycle ${value}`}
                formatter={(value: number, name: string) => {
                  let displayName = "RL Algorithm";
                  if (name.includes("Fixed Time")) displayName = "Fixed Time";
                  else if (name.includes("D3QN Multi"))
                    displayName = "D3QN Multi Agent";
                  return [value.toFixed(1), displayName];
                }}
              />
              <Legend />
              {Object.keys(groupedData).length > 0 &&
                Object.keys(groupedData[Object.keys(groupedData)[0]])
                  .filter((key) => key !== "cycle_id")
                  .map((runId, index) => (
                    <Line
                      key={runId}
                      type="monotone"
                      dataKey={runId}
                      stroke={
                        runId.includes("Fixed Time")
                          ? "hsl(var(--baseline-color))"
                          : runId.includes("D3QN Single")
                          ? "hsl(var(--rl-color))"
                          : runId.includes("D3QN Multi")
                          ? "hsl(220 70% 50%)"
                          : "hsl(var(--rl-color))"
                      }
                      strokeWidth={2}
                      dot={{
                        fill: runId.includes("Fixed Time")
                          ? "hsl(var(--baseline-color))"
                          : runId.includes("D3QN Single")
                          ? "hsl(var(--rl-color))"
                          : runId.includes("D3QN Multi")
                          ? "hsl(220 70% 50%)"
                          : "hsl(var(--rl-color))",
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                        stroke: "hsl(var(--primary))",
                        strokeWidth: 2,
                      }}
                    />
                  ))}
            </LineChart>
          </ResponsiveContainer>
          {/* <div className="mt-3 p-3 bg-muted/30 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 <strong>How to read this chart:</strong> Each line represents a
              different control system's passenger service performance. Higher
              throughput values indicate better passenger experience. Click any
              point to see detailed lane-by-lane breakdown for that cycle.
              {selectedCycle && ` Currently viewing: Cycle ${selectedCycle}`}
            </p>
          </div> */}
        </CardContent>
      </Card>

      {/* Lane Breakdown Chart */}
    </div>
  );
};

// Simple moving average smoothing
const applySmoothing = (data: any[], window = 3) => {
  if (data.length < window) return data;

  return data.map((item, index) => {
    const start = Math.max(0, index - Math.floor(window / 2));
    const end = Math.min(data.length, start + window);
    const slice = data.slice(start, end);

    const smoothed = { ...item };
    Object.keys(item).forEach((key) => {
      if (key !== "cycle_id" && typeof item[key] === "number") {
        const values = slice
          .map((d) => d[key])
          .filter((v) => typeof v === "number");
        if (values.length > 0) {
          smoothed[key] =
            values.reduce((sum, val) => sum + val, 0) / values.length;
        }
      }
    });

    return smoothed;
  });
};
