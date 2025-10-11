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
            Learn how to use the D3QN traffic analysis dashboard and understand
            passenger-centric metrics
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
                    <Badge variant="outline">Primary Metric</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Shows passengers served per traffic cycle. Higher values
                    indicate better passenger-centric optimization. Multi-agent
                    D3QN typically achieves 190-230 passengers/cycle vs 120-150
                    for fixed-time control.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Jeepney Lane Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Displays jeepney throughput and TSP (Traffic Signal
                    Priority) activation rates for public transport
                    optimization.
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
                    <p className="font-medium">Control Systems</p>
                    <p className="text-sm text-muted-foreground">
                      Compare two control methods: "Fixed Time" (traditional
                      baseline) and "D3QN Multi Agent" (advanced reinforcement
                      learning with multi-intersection coordination).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Intersections</p>
                    <p className="text-sm text-muted-foreground">
                      Filter by specific intersection locations (Ecoland,
                      Sandawa, John Paul) or view all intersections together for
                      aggregate analysis.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Cycle Range</p>
                    <p className="text-sm text-muted-foreground">
                      Adjust the time period by selecting specific traffic
                      cycles. Each cycle represents one complete signal phase.
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
                    What is D3QN (Dueling Double Deep Q-Network)?
                  </AccordionTrigger>
                  <AccordionContent>
                    D3QN is an advanced reinforcement learning algorithm that
                    combines value function decomposition with double Q-learning
                    for stable traffic control. It uses passenger-centric reward
                    functions to optimize signal timing for maximum passenger
                    throughput and reduced waiting times, especially for public
                    transport.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How do I interpret passenger-centric KPIs?
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>Passenger Throughput:</strong> Higher is better
                        - more passengers served per cycle
                      </li>
                      <li>
                        <strong>Jeepney Throughput:</strong> Higher indicates
                        better public transport efficiency
                      </li>
                      <li>
                        <strong>TSP Activations:</strong> Shows frequency of
                        traffic signal priority for jeepneys
                      </li>
                      <li>
                        <strong>Coordination Score:</strong> Higher values
                        indicate better multi-agent cooperation
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    What is TSP (Traffic Signal Priority)?
                  </AccordionTrigger>
                  <AccordionContent>
                    TSP is a system that gives priority to specific vehicles
                    (like jeepneys) by extending green lights or shortening red
                    lights when they approach intersections. Our D3QN algorithm
                    uses YOLO-based jeepney detection to intelligently activate
                    TSP for optimal public transport flow.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    What's the difference between Single Agent and Multi Agent
                    D3QN?
                  </AccordionTrigger>
                  <AccordionContent>
                    Single Agent D3QN controls each intersection independently,
                    while Multi Agent D3QN enables coordination between multiple
                    intersections for network-wide optimization. Multi Agent
                    typically achieves better passenger throughput through
                    coordinated signal timing and enhanced traffic flow
                    management.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    How can I export training data for research?
                  </AccordionTrigger>
                  <AccordionContent>
                    Visit the Training Output section to access experiment data,
                    model checkpoints, and performance metrics. Use the export
                    functionality to download training episodes, reward curves,
                    and comparative analysis data for further research and
                    publication purposes.
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
