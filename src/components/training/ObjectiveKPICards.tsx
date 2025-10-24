import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, TrendingUp, TrendingDown } from "lucide-react";
import { ObjectiveMetric } from "@/data/training/trainingData";
import { cn } from "@/lib/utils";

interface ObjectiveKPICardsProps {
  objectives: ObjectiveMetric;
  selectedMetric?: string;
  onMetricSelect?: (metric: string) => void;
}

export const ObjectiveKPICards = ({
  objectives,
  selectedMetric,
  onMetricSelect,
}: ObjectiveKPICardsProps) => {
  const kpis = [
    {
      title: "Passenger Throughput",
      value: objectives.passenger_throughput_improvement_pct,
      suffix: "%",
      subtitle: "vs Fixed Time",
      achieved: objectives.objective_1_achieved,
      target: "+10%",
      icon: TrendingUp,
      positive: true,
      metricKey: "passenger_throughput",
    },
    {
      title: "Public Vehicle Throughput",
      value: objectives.jeepney_throughput_improvement_pct,
      suffix: "%",
      subtitle: "Public Transport Priority",
      achieved: objectives.objective_2_achieved,
      target: "+15%",
      icon: TrendingUp,
      positive: true,
      metricKey: "public_vehicle_throughput",
    },
    {
      title: "Waiting Time",
      value: objectives.waiting_time_reduction_pct,
      suffix: "%",
      subtitle: "Target: -10%",
      achieved: objectives.objective_1_achieved,
      target: "-10%",
      icon: TrendingDown,
      positive: true,
      metricKey: "passenger_waiting_time",
    },
    {
      title: "Overall Vehicle Throughput",
      value: objectives.overall_vehicle_throughput_improvement_pct || 0,
      suffix: "%",
      subtitle: "Total Vehicles per Cycle",
      achieved: objectives.objective_3_achieved,
      target: "+12%",
      icon: TrendingUp,
      positive: true,
      metricKey: "overall_vehicle_throughput",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const isSelected = selectedMetric === kpi.metricKey;

        return (
          <Card
            key={kpi.title}
            className={cn(
              "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md",
              isSelected &&
                "ring-2 ring-primary shadow-lg shadow-primary/20 scale-105"
            )}
            onClick={() => onMetricSelect?.(kpi.metricKey)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              {kpi.achieved ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-primary">
                  {kpi.value > 0 && kpi.positive ? "+" : ""}
                  {kpi.value.toFixed(1)}
                  {kpi.suffix}
                </div>
                {kpi.achieved && (
                  <Badge
                    variant="outline"
                    className="bg-success/10 text-success border-success/20"
                  >
                    ✓ Achieved
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {kpi.subtitle}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <kpi.icon className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Target: {kpi.target}
                </span>
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
