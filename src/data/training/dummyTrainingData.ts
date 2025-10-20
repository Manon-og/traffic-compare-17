import {
  TrainingEpisode,
  ValidationResult,
  BaselineComparison,
  LaneMetric,
  ObjectiveMetric,
  ExperimentInfo,
} from "./trainingData";

// Vehicle types and passenger capacities from training codebase
const VEHICLE_TYPES = {
  car: "car",
  jeepney: "jeepney",
  bus: "bus",
  motorcycle: "motorcycle",
  truck: "truck",
  tricycle: "tricycle",
  modern_jeepney: "modern_jeepney",
} as const;

const PASSENGER_CAPACITY = {
  car: 1.3,
  motorcycle: 1.4,
  truck: 1.1,
  jeepney: 14.0,
  tricycle: 2.5,
  modern_jeepney: 22.0,
  bus: 35.0,
  default: 1.5,
};

// Public transport vehicles (for PT priority metrics)
const PUBLIC_TRANSPORT_TYPES = ["jeepney", "bus", "modern_jeepney"];

export const generateDummyTrainingData = (experimentId: string = "exp-001") => {
  const episodes: TrainingEpisode[] = [];
  const validations: ValidationResult[] = [];
  const laneMetrics: LaneMetric[] = [];

  const intersections = ["Ecoland", "Sandawa", "John Paul"];
  const lanes = ["Lane_N", "Lane_S", "Lane_E", "Lane_W"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const scenarios = [
    "morning_peak",
    "afternoon_peak",
    "evening_peak",
    "off_peak",
  ];

  // Intersection-specific base multipliers (traffic density)
  const intersectionMultipliers: Record<string, number> = {
    Ecoland: 1.3, // High-traffic commercial
    Sandawa: 1.0, // Moderate traffic
    "John Paul": 0.8, // Lower traffic residential
  };

  // Generate 150 episodes (100 offline, 50 online)
  // Each episode is associated with ONE intersection
  for (let episode = 1; episode <= 150; episode++) {
    const phase_type = episode <= 100 ? "offline" : "online";
    const isOnline = phase_type === "online";

    // Cycle through intersections for each episode
    const intersection = intersections[episode % intersections.length];
    const intMultiplier = intersectionMultipliers[intersection];

    // Learning progress: improves over time (0 to 1)
    const learningProgress = Math.min(episode / 150, 1);
    const onlineBonus = isOnline ? 1.15 : 1.0;

    // Cycle-based improvement: throughput increases as cycles progress
    const cycleNumber = ((episode - 1) % 30) + 1;
    const cycleImprovement = 1 + (cycleNumber / 30) * 0.2; // Up to 20% improvement by cycle 30

    // Vehicle distribution changes with learning
    // D3QN learns to prioritize public transport more effectively
    const carCount = Math.floor(
      (30 - learningProgress * 5) * intMultiplier * cycleImprovement +
        Math.random() * 5
    );
    const motorcycleCount = Math.floor(
      (20 - learningProgress * 3) * intMultiplier * cycleImprovement +
        Math.random() * 4
    );
    const truckCount = Math.floor(
      (5 - learningProgress * 1) * intMultiplier + Math.random() * 2
    );
    const tricycleCount = Math.floor(
      (8 - learningProgress * 2) * intMultiplier + Math.random() * 2
    );

    // Public transport increases with better optimization AND more cycles
    const jeepneyCount = Math.floor(
      (8 + learningProgress * 6) *
        intMultiplier *
        cycleImprovement *
        onlineBonus +
        Math.random() * 3
    );
    const modernJeepneyCount = Math.floor(
      (2 + learningProgress * 3) *
        intMultiplier *
        cycleImprovement *
        onlineBonus +
        Math.random() * 2
    );
    const busCount = Math.floor(
      (3 + learningProgress * 4) *
        intMultiplier *
        cycleImprovement *
        onlineBonus +
        Math.random() * 2
    );

    // Calculate passenger throughput based on vehicle mix and capacities
    const carPassengers = carCount * PASSENGER_CAPACITY.car;
    const motorcyclePassengers =
      motorcycleCount * PASSENGER_CAPACITY.motorcycle;
    const truckPassengers = truckCount * PASSENGER_CAPACITY.truck;
    const tricyclePassengers = tricycleCount * PASSENGER_CAPACITY.tricycle;
    const jeepneyPassengers = jeepneyCount * PASSENGER_CAPACITY.jeepney;
    const modernJeepneyPassengers =
      modernJeepneyCount * PASSENGER_CAPACITY.modern_jeepney;
    const busPassengers = busCount * PASSENGER_CAPACITY.bus;

    const totalPassengerThroughput =
      carPassengers +
      motorcyclePassengers +
      truckPassengers +
      tricyclePassengers +
      jeepneyPassengers +
      modernJeepneyPassengers +
      busPassengers;

    const ptPassengerThroughput =
      jeepneyPassengers + modernJeepneyPassengers + busPassengers;

    const totalVehicles =
      carCount +
      motorcycleCount +
      truckCount +
      tricycleCount +
      jeepneyCount +
      modernJeepneyCount +
      busCount;

    // Base metrics with improvement over time AND cycles
    const baseWaitingTime = (60 - learningProgress * 25) / cycleImprovement;
    const baseReward = (100 + learningProgress * 150) * cycleImprovement;

    // LSTM Prediction Accuracy (BAD performance, improves slowly)
    const baseAccuracy = 35 + learningProgress * 25; // Starts at 35%, max ~60%
    const accuracyNoise = (Math.random() - 0.5) * 15; // High variance ±7.5%
    const prediction_accuracy = Math.max(
      20,
      Math.min(60, baseAccuracy + accuracyNoise)
    );

    const baseTime = new Date("2024-01-01T08:00:00");
    baseTime.setMinutes(baseTime.getMinutes() + episode * 5);
    const episodeData: TrainingEpisode = {
      experiment_id: experimentId,
      episode_number: episode,
      phase_type: phase_type,
      scenario_name: scenarios[episode % scenarios.length],
      scenario_day: days[episode % days.length],
      scenario_cycle: cycleNumber,
      intersection_id: intersection, // Associate with specific intersection

      // LSTM-specific metric (BAD PERFORMANCE)
      prediction_accuracy: Math.round(prediction_accuracy * 100) / 100,

      total_reward: baseReward * onlineBonus + (Math.random() * 30 - 15),
      avg_loss:
        Math.max(0.001, 0.01 - learningProgress * 0.008) *
        (Math.random() * 0.5 + 0.75),
      epsilon_value: Math.max(0.01, 1.0 - episode / 120),
      steps_completed: 180 + Math.floor(Math.random() * 40),
      episode_duration_seconds: 200 + Math.floor(Math.random() * 100),
      vehicles_served: totalVehicles,
      completed_trips: Math.floor(
        totalVehicles * (0.85 + learningProgress * 0.1) + Math.random() * 10
      ),
      passenger_throughput:
        totalPassengerThroughput + (Math.random() * 20 - 10),
      avg_waiting_time: baseWaitingTime / onlineBonus + (Math.random() * 8 - 4),
      avg_queue_length: Math.max(
        2,
        12 - learningProgress * 6 + (Math.random() * 2 - 1)
      ),
      avg_speed: 20 + learningProgress * 15 + (Math.random() * 5 - 2.5),
      jeepneys_processed: jeepneyCount + modernJeepneyCount,
      buses_processed: busCount,
      pt_passenger_throughput:
        ptPassengerThroughput + (Math.random() * 15 - 7.5),
      memory_size: Math.min(
        50000,
        episode * 150 + Math.floor(Math.random() * 500)
      ),
      timestamp: baseTime.toISOString(),

      // Vehicle type breakdown
      vehicle_breakdown: {
        cars: carCount,
        motorcycles: motorcycleCount,
        trucks: truckCount,
        tricycles: tricycleCount,
        jeepneys: jeepneyCount,
        modern_jeepneys: modernJeepneyCount,
        buses: busCount,
      },

      // Passenger contribution by vehicle type
      passenger_breakdown: {
        car_passengers: Math.round(carPassengers),
        motorcycle_passengers: Math.round(motorcyclePassengers),
        truck_passengers: Math.round(truckPassengers),
        tricycle_passengers: Math.round(tricyclePassengers),
        jeepney_passengers: Math.round(jeepneyPassengers),
        modern_jeepney_passengers: Math.round(modernJeepneyPassengers),
        bus_passengers: Math.round(busPassengers),
      },
    };

    episodes.push(episodeData);

    // Generate lane metrics for each episode (every 5 episodes)
    if (episode % 5 === 0) {
      lanes.forEach((lane) => {
        // Distribute vehicles across lanes for THIS intersection only
        const laneVehicleCount = Math.floor(totalVehicles / 4);
        const laneCars = Math.floor(carCount / 4 + Math.random() * 2);
        const laneMotorcycles = Math.floor(
          motorcycleCount / 4 + Math.random() * 2
        );
        const laneJeepneys = Math.floor(
          (jeepneyCount + modernJeepneyCount) / 4 + Math.random() * 1
        );
        const laneBuses = Math.floor(busCount / 4 + Math.random() * 1);

        const laneMetric: LaneMetric = {
          experiment_id: experimentId,
          episode_number: episode,
          intersection_id: intersection, // Lane belongs to this intersection
          lane_id: lane,
          queue_length: Math.max(
            1,
            Math.floor(8 - learningProgress * 4 + Math.random() * 3)
          ),
          throughput: Math.floor(
            50 + learningProgress * 30 + Math.random() * 10
          ),
          occupancy: Math.max(
            0.2,
            Math.min(0.9, 0.7 - learningProgress * 0.3 + Math.random() * 0.15)
          ),
          avg_waiting_time: baseWaitingTime + (Math.random() * 10 - 5),
          cars_processed: laneCars,
          jeepneys_processed: laneJeepneys,
          buses_processed: laneBuses,
          motorcycles_processed: laneMotorcycles,
          timestamp: baseTime.toISOString(),
        };
        laneMetrics.push(laneMetric);
      });
    }

    // Validation every 10 episodes
    if (episode % 10 === 0) {
      const validation: ValidationResult = {
        experiment_id: experimentId,
        episode_number: episode,
        avg_reward: baseReward * onlineBonus,
        reward_std: 20 + Math.random() * 10,
        avg_vehicles: Math.floor(totalVehicles),
        avg_completed_trips: Math.floor(
          totalVehicles * (0.85 + learningProgress * 0.1)
        ),
        avg_passenger_throughput: totalPassengerThroughput,
        scenarios_tested: 5,
        timestamp: baseTime.toISOString(),
      };
      validations.push(validation);
    }
  }

  return { episodes, validations, laneMetrics };
};

export const generateBaselineData = (
  experimentId: string = "exp-001"
): BaselineComparison[] => {
  // Fixed-time baseline with typical vehicle mix (less PT optimization)
  const baselineCars = 35;
  const baselineMotorcycles = 22;
  const baselineTrucks = 6;
  const baselineTricycles = 10;
  const baselineJeepneys = 7; // Lower PT throughput
  const baselineModernJeepneys = 1;
  const baselineBuses = 4;

  const baselinePassengerThroughput =
    baselineCars * PASSENGER_CAPACITY.car +
    baselineMotorcycles * PASSENGER_CAPACITY.motorcycle +
    baselineTrucks * PASSENGER_CAPACITY.truck +
    baselineTricycles * PASSENGER_CAPACITY.tricycle +
    baselineJeepneys * PASSENGER_CAPACITY.jeepney +
    baselineModernJeepneys * PASSENGER_CAPACITY.modern_jeepney +
    baselineBuses * PASSENGER_CAPACITY.bus;

  return [
    {
      experiment_id: experimentId,
      baseline_type: "fixed_time",
      avg_passenger_throughput: Math.round(baselinePassengerThroughput),
      avg_waiting_time: 58,
      avg_queue_length: 11,
      avg_speed: 22,
      vehicles_served:
        baselineCars +
        baselineMotorcycles +
        baselineTrucks +
        baselineTricycles +
        baselineJeepneys +
        baselineModernJeepneys +
        baselineBuses,
      completed_trips: 65,
      jeepneys_processed: baselineJeepneys + baselineModernJeepneys,
      buses_processed: baselineBuses,
      num_episodes: 50,
      timestamp: new Date().toISOString(),
    },
  ];
};

export const generateObjectiveMetrics = (
  experimentId: string = "exp-001"
): ObjectiveMetric => {
  return {
    experiment_id: experimentId,
    passenger_throughput_improvement_pct: 12.3,
    waiting_time_reduction_pct: 14.2,
    objective_1_achieved: true,
    jeepney_throughput_improvement_pct: 18.7,
    overall_delay_increase_pct: 3.2, // Within 5% constraint
    pt_priority_constraint_met: true,
    objective_2_achieved: true,
    multi_agent_passenger_delay_reduction_pct: 11.5,
    multi_agent_jeepney_travel_time_reduction_pct: 13.8,
    objective_3_achieved: true,
    p_value: 0.003,
    effect_size: 0.82,
    confidence_interval_lower: 8.5,
    confidence_interval_upper: 16.1,
    calculated_at: new Date().toISOString(),
  };
};

export const generateExperimentInfo = (
  experimentId: string = "exp-001"
): ExperimentInfo => {
  return {
    experiment_id: experimentId,
    experiment_name: "D3QN Multi-Agent Training - Hybrid Mode",
    status: "completed",
    training_mode: "hybrid",
    created_at: new Date("2024-01-01T08:00:00").toISOString(),
    completed_at: new Date("2024-01-02T20:30:00").toISOString(),
    total_episodes: 150,
    best_reward: 245.7,
    convergence_episode: 118,
    training_time_minutes: 2190, // ~36.5 hours
  };
};

// Export combined dataset
export const dummyTrainingDataset = {
  experiment: generateExperimentInfo(),
  baseline: generateBaselineData(),
  objectives: generateObjectiveMetrics(),
  ...generateDummyTrainingData(),
};
