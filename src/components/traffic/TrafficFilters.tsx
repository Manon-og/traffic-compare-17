import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrafficFiltersProps {
  availableRuns: string[];
  selectedRuns: string[];
  onRunsChange: (runs: string[]) => void;
  availableIntersections: string[];
  selectedIntersection: string;
  onIntersectionChange: (intersection: string) => void;
  cycleRange: [number, number];
  onCycleRangeChange: (range: [number, number]) => void;
  maxCycles: number;
  hideIncomplete: boolean;
  onHideIncompleteChange: (hide: boolean) => void;
  onDownloadCSV: () => void;
  dataCount: number;
}

export const TrafficFilters = ({
  availableRuns,
  selectedRuns,
  onRunsChange,
  availableIntersections,
  selectedIntersection,
  onIntersectionChange,
  cycleRange,
  onCycleRangeChange,
  maxCycles,
  hideIncomplete,
  onHideIncompleteChange,
  onDownloadCSV,
  dataCount,
}: TrafficFiltersProps) => {
  const handleRunToggle = (runId: string, checked: boolean) => {
    if (checked) {
      onRunsChange([...selectedRuns, runId]);
    } else {
      onRunsChange(selectedRuns.filter((id) => id !== runId));
    }
  };

  return (
    <Card className="w-full max-w-sm h-[780px] flex flex-col">
      <CardHeader className="flex-shrink-0 pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Traffic Dashboard</CardTitle>
          <InfoTooltip content="Use these filters to focus on specific data subsets. Changes are applied immediately to all charts and tables." />
        </div>
        <p className="text-sm text-muted-foreground">
          Compare fixed-time vs RL traffic performance
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-6 overflow-y-auto pb-6">
        {/* Run Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-sm font-medium">Control Systems</Label>
            <Badge variant="secondary" className="text-xs">
              {selectedRuns.length} selected
            </Badge>
          </div>
          <InfoTooltip content="Select which traffic control systems to compare. Fixed-time uses pre-programmed signal timing, while RL uses adaptive algorithms." />
          <div className="space-y-2">
            {availableRuns.map((runId) => (
              <div key={runId} className="flex items-center space-x-2">
                <Checkbox
                  id={runId}
                  checked={selectedRuns.includes(runId)}
                  onCheckedChange={(checked) =>
                    handleRunToggle(runId, !!checked)
                  }
                />
                <Label
                  htmlFor={runId}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {runId.includes("Fixed Time") ? "🚦 " : "🤖 "}
                  {runId}
                </Label>
              </div>
            ))}
          </div>
          {selectedRuns.length === 0 && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-xs text-yellow-800">
                ⚠️ Select at least one system to view data
              </p>
            </div>
          )}
        </div>

        {/* Intersection Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Intersection</Label>
            <InfoTooltip content="Focus analysis on a specific intersection or view aggregated data from all intersections." />
          </div>
          <Select
            value={selectedIntersection}
            onValueChange={onIntersectionChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🌐 All Intersections</SelectItem>
              {availableIntersections.map((intId) => (
                <SelectItem key={intId} value={intId}>
                  📍 {intId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cycle Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Time Window</Label>
            <InfoTooltip content="Select the range of traffic cycles to analyze. Each cycle typically represents 60-120 seconds of traffic control." />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Cycle {cycleRange[0]}</span>
              <span>Cycle {cycleRange[1]}</span>
            </div>
            <Slider
              value={cycleRange}
              onValueChange={(value) =>
                onCycleRangeChange(value as [number, number])
              }
              max={maxCycles}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground text-center">
              Analyzing {cycleRange[1] - cycleRange[0] + 1} cycle(s)
            </p>
          </div>
        </div>

        {/* Spacer to push export to bottom */}
        <div className="flex-1" />

        {/* Export Section - Pushed to bottom */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Export Data</Label>
            <Badge variant="outline" className="text-xs">
              {dataCount} rows
            </Badge>
          </div>
          <Button
            onClick={onDownloadCSV}
            variant="outline"
            size="default"
            className="w-full"
            disabled={dataCount === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Filtered CSV
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Downloads data matching current filters
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
