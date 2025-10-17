import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { TrafficData } from "@/data/sampleData";
import { TrainingEpisode } from "@/data/training/trainingData";

interface MetricChartProps {
  data: TrafficData[];
  metric: string;
  title: string;
  episodes?: TrainingEpisode[];
  selectedIntersection?: string;
  onCycleHover?: (episode: TrainingEpisode | null) => void;
}

export const MetricChart = ({
  data,
  metric,
  title,
  episodes = [],
  selectedIntersection = "all",
  onCycleHover,
}: MetricChartProps) => {
  // Filter episodes by intersection
  const filteredEpisodes =
    selectedIntersection === "all"
      ? episodes
      : episodes.filter((ep) => ep.intersection_id === selectedIntersection);
  // Map metric keys to actual data properties
  const metricMapping: Record<string, keyof TrafficData> = {
    passenger_throughput: "passenger_throughput",
    public_vehicle_throughput: "public_vehicle_throughput",
    passenger_waiting_time: "passenger_waiting_time",
    overall_vehicle_throughput: "total_count", // Total vehicles processed
  };

  const actualMetric = metricMapping[metric] || "passenger_throughput";

  // Group data by run_id and cycle
  const chartData = data.reduce((acc, item) => {
    const existing = acc.find((d) => d.cycle_id === item.cycle_id);

    if (existing) {
      existing[item.run_id] = item[actualMetric] as number;
    } else {
      acc.push({
        cycle_id: item.cycle_id,
        [item.run_id]: item[actualMetric] as number,
      });
    }

    return acc;
  }, [] as any[]);

  // Sort by cycle_id
  chartData.sort((a, b) => a.cycle_id - b.cycle_id);

  // Get unique run_ids
  const runIds = [...new Set(data.map((d) => d.run_id))];

  // Metric configurations
  const metricConfig: Record<string, { label: string; higherBetter: boolean }> =
    {
      passenger_throughput: {
        label: "Passengers per Cycle",
        higherBetter: true,
      },
      public_vehicle_throughput: {
        label: "Public Vehicles per Cycle",
        higherBetter: true,
      },
      passenger_waiting_time: {
        label: "Waiting Time (seconds)",
        higherBetter: false,
      },
      overall_vehicle_throughput: {
        label: "Total Vehicles per Cycle",
        higherBetter: true,
      },
    };

  const config = metricConfig[metric] || { label: metric, higherBetter: true };

  // Custom tooltip that emits episode data on hover
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const cycleId = payload[0].payload.cycle_id;

      if (onCycleHover && filteredEpisodes.length > 0) {
        // Find the most recent episode for this cycle
        const episode = filteredEpisodes
          .filter((ep) => ep.scenario_cycle === cycleId)
          .sort((a, b) => b.episode_number - a.episode_number)[0];

        if (episode) {
          console.log(
            "Tooltip found episode:",
            episode.episode_number,
            "for cycle:",
            cycleId,
            "intersection:",
            episode.intersection_id
          );
          onCycleHover(episode);
        } else {
          console.warn("No episode found for cycle:", cycleId);
        }
      }
    } else if (!active && onCycleHover) {
      onCycleHover(null);
    }

    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
        <p className="text-sm font-semibold mb-2">
          Cycle {payload[0].payload.cycle_id}
          {selectedIntersection !== "all" && (
            <span className="text-muted-foreground ml-2">
              ({selectedIntersection})
            </span>
          )}
        </p>
        {payload.map((entry: any) => {
          const displayName = entry.name.includes("Fixed Time")
            ? "Fixed Time"
            : "D3QN Multi Agent";
          return (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{displayName}:</span>
              <span className="font-semibold">{entry.value.toFixed(1)}</span>
            </div>
          );
        })}
        <p className="text-xs text-muted-foreground mt-2">
          {selectedIntersection === "all"
            ? "Averaged across all intersections"
            : "Hover to see vehicle breakdown"}
        </p>
      </div>
    );
  };

  return (
    <Card className="transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{title}</CardTitle>
            <InfoTooltip
              content={`Comparison of ${title.toLowerCase()} between Fixed Time and D3QN Multi Agent control systems across traffic cycles. ${
                selectedIntersection === "all"
                  ? "Data is averaged across all intersections."
                  : `Showing data for ${selectedIntersection} intersection only.`
              } Hover over the chart to see detailed vehicle type breakdown.`}
            />
          </div>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Fixed Time
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              D3QN Multi Agent
            </Badge>
          </div>
        </div>
        {selectedIntersection !== "all" && (
          <Badge variant="secondary" className="mt-2">
            📍 {selectedIntersection}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="cycle_id"
              label={{
                value: "Traffic Cycle",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: config.label,
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {runIds.map((runId) => (
              <Line
                key={runId}
                type="monotone"
                dataKey={runId}
                stroke={
                  runId.includes("Fixed Time")
                    ? "hsl(142 76% 36%)"
                    : "hsl(var(--primary))"
                }
                strokeWidth={2}
                dot={false}
                name={
                  runId.includes("Fixed Time")
                    ? "Fixed Time"
                    : "D3QN Multi Agent"
                }
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-3 p-3 bg-muted/30 rounded-md">
          <p className="text-sm text-muted-foreground">
            📊 <strong>Performance Analysis:</strong>{" "}
            {config.higherBetter ? "Higher" : "Lower"} values indicate better
            performance. D3QN Multi Agent adapts to traffic conditions in
            real-time, while Fixed Time uses pre-programmed signal timing.{" "}
            <strong>Notice how throughput improves as cycles progress,</strong>{" "}
            demonstrating the system's learning and optimization capabilities.
            {selectedIntersection === "all" && (
              <> Values shown are averages across all three intersections.</>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
