export interface TrainingEpisode {
  experiment_id: string;
  episode_number: number;
  phase_type: "offline" | "online";
  scenario_name: string;
  scenario_day: string;
  scenario_cycle: number;
  total_reward: number;
  avg_loss: number;
  epsilon_value: number;
  steps_completed: number;
  episode_duration_seconds: number;
  vehicles_served: number;
  completed_trips: number;
  passenger_throughput: number;
  avg_waiting_time: number;
  avg_queue_length: number;
  avg_speed: number;
  jeepneys_processed: number;
  buses_processed: number;
  pt_passenger_throughput: number;
  memory_size: number;
  timestamp: string;
}

export interface ValidationResult {
  experiment_id: string;
  episode_number: number;
  avg_reward: number;
  reward_std: number;
  avg_vehicles: number;
  avg_completed_trips: number;
  avg_passenger_throughput: number;
  scenarios_tested: number;
  timestamp: string;
}

export interface BaselineComparison {
  experiment_id: string;
  baseline_type: "fixed_time";
  avg_passenger_throughput: number;
  avg_waiting_time: number;
  avg_queue_length: number;
  avg_speed: number;
  vehicles_served: number;
  completed_trips: number;
  jeepneys_processed: number;
  buses_processed: number;
  num_episodes: number;
  timestamp: string;
}

export interface LaneMetric {
  experiment_id: string;
  episode_number: number;
  intersection_id: string;
  lane_id: string;
  queue_length: number;
  throughput: number;
  occupancy: number;
  avg_waiting_time: number;
  cars_processed: number;
  jeepneys_processed: number;
  buses_processed: number;
  motorcycles_processed: number;
  timestamp: string;
}

export interface ObjectiveMetric {
  experiment_id: string;
  passenger_throughput_improvement_pct: number;
  waiting_time_reduction_pct: number;
  objective_1_achieved: boolean;
  jeepney_throughput_improvement_pct: number;
  overall_delay_increase_pct: number;
  pt_priority_constraint_met: boolean;
  objective_2_achieved: boolean;
  multi_agent_passenger_delay_reduction_pct: number;
  multi_agent_jeepney_travel_time_reduction_pct: number;
  objective_3_achieved: boolean;
  p_value: number;
  effect_size: number;
  confidence_interval_lower: number;
  confidence_interval_upper: number;
  calculated_at: string;
}

export interface ExperimentInfo {
  experiment_id: string;
  experiment_name: string;
  status: "running" | "completed" | "failed" | "paused";
  training_mode: "offline" | "online" | "hybrid";
  created_at: string;
  completed_at?: string;
  total_episodes: number;
  best_reward?: number;
  convergence_episode?: number;
  training_time_minutes?: number;
}
