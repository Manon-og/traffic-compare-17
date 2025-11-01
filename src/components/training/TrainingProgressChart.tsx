import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
    | "avg_queue_length"
    | "avg_speed";
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

  // Explicit split: Offline = 1..244, Online = 245..N
  const ONLINE_START_EPISODE = 245;
  const onlineStartEpisode = ONLINE_START_EPISODE;

  // Counts for offline/online split
  const offlineCount = Math.min(ONLINE_START_EPISODE - 1, episodes.length);
  const onlineCount = Math.max(episodes.length - offlineCount, 0);
  const referenceEpisode = onlineStartEpisode;

  // Split data into offline and online segments for color transition
  // IMPORTANT: Both segments include the transition point to ensure continuity
  // Divide passenger_throughput by 3 to match the card display
  const offlineData = data.map((d) => {
    const adjustedValue =
      metric === "passenger_throughput" ? (d.value || 0) / 3 : d.value;
    return {
      ...d,
      offlineValue: d.episode < ONLINE_START_EPISODE ? adjustedValue : null,
      onlineValue: d.episode >= ONLINE_START_EPISODE ? adjustedValue : null,
    };
  });

  const metricConfig = {
    passenger_throughput: {
      color: "hsl(var(--primary))",
      onlineColor: "hsl(142 76% 36%)", // Green
      label: "Passengers",
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
          </div>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              Offline Phase{offlineCount ? ` (${offlineCount})` : ""}
            </Badge>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Online Phase{onlineCount ? ` (${onlineCount})` : ""}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="relative w-10">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-sm text-muted-foreground whitespace-nowrap select-none pointer-events-none">
              {config.label}
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={offlineData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="episode" tickMargin={10} />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    const displayName = name.includes("offline")
                      ? "Offline Phase"
                      : "Online Phase";
                    return value !== null
                      ? [value.toFixed(1), displayName]
                      : null;
                  }}
                  labelFormatter={(episode) => `Episode ${episode}`}
                />
                {/** Legend removed - badges at top-right already indicate series */}
                {referenceEpisode && (
                  <ReferenceLine
                    x={referenceEpisode}
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
          </div>
        </div>
        <div className="text-center mt-2 text-xs md:text-sm text-muted-foreground">
          Training Episode
        </div>
        <div className="mt-3 p-3 bg-muted/30 rounded-md">
          <p className="text-sm text-muted-foreground">
            📊 <strong>Training Progress:</strong>{" "}
            {config.higherBetter ? "Higher" : "Lower"} values indicate better
            performance. Marking the shift from offline learning to online
            real-time application.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
