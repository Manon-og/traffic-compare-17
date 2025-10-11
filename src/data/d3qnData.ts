export interface D3QNTrafficData {
  // Core identification
  experiment_id: string;
  experiment_name: string;
  episode_number: number;
  intersection_id: string;

  // Scenario Information
  scenario_info: {
    day: string;
    cycle: number;
    weather: string;
    peak_hour: boolean;
    traffic_density: "low" | "medium" | "high";
  };

  // Core RL Metrics
  total_reward: number;
  steps_completed: number;
  epsilon_value: number;
  avg_loss: number;
  memory_size: number;

  // Traffic Performance Metrics
  total_vehicles: number;
  completed_trips: number;
  passenger_throughput: number;
  avg_waiting_time: number;
  avg_speed: number;
  avg_queue_length: number;
  max_queue_length: number;
  travel_time_index: number;

  // Public Transport Metrics
  buses_processed: number;
  jeepneys_processed: number;
  pt_passenger_throughput: number;
  pt_avg_waiting: number;
  pt_service_efficiency: number;

  // Reward Components
  reward_components: {
    waiting_time_penalty: number;
    throughput_reward: number;
    queue_penalty: number;
    pt_priority_bonus: number;
    speed_reward: number;
  };

  // Timing
  episode_duration_minutes: number;
  timestamp: string;

  // Experiment metadata
  experiment_status: "running" | "completed" | "failed" | "paused";
  checkpoint_type?: "best" | "regular" | "final";
}

// Legacy compatibility interface
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
  reward?: number;
  phase_index?: number;
  timestamp_step?: number;
}

export const generateD3QNSampleData = (): D3QNTrafficData[] => {
  const data: D3QNTrafficData[] = [];

  // Experiment configurations
  const experiments = [
    {
      id: "exp-d3qn-001",
      name: "D3QN_Standard_Training",
      status: "completed" as const,
    },
    {
      id: "exp-baseline-001",
      name: "Fixed_Time_Baseline",
      status: "completed" as const,
    },
    {
      id: "exp-d3qn-002",
      name: "D3QN_Enhanced_PT_Priority",
      status: "running" as const,
    },
  ];

  const intersections = [
    "EDSA_Shaw",
    "EDSA_Ortigas",
    "Ayala_Makati",
    "BGC_5th",
    "QC_Circle",
  ];
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const weathers = ["sunny", "rainy", "cloudy"];
  const trafficDensities: ("low" | "medium" | "high")[] = [
    "low",
    "medium",
    "high",
  ];

  experiments.forEach((exp) => {
    const isD3QN = exp.name.includes("D3QN");
    const isEnhanced = exp.name.includes("Enhanced");
    const episodeCount = exp.status === "completed" ? 150 : 75;

    for (let episode = 1; episode <= episodeCount; episode++) {
      intersections.forEach((intId) => {
        const day = days[Math.floor(Math.random() * days.length)];
        const weather = weathers[Math.floor(Math.random() * weathers.length)];
        const isPeakHour = Math.random() > 0.6;
        const trafficDensity =
          trafficDensities[Math.floor(Math.random() * trafficDensities.length)];
        const cycle = Math.floor(Math.random() * 100) + 1;

        // Base performance metrics with realistic variations
        let baseReward: number;
        let baseWaitTime: number;
        let baseThroughput: number;
        let baseQueueLength: number;
        let baseSpeed: number;

        if (isD3QN) {
          // D3QN performance improves over episodes
          const learningProgress = Math.min(episode / 100, 1);
          baseReward = 150 + learningProgress * 200 + (Math.random() * 50 - 25);
          baseWaitTime = 45 - learningProgress * 15 + (Math.random() * 10 - 5);
          baseThroughput =
            450 + learningProgress * 150 + (Math.random() * 50 - 25);
          baseQueueLength = 8 - learningProgress * 3 + (Math.random() * 2 - 1);
          baseSpeed = 25 + learningProgress * 10 + (Math.random() * 5 - 2.5);
        } else {
          // Fixed time baseline - consistent but suboptimal
          baseReward = 120 + (Math.random() * 30 - 15);
          baseWaitTime = 65 + (Math.random() * 15 - 7.5);
          baseThroughput = 380 + (Math.random() * 40 - 20);
          baseQueueLength = 12 + (Math.random() * 4 - 2);
          baseSpeed = 22 + (Math.random() * 3 - 1.5);
        }

        // Apply scenario modifiers
        const densityMultiplier =
          trafficDensity === "high"
            ? 1.4
            : trafficDensity === "medium"
            ? 1.1
            : 0.8;
        const peakMultiplier = isPeakHour ? 1.3 : 1.0;
        const weatherMultiplier =
          weather === "rainy" ? 1.2 : weather === "cloudy" ? 1.05 : 1.0;
        const totalMultiplier =
          densityMultiplier * peakMultiplier * weatherMultiplier;

        // Calculate final metrics
        const waitTime = Math.max(15, baseWaitTime * totalMultiplier);
        const throughput = Math.max(
          200,
          baseThroughput / Math.sqrt(totalMultiplier)
        );
        const queueLength = Math.max(2, baseQueueLength * totalMultiplier);
        const speed = Math.max(10, baseSpeed / Math.sqrt(totalMultiplier));

        // Vehicle counts
        const totalVehicles = Math.floor(
          200 + Math.random() * 300 * totalMultiplier
        );
        const completedTrips = Math.floor(
          totalVehicles * (0.85 + Math.random() * 0.1)
        );

        // Public transport metrics (enhanced for PT priority experiment)
        const ptMultiplier = isEnhanced ? 1.5 : 1.0;
        const busesProcessed = Math.floor(
          (8 + Math.random() * 12) * ptMultiplier
        );
        const jeepneysProcessed = Math.floor(
          (15 + Math.random() * 25) * ptMultiplier
        );
        const ptThroughput =
          (busesProcessed * 35 + jeepneysProcessed * 18) * ptMultiplier;
        const ptWaiting = Math.max(10, (waitTime * 0.7) / ptMultiplier);
        const ptEfficiency = Math.min(
          0.95,
          0.6 + (ptMultiplier - 1) * 0.2 + Math.random() * 0.2
        );

        // Reward components breakdown
        const waitingPenalty = -waitTime * 2.5;
        const throughputReward = throughput * 0.8;
        const queuePenalty = -queueLength * 15;
        const ptBonus = isEnhanced ? ptEfficiency * 100 : 0;
        const speedReward = speed * 3;

        const totalRewardCalculated =
          waitingPenalty +
          throughputReward +
          queuePenalty +
          ptBonus +
          speedReward;

        // RL-specific metrics
        const epsilonValue = isD3QN ? Math.max(0.01, 1.0 - episode / 200) : 0;
        const avgLoss = isD3QN ? 0.001 + Math.random() * 0.005 : 0;
        const memorySize = isD3QN
          ? Math.min(50000, episode * 150 + Math.floor(Math.random() * 1000))
          : 0;
        const stepsCompleted = 180 + Math.floor(Math.random() * 120); // 3-5 minute episodes

        const baseTime = new Date();
        baseTime.setMinutes(
          baseTime.getMinutes() - (episodeCount - episode) * 5
        );

        data.push({
          experiment_id: exp.id,
          experiment_name: exp.name,
          episode_number: episode,
          intersection_id: intId,
          scenario_info: {
            day,
            cycle,
            weather,
            peak_hour: isPeakHour,
            traffic_density: trafficDensity,
          },
          total_reward: Math.round(totalRewardCalculated * 100) / 100,
          steps_completed: stepsCompleted,
          epsilon_value: Math.round(epsilonValue * 1000) / 1000,
          avg_loss: Math.round(avgLoss * 10000) / 10000,
          memory_size: memorySize,
          total_vehicles: totalVehicles,
          completed_trips: completedTrips,
          passenger_throughput: Math.round(throughput * 100) / 100,
          avg_waiting_time: Math.round(waitTime * 100) / 100,
          avg_speed: Math.round(speed * 100) / 100,
          avg_queue_length: Math.round(queueLength * 100) / 100,
          max_queue_length: Math.floor(
            queueLength * (1.5 + Math.random() * 0.5)
          ),
          travel_time_index: Math.round((waitTime / speed) * 100) / 100,
          buses_processed: busesProcessed,
          jeepneys_processed: jeepneysProcessed,
          pt_passenger_throughput: Math.round(ptThroughput * 100) / 100,
          pt_avg_waiting: Math.round(ptWaiting * 100) / 100,
          pt_service_efficiency: Math.round(ptEfficiency * 1000) / 1000,
          reward_components: {
            waiting_time_penalty: Math.round(waitingPenalty * 100) / 100,
            throughput_reward: Math.round(throughputReward * 100) / 100,
            queue_penalty: Math.round(queuePenalty * 100) / 100,
            pt_priority_bonus: Math.round(ptBonus * 100) / 100,
            speed_reward: Math.round(speedReward * 100) / 100,
          },
          episode_duration_minutes:
            Math.round((stepsCompleted / 60) * 100) / 100,
          timestamp: baseTime.toISOString(),
          experiment_status: exp.status,
        });
      });
    }
  });

  return data.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

// Convert D3QN data to legacy format for compatibility
export const convertToLegacyFormat = (
  d3qnData: D3QNTrafficData[]
): TrafficData[] => {
  return d3qnData.map((item, index) => ({
    run_id: item.experiment_name.includes("D3QN")
      ? `d3qn_${item.experiment_id.slice(-3)}`
      : `fixed_time_${item.experiment_id.slice(-3)}`,
    intersection_id: item.intersection_id,
    cycle_id: item.scenario_info.cycle,
    start_time: new Date(item.timestamp).toTimeString().split(" ")[0],
    lane_id: `Lane_${(index % 4) + 1}`, // Distribute across 4 lanes
    total_count: item.total_vehicles,
    total_pcu: Math.round(item.passenger_throughput / 10),
    occupancy: Math.min(0.95, Math.max(0.1, item.avg_queue_length / 20)),
    total_queue: Math.round(item.avg_queue_length),
    throughput_pcu: Math.round(item.passenger_throughput),
    reward: item.experiment_name.includes("D3QN")
      ? item.total_reward
      : undefined,
    phase_index: (index % 4) + 1,
    timestamp_step: index,
  }));
};

// Generate the sample data
export const d3qnSampleData = generateD3QNSampleData();
export const sampleData = convertToLegacyFormat(d3qnSampleData);

// Legacy data generation function for compatibility
export const generateSampleData = () =>
  convertToLegacyFormat(generateD3QNSampleData());
