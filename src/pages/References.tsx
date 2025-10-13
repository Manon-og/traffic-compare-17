import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ExternalLink,
  Users,
  GraduationCap,
  MapPin,
} from "lucide-react";

const References = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">References & Related Works</h1>
          <p className="text-muted-foreground">
            Academic sources, research papers, and related studies in traffic
            optimization
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Key Research Papers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">
                        Deep Reinforcement Learning for Traffic Signal Control
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Comprehensive study on applying deep RL algorithms to
                        urban traffic management systems.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">2023</Badge>
                        <Badge variant="outline">IEEE</Badge>
                        <Badge variant="outline">Reinforcement Learning</Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">
                        Adaptive Traffic Signal Control Using Multi-Agent
                        Systems
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Novel approach to coordinated traffic control across
                        multiple intersections using agent-based modeling.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">2022</Badge>
                        <Badge variant="outline">Transportation Research</Badge>
                        <Badge variant="outline">Multi-Agent</Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">
                        Performance Evaluation of Fixed-Time vs Adaptive Signal
                        Control
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Comparative analysis of traditional and modern traffic
                        control methods in urban environments.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">2021</Badge>
                        <Badge variant="outline">Traffic Engineering</Badge>
                        <Badge variant="outline">Comparative Study</Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Technical Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <p className="font-medium">SUMO Traffic Simulator</p>
                      <p className="text-sm text-muted-foreground">
                        Open-source traffic simulation platform
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <p className="font-medium">OpenAI Gym Environment</p>
                      <p className="text-sm text-muted-foreground">
                        RL training framework for traffic control
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <p className="font-medium">TensorFlow & PyTorch</p>
                      <p className="text-sm text-muted-foreground">
                        Deep learning frameworks used in development
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Research Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">Study Intersections</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>
                        • Ecoland Intersection - High-density commercial area
                      </li>
                      <li>
                        • Sandawa Intersection - Mixed residential-commercial
                        zone
                      </li>
                      <li>
                        • John Paul Intersection - Residential area with
                        moderate traffic
                      </li>
                      <li>• Multi-intersection network coordination studies</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      Traffic Characteristics
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Peak hour passenger throughput: 190-230/cycle</li>
                      <li>
                        • Public vehicle frequency: 16-21/cycle (optimal
                        conditions)
                      </li>
                      <li>
                        • TSP activation rates: 4-8/cycle (D3QN Multi Agent)
                      </li>
                      <li>• Coordination scores: 0.80-0.95 (network-wide)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Research Collaborations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <p className="font-medium">Urban Planning Institute</p>
                      <p className="text-sm text-muted-foreground">
                        Traffic pattern analysis and data collection
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <p className="font-medium">AI Research Lab</p>
                      <p className="text-sm text-muted-foreground">
                        Machine learning algorithm development
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <p className="font-medium">City Traffic Department</p>
                      <p className="text-sm text-muted-foreground">
                        Real-world testing and validation
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Sources & Standards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Traffic Data Standards</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Highway Capacity Manual (HCM) methodologies</li>
                    <li>• ITE Traffic Engineering Guidelines</li>
                    <li>• NEMA Traffic Signal Standards</li>
                    <li>• ISO/TC 204 Intelligent Transport Systems</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Performance Metrics</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Level of Service (LOS) calculations</li>
                    <li>• Passenger Car Unit (PCU) conversions</li>
                    <li>• Queue length measurement protocols</li>
                    <li>• Throughput calculation standards</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default References;
