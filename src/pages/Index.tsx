import { useState, useEffect, useMemo } from "react";
import { TrafficData, sampleData } from "@/data/sampleData";
import {
  filterData,
  computeKPIs,
  buildTimeSeriesData,
  getLaneBreakdown,
  calculateDelta,
  parseCSVData,
  validateSchema,
  KPIData,
  ComparisonKPIs,
} from "@/utils/trafficUtils";
import { KPICard } from "@/components/traffic/KPICard";
import { TrafficChart } from "@/components/traffic/TrafficChart";
import { TrafficFilters } from "@/components/traffic/TrafficFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useToast } from "@/hooks/use-toast";
import { Car, TrendingDown, Activity, Trophy, Eye, EyeOff } from "lucide-react";
import { TrainingOutput } from "@/components/traffic/TrainingOutput";

const Index = () => {
  const [data, setData] = useState<TrafficData[]>([]);
  const [selectedRuns, setSelectedRuns] = useState<string[]>([]);
  const [selectedIntersection, setSelectedIntersection] =
    useState<string>("all");
  const [cycleRange, setCycleRange] = useState<[number, number]>([1, 30]);
  const [hideIncomplete, setHideIncomplete] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<number | undefined>();
  const [showDataTable, setShowDataTable] = useState(false);
  const { toast } = useToast();

  // Load sample data on mount
  useEffect(() => {
    setData(sampleData);
    setSelectedRuns(["Fixed Time", "D3QN Multi Agent"]);
  }, []);

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
    () => Math.max(...data.map((row) => row.cycle_id), 30),
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

  // Compute KPIs
  const kpis = useMemo(() => {
    if (selectedRuns.length <= 1) {
      return computeKPIs(filteredData) as KPIData;
    }
    return computeKPIs(filteredData, true) as ComparisonKPIs;
  }, [filteredData, selectedRuns]);

  // Build chart data - Change from total_queue to passenger-focused metrics
  const timeSeriesData = useMemo(
    () => buildTimeSeriesData(filteredData, "passenger_throughput"),
    [filteredData]
  );

  const laneData = useMemo(
    () => getLaneBreakdown(filteredData, selectedCycle),
    [filteredData, selectedCycle]
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

  const renderKPIs = () => {
    if (selectedRuns.length <= 1) {
      const singleKPI = kpis as KPIData;
      return (
        <div className="grid gap-4 grid-cols-1">
          <KPICard
            title="Passenger Throughput"
            subtitle="passengers per cycle"
            value={singleKPI.avgPassengerThroughput || 1}
            icon={<Car className="h-4 w-4" />}
          />
          <KPICard
            title="Public Vehicle Throughput"
            subtitle="public vehicles per cycle"
            value={singleKPI.avgPublicVehicleThroughput || 0}
            icon={<TrendingDown className="h-4 w-4" />}
          />
          {/* <KPICard
            title="TSP Activations"
            subtitle="activations per cycle"
            value={singleKPI.avgTspActivations || 0}
            icon={<Activity className="h-4 w-4" />}
          /> */}
          {/* <KPICard
            title="Coordination Score"
            subtitle="multi-agent coordination"
            value={singleKPI.avgCoordinationScore || 0}
            icon={<Trophy className="h-4 w-4" />}
          /> */}
        </div>
      );
    }

    // Comparison view
    const comparisonKPIs = kpis as ComparisonKPIs;
    const fixedTimeKey = selectedRuns.find((run) => run.includes("Fixed Time"));
    const rlKey = selectedRuns.find((run) => run.includes("D3QN"));

    if (!fixedTimeKey || !rlKey) return null;

    const fixedTime = comparisonKPIs[fixedTimeKey];
    const rl = comparisonKPIs[rlKey];

    return (
      <div className="grid gap-4 grid-cols-1">
        <KPICard
          title="Passenger Throughput"
          subtitle="D3QN vs Fixed Time"
          value={rl.avgPassengerThroughput || 0}
          delta={calculateDelta(
            rl.avgPassengerThroughput || 0,
            fixedTime.avgPassengerThroughput || 0
          )}
          deltaType={
            (rl.avgPassengerThroughput || 0) >
            (fixedTime.avgPassengerThroughput || 0)
              ? "positive"
              : "negative"
          }
          icon={<Car className="h-4 w-4" />}
        />
        <KPICard
          title="Public Vehicle Throughput"
          subtitle="D3QN vs Fixed Time"
          value={rl.avgPublicVehicleThroughput || 0}
          delta={calculateDelta(
            rl.avgPublicVehicleThroughput || 0,
            fixedTime.avgPublicVehicleThroughput || 0
          )}
          deltaType={
            (rl.avgPublicVehicleThroughput || 0) >
            (fixedTime.avgPublicVehicleThroughput || 0)
              ? "positive"
              : "negative"
          }
          icon={<TrendingDown className="h-4 w-4" />}
        />
        {/* <KPICard
          title="TSP Activations"
          subtitle="D3QN vs Fixed Time"
          value={rl.avgTspActivations || 0}
          delta={calculateDelta(
            rl.avgTspActivations || 0,
            fixedTime.avgTspActivations || 0
          )}
          deltaType={
            (rl.avgTspActivations || 0) > (fixedTime.avgTspActivations || 0)
              ? "positive"
              : "negative"
          }
          icon={<Activity className="h-4 w-4" />}
        /> */}
        {/* <KPICard
          title="Coordination Score"
          subtitle="D3QN vs Fixed Time"
          value={rl.avgCoordinationScore || 0}
          delta={calculateDelta(
            rl.avgCoordinationScore || 0,
            fixedTime.avgCoordinationScore || 0
          )}
          deltaType={
            (rl.avgCoordinationScore || 0) >
            (fixedTime.avgCoordinationScore || 0)
              ? "positive"
              : "negative"
          }
          icon={<Trophy className="h-4 w-4" />}
        /> */}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center">
            <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
                D3QN Neural Traffic Control
              </p>
            </div>
          </div>
          <h1 className="text-8xl p-2 font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-100 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
            Traffic Analysis
          </h1>
          {/* <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Performance monitoring for intelligent traffic signal control
            systems. Advanced reinforcement learning agents optimizing urban
            intersection traffic flow with integrated public transport
            prioritization and adaptive signal timing.
          </p> */}
          {/* <div className="flex justify-center gap-6 text-sm text-muted-foreground mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              <span>D3QN Active Learning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span>Fixed-Time Baseline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span>Enhanced PT Priority</span>
            </div>
          </div> */}
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

            {/* KPI Cards */}
            {filteredData.length > 0 && (
              <div className="space-y-4">{renderKPIs()}</div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Charts */}
            {filteredData.length > 0 && (
              <TrafficChart
                timeSeriesData={timeSeriesData}
                laneData={laneData}
                selectedCycle={selectedCycle}
                onCycleSelect={setSelectedCycle}
                metric="Passenger Throughput"
              />
            )}

            <TrainingOutput.DataAnalysis />

            {/* Data Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle>Data Inspection</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDataTable(!showDataTable)}
                  >
                    {showDataTable ? (
                      <EyeOff className="w-4 h-4 mr-2" />
                    ) : (
                      <Eye className="w-4 h-4 mr-2" />
                    )}
                    {showDataTable ? "Hide" : "Show"} Details
                  </Button>
                </div>
              </CardHeader>
              {showDataTable && (
                <CardContent>
                  <div className="mb-4 p-3 bg-muted/30 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>How to use this table:</strong> Each row
                      represents one lane's performance during a specific
                      traffic cycle. Use the filters above to narrow down to
                      specific control systems, intersections, or time periods
                      you want to analyze.
                    </p>
                  </div>
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="p-2 text-left">Control System</th>
                          <th className="p-2 text-left">Intersection</th>
                          <th className="p-2 text-left">Cycle</th>
                          <th className="p-2 text-left">Lane</th>
                          <th className="p-2 text-left">Queue</th>
                          <th className="p-2 text-left">Throughput</th>
                          <th className="p-2 text-left">Occupancy</th>
                          <th className="p-2 text-left">PCU</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.slice(0, 100).map((row, index) => (
                          <tr
                            key={index}
                            className="border-b hover:bg-muted/20"
                          >
                            <td className="p-2">
                              <span
                                className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                                  row.run_id.includes("fixed_time")
                                    ? "bg-success/20 text-success border border-success/30"
                                    : "bg-primary/20 text-primary border border-primary/30"
                                }`}
                              >
                                {row.run_id.includes("fixed_time")
                                  ? "🚦 Fixed Time"
                                  : "🤖 RL"}
                              </span>
                            </td>
                            <td className="p-2 font-mono">
                              {row.intersection_id}
                            </td>
                            <td className="p-2">{row.cycle_id}</td>
                            <td className="p-2 font-mono">{row.lane_id}</td>
                            <td className="p-2 font-bold">{row.total_queue}</td>
                            <td className="p-2">
                              {row.throughput_pcu.toFixed(1)}
                            </td>
                            <td className="p-2">{row.occupancy.toFixed(2)}</td>
                            <td className="p-2">{row.total_pcu.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredData.length > 100 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Showing first 100 rows of {filteredData.length} total
                        rows. Use filters to reduce dataset size.
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

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
