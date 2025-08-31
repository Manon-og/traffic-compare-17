import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Download } from 'lucide-react';

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
  dataCount
}: TrafficFiltersProps) => {

  const handleRunToggle = (runId: string, checked: boolean) => {
    if (checked) {
      onRunsChange([...selectedRuns, runId]);
    } else {
      onRunsChange(selectedRuns.filter(id => id !== runId));
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Traffic Dashboard</CardTitle>
          <InfoTooltip content="Use these filters to focus on specific data subsets. Changes are applied immediately to all charts and tables." />
        </div>
        <p className="text-sm text-muted-foreground">
          Compare fixed-time vs RL traffic performance
        </p>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Run Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">
              Control Systems ({selectedRuns.length} selected)
            </Label>
            <InfoTooltip content="Select which traffic control systems to compare. Fixed-time uses pre-programmed signal timing, while RL uses adaptive algorithms." />
          </div>
          <div className="space-y-2">
            {availableRuns.map(runId => (
              <div key={runId} className="flex items-center space-x-2">
                <Checkbox
                  id={runId}
                  checked={selectedRuns.includes(runId)}
                  onCheckedChange={(checked) => handleRunToggle(runId, !!checked)}
                />
                <Label 
                  htmlFor={runId} 
                  className="text-sm font-normal cursor-pointer"
                >
                  {runId.includes('fixed_time') ? '🚦 Fixed Time' : '🤖 RL Algorithm'} ({runId})
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Intersection Selection */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Intersection</Label>
            <InfoTooltip content="Focus analysis on a specific intersection or view aggregated data from all intersections." />
          </div>
          <Select value={selectedIntersection} onValueChange={onIntersectionChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Intersections</SelectItem>
              {availableIntersections.map(intId => (
                <SelectItem key={intId} value={intId}>
                  {intId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cycle Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">
              Time Window: Cycles {cycleRange[0]} - {cycleRange[1]}
            </Label>
            <InfoTooltip content="Select the range of traffic cycles to analyze. Each cycle typically represents 60-120 seconds of traffic control." />
          </div>
          <Slider
            value={cycleRange}
            onValueChange={(value) => onCycleRangeChange(value as [number, number])}
            max={maxCycles}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="hide-incomplete"
              checked={hideIncomplete}
              onCheckedChange={onHideIncompleteChange}
            />
            <Label htmlFor="hide-incomplete" className="text-sm">
              Hide incomplete data
            </Label>
            <InfoTooltip content="Exclude rows with missing occupancy or vehicle count data from analysis." />
          </div>
        </div>

        {/* Export */}
        <div className="space-y-2">
          <Button 
            onClick={onDownloadCSV}
            variant="outline"
            size="sm"
            className="w-full justify-start"
            disabled={dataCount === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Filtered CSV
          </Button>
          <p className="text-xs text-muted-foreground">
            {dataCount} rows available
          </p>
        </div>
      </CardContent>
    </Card>
  );
};