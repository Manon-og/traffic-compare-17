import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, TrendingUp, TrendingDown } from "lucide-react";
import { ObjectiveMetric } from "@/data/training/trainingData";

interface ObjectiveKPICardsProps {
  objectives: ObjectiveMetric;
}

export const ObjectiveKPICards = ({ objectives }: ObjectiveKPICardsProps) => {
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
    },
    {
      title: "Waiting Time Reduction",
      value: objectives.waiting_time_reduction_pct,
      suffix: "%",
      subtitle: "Target: -10%",
      achieved: objectives.objective_1_achieved,
      target: "-10%",
      icon: TrendingDown,
      positive: true,
    },
    {
      title: "Multi-Agent Coordination",
      value: objectives.multi_agent_jeepney_travel_time_reduction_pct,
      suffix: "%",
      subtitle: "Travel Time Reduction",
      achieved: objectives.objective_3_achieved,
      target: "-10%",
      icon: TrendingDown,
      positive: true,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="relative overflow-hidden">
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
            <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
            <div className="mt-2 flex items-center gap-2">
              <kpi.icon className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Target: {kpi.target}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
