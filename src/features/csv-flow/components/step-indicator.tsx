import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  number: number;
  text: string;
  description?: string;
  active: boolean;
};

function StepIndicator(props: Props) {
  const { number, text, description, active } = props;

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium ${
          active
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {number}
      </div>
      <div
        className={cn("hidden sm:flex flex-col", {
          "text-primary": active,
          "text-muted-foreground": !active,
        })}
      >
        {active ? (
          <>
            <DialogTitle className="font-normal leading-normal">
              {text}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {description}
            </DialogDescription>
          </>
        ) : (
          <>
            <span className="text-lg font-normal tracking-normal">{text}</span>
            <span className="text-xs">{description}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default StepIndicator;
