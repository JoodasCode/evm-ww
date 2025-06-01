import * as React from "react"
import { cn } from "@/lib/utils"

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  gapX?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  gapY?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  flow?: "row" | "col" | "dense" | "row-dense" | "col-dense"
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap, gapX, gapY, flow, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          cols === 1 && "grid-cols-1",
          cols === 2 && "grid-cols-2",
          cols === 3 && "grid-cols-3",
          cols === 4 && "grid-cols-4",
          cols === 5 && "grid-cols-5",
          cols === 6 && "grid-cols-6",
          cols === 7 && "grid-cols-7",
          cols === 8 && "grid-cols-8",
          cols === 9 && "grid-cols-9",
          cols === 10 && "grid-cols-10",
          cols === 11 && "grid-cols-11",
          cols === 12 && "grid-cols-12",
          gap === 0 && "gap-0",
          gap === 1 && "gap-1",
          gap === 2 && "gap-2",
          gap === 3 && "gap-3",
          gap === 4 && "gap-4",
          gap === 5 && "gap-5",
          gap === 6 && "gap-6",
          gap === 7 && "gap-7",
          gap === 8 && "gap-8",
          gap === 9 && "gap-9",
          gap === 10 && "gap-10",
          gapX === 0 && "gap-x-0",
          gapX === 1 && "gap-x-1",
          gapX === 2 && "gap-x-2",
          gapX === 3 && "gap-x-3",
          gapX === 4 && "gap-x-4",
          gapX === 5 && "gap-x-5",
          gapX === 6 && "gap-x-6",
          gapX === 7 && "gap-x-7",
          gapX === 8 && "gap-x-8",
          gapX === 9 && "gap-x-9",
          gapX === 10 && "gap-x-10",
          gapY === 0 && "gap-y-0",
          gapY === 1 && "gap-y-1",
          gapY === 2 && "gap-y-2",
          gapY === 3 && "gap-y-3",
          gapY === 4 && "gap-y-4",
          gapY === 5 && "gap-y-5",
          gapY === 6 && "gap-y-6",
          gapY === 7 && "gap-y-7",
          gapY === 8 && "gap-y-8",
          gapY === 9 && "gap-y-9",
          gapY === 10 && "gap-y-10",
          flow === "row" && "grid-flow-row",
          flow === "col" && "grid-flow-col",
          flow === "dense" && "grid-flow-dense",
          flow === "row-dense" && "grid-flow-row-dense",
          flow === "col-dense" && "grid-flow-col-dense",
          className
        )}
        {...props}
      />
    )
  }
)

Grid.displayName = "Grid"

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  col?: "auto" | "full" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  colStart?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13
  colEnd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13
  row?: "auto" | "full" | 1 | 2 | 3 | 4 | 5 | 6
  rowStart?: 1 | 2 | 3 | 4 | 5 | 6 | 7
  rowEnd?: 1 | 2 | 3 | 4 | 5 | 6 | 7
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, col, colStart, colEnd, row, rowStart, rowEnd, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          col === "auto" && "col-auto",
          col === "full" && "col-span-full",
          typeof col === "number" && `col-span-${col}`,
          colStart && `col-start-${colStart}`,
          colEnd && `col-end-${colEnd}`,
          row === "auto" && "row-auto",
          row === "full" && "row-span-full",
          typeof row === "number" && `row-span-${row}`,
          rowStart && `row-start-${rowStart}`,
          rowEnd && `row-end-${rowEnd}`,
          className
        )}
        {...props}
      />
    )
  }
)

GridItem.displayName = "GridItem"

export { Grid, GridItem }
