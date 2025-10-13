import {
  TrainingEpisode,
  ValidationResult,
  BaselineComparison,
  LaneMetric,
  ObjectiveMetric,
  ExperimentInfo,
} from "./trainingData";

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

  // Generate 150 episodes (100 offline, 50 online)
  for (let episode = 1; episode <= 150; episode++) {
    const phase_type = episode <= 100 ? "offline" : "online";
    const isOnline = phase_type === "online";

    // Learning progress: improves over time
    const learningProgress = Math.min(episode / 150, 1);
    const onlineBonus = isOnline ? 1.1 : 1.0;

    // Base metrics with improvement over time
    const basePassengerThroughput = 150 + learningProgress * 80;
    const baseWaitingTime = 60 - learningProgress * 25;
    const baseJeepneyThroughput = 12 + learningProgress * 8;
    const baseReward = 100 + learningProgress * 150;

    const baseTime = new Date("2024-01-01T08:00:00");
    baseTime.setMinutes(baseTime.getMinutes() + episode * 5);

    const episodeData: TrainingEpisode = {
      experiment_id: experimentId,
      episode_number: episode,
      phase_type: phase_type,
      scenario_name: scenarios[episode % scenarios.length],
      scenario_day: days[episode % days.length],
      scenario_cycle: (episode % 30) + 1,
      total_reward: baseReward * onlineBonus + (Math.random() * 30 - 15),
      avg_loss:
        Math.max(0.001, 0.01 - learningProgress * 0.008) *
        (Math.random() * 0.5 + 0.75),
      epsilon_value: Math.max(0.01, 1.0 - episode / 120),
      steps_completed: 180 + Math.floor(Math.random() * 40),
      episode_duration_seconds: 200 + Math.floor(Math.random() * 100),
      vehicles_served: Math.floor(
        250 + learningProgress * 100 + Math.random() * 50
      ),
      completed_trips: Math.floor(
        200 + learningProgress * 80 + Math.random() * 40
      ),
      passenger_throughput:
        basePassengerThroughput * onlineBonus + (Math.random() * 20 - 10),
      avg_waiting_time: baseWaitingTime / onlineBonus + (Math.random() * 8 - 4),
      avg_queue_length: Math.max(
        2,
        12 - learningProgress * 6 + (Math.random() * 2 - 1)
      ),
      avg_speed: 20 + learningProgress * 15 + (Math.random() * 5 - 2.5),
      jeepneys_processed: Math.floor(
        baseJeepneyThroughput * onlineBonus + (Math.random() * 3 - 1.5)
      ),
      buses_processed: Math.floor(
        (8 + learningProgress * 4) * onlineBonus + (Math.random() * 2 - 1)
      ),
      pt_passenger_throughput: Math.floor(
        (120 + learningProgress * 50) * onlineBonus + (Math.random() * 15 - 7.5)
      ),
      memory_size: Math.min(
        50000,
        episode * 150 + Math.floor(Math.random() * 500)
      ),
      timestamp: baseTime.toISOString(),
    };

    episodes.push(episodeData);

    // Generate lane metrics for each episode (every 5 episodes)
    if (episode % 5 === 0) {
      intersections.forEach((intersection) => {
        lanes.forEach((lane) => {
          const laneMetric: LaneMetric = {
            experiment_id: experimentId,
            episode_number: episode,
            intersection_id: intersection,
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
            cars_processed: Math.floor(
              30 + learningProgress * 15 + Math.random() * 8
            ),
            jeepneys_processed: Math.floor(
              baseJeepneyThroughput / 4 + Math.random() * 2
            ),
            buses_processed: Math.floor(
              (8 + learningProgress * 4) / 4 + Math.random() * 1.5
            ),
            motorcycles_processed: Math.floor(
              20 + learningProgress * 10 + Math.random() * 5
            ),
            timestamp: baseTime.toISOString(),
          };
          laneMetrics.push(laneMetric);
        });
      });
    }

    // Validation every 10 episodes
    if (episode % 10 === 0) {
      const validation: ValidationResult = {
        experiment_id: experimentId,
        episode_number: episode,
        avg_reward: baseReward * onlineBonus,
        reward_std: 20 + Math.random() * 10,
        avg_vehicles: Math.floor(250 + learningProgress * 100),
        avg_completed_trips: Math.floor(200 + learningProgress * 80),
        avg_passenger_throughput: basePassengerThroughput * onlineBonus,
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
  return [
    {
      experiment_id: experimentId,
      baseline_type: "fixed_time",
      avg_passenger_throughput: 145,
      avg_waiting_time: 58,
      avg_queue_length: 11,
      avg_speed: 22,
      vehicles_served: 280,
      completed_trips: 220,
      jeepneys_processed: 10,
      buses_processed: 7,
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
    waiting_time_reduction_pct: -14.2,
    objective_1_achieved: true,
    jeepney_throughput_improvement_pct: 18.7,
    overall_delay_increase_pct: 3.2, // Within 5% constraint
    pt_priority_constraint_met: true,
    objective_2_achieved: true,
    multi_agent_passenger_delay_reduction_pct: 11.5,
    multi_agent_jeepney_travel_time_reduction_pct: -13.8,
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
