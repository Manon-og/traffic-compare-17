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
    // ✅ Filter to only use aggregated rows (avoid counting lanes multiple times)
    const aggregatedData = data.filter(
      (row) => row.lane_id === "Aggregate" || row.lane_id.startsWith("Lane_")
    );

    // If all data is lane-based, use it directly
    const dataToUse =
      aggregatedData.length > 0 && aggregatedData[0].lane_id === "Aggregate"
        ? aggregatedData
        : data;

    const avgTotalQueue =
      dataToUse.reduce((sum, row) => sum + row.total_queue, 0) /
      dataToUse.length;
    const avgThroughput =
      dataToUse.reduce((sum, row) => sum + row.throughput_pcu, 0) /
      dataToUse.length;
    const avgOccupancy =
      dataToUse.reduce((sum, row) => sum + row.occupancy, 0) / dataToUse.length;
    const avgWaitingTime =
      dataToUse.reduce((sum, row) => sum + (row.waiting_time || 0), 0) /
      dataToUse.length;
    const avgSpeed =
      dataToUse.reduce((sum, row) => sum + (row.avg_speed || 0), 0) /
      dataToUse.length;
    const avgCompletedTrips =
      dataToUse.reduce((sum, row) => sum + (row.completed_trips || 0), 0) /
      dataToUse.length;
    const avgPassengerThroughput =
      dataToUse.reduce((sum, row) => sum + (row.passenger_throughput || 0), 0) /
      dataToUse.length;
    const avgPublicVehicleThroughput =
      dataToUse.reduce(
        (sum, row) => sum + (row.public_vehicle_throughput || 0),
        0
      ) / dataToUse.length;
    const avgTspActivations =
      dataToUse.reduce((sum, row) => sum + (row.tsp_activations || 0), 0) /
      dataToUse.length;
    const avgCoordinationScore =
      dataToUse.reduce((sum, row) => sum + (row.coordination_score || 0), 0) /
      dataToUse.length;
    const rewardData = dataToUse.filter(
      (row) => row.reward !== undefined && row.reward !== null
    );
    const avgReward =
      rewardData.length > 0
        ? rewardData.reduce((sum, row) => sum + (row.reward || 0), 0) /
          rewardData.length
        : undefined;

    console.log("KPI Calculation Debug:");
    console.log("  Total data points:", data.length);
    console.log("  Using data points:", dataToUse.length);
    console.log(
      "  Avg Passenger Throughput:",
      avgPassengerThroughput.toFixed(1)
    );
    console.log("  Avg Waiting Time:", avgWaitingTime.toFixed(1));

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
  // Group by run_id and cycle_id
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

    // Only add if not already aggregated (check if lane_id is "Aggregate")
    if (row.lane_id === "Aggregate") {
      // Use value directly (already aggregated)
      acc[key].values.push(row[metric] as number);
    } else {
      // For legacy lane-based data, collect all lanes
      acc[key].values.push(row[metric] as number);
    }

    return acc;
  }, {} as Record<string, { cycle_id: number; run_id: string; values: number[]; timestamp_step?: number }>);

  // Convert to array and calculate averages
  return Object.values(grouped)
    .map((group) => {
      // If lane_id is "Aggregate", use first value directly
      // Otherwise, calculate average across lanes
      const value =
        group.values.length === 1
          ? group.values[0]
          : group.values.reduce((sum, val) => sum + val, 0) /
            group.values.length;

      return {
        cycle_id: group.cycle_id,
        run_id: group.run_id,
        value: Math.round(value * 10) / 10,
        timestamp_step: group.timestamp_step,
      };
    })
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

/**
 * Calculate percentage change with proper direction handling
 * For metrics where LOWER is better (waiting time, delay), shows reduction
 * For metrics where HIGHER is better (throughput), shows improvement
 */
export const calculatePercentageChange = (
  newValue: number,
  baselineValue: number,
  lowerIsBetter: boolean = false
): { value: number; isImprovement: boolean } => {
  if (baselineValue === 0) return { value: 0, isImprovement: false };

  const percentChange = ((newValue - baselineValue) / baselineValue) * 100;

  if (lowerIsBetter) {
    // For waiting time, queue length, etc. - negative change is good
    return {
      value: Math.abs(percentChange), // Show as positive number
      isImprovement: percentChange < 0, // Decrease is improvement
    };
  } else {
    // For throughput, speed, etc. - positive change is good
    return {
      value: Math.abs(percentChange),
      isImprovement: percentChange > 0,
    };
  }
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
