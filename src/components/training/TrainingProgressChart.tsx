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

  const metricConfig = {
    passenger_throughput: {
      color: "hsl(var(--primary))",
      label: "Passengers/Cycle",
      higherBetter: true,
    },
    avg_waiting_time: {
      color: "hsl(var(--destructive))",
      label: "Seconds",
      higherBetter: false,
    },
    total_reward: {
      color: "hsl(142 76% 36%)",
      label: "Reward",
      higherBetter: true,
    },
    avg_queue_length: {
      color: "hsl(48 96% 53%)",
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
              content={`Shows ${title.toLowerCase()} across training episodes. The vertical line marks the transition from offline to online training.`}
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
          <LineChart data={data}>
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
              formatter={(value: number) => [value.toFixed(1), title]}
              labelFormatter={(episode) => `Episode ${episode}`}
            />
            <Legend />
            {onlineStartEpisode && (
              <ReferenceLine
                x={onlineStartEpisode}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
                label={{
                  value: "Online Training Starts",
                  position: "top",
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={2}
              dot={false}
              name={title}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-3 p-3 bg-muted/30 rounded-md">
          <p className="text-sm text-muted-foreground">
            📊 <strong>Training Progress:</strong>{" "}
            {config.higherBetter ? "Higher" : "Lower"} values indicate better
            performance. The algorithm learns optimal policies during offline
            training (episodes 1-100), then applies them in during online
            training (episodes 101-150).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
