import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Car, Bike, Bus, Truck } from "lucide-react";

interface VehicleBreakdownCardProps {
  cycleData?: {
    cycle: number;
    cars: number;
    motorcycles: number;
    trucks: number;
    tricycles: number;
    jeepneys: number;
    modern_jeepneys: number;
    buses: number;
  };
}

export const VehicleBreakdownCard = ({
  cycleData,
}: VehicleBreakdownCardProps) => {
  if (!cycleData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">Vehicle Breakdown</CardTitle>
            <InfoTooltip content="Hover over the chart to see vehicle type distribution for each cycle" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            Hover over chart to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  const vehicleTypes = [
    {
      label: "Cars",
      value: cycleData.cars,
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      label: "Motorcycles",
      value: cycleData.motorcycles,
      icon: Bike,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      label: "Jeepneys",
      value: cycleData.jeepneys,
      icon: Bus,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      label: "Modern Jeepneys",
      value: cycleData.modern_jeepneys,
      icon: Bus,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      label: "Buses",
      value: cycleData.buses,
      icon: Bus,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      label: "Trucks",
      value: cycleData.trucks,
      icon: Truck,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      label: "Tricycles",
      value: cycleData.tricycles,
      icon: Bike,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
    },
  ];

  const totalVehicles = vehicleTypes.reduce((sum, type) => sum + type.value, 0);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">Vehicle Breakdown</CardTitle>
            <InfoTooltip content="Real-time vehicle type distribution for the selected traffic cycle" />
          </div>
          <Badge variant="outline" className="text-xs">
            Cycle {cycleData.cycle}
          </Badge>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-2xl font-bold text-primary">{totalVehicles}</p>
          <p className="text-xs text-muted-foreground">total vehicles</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {vehicleTypes.map((type) => {
          const Icon = type.icon;
          const percentage =
            totalVehicles > 0
              ? ((type.value / totalVehicles) * 100).toFixed(1)
              : "0";

          return (
            <div
              key={type.label}
              className={`flex items-center justify-between p-2 rounded-md border ${type.bgColor} ${type.borderColor}`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${type.color}`} />
                <span className="text-xs font-medium">{type.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{type.value}</span>
                <Badge variant="secondary" className="text-[10px] px-1 py-0">
                  {percentage}%
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
