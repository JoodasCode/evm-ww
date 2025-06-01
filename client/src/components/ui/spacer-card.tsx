import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "./card"

interface SpacerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "pattern"
  intensity?: "low" | "medium" | "high"
}

const SpacerCard = React.forwardRef<HTMLDivElement, SpacerCardProps>(
  ({ className, variant = "default", intensity = "medium", ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "subtle":
          return "bg-muted/50"
        case "pattern":
          return "bg-background"
        default:
          return "bg-muted/20"
      }
    }

    const getIntensityClasses = () => {
      switch (intensity) {
        case "low":
          return "opacity-30"
        case "high":
          return "opacity-100"
        default:
          return "opacity-70"
      }
    }

    return (
      <Card
        ref={ref}
        className={cn(
          "shadow-sm h-full flex flex-col",
          getVariantClasses(),
          getIntensityClasses(),
          className
        )}
        {...props}
      >
        <CardContent className="p-0 h-full flex items-center justify-center">
          {variant === "pattern" ? (
            <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full p-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-md",
                    i % 2 === 0 ? "bg-muted/40" : "bg-muted/70"
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-full" />
          )}
        </CardContent>
      </Card>
    )
  }
)

SpacerCard.displayName = "SpacerCard"

export { SpacerCard }
