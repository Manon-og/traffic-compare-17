import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, BarChart3, Settings, Download } from "lucide-react"

const Help = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Help & Documentation</h1>
          <p className="text-muted-foreground">Learn how to use the dashboard and understand the traffic data</p>
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
                    Queue Length Chart
                    <Badge variant="outline">Primary Metric</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Shows the number of vehicles waiting at red lights over time. Lower values indicate better traffic flow.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Lane Breakdown</h4>
                  <p className="text-sm text-muted-foreground">
                    Displays performance metrics for individual lanes at selected cycles for detailed analysis.
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
                      Select one or more control systems to compare. Choose "Fixed Time" for traditional systems or "RL" for reinforcement learning.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Intersections</p>
                    <p className="text-sm text-muted-foreground">
                      Filter by specific intersection IDs or view all intersections together for aggregate analysis.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Cycle Range</p>
                    <p className="text-sm text-muted-foreground">
                      Adjust the time period by selecting specific traffic cycles. Each cycle represents one complete signal phase.
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
                  <AccordionTrigger>What is reinforcement learning in traffic control?</AccordionTrigger>
                  <AccordionContent>
                    Reinforcement learning (RL) is an AI technique that learns optimal traffic signal timing by trial and error. 
                    The algorithm observes traffic conditions and adjusts signal phases to minimize congestion and improve flow, 
                    adapting to changing traffic patterns in real-time.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I interpret KPI values?</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Queue Length:</strong> Lower is better - fewer vehicles waiting at lights</li>
                      <li><strong>Throughput:</strong> Higher is better - more vehicles processed per hour</li>
                      <li><strong>Occupancy:</strong> 0.3-0.7 is optimal - indicates efficient lane utilization</li>
                      <li><strong>RL Reward:</strong> Higher is better - shows algorithm performance</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What does PCU mean?</AccordionTrigger>
                  <AccordionContent>
                    PCU stands for Passenger Car Unit, a standard measure that converts different vehicle types 
                    (cars, trucks, buses) into equivalent passenger cars for consistent traffic analysis. 
                    For example, a truck might count as 2.5 PCUs.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Why do some cycles show incomplete data?</AccordionTrigger>
                  <AccordionContent>
                    Incomplete data can occur due to sensor malfunctions, communication issues, or system maintenance. 
                    Use the "Hide Incomplete" filter to exclude these data points from your analysis for more accurate results.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>How can I export data for my own analysis?</AccordionTrigger>
                  <AccordionContent>
                    Click the "Export CSV" button in the filters panel to download the currently filtered dataset. 
                    You can also visit the Reports page for additional export options including PDF summaries and Excel formats.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Help