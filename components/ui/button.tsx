import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none border border-border/70 bg-background text-sm font-semibold uppercase tracking-[0.08em] transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brand-major text-brand-major-foreground border-brand-major hover:bg-brand-major/85",
        destructive:
          "bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/85 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-border bg-background hover:bg-brand-fine/20 hover:text-brand-fine-foreground",
        secondary:
          "bg-brand-medium text-brand-medium-foreground border-brand-medium hover:bg-brand-medium/85",
        ghost:
          "border-border/60 bg-background hover:bg-brand-fine/20 hover:text-brand-fine-foreground",
        link: "border-none bg-transparent text-brand-major underline-offset-4 hover:text-brand-major/80",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-9 gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 px-7 has-[>svg]:px-5",
        icon: "h-10 w-10",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
