import { TrafficData } from "@/data/sampleData";

export interface KPIData {
  avgTotalQueue: number;
  avgThroughput: number;
  avgOccupancy: number;
  avgWaitingTime: number;
  avgSpeed: number;
  avgCompletedTrips: number;
  avgPassengerThroughput: number;
  avgPublicVehicleThroughput: number;
  avgTspActivations: number;
  avgCoordinationScore: number;
  avgReward?: number;
}

export interface ComparisonKPIs {
  [runId: string]: KPIData;
}

export const validateSchema = (
  data: any[]
): { isValid: boolean; missingColumns: string[] } => {
  const requiredColumns = [
    "run_id",
    "intersection_id",
    "cycle_id",
    "start_time",
    "lane_id",
    "total_count",
    "total_pcu",
    "occupancy",
    "total_queue",
    "throughput_pcu",
  ];

  if (data.length === 0) {
    return { isValid: false, missingColumns: ["No data found"] };
  }

  const firstRow = data[0];
  const missingColumns = requiredColumns.filter((col) => !(col in firstRow));

  return {
    isValid: missingColumns.length === 0,
    missingColumns,
  };
};

export const filterData = (
  data: TrafficData[],
  selectedRuns: string[],
  selectedIntersection: string,
  cycleRange: [number, number],
  hideIncomplete: boolean
): TrafficData[] => {
  return data.filter((row) => {
    if (selectedRuns.length > 0 && !selectedRuns.includes(row.run_id))
      return false;
    if (
      selectedIntersection !== "all" &&
      row.intersection_id !== selectedIntersection
    )
      return false;
    if (row.cycle_id < cycleRange[0] || row.cycle_id > cycleRange[1])
      return false;
    if (
      hideIncomplete &&
      (row.occupancy === null ||
        row.occupancy === undefined ||
        row.total_count === null ||
        row.total_count === undefined)
    )
      return false;
    return true;
  });
};

export const computeKPIs = (
  data: TrafficData[],
  groupByRun = false
): KPIData | ComparisonKPIs => {
  if (data.length === 0) {
    const emptyKPI = {
      avgTotalQueue: 0,
      avgThroughput: 0,
      avgOccupancy: 0,
      avgWaitingTime: 0,
      avgSpeed: 0,
      avgCompletedTrips: 0,
      avgPassengerThroughput: 0,
      avgPublicVehicleThroughput: 0,
      avgTspActivations: 0,
      avgCoordinationScore: 0,
      avgReward: 0,
    };
    return groupByRun ? {} : emptyKPI;
  }

  if (!groupByRun) {
    const avgTotalQueue =
      data.reduce((sum, row) => sum + row.total_queue, 0) / data.length;
    const avgThroughput =
      data.reduce((sum, row) => sum + row.throughput_pcu, 0) / data.length;
    const avgOccupancy =
      data.reduce((sum, row) => sum + row.occupancy, 0) / data.length;
    const avgWaitingTime =
      data.reduce((sum, row) => sum + (row.waiting_time || 0), 0) / data.length;
    const avgSpeed =
      data.reduce((sum, row) => sum + (row.avg_speed || 0), 0) / data.length;
    const avgCompletedTrips =
      data.reduce((sum, row) => sum + (row.completed_trips || 0), 0) /
      data.length;
    const avgPassengerThroughput =
      data.reduce((sum, row) => sum + (row.passenger_throughput || 0), 0) /
      data.length;
    const avgPublicVehicleThroughput =
      data.reduce((sum, row) => sum + (row.public_vehicle_throughput || 0), 0) /
      data.length;
    const avgTspActivations =
      data.reduce((sum, row) => sum + (row.tsp_activations || 0), 0) /
      data.length;
    const avgCoordinationScore =
      data.reduce((sum, row) => sum + (row.coordination_score || 0), 0) /
      data.length;
    const rewardData = data.filter(
      (row) => row.reward !== undefined && row.reward !== null
    );
    const avgReward =
      rewardData.length > 0
        ? rewardData.reduce((sum, row) => sum + (row.reward || 0), 0) /
          rewardData.length
        : undefined;

    return {
      avgTotalQueue: Math.round(avgTotalQueue * 10) / 10,
      avgThroughput: Math.round(avgThroughput * 10) / 10,
      avgOccupancy: Math.round(avgOccupancy * 100) / 100,
      avgWaitingTime: Math.round(avgWaitingTime * 10) / 10,
      avgSpeed: Math.round(avgSpeed * 10) / 10,
      avgCompletedTrips: Math.round(avgCompletedTrips * 10) / 10,
      avgPassengerThroughput: Math.round(avgPassengerThroughput * 10) / 10,
      avgPublicVehicleThroughput:
        Math.round(avgPublicVehicleThroughput * 10) / 10,
      avgTspActivations: Math.round(avgTspActivations * 10) / 10,
      avgCoordinationScore: Math.round(avgCoordinationScore * 100) / 100,
      avgReward: avgReward ? Math.round(avgReward * 100) / 100 : undefined,
    };
  }

  // Group by run_id
  const groupedData = data.reduce((acc, row) => {
    if (!acc[row.run_id]) acc[row.run_id] = [];
    acc[row.run_id].push(row);
    return acc;
  }, {} as Record<string, TrafficData[]>);

  const result: ComparisonKPIs = {};
  Object.entries(groupedData).forEach(([runId, runData]) => {
    result[runId] = computeKPIs(runData, false) as KPIData;
  });

  return result;
};

export const buildTimeSeriesData = (
  data: TrafficData[],
  metric: keyof TrafficData = "total_queue"
) => {
  const grouped = data.reduce((acc, row) => {
    const key = `${row.run_id}_${row.cycle_id}`;
    if (!acc[key]) {
      acc[key] = {
        cycle_id: row.cycle_id,
        run_id: row.run_id,
        values: [],
        timestamp_step: row.timestamp_step,
      };
    }
    acc[key].values.push(row[metric] as number);
    return acc;
  }, {} as Record<string, { cycle_id: number; run_id: string; values: number[]; timestamp_step?: number }>);

  return Object.values(grouped)
    .map((group) => ({
      cycle_id: group.cycle_id,
      run_id: group.run_id,
      value:
        group.values.reduce((sum, val) => sum + val, 0) / group.values.length,
      timestamp_step: group.timestamp_step,
    }))
    .sort((a, b) => a.cycle_id - b.cycle_id);
};

export const getLaneBreakdown = (
  data: TrafficData[],
  selectedCycle?: number
) => {
  const filteredData = selectedCycle
    ? data.filter((row) => row.cycle_id === selectedCycle)
    : data;

  if (filteredData.length === 0) return [];

  // Get all unique run_ids from the filtered data
  const uniqueRunIds = [...new Set(filteredData.map((row) => row.run_id))];

  const grouped = filteredData.reduce((acc, row) => {
    const key = row.lane_id;

    if (!acc[key]) {
      acc[key] = {
        lane_id: row.lane_id,
      };
      // Initialize totals and counters for each run_id
      uniqueRunIds.forEach((runId) => {
        acc[key][runId] = 0;
        acc[key][`${runId}_count`] = 0;
      });
    }

    // Add the public_vehicle_throughput value and increment counter for this run_id
    acc[key][row.run_id] += row.public_vehicle_throughput || 0;
    acc[key][`${row.run_id}_count`] += 1;

    return acc;
  }, {} as Record<string, any>);

  // Calculate averages for each run_id
  return Object.values(grouped).map((group: any) => {
    const result: any = { lane_id: group.lane_id };

    uniqueRunIds.forEach((runId) => {
      const count = group[`${runId}_count`];
      result[runId] =
        count > 0 ? Math.round((group[runId] / count) * 10) / 10 : 0;
    });

    return result;
  });
};

export const calculateDelta = (current: number, baseline: number): string => {
  if (baseline === 0) return "0%";
  const delta = ((current - baseline) / baseline) * 100;
  const sign = delta > 0 ? "+" : "";
  return `${sign}${Math.round(delta)}%`;
};

export const parseCSVData = (csvText: string): TrafficData[] => {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const data: TrafficData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const row: any = {};

    headers.forEach((header, index) => {
      const value = values[index];
      if (
        header === "cycle_id" ||
        header === "total_count" ||
        header === "total_queue" ||
        header === "phase_index" ||
        header === "timestamp_step"
      ) {
        row[header] = parseInt(value) || 0;
      } else if (
        header === "total_pcu" ||
        header === "occupancy" ||
        header === "throughput_pcu" ||
        header === "reward"
      ) {
        row[header] = parseFloat(value) || 0;
      } else {
        row[header] = value;
      }
    });

    data.push(row as TrafficData);
  }

  return data;
};
