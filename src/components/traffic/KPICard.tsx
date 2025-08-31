import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  tooltip?: string;
  className?: string;
}

export const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  delta, 
  deltaType = 'neutral',
  icon,
  tooltip,
  className 
}: KPICardProps) => {
  const getDeltaColor = () => {
    switch (deltaType) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className={cn("relative overflow-hidden shadow-sm hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {tooltip && <InfoTooltip content={tooltip} />}
        </div>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {typeof value === 'number' ? value.toFixed(1) : value}
        </div>
        <div className="flex items-center justify-between mt-2">
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
          {delta && (
            <Badge 
              variant="secondary" 
              className={cn("text-xs font-medium", getDeltaColor())}
            >
              {delta}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};