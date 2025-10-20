import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrainingProgressChart } from "@/components/training/TrainingProgressChart";
import { TrainingMetricsCards } from "@/components/training/TrainingMetricsCards";
import { BaselineComparisonChart } from "@/components/training/BaselineComparisonChart";
import { dummyTrainingDataset } from "@/data/training/dummyTrainingData";
import { Activity, TrendingUp, CheckCircle } from "lucide-react";
import { useState } from "react";

const Training = () => {
  const {
    experiment,
    episodes,
    validations,
    baseline,
    objectives,
    laneMetrics,
  } = dummyTrainingDataset;

  // Calculate average D3QN values from last 20 episodes
  const recentEpisodes = episodes.slice(-20);
  const avgPassengerThroughput =
    recentEpisodes.reduce((sum, ep) => sum + ep.passenger_throughput, 0) /
    recentEpisodes.length;
  const avgWaitingTime =
    recentEpisodes.reduce((sum, ep) => sum + ep.avg_waiting_time, 0) /
    recentEpisodes.length;

  // Keep reward metric
  const avgReward =
    recentEpisodes.reduce((sum, ep) => sum + ep.total_reward, 0) /
    recentEpisodes.length;

  // LSTM-specific metric
  const avgPredictionAccuracy =
    recentEpisodes.reduce((sum, ep) => sum + (ep.prediction_accuracy || 0), 0) /
    recentEpisodes.length;
  const avgJeepneys =
    recentEpisodes.reduce((sum, ep) => sum + ep.jeepneys_processed, 0) /
    recentEpisodes.length;

  const actualValues = {
    avgPassengerThroughput,
    avgWaitingTime,
    avgReward,
    avgPredictionAccuracy,
  };

  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">D3QN Training Dashboard</h1>
            <Badge
              variant="outline"
              className="bg-success/10 text-success border-success/20"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {experiment.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Training metrics for {experiment.experiment_name}
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
                <p className="text-sm text-muted-foreground">Total Episodes</p>
                <p className="text-2xl font-bold">
                  {experiment.total_episodes}
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
                  Convergence Episode
                </p>
                <p className="text-2xl font-bold text-primary">
                  {experiment.convergence_episode}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Training Time</p>
                <p className="text-2xl font-bold">
                  {((experiment.training_time_minutes || 0) / 60).toFixed(1)}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics KPIs */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Key Performance Metrics (Last 20 Episodes)
          </h2>
          <TrainingMetricsCards
            actualValues={actualValues}
            selectedMetric={selectedMetric}
            onMetricSelect={setSelectedMetric}
          />
        </div>

        {/* Training Progress Charts */}
        <Tabs defaultValue="passenger" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="passenger">
              Average Passenger Throughput
            </TabsTrigger>
            <TabsTrigger value="waiting">Average Waiting Time</TabsTrigger>
            <TabsTrigger value="reward">Average Reward</TabsTrigger>
            <TabsTrigger value="accuracy">Prediction Accuracy</TabsTrigger>
          </TabsList>

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
              episodes={episodes}
              metric="prediction_accuracy"
              title="LSTM Prediction Accuracy Over Training"
            />
          </TabsContent>
        </Tabs>

        {/* Baseline Comparisons */}
        {/* <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Baseline Comparison: D3QN vs Fixed Time
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <BaselineComparisonChart
              baselines={baseline}
              d3qnValue={avgPassengerThroughput}
              metric="avg_passenger_throughput"
              title="Passenger Throughput Comparison"
            />
            <BaselineComparisonChart
              baselines={baseline}
              d3qnValue={avgWaitingTime}
              metric="avg_waiting_time"
              title="Waiting Time Comparison"
            />
          </div>
          <BaselineComparisonChart
            baselines={baseline}
            d3qnValue={avgJeepneys}
            metric="jeepneys_processed"
            title="Public Vehicle Throughput Comparison"
          />
        </div> */}

        {/* Statistical Significance */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Statistical Validation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">P-Value</p>
                <p className="text-2xl font-bold">
                  {objectives.p_value.toFixed(4)}
                  {objectives.p_value < 0.05 && (
                    <Badge
                      variant="outline"
                      className="ml-2 bg-success/10 text-success"
                    >
                      Significant
                    </Badge>
                  )}
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Effect Size (Cohen's d)
                </p>
                <p className="text-2xl font-bold">
                  {objectives.effect_size.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  95% Confidence Interval
                </p>
                <p className="text-lg font-bold">
                  [{objectives.confidence_interval_lower.toFixed(1)},{" "}
                  {objectives.confidence_interval_upper.toFixed(1)}]
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default Training;
