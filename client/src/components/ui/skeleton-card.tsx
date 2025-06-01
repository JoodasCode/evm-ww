import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "./card"
import { Skeleton } from "./skeleton"

interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "compact" | "detailed"
}

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "h-full flex flex-col",
          className
        )}
        {...props}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              {variant !== "compact" && <Skeleton className="h-3 w-1/2" />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          {variant === "detailed" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
              <Skeleton className="h-24 w-full" />
            </div>
          ) : variant === "compact" ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)

SkeletonCard.displayName = "SkeletonCard"

export { SkeletonCard }
