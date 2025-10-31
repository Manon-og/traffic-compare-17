import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TrainingProgressChart } from "@/components/training/TrainingProgressChart";
import { TrainingMetricsCards } from "@/components/training/TrainingMetricsCards";
import { BaselineComparisonChart } from "@/components/training/BaselineComparisonChart";
import { trainingDataset } from "@/data/realData";
import { lstmData } from "@/data/realData/lstm";
import { TrainingEpisode } from "@/data/training/trainingData";
import { Activity, TrendingUp, CheckCircle } from "lucide-react";
import { useState } from "react";

const Training = () => {
  // Use processed training data
  const episodes = trainingDataset.episodes;
  const experiment = {
    experiment_name: trainingDataset.experiment.experiment_name,
    status: trainingDataset.experiment.status,
    best_reward: trainingDataset.experiment.best_reward,
  };
  // Calculate averages from ALL episodes
  const avgPassengerThroughput =
    episodes.reduce((sum, ep) => sum + (ep.passenger_throughput || 0), 0) /
    episodes.length;
  const avgWaitingTime =
    episodes.reduce((sum, ep) => sum + (ep.avg_waiting_time || 0), 0) /
    episodes.length;
  const avgReward =
    episodes.reduce((sum, ep) => sum + (ep.total_reward || 0), 0) /
    episodes.length;
  const avgJeepneys =
    episodes.reduce((sum, ep) => sum + (ep.jeepneys_processed || 0), 0) /
    episodes.length;

  // Calculate average LSTM prediction accuracy from lstmData
  const avgPredictionAccuracy =
    lstmData.reduce((sum, ep) => sum + (ep.accuracy || 0), 0) / lstmData.length;

  const actualValues = {
    avgPassengerThroughput,
    avgWaitingTime,
    avgReward,
    avgPredictionAccuracy: avgPredictionAccuracy * 100,
  };

  // Default to passenger throughput
  const [selectedMetric, setSelectedMetric] = useState<string>(
    "passenger_throughput"
  );

  const metricTabMap: Record<string, string> = {
    passenger_throughput: "passenger",
    avg_waiting_time: "waiting",
    total_reward: "reward",
    prediction_accuracy: "accuracy",
  };
  const tabMetricMap: Record<string, string> = {
    passenger: "passenger_throughput",
    waiting: "avg_waiting_time",
    reward: "total_reward",
    accuracy: "prediction_accuracy",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              D3QN + LSTM Training Dashboard
            </h1>
            <Badge
              variant="outline"
              className="bg-success/10 text-success border-success/20"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {experiment.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Training metrics for {experiment.experiment_name} with LSTM traffic
            prediction
          </p>
        </div>

        {/* Experiment Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Experiment Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">D3QN Episodes</p>
                <p className="text-2xl font-bold">{episodes.length + 50}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">LSTM Episodes</p>
                <p className="text-2xl font-bold text-primary">
                  {lstmData.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Best Reward</p>
                <p className="text-2xl font-bold text-success">
                  {experiment.best_reward?.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg LSTM Accuracy
                </p>
                <p className="text-2xl font-bold">
                  {(avgPredictionAccuracy * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics KPIs */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Key Performance Metrics
          </h2>
          <TrainingMetricsCards
            actualValues={actualValues}
            selectedMetric={selectedMetric}
            onMetricSelect={setSelectedMetric}
          />
        </div>

        {/* Training Progress Charts */}
        <Tabs
          value={metricTabMap[selectedMetric] || "passenger"}
          onValueChange={(tab) =>
            setSelectedMetric(tabMetricMap[tab] || "passenger_throughput")
          }
          className="space-y-4"
        >
          <TabsContent value="passenger" className="space-y-4">
            <TrainingProgressChart
              episodes={episodes}
              metric="passenger_throughput"
              title="Passenger Throughput Over Training"
            />
          </TabsContent>

          <TabsContent value="waiting" className="space-y-4">
            <TrainingProgressChart
              episodes={episodes}
              metric="avg_waiting_time"
              title="Average Waiting Time Over Training"
            />
          </TabsContent>

          <TabsContent value="reward" className="space-y-4">
            <TrainingProgressChart
              episodes={episodes}
              metric="total_reward"
              title="Total Reward Over Training"
            />
          </TabsContent>

          <TabsContent value="accuracy" className="space-y-4">
            <TrainingProgressChart
              episodes={lstmData.map(
                (ep): TrainingEpisode => ({
                  experiment_id: "lstm_training",
                  episode_number: ep.episode,
                  phase_type: "online" as const,
                  scenario_name: `LSTM Episode ${ep.episode}`,
                  scenario_day: `Day ${Math.floor(ep.episode / 10)}`,
                  scenario_cycle: ep.episode,
                  prediction_accuracy: ep.accuracy * 100,
                  total_reward: 0,
                  avg_loss: 0,
                  epsilon_value: 0,
                  steps_completed: 300,
                  episode_duration_seconds: 300,
                  vehicles_served: 0,
                  completed_trips: 0,
                  passenger_throughput: 0,
                  avg_waiting_time: 0,
                  avg_queue_length: 0,
                  avg_speed: 0,
                  jeepneys_processed: 0,
                  buses_processed: 0,
                  pt_passenger_throughput: 0,
                  memory_size: 0,
                  timestamp: ep.timestamp,
                })
              )}
              metric="prediction_accuracy"
              title={`LSTM Prediction Accuracy Over All ${lstmData.length} Episodes`}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Training;
