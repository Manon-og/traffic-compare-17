import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { TrainingEpisode } from "@/data/training/trainingData";

interface TrainingProgressChartProps {
  episodes: TrainingEpisode[];
  metric:
    | "passenger_throughput"
    | "avg_waiting_time"
    | "total_reward"
    | "prediction_accuracy"
    | "avg_queue_length";
  title: string;
}

export const TrainingProgressChart = ({
  episodes,
  metric,
  title,
}: TrainingProgressChartProps) => {
  const data = episodes.map((ep) => ({
    episode: ep.episode_number,
    value: ep[metric],
    phase: ep.phase_type,
  }));

  // Find where online training starts
  const onlineStartEpisode = episodes.find(
    (ep) => ep.phase_type === "online"
  )?.episode_number;

  // Split data into offline and online segments for color transition
  // IMPORTANT: Both segments include the transition point to ensure continuity
  const offlineData = data.map((d) => ({
    ...d,
    offlineValue:
      d.episode <= (onlineStartEpisode || Infinity) ? d.value : null,
    onlineValue: d.episode >= (onlineStartEpisode || 0) ? d.value : null,
  }));

  const metricConfig = {
    passenger_throughput: {
      color: "hsl(var(--primary))",
      onlineColor: "hsl(142 76% 36%)", // Green
      label: "Passengers/Cycle",
      higherBetter: true,
    },
    avg_waiting_time: {
      color: "hsl(var(--destructive))",
      onlineColor: "hsl(142 76% 36%)", // Green
      label: "Seconds",
      higherBetter: false,
    },
    total_reward: {
      color: "hsl(var(--primary))",
      onlineColor: "hsl(142 76% 36%)", // Green
      label: "Reward",
      higherBetter: true,
    },
    prediction_accuracy: {
      color: "hsl(271 81% 56%)", // Purple
      onlineColor: "hsl(271 81% 66%)",
      label: "Accuracy (%)",
      higherBetter: true,
    },
    avg_queue_length: {
      color: "hsl(48 96% 53%)",
      onlineColor: "hsl(142 76% 36%)", // Green
      label: "Vehicles",
      higherBetter: false,
    },
  };

  const config = metricConfig[metric];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{title}</CardTitle>
            <InfoTooltip
              content={`Shows ${title.toLowerCase()} across training episodes. The line changes to green when online training begins.`}
            />
          </div>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              Offline Phase
            </Badge>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Online Phase
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={offlineData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="episode"
              label={{
                value: "Training Episode",
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
            <Tooltip
              formatter={(value: number, name: string) => {
                const displayName = name.includes("offline")
                  ? "Offline Phase"
                  : "Online Phase";
                return value !== null ? [value.toFixed(1), displayName] : null;
              }}
              labelFormatter={(episode) => `Episode ${episode}`}
            />
            <Legend formatter={(value) => title} iconType="line" />
            {onlineStartEpisode && (
              <ReferenceLine
                x={onlineStartEpisode}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
                strokeWidth={2}
                label={{
                  value: "Online Training Starts",
                  position: "top",
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                }}
              />
            )}
            {/* Offline phase segment (blue) - includes transition point */}
            <Line
              type="monotone"
              dataKey="offlineValue"
              stroke={config.color}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              name="offlinePhase"
              legendType="none"
            />
            {/* Online phase segment (green) - starts from transition point */}
            <Line
              type="monotone"
              dataKey="onlineValue"
              stroke={config.onlineColor}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              name="onlinePhase"
              legendType="none"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-3 p-3 bg-muted/30 rounded-md">
          <p className="text-sm text-muted-foreground">
            📊 <strong>Training Progress:</strong>{" "}
            {config.higherBetter ? "Higher" : "Lower"} values indicate better
            performance. The line transitions from{" "}
            <span style={{ color: config.color, fontWeight: "bold" }}>
              blue
            </span>{" "}
            to{" "}
            <span style={{ color: config.onlineColor, fontWeight: "bold" }}>
              green
            </span>{" "}
            at episode {onlineStartEpisode}, marking the shift from offline
            learning to online real-time application.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
