import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, BarChart3, Settings, Download } from "lucide-react";

const Help = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Help & Documentation</h1>
          <p className="text-muted-foreground">
            Guide to understanding the LSTM-Enhanced D3QN MARL system results
            and passenger-centric performance metrics
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Understanding the Charts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    Passenger Throughput Chart
                    <Badge variant="outline">Primary Objective</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Shows total passengers served per 5-minute episode across
                    all vehicle types. The D3QN-MARL agent achieved a mean of
                    2,331.38 passengers/episode (+9.53%) compared to the
                    fixed-time baseline of 2,128.44 passengers/episode. This
                    represents approximately 202 additional passengers served
                    per episode.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">
                    Waiting Time & Queue Management
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Displays mean passenger waiting time (reduced by 34.06% from
                    10.72s to 7.06s) and average queue length (reduced by 6.42%
                    from 94.84 to 88.75 vehicles). Lower values indicate better
                    adaptive signal timing and efficient queue clearance.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    Transit Signal Priority (TSP)
                    <Badge variant="outline">Objective 2</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Vehicle-type breakdown showing TSP effectiveness. Buses
                    improved +16.5% (24.08 → 28.05) and Jeepneys +23.7% (59.76 →
                    73.97), both exceeding the 15% target. This prioritization
                    was achieved by reallocating green time from lower-occupancy
                    vehicles (trucks -5.1%, motorcycles -0.8%).
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">LSTM Temporal Context</h4>
                  <p className="text-sm text-muted-foreground">
                    Auxiliary task classifying traffic patterns (Heavy vs. Light
                    days). Achieved 56.7% mean accuracy with high recall (97.1%)
                    for Heavy days, ensuring peak-demand periods are rarely
                    missed. While below the 80% target, it provided functional
                    temporal awareness for adaptive timing decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Using Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Control Systems Comparison</p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Fixed Time:</strong> Traditional baseline using
                      pre-programmed signal timing from the corridor's existing
                      plan.
                      <strong>D3QN Multi-Agent:</strong> LSTM-enhanced Dueling
                      Double Deep Q-Network with CTDE architecture,
                      passenger-centric rewards, and adaptive phase timing
                      (12-120 seconds) based on real-time state and temporal
                      context.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Intersection Selection</p>
                    <p className="text-sm text-muted-foreground">
                      Filter by specific Davao City intersections:{" "}
                      <strong>Ecoland 4-way</strong> (commercial hub),
                      <strong>John Paul II College 5-way</strong> (complex
                      multi-approach), <strong>Sandawa 3-way</strong>{" "}
                      (residential-commercial). Select "All" to view aggregate
                      performance across the three-intersection network for
                      multi-agent coordination analysis.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Episode/Scenario Range</p>
                    <p className="text-sm text-muted-foreground">
                      View specific validation scenarios from the 66 five-minute
                      episodes evaluated. Each episode represents a complete
                      traffic scenario with deterministic agent execution (ε=0)
                      to ensure reproducible results. Training episodes (300)
                      show the learning progression during offline and online
                      training phases.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    What is D3QN (Dueling Double Deep Q-Network) and how does it
                    work?
                  </AccordionTrigger>
                  <AccordionContent>
                    D3QN combines three advanced deep reinforcement learning
                    techniques: (1) <strong>Double Q-learning</strong> to reduce
                    overestimation bias, (2){" "}
                    <strong>Dueling architecture</strong> that separately
                    estimates state value and action advantages for better value
                    estimation, and (3) <strong>Deep Q-Networks</strong> for
                    function approximation. In our system, each intersection
                    agent observes traffic state (queue lengths, waiting times,
                    vehicle types) and selects phase durations (12-120 seconds)
                    to maximize a passenger-weighted reward function that
                    prioritizes throughput, waiting time reduction, and TSP
                    activation for public vehicles (buses, jeepneys).
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How do I interpret the performance metrics and KPIs?
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>Passenger Throughput (Primary):</strong> Total
                        passengers served per 5-min episode. D3QN achieved
                        2,331.38 avg (+9.53%) vs baseline 2,128.44. Higher =
                        better. Target was ≥10%.
                      </li>
                      <li>
                        <strong>Waiting Time:</strong> Mean passenger waiting
                        time in seconds. D3QN achieved 7.06s (-34.06%) vs
                        baseline 10.72s. Lower = better. Exceeded -10% target
                        significantly.
                      </li>
                      <li>
                        <strong>Vehicle Throughput by Type:</strong> Buses
                        (+16.5%), Jeepneys (+23.7%), Cars (+23.7%), Motorcycles
                        (-0.8%), Trucks (-5.1%). TSP reallocates time to
                        high-occupancy vehicles.
                      </li>
                      <li>
                        <strong>Queue Length:</strong> Average vehicles waiting.
                        D3QN achieved 88.75 (-6.42%) vs baseline 94.84. Modest
                        reduction reflects corridor capacity constraints.
                      </li>
                      <li>
                        <strong>LSTM Accuracy:</strong> Temporal pattern
                        classification (Heavy vs. Light day). Mean 56.7%, but
                        97.1% recall for Heavy days ensures peak periods are
                        identified.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    What is TSP (Transit Signal Priority) and how was it
                    validated?
                  </AccordionTrigger>
                  <AccordionContent>
                    TSP is a mechanism that prioritizes high-occupancy public
                    transport vehicles (buses, jeepneys) by strategically
                    reallocating green time from lower-occupancy vehicles. Our
                    system implements TSP through: (1){" "}
                    <strong>6-second override logic</strong> in the agent's
                    action space when public vehicles are detected, (2){" "}
                    <strong>Passenger-weighted reward function</strong> that
                    values each passenger equally regardless of vehicle type,
                    incentivizing the agent to serve more passengers per cycle,
                    and (3) <strong>Vehicle type classification</strong> in the
                    state representation.
                    <br />
                    <br />
                    <strong>Validation Results (Objective 2):</strong> Bus
                    throughput +16.5% (24.08 → 28.05), Jeepney throughput +23.7%
                    (59.76 → 73.97), both exceeding the 15% target. Combined PT
                    passenger throughput improved +20.6%. This was achieved
                    while maintaining overall system efficiency, with car
                    throughput actually increasing (+23.7%) due to better
                    coordination.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    What's the difference between Fixed-Time and D3QN
                    Multi-Agent control?
                  </AccordionTrigger>
                  <AccordionContent>
                    <strong>Fixed-Time Baseline:</strong> Uses the corridor's
                    existing pre-programmed signal timing plan with fixed phase
                    durations that do not adapt to real-time traffic conditions.
                    Serves as the control group representing current practice.
                    <br />
                    <br />
                    <strong>D3QN Multi-Agent (LSTM-Enhanced):</strong> Each
                    intersection has an autonomous agent that: (1) Observes
                    real-time state (queue lengths, waiting times, vehicle types
                    per lane), (2) Receives temporal context from LSTM encoder
                    (Heavy vs. Light day prediction), (3) Selects adaptive phase
                    durations (12-120s) to maximize passenger-weighted rewards,
                    and (4) Learns coordinated policies through CTDE
                    (Centralized Training, Decentralized Execution) with shared
                    experience replay buffer.
                    <br />
                    <br />
                    <strong>Key Advantages:</strong> Dynamic adaptation (+9.53%
                    passengers, -34.06% waiting time), TSP prioritization (buses
                    +16.5%, jeepneys +23.7%), implicit multi-intersection
                    coordination (-34.06% network delay), and statistical
                    robustness (agent's minimum &gt; baseline's average).
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    What are the limitations and real-world deployment
                    considerations?
                  </AccordionTrigger>
                  <AccordionContent>
                    <strong>Simulation-to-Reality Gap:</strong> Results are from
                    calibrated SUMO simulation. Real-world deployment may retain
                    only 40-60% of improvements due to sensor noise, driver
                    variability, incidents, and weather. Realistic expectation:
                    4-6% passenger throughput gain, 15-20% waiting time
                    reduction.
                    <br />
                    <br />
                    <strong>Network Scale:</strong> Validated on 3 adjacent
                    intersections. Scaling to 10+ intersections requires
                    additional testing and may need architecture modifications.
                    <br />
                    <br />
                    <strong>Data Requirements:</strong> Manual video annotation
                    (2-5% error rate) limits scalability. Field deployment
                    should integrate AVL (Automatic Vehicle Location) and APC
                    (Automatic Passenger Counting) data from public transport
                    operators.
                    <br />
                    <br />
                    <strong>LSTM Performance:</strong> 56.7% accuracy suggests
                    simpler temporal features (day-of-week, hour-of-day) might
                    provide most benefits with fewer failure modes.
                    <br />
                    <br />
                    <strong>Hyperparameter Sensitivity:</strong> 5-10%
                    performance swings with reward weight changes. New corridors
                    require local retuning and retraining.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>
                    How do the results compare to peer research benchmarks?
                  </AccordionTrigger>
                  <AccordionContent>
                    Our results align well with established SUMO-based DRL
                    traffic control research:
                    <br />
                    <br />
                    <strong>Passenger Throughput (+9.53%):</strong> Matches the
                    10-15% range for passenger-centric controllers (Olusanya,
                    2025; Rasheed, 2020).
                    <br />
                    <br />
                    <strong>
                      Public Transit Throughput (+76.6% combined):
                    </strong>{" "}
                    Within 50-100% band for TSP-enabled systems (Olusanya,
                    2025), confirming effective prioritization.
                    <br />
                    <br />
                    <strong>Waiting Time Reduction (-34.06%):</strong> Fits
                    20-40% range for multi-agent DRL on realistic networks
                    (Rasheed, 2020; Tan, 2022; Mahato, 2025). Larger reductions
                    in other papers typically result from weaker baselines.
                    <br />
                    <br />
                    <strong>Statistical Significance:</strong> Highly
                    significant results (p &lt; 0.000001, Cohen's d = 3.13) with
                    non-overlapping 95% CIs confirm robustness beyond typical
                    simulation variance.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;
