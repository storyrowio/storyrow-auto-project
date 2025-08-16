import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-auto",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
          tonal: "border-none"
      },
        color: {
          default: 'bg-muted',
          primary: 'bg-primary',
            secondary: "bg-secondary",
          destructive: "bg-destructive"
        },
    },
      compoundVariants: [
          { variant: 'tonal', color: 'default', class: 'bg-gray-200 text-gray-800' },
          { variant: 'tonal', color: 'primary', class: 'bg-primary/10 text-primary' },
          { variant: 'tonal', color: 'secondary', class: 'bg-secondary/20 text-secondary-700' },
          { variant: 'tonal', color: 'destructive', class: 'bg-destructive/20 text-destructive' },
      ],
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
    color,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean } | any) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, color }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
