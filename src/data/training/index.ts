import { dummyTrainingDataset } from "./dummyTrainingData";
import {
  dashboardDataset,
  trainingDataset as realTrainingData,
} from "../realData";

// Toggle real vs dummy data
export const USE_REAL_DATA = true;

// For Dashboard (Index.tsx) - Uses validation data
export const dashboardData = USE_REAL_DATA
  ? dashboardDataset
  : dummyTrainingDataset;

// For Training Page (Training.tsx) - Uses training progress data
export const trainingData = USE_REAL_DATA
  ? realTrainingData
  : dummyTrainingDataset;

// Legacy export (for backward compatibility)
export const trainingDataset = dashboardData;

// Export types
export * from "./trainingData";
