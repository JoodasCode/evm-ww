import * as React from "react"
import { cn } from "@/lib/utils"
import { Grid, GridItem } from "./grid"
import { Card } from "./card"

interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  badge?: React.ReactNode
  fixedHeight?: boolean
  cols?: 1 | 2 | 3 | 4
}

const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
  ({ className, title, description, badge, fixedHeight = true, cols = 2, children, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn(
          "space-y-6",
          fixedHeight && "h-[calc(100vh-180px)]",
          className
        )} 
        {...props}
      >
        {(title || description || badge) && (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {title && <h2 className="text-2xl font-bold text-foreground">{title}</h2>}
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
            {badge && badge}
          </div>
        )}
        <Grid cols={cols} gap={6} className="h-full">
          {children}
        </Grid>
      </div>
    )
  }
)

DashboardLayout.displayName = "DashboardLayout"

export { DashboardLayout, GridItem }
