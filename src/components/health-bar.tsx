import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type HealthBarProps = {
  health: number;
  className?: string;
};

// This component is not used, but kept for reference.
function OriginalHealthBar({ health, className }: HealthBarProps) {
  let colorClass = "bg-green-500";
  if (health < 50) colorClass = "bg-yellow-500";
  if (health < 25) colorClass = "bg-red-500";

  return (
    <Progress value={health} className={cn("h-3", className)} indicatorClassName={colorClass} />
  );
}

const SimpleHealthBar = ({ health, className }: HealthBarProps) => {
    let colorClass = "bg-green-500";
    if (health < 50) colorClass = "bg-yellow-500";
    if (health < 25) colorClass = "bg-red-500";

    return (
        <div className={cn("h-3 w-full overflow-hidden rounded-full bg-secondary", className)}>
            <div 
                className={cn("h-full transition-all", colorClass)}
                style={{ width: `${health}%`}}
            />
        </div>
    );
};

export { SimpleHealthBar as HealthBar };
