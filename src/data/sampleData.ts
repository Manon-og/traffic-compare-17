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

export const generateSampleData = (): TrafficData[] => {
  const data: TrafficData[] = [];
  const runs = ['fixed_time_01', 'rl_01'];
  const intersections = ['Int1', 'Int2', 'Int3'];
  const lanes = ['Lane_N', 'Lane_S', 'Lane_E', 'Lane_W'];
  
  let timestep = 0;
  
  runs.forEach(runId => {
    intersections.forEach(intId => {
      for (let cycle = 1; cycle <= 30; cycle++) {
        const baseTime = new Date(2024, 0, 1, 8, 0, 0);
        baseTime.setSeconds(baseTime.getSeconds() + cycle * 90); // 90 second cycles
        
        lanes.forEach((laneId, laneIndex) => {
          // Fixed time tends to have higher queues, lower efficiency
          const isFixedTime = runId.includes('fixed_time');
          const baseQueue = isFixedTime ? 8 + Math.random() * 6 : 5 + Math.random() * 4;
          const baseThroughput = isFixedTime ? 180 + Math.random() * 30 : 200 + Math.random() * 40;
          const baseOccupancy = isFixedTime ? 0.6 + Math.random() * 0.3 : 0.4 + Math.random() * 0.25;
          
          // Add some variation by intersection
          const intMultiplier = intId === 'Int1' ? 1.2 : intId === 'Int2' ? 1.0 : 0.8;
          
          data.push({
            run_id: runId,
            intersection_id: intId,
            cycle_id: cycle,
            start_time: baseTime.toTimeString().split(' ')[0],
            lane_id: laneId,
            total_count: Math.round((15 + Math.random() * 10) * intMultiplier),
            total_pcu: Math.round((12 + Math.random() * 8) * intMultiplier * 10) / 10,
            occupancy: Math.min(0.95, Math.max(0.1, baseOccupancy * intMultiplier)),
            total_queue: Math.round(baseQueue * intMultiplier),
            throughput_pcu: Math.round(baseThroughput * intMultiplier),
            reward: isFixedTime ? undefined : Math.round((0.7 + Math.random() * 0.6) * 100) / 100,
            phase_index: laneIndex + 1,
            timestamp_step: timestep++
          });
        });
      }
    });
  });
  
  return data;
};

export const sampleData = generateSampleData();