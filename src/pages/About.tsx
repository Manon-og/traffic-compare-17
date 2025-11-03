import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Lightbulb, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">About This Research</h1>
          <p className="text-muted-foreground">
            LSTM-Enhanced D3QN Multi-Agent Reinforcement Learning for Adaptive
            Traffic Signal Control in Davao City, Philippines
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This research develops and evaluates an LSTM-enhanced Double
                Deep Q-Network (D3QN) Multi-Agent Reinforcement Learning (MARL)
                system for adaptive traffic signal control in Davao City,
                Philippines. The system was rigorously tested across three
                critical intersections (Ecoland 4-way, John Paul II College
                5-way, Sandawa 3-way), demonstrating significant improvements in
                passenger throughput (+9.53%), waiting time reduction (-34.06%),
                and public transit prioritization through an intelligent Transit
                Signal Priority (TSP) mechanism.
              </p>
              {/* <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">D3QN Multi-Agent RL</Badge>
                <Badge variant="secondary">LSTM Temporal Context</Badge>
                <Badge variant="secondary">Passenger-Centric Rewards</Badge>
                <Badge variant="secondary">Transit Signal Priority</Badge>
                <Badge variant="secondary">CTDE Architecture</Badge>
                <Badge variant="secondary">Davao City Network</Badge>
              </div> */}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Dueling D3QN architecture with passenger-weighted reward
                    functions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    LSTM temporal encoder for traffic pattern recognition (Heavy
                    vs. Light days)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Intelligent TSP mechanism prioritizing buses (+16.5%) and
                    jeepneys (+23.7%)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    CTDE (Centralized Training, Decentralized Execution) for
                    multi-agent coordination
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Real-world calibrated SUMO simulation with manual video
                    annotation data
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Expected Outcomes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <strong>+9.53% passenger throughput</strong> (2,331.38 vs
                    2,128.44 baseline) - Nearly met 10% target
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <strong>-34.06% waiting time reduction</strong> (7.06s vs
                    10.72s baseline) - Exceeded 10% target
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <strong>TSP effectiveness validated:</strong> Buses +16.5%,
                    Jeepneys +23.7% (both exceeded 15% target)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <strong>Network-wide coordination:</strong> -34.06% delay
                    reduction across 3 intersections
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning">⚠</span>
                    <strong>LSTM accuracy:</strong> 56.7% mean (below 80%
                    target)
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Research Team & Methodology
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <p className="text-muted-foreground">
                This research employed a rigorous mixed-methods evaluation
                protocol using SUMO simulation calibrated with manual video
                annotation data from Davao City intersections. The D3QN-MARL
                system was evaluated deterministically (ε=0) across 66
                five-minute scenarios, with statistical validation confirming
                highly significant improvements (p &lt; 0.000001, Cohen's d =
                3.13) compared to the fixed-time baseline. Our methodology
                includes:
              </p> */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Data Collection</h4>
                  <p className="text-sm text-muted-foreground">
                    Manual video annotation from real Davao City traffic with
                    vehicle type classification (cars, buses, jeepneys,
                    motorcycles, trucks)
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Network Topology</h4>
                  <p className="text-sm text-muted-foreground">
                    OpenStreetMap-based SUMO simulation of 3 intersections with
                    realistic geometry and demand patterns
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Training Protocol</h4>
                  <p className="text-sm text-muted-foreground">
                    Hybrid offline-online training (75,000 transitions) with
                    anti-cheating constraints and passenger-weighted rewards
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2">
                  Study Location: Davao City, Philippines
                </h4>
                <p className="text-sm text-muted-foreground">
                  Three adjacent intersections along a critical corridor:{" "}
                  <strong>Ecoland 4-way</strong> (high-traffic commercial hub),
                  <strong>John Paul II College 5-way</strong> (complex
                  multi-approach intersection), and{" "}
                  <strong>Sandawa 3-way</strong>
                  (residential-commercial transition). Each intersection
                  features mixed traffic with significant public transport
                  presence (jeepneys, buses), making them ideal testbeds for
                  passenger-centric TSP optimization and multi-agent
                  coordination strategies.
                </p>
              </div>

              <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">📊</span>
                  Statistical Significance
                </h4>
                <p className="text-sm text-muted-foreground">
                  All primary and secondary results demonstrated high
                  statistical significance with non-overlapping 95% confidence
                  intervals. The agent's{" "}
                  <strong>
                    minimum performance exceeded the baseline's average
                  </strong>
                  , confirming system robustness across diverse traffic
                  scenarios. Results align with peer research benchmarks for
                  SUMO-based DRL traffic control systems.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
