// Raw data type definitions for LSTM training data
export interface RawLSTMData {
  experiment_name: string;
  config: {
    learning_rate: number;
    epsilon_decay: number;
    memory_size: number;
    batch_size: number;
    gamma: number;
    sequence_length: number;
    episodes: number;
    target_update_freq: number;
    save_freq: number;
    validation_freq: number;
    episode_duration: number;
    warmup_time: number;
    min_phase_time: number;
    max_phase_time: number;
    random_seed: number;
    validation_episodes: number;
    agent_type: string;
    offline_episodes: number;
    online_episodes: number;
  };
  training_time_minutes: number;
  best_reward: number;
  convergence_episode: number;
  training_results: RawTrainingResult[];
}

export interface RawTrainingResult {
  episode: number;
  scenario: string;
  reward: number;
  steps: number;
  time_minutes: number;
  avg_loss: number;
  epsilon: number;
  vehicles: number;
  completed_trips: number;
  passenger_throughput: number;
  memory_size: number;
}

// Raw validation data types
export interface RawValidationData {
  episode: number;
  scenario: string;
  fixed_time?: {
    passenger_throughput: number;
    avg_waiting_time: number;
    avg_queue_length: number;
    total_vehicles: number;
    vehicle_types?: Record<string, number>;
    intersections?: Record<string, unknown>;
  };
  d3qn?: {
    passenger_throughput: number;
    avg_waiting_time: number;
    avg_queue_length: number;
    total_vehicles: number;
    vehicle_types?: Record<string, number>;
    intersections?: Record<string, unknown>;
  };
}
