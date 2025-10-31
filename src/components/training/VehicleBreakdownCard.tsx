import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Car, Bike, Bus, Truck } from "lucide-react";

type Breakdown = {
  cars: number;
  motorcycles: number;
  trucks: number;
  tricycles: number;
  jeepneys: number;
  modern_jeepneys: number;
  buses: number;
};

interface VehicleBreakdownCardProps {
  cycleData?: {
    episode: number;
    d3qn?: Breakdown;
    fixed?: Breakdown;
    label?: string;
    // Legacy fields (treated as D3QN)
    cars?: number;
    motorcycles?: number;
    trucks?: number;
    tricycles?: number;
    jeepneys?: number;
    modern_jeepneys?: number;
    buses?: number;
  };
}

export const VehicleBreakdownCard = ({
  cycleData,
}: VehicleBreakdownCardProps) => {
  const zero: Breakdown = {
    cars: 0,
    motorcycles: 0,
    trucks: 0,
    tricycles: 0,
    jeepneys: 0,
    modern_jeepneys: 0,
    buses: 0,
  };

  const legacy: Breakdown = {
    cars: cycleData?.cars || 0,
    motorcycles: cycleData?.motorcycles || 0,
    trucks: cycleData?.trucks || 0,
    tricycles: cycleData?.tricycles || 0,
    jeepneys: cycleData?.jeepneys || 0,
    modern_jeepneys: cycleData?.modern_jeepneys || 0,
    buses: cycleData?.buses || 0,
  };

  const d3qn: Breakdown = cycleData?.d3qn || (cycleData ? legacy : zero);
  const fixed: Breakdown = cycleData?.fixed || zero;
  const episodeNum = cycleData?.episode || 0;

  const vehicleTypes = [
    {
      label: "Cars",
      dVal: d3qn.cars,
      fVal: fixed.cars,
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      label: "Motorcycles",
      dVal: d3qn.motorcycles,
      fVal: fixed.motorcycles,
      icon: Bike,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      label: "Jeepneys",
      dVal: d3qn.jeepneys,
      fVal: fixed.jeepneys,
      icon: Bus,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      label: "Buses",
      dVal: d3qn.buses,
      fVal: fixed.buses,
      icon: Bus,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      label: "Trucks",
      dVal: d3qn.trucks,
      fVal: fixed.trucks,
      icon: Truck,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      label: "Tricycles",
      dVal: d3qn.tricycles,
      fVal: fixed.tricycles,
      icon: Bike,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
    },
  ] as const;

  const totalVehiclesD3QN =
    d3qn.cars +
    d3qn.motorcycles +
    d3qn.trucks +
    d3qn.tricycles +
    d3qn.jeepneys +
    d3qn.modern_jeepneys +
    d3qn.buses;
  const totalVehiclesFixed =
    fixed.cars +
    fixed.motorcycles +
    fixed.trucks +
    fixed.tricycles +
    fixed.jeepneys +
    fixed.modern_jeepneys +
    fixed.buses;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">Vehicle Breakdown</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            Episode {episodeNum}
          </Badge>
        </div>
        {/* <div className="mt-2 flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-semibold text-primary">D3QN</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-semibold text-foreground/80">Fixed</p>
          </div>
        </div> */}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between px-2 pb-1">
          <span className="text-[10px] text-muted-foreground">Type</span>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-muted-foreground w-10 text-right">
              D3QN
            </span>
            <span className="text-[10px] text-muted-foreground w-10 text-right">
              Fixed
            </span>
            <span className="text-[10px] text-muted-foreground w-10 text-right">
              Δ%
            </span>
          </div>
        </div>
        {vehicleTypes.map((type) => {
          const Icon = type.icon;
          const deltaPct =
            type.fVal === 0 ? 0 : ((type.dVal - type.fVal) / type.fVal) * 100;
          const deltaColor =
            deltaPct > 0
              ? "text-green-600"
              : deltaPct < 0
              ? "text-red-600"
              : "text-muted-foreground";
          const sign = deltaPct > 0 ? "+" : "";

          return (
            <div
              key={type.label}
              className={`flex items-center justify-between p-2 rounded-md border ${type.bgColor} ${type.borderColor}`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${type.color}`} />
                <span className="text-xs font-medium">{type.label}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold w-10 text-right">
                  {type.dVal}
                </span>
                <span className="text-sm font-semibold w-10 text-right">
                  {type.fVal}
                </span>
                <span
                  className={`text-xs font-semibold w-10 text-right ${deltaColor}`}
                >
                  {sign}
                  {deltaPct.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
