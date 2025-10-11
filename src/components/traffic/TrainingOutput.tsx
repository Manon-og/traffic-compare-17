import { useState } from "react";
import { D3QNTrafficData, d3qnSampleData } from "@/data/d3qnData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Activity, Eye, EyeOff } from "lucide-react";

interface TrainingOutputProps {
  className?: string;
}

// Header Component
const Header = ({ className }: { className?: string }) => {
  return (
    <div className={`text-center space-y-4 py-8 ${className}`}>
      <div className="flex justify-center">
        <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
            D3QN Neural Traffic Control
          </p>
        </div>
      </div>
      <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-100 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
        Deep Q-Network Traffic Analysis
      </h1>
      {/* <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
        Performance monitoring for intelligent traffic signal control systems.
        Advanced reinforcement learning agents optimizing urban intersection
        traffic flow with integrated public transport prioritization and
        adaptive signal timing.
      </p> */}
      <div className="flex justify-center gap-6 text-sm text-muted-foreground mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
          <span>D3QN Active Learning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <span>Fixed-Time Baseline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning"></div>
          <span>Enhanced PT Priority</span>
        </div>
      </div>
    </div>
  );
};

// Active Experiments Component
const ActiveExperiments = ({ className }: { className?: string }) => {
  const [showD3QNData, setShowD3QNData] = useState(false);

  return (
    <Card
      className={`bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 ${className}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <CardTitle className="text-primary">Active Experiments</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowD3QNData(!showD3QNData)}
          >
            {showD3QNData ? (
              <EyeOff className="w-4 h-4 mr-2" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            {showD3QNData ? "Hide" : "Show"} Details
          </Button>
        </div>
      </CardHeader>
      {showD3QNData && (
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {d3qnSampleData.slice(0, 3).map((exp, index) => (
              <div
                key={exp.experiment_id}
                className="p-4 bg-background/60 rounded-lg border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      exp.experiment_status === "completed"
                        ? "bg-success"
                        : exp.experiment_status === "running"
                        ? "bg-primary animate-pulse"
                        : "bg-muted"
                    }`}
                  ></div>
                  <span className="font-medium text-sm">
                    {exp.experiment_name.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Episode: {exp.episode_number}</p>
                  <p>Reward: {exp.total_reward.toFixed(1)}</p>
                  <p>Epsilon: {exp.epsilon_value.toFixed(3)}</p>
                  <p>
                    PT Efficiency:{" "}
                    {(exp.pt_service_efficiency * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

// Data Analysis Component
const DataAnalysis = ({ className }: { className?: string }) => {
  const [showDetailedTable, setShowDetailedTable] = useState(false);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Training Data Analysis</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetailedTable(!showDetailedTable)}
          >
            {showDetailedTable ? (
              <EyeOff className="w-4 h-4 mr-2" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            {showDetailedTable ? "Hide" : "Show"} Details
          </Button>
        </div>
      </CardHeader>
      {showDetailedTable && (
        <CardContent>
          <div className="mb-4 p-3 bg-muted/30 rounded-md">
            <p className="text-sm text-muted-foreground">
              🧠 <strong>D3QN Training Progress:</strong> Each row represents
              one training episode's performance. Watch reward values increase
              as the neural network learns optimal traffic control strategies.
            </p>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="p-2 text-left">Experiment</th>
                  <th className="p-2 text-left">Episode</th>
                  <th className="p-2 text-left">Intersection</th>
                  <th className="p-2 text-left">Total Reward</th>
                  <th className="p-2 text-left">Avg Queue</th>
                  <th className="p-2 text-left">Wait Time</th>
                  <th className="p-2 text-left">Throughput</th>
                  <th className="p-2 text-left">Speed</th>
                  <th className="p-2 text-left">PT Efficiency</th>
                  {/* <th className="p-2 text-left">Epsilon</th>
                  <th className="p-2 text-left">Memory</th> */}
                </tr>
              </thead>
              <tbody>
                {d3qnSampleData.slice(0, 100).map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/20">
                    <td className="p-2">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          row.experiment_name.includes("D3QN")
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : row.experiment_name.includes("Fixed")
                            ? "bg-success/20 text-success border border-success/30"
                            : "bg-warning/20 text-warning border border-warning/30"
                        }`}
                      >
                        {row.experiment_name.includes("D3QN")
                          ? "🧠 D3QN"
                          : row.experiment_name.includes("Fixed")
                          ? "🚦 Fixed"
                          : "⚡ Enhanced"}
                      </span>
                    </td>
                    <td className="p-2 font-mono">{row.episode_number}</td>
                    <td className="p-2 font-mono text-xs">
                      {row.intersection_id}
                    </td>
                    <td className="p-2 font-bold">
                      <span
                        className={
                          row.total_reward > 0
                            ? "text-success"
                            : "text-destructive"
                        }
                      >
                        {row.total_reward.toFixed(1)}
                      </span>
                    </td>
                    <td className="p-2">{row.avg_queue_length.toFixed(1)}</td>
                    <td className="p-2">{row.avg_waiting_time.toFixed(1)}s</td>
                    <td className="p-2">
                      {row.passenger_throughput.toFixed(0)}
                    </td>
                    <td className="p-2">{row.avg_speed.toFixed(1)} km/h</td>
                    <td className="p-2">
                      {(row.pt_service_efficiency * 100).toFixed(1)}%
                    </td>
                    {/* <td className="p-2 font-mono text-xs">
                      {row.epsilon_value.toFixed(3)}
                    </td>
                    <td className="p-2 text-xs">
                      {(row.memory_size / 1000).toFixed(1)}k
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            {d3qnSampleData.length > 100 && (
              <p className="text-xs text-muted-foreground mt-2">
                Showing first 100 episodes of {d3qnSampleData.length} total
                training episodes.
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

// Reward Components Component
const RewardComponents = ({ className }: { className?: string }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Reward Components Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {Object.entries(d3qnSampleData[0]?.reward_components || {}).map(
            ([key, value]) => (
              <div key={key} className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {key.replace(/_/g, " ")}
                </p>
                <p
                  className={`text-lg font-bold ${
                    typeof value === "number" && value > 0
                      ? "text-success"
                      : "text-destructive"
                  }`}
                >
                  {typeof value === "number" ? value.toFixed(1) : "N/A"}
                </p>
              </div>
            )
          )}
        </div>
        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground">
            <strong>Reward Composition:</strong> The D3QN agent optimizes
            multiple objectives simultaneously - minimizing waiting times and
            queue lengths while maximizing throughput, speed, and public
            transport efficiency.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Main TrainingOutput Component
function TrainingOutput({ className }: TrainingOutputProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <Header />
      <ActiveExperiments />
      <DataAnalysis />
      <RewardComponents />
    </div>
  );
}

// Attach sub-components to main component
TrainingOutput.Header = Header;
TrainingOutput.ActiveExperiments = ActiveExperiments;
TrainingOutput.DataAnalysis = DataAnalysis;
TrainingOutput.RewardComponents = RewardComponents;

export { TrainingOutput };
