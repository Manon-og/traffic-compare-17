import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { BaselineComparison } from "@/data/training/trainingData";

interface BaselineComparisonChartProps {
  baselines: BaselineComparison[];
  d3qnValue: number;
  metric:
    | "avg_passenger_throughput"
    | "avg_waiting_time"
    | "jeepneys_processed";
  title: string;
}

export const BaselineComparisonChart = ({
  baselines,
  d3qnValue,
  metric,
  title,
}: BaselineComparisonChartProps) => {
  const data = [
    ...baselines.map((b) => ({
      system: "Fixed Time",
      value: b[metric],
    })),
    {
      system: "D3QN Multi Agent",
      value: d3qnValue,
    },
  ];

  const metricLabels = {
    avg_passenger_throughput: "Passengers per Cycle",
    avg_waiting_time: "Average Waiting Time (seconds)",
    jeepneys_processed: "Public Vehicles Processed",
  };

  // Color coding: D3QN in primary, Fixed Time in baseline color
  const getBarColor = (systemName: string) => {
    if (systemName === "D3QN Multi Agent") return "hsl(var(--primary))";
    return "hsl(var(--baseline-color))";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{title}</CardTitle>
          <InfoTooltip content="Comparison of D3QN Multi Agent performance against Fixed Time baseline control system. D3QN shows significant improvements in passenger-centric metrics." />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="system" />
            <YAxis
              label={{
                value: metricLabels[metric],
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={(value: number) => value.toFixed(1)}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Legend />
            <Bar
              dataKey="value"
              name={metricLabels[metric]}
              radius={[8, 8, 0, 0]}
            >
              {data.map((entry, index) => (
                <Bar
                  key={`bar-${index}`}
                  dataKey="value"
                  fill={getBarColor(entry.system)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 p-3 bg-muted/30 rounded-md">
          <p className="text-sm text-muted-foreground">
            📊 <strong>Baseline Comparison:</strong> D3QN Multi Agent
            consistently outperforms traditional Fixed Time control across all
            passenger-centric metrics. The improvements demonstrate the
            effectiveness of reinforcement learning for urban traffic
            optimization.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
