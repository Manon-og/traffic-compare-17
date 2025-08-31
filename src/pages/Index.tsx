import { useState, useEffect, useMemo } from 'react';
import { TrafficData, sampleData } from '@/data/sampleData';
import { 
  filterData, 
  computeKPIs, 
  buildTimeSeriesData, 
  getLaneBreakdown, 
  calculateDelta,
  parseCSVData,
  validateSchema,
  KPIData,
  ComparisonKPIs
} from '@/utils/trafficUtils';
import { KPICard } from '@/components/traffic/KPICard';
import { TrafficChart } from '@/components/traffic/TrafficChart';
import { TrafficFilters } from '@/components/traffic/TrafficFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useToast } from '@/hooks/use-toast';
import { Car, TrendingDown, Activity, Trophy, Eye, EyeOff } from 'lucide-react';

const Index = () => {
  const [data, setData] = useState<TrafficData[]>([]);
  const [selectedRuns, setSelectedRuns] = useState<string[]>([]);
  const [selectedIntersection, setSelectedIntersection] = useState<string>('all');
  const [cycleRange, setCycleRange] = useState<[number, number]>([1, 30]);
  const [hideIncomplete, setHideIncomplete] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<number | undefined>();
  const [showDataTable, setShowDataTable] = useState(false);
  const { toast } = useToast();

  // Load sample data on mount
  useEffect(() => {
    setData(sampleData);
    setSelectedRuns(['fixed_time_01', 'rl_01']);
  }, []);

  // Extract available options from data
  const availableRuns = useMemo(() => 
    [...new Set(data.map(row => row.run_id))], [data]);
  
  const availableIntersections = useMemo(() => 
    [...new Set(data.map(row => row.intersection_id))], [data]);
  
  const maxCycles = useMemo(() => 
    Math.max(...data.map(row => row.cycle_id), 30), [data]);

  // Filter data based on current selections
  const filteredData = useMemo(() => 
    filterData(data, selectedRuns, selectedIntersection, cycleRange, hideIncomplete),
    [data, selectedRuns, selectedIntersection, cycleRange, hideIncomplete]
  );

  // Compute KPIs
  const kpis = useMemo(() => {
    if (selectedRuns.length <= 1) {
      return computeKPIs(filteredData) as KPIData;
    }
    return computeKPIs(filteredData, true) as ComparisonKPIs;
  }, [filteredData, selectedRuns]);

  // Build chart data
  const timeSeriesData = useMemo(() => 
    buildTimeSeriesData(filteredData, 'total_queue'), [filteredData]);
  
  const laneData = useMemo(() => 
    getLaneBreakdown(filteredData, selectedCycle), [filteredData, selectedCycle]);


  const handleDownloadCSV = () => {
    const headers = Object.keys(filteredData[0] || {});
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => 
        headers.map(header => row[header as keyof TrafficData]).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `traffic_data_filtered_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderKPIs = () => {
    if (selectedRuns.length <= 1) {
      const singleKPI = kpis as KPIData;
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Avg Queue Length"
              subtitle="vehicles waiting per cycle"
              value={singleKPI.avgTotalQueue}
              tooltip="Average number of vehicles waiting at red lights across all cycles. Lower values indicate better traffic flow."
              icon={<Car className="h-4 w-4" />}
            />
            <KPICard
              title="Avg Throughput"
              subtitle="PCU per hour"
              value={singleKPI.avgThroughput}
              tooltip="Traffic volume normalized to Passenger Car Units per hour. Higher values mean more vehicles processed efficiently."
              icon={<TrendingDown className="h-4 w-4" />}
            />
            <KPICard
              title="Avg Occupancy"
              subtitle="lane utilization (0-1)"
              value={singleKPI.avgOccupancy}
              tooltip="Proportion of time lanes are occupied by vehicles. Values between 0.3-0.7 typically indicate optimal flow."
              icon={<Activity className="h-4 w-4" />}
            />
            {singleKPI.avgReward !== undefined && (
              <KPICard
                title="Avg RL Reward"
                subtitle="algorithm performance score"
                value={singleKPI.avgReward}
                tooltip="Performance score used by the RL algorithm. Higher values indicate the system is learning to optimize traffic better."
                icon={<Trophy className="h-4 w-4" />}
              />
            )}
        </div>
      );
    }

    // Comparison view
    const comparisonKPIs = kpis as ComparisonKPIs;
    const fixedTimeKey = selectedRuns.find(run => run.includes('fixed_time'));
    const rlKey = selectedRuns.find(run => run.includes('rl'));
    
    if (!fixedTimeKey || !rlKey) return null;

    const fixedTime = comparisonKPIs[fixedTimeKey];
    const rl = comparisonKPIs[rlKey];

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Queue Length"
          subtitle="RL vs Fixed Time"
          value={rl.avgTotalQueue}
          delta={calculateDelta(rl.avgTotalQueue, fixedTime.avgTotalQueue)}
          deltaType={rl.avgTotalQueue < fixedTime.avgTotalQueue ? 'positive' : 'negative'}
          tooltip={`RL: ${rl.avgTotalQueue.toFixed(1)} vs Fixed Time: ${fixedTime.avgTotalQueue.toFixed(1)} vehicles. Lower is better for traffic flow.`}
          icon={<Car className="h-4 w-4" />}
        />
        <KPICard
          title="Throughput"
          subtitle="RL vs Fixed Time"
          value={rl.avgThroughput}
          delta={calculateDelta(rl.avgThroughput, fixedTime.avgThroughput)}
          deltaType={rl.avgThroughput > fixedTime.avgThroughput ? 'positive' : 'negative'}
          tooltip={`RL: ${rl.avgThroughput.toFixed(1)} vs Fixed Time: ${fixedTime.avgThroughput.toFixed(1)} PCU/h. Higher is better for capacity.`}
          icon={<TrendingDown className="h-4 w-4" />}
        />
        <KPICard
          title="Occupancy"
          subtitle="RL vs Fixed Time"
          value={rl.avgOccupancy}
          delta={calculateDelta(rl.avgOccupancy, fixedTime.avgOccupancy)}
          deltaType={rl.avgOccupancy < fixedTime.avgOccupancy ? 'positive' : 'negative'}
          tooltip={`RL: ${rl.avgOccupancy.toFixed(2)} vs Fixed Time: ${fixedTime.avgOccupancy.toFixed(2)} utilization. Lower typically indicates smoother flow.`}
          icon={<Activity className="h-4 w-4" />}
        />
        {rl.avgReward !== undefined && fixedTime.avgReward !== undefined && (
          <KPICard
            title="RL Performance"
            subtitle="reward score"
            value={rl.avgReward}
            delta={calculateDelta(rl.avgReward, fixedTime.avgReward)}
            deltaType={rl.avgReward > fixedTime.avgReward ? 'positive' : 'negative'}
            tooltip={`RL reward score: ${rl.avgReward.toFixed(2)}. Higher values indicate better algorithm performance and traffic optimization.`}
            icon={<Trophy className="h-4 w-4" />}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Traffic Dashboard — Fixed Time vs RL
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare traffic intersection performance between fixed-time control systems and reinforcement learning algorithms
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
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
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* KPI Cards */}
            {filteredData.length > 0 && renderKPIs()}

            {/* Charts */}
            {filteredData.length > 0 && (
              <TrafficChart
                timeSeriesData={timeSeriesData}
                laneData={laneData}
                selectedCycle={selectedCycle}
                onCycleSelect={setSelectedCycle}
                metric="Total Queue (vehicles)"
              />
            )}

            {/* Data Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle>Data Inspection</CardTitle>
                    <InfoTooltip content="Raw data table showing individual measurements for each cycle and lane. Use filters to focus on specific control systems or time periods." />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDataTable(!showDataTable)}
                  >
                    {showDataTable ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showDataTable ? 'Hide' : 'Show'} Table
                  </Button>
                </div>
              </CardHeader>
              {showDataTable && (
                <CardContent>
                  <div className="mb-4 p-3 bg-muted/30 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>How to use this table:</strong> Each row represents one lane's performance during a specific traffic cycle. 
                      Use the filters above to narrow down to specific control systems, intersections, or time periods you want to analyze.
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
                          <tr key={index} className="border-b hover:bg-muted/20">
                            <td className="p-2">
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                                row.run_id.includes('fixed_time') 
                                  ? 'bg-success/20 text-success border border-success/30' 
                                  : 'bg-primary/20 text-primary border border-primary/30'
                              }`}>
                                {row.run_id.includes('fixed_time') ? '🚦 Fixed Time' : '🤖 RL'}
                              </span>
                            </td>
                            <td className="p-2 font-mono">{row.intersection_id}</td>
                            <td className="p-2">{row.cycle_id}</td>
                            <td className="p-2 font-mono">{row.lane_id}</td>
                            <td className="p-2 font-bold">{row.total_queue}</td>
                            <td className="p-2">{row.throughput_pcu.toFixed(1)}</td>
                            <td className="p-2">{row.occupancy.toFixed(2)}</td>
                            <td className="p-2">{row.total_pcu.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredData.length > 100 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Showing first 100 rows of {filteredData.length} total rows. Use filters to reduce dataset size.
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
                  <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
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
