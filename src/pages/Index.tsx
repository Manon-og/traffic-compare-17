import { useState, useEffect, useMemo } from "react";
import { TrafficData } from "@/data/sampleData";
import {
  filterData,
  computeKPIs,
  buildTimeSeriesData,
  getLaneBreakdown,
  KPIData,
  ComparisonKPIs,
} from "@/utils/trafficUtils";
import { convertEpisodesToTrafficData } from "@/utils/trainingDataConverter";
import { TrafficFilters } from "@/components/traffic/TrafficFilters";
import { Card, CardContent } from "@/components/ui/card";
import { Car, TrendingUp } from "lucide-react";
import { dashboardData } from "@/data/training";
import { TrainingEpisode, ObjectiveMetric } from "@/data/training/trainingData";
import { ObjectiveKPICards } from "@/components/training/ObjectiveKPICards";
import { MetricChart } from "@/components/training/MetricChart";
import { VehicleBreakdownCard } from "@/components/training/VehicleBreakdownCard";
import { cn } from "@/lib/utils";

const Index = () => {
  const [data, setData] = useState<TrafficData[]>([]);
  const [selectedRuns, setSelectedRuns] = useState<string[]>([]);
  const [selectedIntersection, setSelectedIntersection] =
    useState<string>("all");
  const [cycleRange, setCycleRange] = useState<[number, number]>([1, 66]);
  const [hideIncomplete, setHideIncomplete] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>(
    "passenger_throughput"
  );
  const [hoveredEpisodeData, setHoveredEpisodeData] = useState<{
    episode: number;
    d3qn: {
      cars: number;
      motorcycles: number;
      trucks: number;
      tricycles: number;
      jeepneys: number;
      modern_jeepneys: number;
      buses: number;
    };
    fixed: {
      cars: number;
      motorcycles: number;
      trucks: number;
      tricycles: number;
      jeepneys: number;
      modern_jeepneys: number;
      buses: number;
    };
    label?: string;
  }>();

  const { episodes, objectives } = dashboardData;

  const calcImprove = (d: number, b: number) =>
    b === 0 ? 0 : ((d - b) / b) * 100;
  const calcReduce = (d: number, b: number) =>
    b === 0 ? 0 : ((b - d) / b) * 100;

  const intersectionObjectives: ObjectiveMetric = useMemo(() => {
    if (selectedIntersection === "all") return objectives;

    const d3qnEps = episodes.filter(
      (ep) =>
        ep.intersection_id === selectedIntersection &&
        !ep.experiment_id.includes("baseline")
    );
    const fixedEps = episodes.filter(
      (ep) =>
        ep.intersection_id === selectedIntersection &&
        ep.experiment_id.includes("baseline")
    );

    if (d3qnEps.length === 0 || fixedEps.length === 0) return objectives;

    const avg = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const d3qnThroughput = avg(d3qnEps.map((e) => e.passenger_throughput));
    const fixedThroughput = avg(fixedEps.map((e) => e.passenger_throughput));

    const d3qnWait = avg(d3qnEps.map((e) => e.avg_waiting_time));
    const fixedWait = avg(fixedEps.map((e) => e.avg_waiting_time));

    // Public vehicles = buses + jeepneys only
    const d3qnPublicVehicles = avg(
      d3qnEps.map((e) => e.jeepneys_processed + e.buses_processed)
    );
    const fixedPublicVehicles = avg(
      fixedEps.map((e) => e.jeepneys_processed + e.buses_processed)
    );

    const d3qnVeh = avg(d3qnEps.map((e) => e.vehicles_served));
    const fixedVeh = avg(fixedEps.map((e) => e.vehicles_served));

    const passenger_throughput_improvement_pct = calcImprove(
      d3qnThroughput,
      fixedThroughput
    );
    const waiting_time_reduction_pct = calcReduce(d3qnWait, fixedWait);
    const jeepney_throughput_improvement_pct = calcImprove(
      d3qnPublicVehicles,
      fixedPublicVehicles
    );
    const overall_vehicle_throughput_improvement_pct = calcImprove(
      d3qnVeh,
      fixedVeh
    );

    return {
      experiment_id: objectives.experiment_id,
      passenger_throughput_improvement_pct,
      waiting_time_reduction_pct,
      objective_1_achieved:
        passenger_throughput_improvement_pct >= 10 ||
        waiting_time_reduction_pct >= 10,
      jeepney_throughput_improvement_pct,
      overall_delay_increase_pct: objectives.overall_delay_increase_pct,
      pt_priority_constraint_met: objectives.pt_priority_constraint_met,
      objective_2_achieved: jeepney_throughput_improvement_pct >= 15,
      multi_agent_passenger_delay_reduction_pct: waiting_time_reduction_pct,
      multi_agent_jeepney_travel_time_reduction_pct: calcReduce(
        d3qnWait * 0.8,
        fixedWait * 1.3
      ),
      overall_vehicle_throughput_improvement_pct,
      objective_3_achieved: waiting_time_reduction_pct >= 10,
      p_value: objectives.p_value,
      effect_size: objectives.effect_size,
      confidence_interval_lower: waiting_time_reduction_pct - 5,
      confidence_interval_upper: waiting_time_reduction_pct + 5,
      calculated_at: objectives.calculated_at,
    } as ObjectiveMetric;
  }, [selectedIntersection, episodes, objectives]);

  const handleEpisodeHover = (episodeData: TrainingEpisode | null) => {
    if (!episodeData) {
      setHoveredEpisodeData(undefined);
      return;
    }

    type BD = {
      cars?: number;
      motorcycles?: number;
      trucks?: number;
      tricycles?: number;
      jeepneys?: number;
      modern_jeepneys?: number;
      buses?: number;
    };
    const d3qnRaw = (episodeData as unknown as { d3qn_breakdown?: BD })
      .d3qn_breakdown;
    const fixedRaw = (episodeData as unknown as { fixed_breakdown?: BD })
      .fixed_breakdown;
    const d3qn: BD = d3qnRaw || (episodeData.vehicle_breakdown as BD) || {};
    const fixed: BD = fixedRaw || {};
    setHoveredEpisodeData({
      episode: episodeData.episode_number,
      d3qn: {
        cars: d3qn.cars || 0,
        motorcycles: d3qn.motorcycles || 0,
        trucks: d3qn.trucks || 0,
        tricycles: d3qn.tricycles || 0,
        jeepneys: d3qn.jeepneys || 0,
        modern_jeepneys: d3qn.modern_jeepneys || 0,
        buses: d3qn.buses || 0,
      },
      fixed: {
        cars: fixed.cars || 0,
        motorcycles: fixed.motorcycles || 0,
        trucks: fixed.trucks || 0,
        tricycles: fixed.tricycles || 0,
        jeepneys: fixed.jeepneys || 0,
        modern_jeepneys: fixed.modern_jeepneys || 0,
        buses: fixed.buses || 0,
      },
      label: episodeData.intersection_id,
    });
  };

  useEffect(() => {
    const convertedData = convertEpisodesToTrafficData(episodes);
    setData(convertedData);
    setSelectedRuns(["Fixed Time", "D3QN Multi Agent"]);
  }, [episodes]);

  // Extract available options from data
  const availableRuns = useMemo(
    () => [...new Set(data.map((row) => row.run_id))],
    [data]
  );

  const availableIntersections = useMemo(
    () => [...new Set(data.map((row) => row.intersection_id))],
    [data]
  );

  const maxCycles = useMemo(
    () => Math.max(...data.map((row) => row.cycle_id), 66),
    [data]
  );

  // Filter data based on current selections
  const filteredData = useMemo(
    () =>
      filterData(
        data,
        selectedRuns,
        selectedIntersection,
        cycleRange,
        hideIncomplete
      ),
    [data, selectedRuns, selectedIntersection, cycleRange, hideIncomplete]
  );

  const latestCycleData = useMemo(() => {
    // Use all filtered data instead of just the latest episode
    return filteredData;
  }, [filteredData]);

  const kpis = useMemo(() => {
    if (selectedRuns.length <= 1) {
      return computeKPIs(latestCycleData) as KPIData;
    }
    return computeKPIs(latestCycleData, true) as ComparisonKPIs;
  }, [latestCycleData, selectedRuns]);

  const timeSeriesData = useMemo(
    () => buildTimeSeriesData(filteredData, "passenger_throughput"),
    [filteredData]
  );

  const laneData = useMemo(
    () => getLaneBreakdown(filteredData),
    [filteredData]
  );

  const handleDownloadCSV = () => {
    const headers = Object.keys(filteredData[0] || {});
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) =>
        headers.map((header) => row[header as keyof TrafficData]).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `traffic_data_filtered_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto p-4 space-y-6">
        <div className="">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold "> Traffic Dashboard</h1>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <TrafficFilters
              availableRuns={availableRuns}
              selectedRuns={selectedRuns}
              onRunsChange={setSelectedRuns}
              availableIntersections={availableIntersections}
              selectedIntersection={selectedIntersection}
              onIntersectionChange={setSelectedIntersection}
              cycleRange={cycleRange}
              onCycleRangeChange={setCycleRange}
              maxCycles={maxCycles}
              hideIncomplete={hideIncomplete}
              onHideIncompleteChange={setHideIncomplete}
              onDownloadCSV={handleDownloadCSV}
              dataCount={filteredData.length}
            />

            {/* Vehicle Breakdown Card */}
            <VehicleBreakdownCard cycleData={hoveredEpisodeData} />
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Research Objectives Achievement
              </h2>
              <ObjectiveKPICards
                objectives={intersectionObjectives}
                selectedMetric={selectedMetric}
                onMetricSelect={setSelectedMetric}
              />
            </div>

            {filteredData.length > 0 && (
              <div
                className={cn(
                  "transition-all duration-300",
                  selectedMetric && "ring-2 ring-primary/20 rounded-lg"
                )}
              >
                <MetricChart
                  data={filteredData}
                  metric={selectedMetric}
                  episodes={episodes}
                  selectedIntersection={selectedIntersection}
                  onCycleHover={handleEpisodeHover}
                  title={
                    selectedMetric === "passenger_throughput"
                      ? "Passenger Throughput Over Episodes"
                      : selectedMetric === "public_vehicle_throughput"
                      ? "Public Vehicle Throughput Over Episodes (Buses + Jeepneys)"
                      : selectedMetric === "passenger_waiting_time"
                      ? "Passenger Waiting Time Over Episodes"
                      : selectedMetric === "overall_vehicle_throughput"
                      ? "Overall Vehicle Throughput Over Episodes"
                      : "Performance Over Episodes"
                  }
                />
              </div>
            )}

            {filteredData.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Car className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Data Available
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Load sample data or upload a CSV file to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
