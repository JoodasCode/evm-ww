import * as React from "react"
import { cn } from "@/lib/utils"
import { Grid, GridItem } from "./grid"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"

interface CardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  fixedHeight?: boolean
}

const CardLayout = React.forwardRef<HTMLDivElement, CardLayoutProps>(
  ({ className, title, description, fixedHeight = true, children, ...props }, ref) => {
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
        {(title || description) && (
          <div className="flex flex-col space-y-1.5">
            {title && <h2 className="text-2xl font-bold text-foreground">{title}</h2>}
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        )}
        <Grid cols={2} gap={6} className="h-full">
          {children}
        </Grid>
      </div>
    )
  }
)

CardLayout.displayName = "CardLayout"

interface CardItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: React.ElementType
  footer?: React.ReactNode
  loading?: boolean
}

const CardItem = React.forwardRef<HTMLDivElement, CardItemProps>(
  ({ className, title, description, icon: Icon, footer, loading, children, ...props }, ref) => {
    return (
      <GridItem className={className} {...props}>
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col" ref={ref}>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : (
              children
            )}
          </CardContent>
          {footer && <CardFooter>{footer}</CardFooter>}
        </Card>
      </GridItem>
    )
  }
)

CardItem.displayName = "CardItem"

export { CardLayout, CardItem }
