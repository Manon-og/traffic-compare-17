import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Users, Lightbulb, TrendingUp } from "lucide-react"

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">About This Project</h1>
          <p className="text-muted-foreground">Understanding the purpose and methodology behind our traffic analysis system</p>
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
                This traffic analysis dashboard compares the performance of traditional fixed-time traffic control systems 
                with modern reinforcement learning (RL) algorithms. Our goal is to demonstrate how AI-driven traffic 
                management can improve urban mobility and reduce congestion.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Traffic Optimization</Badge>
                <Badge variant="secondary">Reinforcement Learning</Badge>
                <Badge variant="secondary">Urban Mobility</Badge>
                <Badge variant="secondary">Data Analysis</Badge>
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
                    Real-time performance comparison between control systems
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Interactive data visualization and filtering
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Comprehensive KPI tracking and analysis
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Export capabilities for further research
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
                    Reduced average queue lengths at intersections
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    Improved traffic throughput and flow efficiency
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    Better adaptation to varying traffic patterns
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    Data-driven insights for traffic management
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
                This project combines expertise in traffic engineering, machine learning, and urban planning to 
                develop and evaluate next-generation traffic control systems. Our methodology includes:
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Data Collection</h4>
                  <p className="text-sm text-muted-foreground">
                    Real-world traffic measurements from urban intersections
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Algorithm Development</h4>
                  <p className="text-sm text-muted-foreground">
                    Advanced RL models trained on traffic optimization
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Performance Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive comparison with traditional systems
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default About