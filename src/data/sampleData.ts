export interface TrafficData {
  run_id: string;
  intersection_id: string;
  cycle_id: number;
  start_time: string;
  lane_id: string;
  total_count: number;
  total_pcu: number;
  occupancy: number;
  total_queue: number;
  throughput_pcu: number;

  // Passenger-centric metrics (aligned with objectives)
  passenger_throughput: number; // passengers per cycle
  passenger_waiting_time: number; // average passenger waiting time (seconds)

  // Public vehicle-specific metrics (aligned with objectives)
  public_vehicle_count: number; // number of public vehicles detected
  public_vehicle_throughput: number; // public vehicle throughput per cycle
  public_vehicle_travel_time: number; // average public vehicle travel time (seconds)
  public_vehicle_delay: number; // public vehicle delay compared to free flow

  // Transit Signal Priority metrics
  tsp_activations: number; // number of TSP activations this cycle
  green_extension_time: number; // total green extension time (seconds)

  // Multi-agent coordination metrics
  coordination_score: number; // coordination effectiveness (0-1)
  overall_vehicle_delay: number; // total vehicle delay (seconds)

  // YOLO detection metrics
  vehicle_classification_accuracy: number; // YOLO detection accuracy (0-1)

  // Legacy fields for compatibility
  waiting_time: number;
  avg_speed: number;
  completed_trips: number;
  reward?: number;
  phase_index?: number;
  timestamp_step?: number;
}

export const generateSampleData = (): TrafficData[] => {
  const data: TrafficData[] = [];
  const runs = ["Fixed Time", "D3QN Multi Agent"];
  const intersections = ["Ecoland", "Sandawa", "John Paul"];
  const lanes = ["Lane_N", "Lane_S", "Lane_E", "Lane_W"];

  // Traffic demand scenarios
  const scenarios = ["low_demand", "medium_demand", "high_demand"];

  let timestep = 0;

  runs.forEach((runId) => {
    intersections.forEach((intId) => {
      for (let cycle = 1; cycle <= 30; cycle++) {
        const baseTime = new Date(2024, 0, 1, 8, 0, 0);
        baseTime.setSeconds(baseTime.getSeconds() + cycle * 90); // 90 second cycles

        lanes.forEach((laneId, laneIndex) => {
          // Performance hierarchy: Multi Agent > Fixed Time
          const isFixedTime = runId.includes("Fixed Time");
          const isMultiAgent = runId.includes("D3QN Multi");

          // Queue lengths (lower is better): Multi < Fixed
          const baseQueue = isFixedTime
            ? 8 + Math.random() * 6 // Worst: 8-14
            : 3 + Math.random() * 3; // Best: 3-6

          // Throughput (higher is better): Multi > Fixed
          const baseThroughput = isFixedTime
            ? 180 + Math.random() * 30 // Worst: 180-210
            : 240 + Math.random() * 40; // Best: 240-280

          // Occupancy (lower is better): Multi < Fixed
          const baseOccupancy = isFixedTime
            ? 0.6 + Math.random() * 0.3 // Worst: 0.6-0.9
            : 0.25 + Math.random() * 0.2; // Best: 0.25-0.45

          // Waiting time (lower is better): Multi < Fixed
          const baseWaitingTime = isFixedTime
            ? 45 + Math.random() * 25 // Worst: 45-70 seconds
            : 15 + Math.random() * 10; // Best: 15-25 seconds

          // Speed (higher is better): Multi > Fixed
          const baseSpeed = isFixedTime
            ? 15 + Math.random() * 10 // Worst: 15-25 km/h
            : 35 + Math.random() * 15; // Best: 35-50 km/h

          // Completed trips (higher is better): Multi > Fixed
          const baseCompletedTrips = isFixedTime
            ? 35 + Math.random() * 15 // Worst: 35-50
            : 65 + Math.random() * 25; // Best: 65-90

          // Research-specific metrics (higher is better): Multi > Fixed
          const basePassengerThroughput = isFixedTime
            ? 120 + Math.random() * 30 // Worst: 120-150 passengers/cycle
            : 190 + Math.random() * 40; // Best: 190-230 passengers/cycle

          const basePublicVehicleThroughput = isFixedTime
            ? 8 + Math.random() * 3 // Worst: 8-11 public vehicles/cycle
            : 16 + Math.random() * 5; // Best: 16-21 public vehicles/cycle

          const baseTspActivations = isFixedTime
            ? 0 // Fixed time doesn't use TSP
            : 4 + Math.random() * 4; // Best: 4-8 activations/cycle

          const baseCoordinationScore = isFixedTime
            ? 0.3 + Math.random() * 0.2 // Worst: 0.3-0.5
            : 0.8 + Math.random() * 0.15; // Best: 0.80-0.95

          // Add some variation by intersection
          const intMultiplier =
            intId === "Ecoland" ? 1.2 : intId === "Sandawa" ? 1.0 : 0.8;

          data.push({
            run_id: runId,
            intersection_id: intId,
            cycle_id: cycle,
            start_time: baseTime.toTimeString().split(" ")[0],
            lane_id: laneId,
            total_count: Math.round((15 + Math.random() * 10) * intMultiplier),
            total_pcu:
              Math.round((12 + Math.random() * 8) * intMultiplier * 10) / 10,
            occupancy: Math.min(
              0.95,
              Math.max(0.1, baseOccupancy * intMultiplier)
            ),
            total_queue: Math.round(baseQueue * intMultiplier),
            throughput_pcu: Math.round(baseThroughput * intMultiplier),
            waiting_time: Math.round(baseWaitingTime * intMultiplier * 10) / 10,
            avg_speed: Math.round(baseSpeed * intMultiplier * 10) / 10,
            completed_trips: Math.round(baseCompletedTrips * intMultiplier),
            passenger_throughput: Math.round(
              basePassengerThroughput * intMultiplier
            ),
            passenger_waiting_time:
              Math.round(baseWaitingTime * intMultiplier * 10) / 10,
            public_vehicle_count: Math.round(
              (isFixedTime ? 3 + Math.random() * 4 : 6 + Math.random() * 6) *
                intMultiplier
            ),
            public_vehicle_throughput: Math.round(
              basePublicVehicleThroughput * intMultiplier
            ),
            public_vehicle_travel_time: Math.round(
              (isFixedTime
                ? 140 + Math.random() * 60
                : 100 + Math.random() * 30) * intMultiplier
            ),
            public_vehicle_delay: Math.round(
              (isFixedTime ? 25 + Math.random() * 25 : 8 + Math.random() * 12) *
                intMultiplier
            ),
            tsp_activations: Math.round(baseTspActivations * intMultiplier),
            green_extension_time: isFixedTime
              ? 0
              : Math.round((15 + Math.random() * 20) * intMultiplier),
            coordination_score:
              Math.round(baseCoordinationScore * intMultiplier * 100) / 100,
            overall_vehicle_delay: Math.round(
              (isFixedTime
                ? 300 + Math.random() * 150
                : 150 + Math.random() * 75) * intMultiplier
            ),
            vehicle_classification_accuracy:
              Math.round(
                (isFixedTime
                  ? 0.82 + Math.random() * 0.08
                  : 0.92 + Math.random() * 0.06) * 100
              ) / 100,
            reward: isFixedTime
              ? undefined
              : Math.round((0.7 + Math.random() * 0.6) * 100) / 100,
            phase_index: laneIndex + 1,
            timestamp_step: timestep++,
          });
        });
      }
    });
  });

  return data;
};

export const sampleData = generateSampleData();
