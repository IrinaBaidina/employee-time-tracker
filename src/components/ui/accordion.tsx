import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon} from "lucide-react"
import { cn } from "@/lib/utils"

const AccordionDirectionContext = React.createContext<"down" | "right" | "left">("down")

function Accordion({
  direction = "down",
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> & {
  direction?: "down" | "right" | "left"
}) {
  const layoutClass =
    direction === "right"
      ? "flex flex-row items-start"
      : direction === "left"
        ? "flex flex-row-reverse items-start"
        : "flex flex-col"
  return (
    <AccordionDirectionContext.Provider value={direction}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        className={cn(layoutClass, className)}
        {...props}
      >
        {children}
      </AccordionPrimitive.Root>
    </AccordionDirectionContext.Provider>
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  const direction = React.useContext(AccordionDirectionContext)
  const borderClass =
    direction === "right"
      ? "pr-2 mr-2 border-r-2 last:border-r-0 last:pr-0 last:mr-2"
      : direction === "left"
        ? "pl-2 ml-2 border-l-2 last:border-l-0 last:pl-0 last:ml-2"
        : "border-b-2 last:border-b-0 last:pb-0 last:mb-0";

  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(borderClass, className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  chevron = true,
  chevronClassName,
  chevronElement,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  chevron?: boolean
  chevronClassName?: string
  chevronElement?: string
}) {
  const isCustomChevron = chevronElement === "CustomChevron"

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:bg-accent focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          // Селектор для стандартного шеврона (непосредственный дочерний svg)
          "[&[data-state=open]>svg]:rotate-180",
          // Селектор для кастомного шеврона (svg внутри div)
          isCustomChevron && "[&[data-state=open]>div>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        {chevron && (
          isCustomChevron ? (
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white">
              <ChevronDownIcon className={cn(
                "text-signature pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200",
              )} />
            </div>
          ) : (
            <ChevronDownIcon className={cn(
              "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200",
            )} />
          )
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const direction = React.useContext(AccordionDirectionContext)
  const animationClass =
    direction === "right"
      ? "data-[state=open]:animate-accordion-right data-[state=closed]:animate-accordion-close-horizontal"
      : direction === "left"
        ? "data-[state=open]:animate-accordion-left data-[state=closed]:animate-accordion-close-horizontal"
        : "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down";

  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-sm transition-all",
        animationClass
      )}
      {...props}
    >
      <div className={className}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }