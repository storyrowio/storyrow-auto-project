'use client'

import * as React from 'react'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'
import {buttonVariants} from './button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar ({
                       className,
                       classNames,
                       showOutsideDays = true,
                       ...props
                   }: CalendarProps): any {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('max-w-fit p-3 relative', className)}
            classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-8 sm:space-y-0 justify-between',
                month: 'space-y-4',
                month_caption: 'text-center',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium',
                weekday: 'text-gray-400 font-medium text-sm',
                weeks: 'border-separate border-spacing-4',
                nav: 'w-0 m-0',
                nav_button: cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                ),
                button_previous: cn(
                    buttonVariants({ variant: 'outline' }),
                    'absolute left-1 size-8'
                ),
                button_next: cn(
                    buttonVariants({ variant: 'outline' }),
                    'absolute right-1 size-8'
                ),
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell:
                    'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2 rounded-lg overflow-hidden',
                cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: cn(
                    // buttonVariants({ variant: 'ghost' }),
                    'h-8 w-8 p-0 font-normal text-sm text-center rounded-sm aria-selected:opacity-100'
                ),
                selected: 'bg-primary hover:bg-primary focus:bg-primary text-white rounded-md',
                today: 'bg-accent text-accent-foreground',
                outside: 'text-muted-foreground opacity-40',
                disabled: 'text-muted-foreground opacity-40',
                range_middle:
                    'aria-selected:bg-primary/5 aria-selected:text-primary !rounded-none',
                hidden: 'invisible',
                ...classNames
            }}
            components={{
                // NextMonthButton: ({ ...props }) => <button>
                //     <ChevronLeftIcon className="h-4 w-4" />
                // </button>,
                // PreviousMonthButton:  ({ ...props }) => <button>
                //     <ChevronRightIcon className="h-4 w-4" />
                // </button>
                // IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-4 w-4" />,
                // IconRight: ({ ...props }) => <ChevronRightIcon className="h-4 w-4" />
            }}
            {...props}
        />
    )
}
Calendar.displayName = 'Calendar'

export { Calendar }
