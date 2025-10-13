import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Lightbulb, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">About This Project</h1>
          <p className="text-muted-foreground">
            Understanding the purpose and methodology behind our traffic
            analysis system
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
                This traffic analysis dashboard compares the performance of
                traditional fixed-time traffic control systems with modern D3QN
                (Dueling Double Deep Q-Network) reinforcement learning
                algorithms. Our focus is on passenger-centric optimization,
                demonstrating how AI-driven traffic management can improve urban
                mobility, reduce passenger waiting times, and enhance public
                transport efficiency.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">D3QN Reinforcement Learning</Badge>
                <Badge variant="secondary">
                  Passenger-Centric Optimization
                </Badge>
                <Badge variant="secondary">Public Transport Priority</Badge>
                <Badge variant="secondary">Multi-Agent Systems</Badge>
                <Badge variant="secondary">Urban Mobility</Badge>
              </div>
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
                    Passenger throughput optimization with D3QN algorithms
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    D3QN Multi-Agent vs Fixed-Time system comparison
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Public vehicle-specific traffic signal prioritization (TSP)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Multi-agent coordination and performance tracking
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
                    ≥10% reduction in passenger waiting times vs fixed-time
                    control
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    Increased passenger throughput per cycle (190-230 vs
                    120-150)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    Enhanced public vehicle priority through intelligent TSP
                    activation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    Multi-agent coordination for network-wide optimization
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
              <p className="text-muted-foreground">
                This research focuses on developing a Double-Dueling DQN
                algorithm with passenger-centric reward functions, integrating
                YOLO-based vehicle classification for public vehicles, and
                demonstrating superior performance over traditional control
                systems. Our methodology includes:
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">SUMO Simulation</h4>
                  <p className="text-sm text-muted-foreground">
                    High-fidelity traffic simulation with passenger-focused
                    metrics
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">D3QN Development</h4>
                  <p className="text-sm text-muted-foreground">
                    Dueling Double DQN with passenger-centric reward functions
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">YOLO Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Public vehicle detection for intelligent signal
                    prioritization
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2">Research Locations</h4>
                <p className="text-sm text-muted-foreground">
                  Our study focuses on three key intersections in the urban
                  traffic network: Ecoland (high-traffic commercial area),
                  Sandawa (moderate residential-commercial), and John Paul
                  (lower-traffic residential area). Each location presents
                  unique traffic patterns and challenges for our D3QN algorithms
                  to optimize.
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
