import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainingMetricsCardsProps {
  actualValues: {
    avgPassengerThroughput: number;
    avgWaitingTime: number;
    avgReward: number;
    avgPredictionAccuracy: number;
  };
  selectedMetric?: string;
  onMetricSelect?: (metric: string) => void;
}

export const TrainingMetricsCards = ({
  actualValues,
  selectedMetric,
  onMetricSelect,
}: TrainingMetricsCardsProps) => {
  const metrics = [
    {
      title: "Average Passenger Throughput",
      value: actualValues.avgPassengerThroughput / 3,
      suffix: " passengers/cycle",
      subtitle: "Passengers served per traffic cycle",
      icon: TrendingUp,
      metricKey: "passenger_throughput",
      higherBetter: true,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Average Waiting Time",
      value: actualValues.avgWaitingTime,
      suffix: " seconds",
      subtitle: "Average passenger waiting time",
      icon: Timer,
      metricKey: "avg_waiting_time",
      higherBetter: false,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      title: "Average Reward",
      value: actualValues.avgReward,
      suffix: "",
      subtitle: "D3QN reinforcement learning reward",
      icon: TrendingUp,
      metricKey: "total_reward",
      higherBetter: true,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Prediction Accuracy",
      value: actualValues.avgPredictionAccuracy,
      suffix: "%",
      subtitle: "LSTM traffic phase prediction accuracy",
      icon: Target,
      metricKey: "prediction_accuracy",
      higherBetter: true,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const isSelected = selectedMetric === metric.metricKey;
        const Icon = metric.icon;

        return (
          <Card
            key={metric.title}
            className={cn(
              "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md",
              isSelected &&
                "ring-2 ring-primary shadow-lg shadow-primary/20 scale-105"
            )}
            onClick={() => onMetricSelect?.(metric.metricKey)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <Icon className={cn("h-4 w-4", metric.color)} />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className={cn("text-2xl font-bold", metric.color)}>
                  {metric.value.toFixed(1)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {metric.suffix}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.subtitle}
              </p>
              <div className="mt-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs",
                    metric.bgColor,
                    metric.borderColor,
                    "border"
                  )}
                >
                  {metric.higherBetter ? (
                    <>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Higher is better
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Lower is better
                    </>
                  )}
                </Badge>
              </div>
              {isSelected && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-primary/5 rounded-lg" />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
