import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const buttonGroupVariants = cva(
  "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[>[data-variant=outline]]:*:data-[slot=input-group]:border-oklch(0.922 0 0) has-[>[data-variant=outline]]:*:data-[slot=select-trigger]:border-oklch(0.922 0 0) has-[>[data-variant=outline]]:[&>[data-slot=input-group]:has(:focus-visible)]:border-oklch(0.708 0 0) has-[>[data-variant=outline]]:[&>[data-slot=select-trigger]:focus-visible]:border-oklch(0.708 0 0) has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-2xl [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 has-[>[data-variant=outline]]:[&>input]:border-oklch(0.922 0 0) has-[>[data-variant=outline]]:[&>input:focus-visible]:border-oklch(0.708 0 0) dark:has-[>[data-variant=outline]]:*:data-[slot=input-group]:border-oklch(1 0 0 / 10%) dark:has-[>[data-variant=outline]]:*:data-[slot=select-trigger]:border-oklch(1 0 0 / 10%) dark:has-[>[data-variant=outline]]:[&>[data-slot=input-group]:has(:focus-visible)]:border-oklch(0.556 0 0) dark:has-[>[data-variant=outline]]:[&>[data-slot=select-trigger]:focus-visible]:border-oklch(0.556 0 0) dark:has-[>[data-variant=outline]]:[&>input]:border-oklch(1 0 0 / 10%) dark:has-[>[data-variant=outline]]:[&>input:focus-visible]:border-oklch(0.556 0 0)",
  {
    variants: {
      orientation: {
        horizontal:
          "*:data-slot:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-2xl! [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0",
        vertical:
          "flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-2xl! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex items-center gap-2 rounded-2xl border border-oklch(0.922 0 0) bg-oklch(0.97 0 0) px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 dark:border-oklch(1 0 0 / 10%) dark:bg-oklch(0.269 0 0)",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "button-group-text",
    },
  })
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "relative self-stretch bg-oklch(0.922 0 0) data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto dark:bg-oklch(1 0 0 / 15%)",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
