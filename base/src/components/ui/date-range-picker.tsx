'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Calendar } from './calendar'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from './select'
import { ChevronUpIcon, ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import {Label} from "@/components/ui/label";

export interface DateRangePickerProps {
    onUpdate?: (values: { range: DateRange }) => void
    initialDateFrom?: Date | string
    initialDateTo?: Date | string
    initialCompareFrom?: Date | string
    initialCompareTo?: Date | string
    align?: 'start' | 'center' | 'end'
    locale?: string
    showCompare?: boolean
}

interface DateInputProps {
    value?: Date
    onChange: (date: Date) => void
}

interface DateParts {
    day: number
    month: number
    year: number
}

const formatDate = (date: Date, locale: string = 'en-us'): string => {
    return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
    if (typeof dateInput === 'string') {
        const parts = dateInput.split('-').map((part) => parseInt(part, 10))
        const date = new Date(parts[0], parts[1] - 1, parts[2])
        return date
    } else {
        return dateInput
    }
}

interface DateRange {
    from: Date
    to: Date | undefined
}

interface Preset {
    name: string
    label: string
}

const PRESETS: Preset[] = [
    { name: 'today', label: 'Today' },
    { name: 'yesterday', label: 'Yesterday' },
    { name: 'last7', label: 'Last 7 days' },
    { name: 'last14', label: 'Last 14 days' },
    { name: 'last30', label: 'Last 30 days' },
    { name: 'thisWeek', label: 'This Week' },
    { name: 'lastWeek', label: 'Last Week' },
    { name: 'thisMonth', label: 'This Month' },
    { name: 'lastMonth', label: 'Last Month' }
]

const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
    const [date, setDate] = React.useState<DateParts>(() => {
        const d = value ? new Date(value) : new Date()
        return {
            day: d.getDate(),
            month: d.getMonth() + 1, // JavaScript months are 0-indexed
            year: d.getFullYear()
        }
    })

    const monthRef = useRef<HTMLInputElement | null>(null)
    const dayRef = useRef<HTMLInputElement | null>(null)
    const yearRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        const d = value ? new Date(value) : new Date()
        setDate({
            day: d.getDate(),
            month: d.getMonth() + 1,
            year: d.getFullYear()
        })
    }, [value])

    const validateDate = (field: keyof DateParts, value: number): boolean => {
        if (
            (field === 'day' && (value < 1 || value > 31)) ||
            (field === 'month' && (value < 1 || value > 12)) ||
            (field === 'year' && (value < 1000 || value > 9999))
        ) {
            return false
        }

        // Validate the day of the month
        const newDate = { ...date, [field]: value }
        const d = new Date(newDate.year, newDate.month - 1, newDate.day)
        return d.getFullYear() === newDate.year &&
            d.getMonth() + 1 === newDate.month &&
            d.getDate() === newDate.day
    }

    const handleInputChange =
        (field: keyof DateParts) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value ? Number(e.target.value) : ''
            const isValid = typeof newValue === 'number' && validateDate(field, newValue)

            // If the new value is valid, update the date
            const newDate = { ...date, [field]: newValue }
            setDate(newDate)

            // only call onChange when the entry is valid
            if (isValid) {
                onChange(new Date(newDate.year, newDate.month - 1, newDate.day))
            }
        }

    const initialDate = useRef<DateParts>(date)

    const handleBlur = (field: keyof DateParts) => (
        e: React.FocusEvent<HTMLInputElement>
    ): void => {
        if (!e.target.value) {
            setDate(initialDate.current)
            return
        }

        const newValue = Number(e.target.value)
        const isValid = validateDate(field, newValue)

        if (!isValid) {
            setDate(initialDate.current)
        } else {
            // If the new value is valid, update the initial value
            initialDate.current = { ...date, [field]: newValue }
        }
    }

    const handleKeyDown =
        (field: keyof DateParts) => (e: React.KeyboardEvent<HTMLInputElement>) => {
            // Allow command (or control) combinations
            if (e.metaKey || e.ctrlKey) {
                return
            }

            // Prevent non-numeric characters, excluding allowed keys
            if (
                !/^[0-9]$/.test(e.key) &&
                ![
                    'ArrowUp',
                    'ArrowDown',
                    'ArrowLeft',
                    'ArrowRight',
                    'Delete',
                    'Tab',
                    'Backspace',
                    'Enter'
                ].includes(e.key)
            ) {
                e.preventDefault()
                return
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault()
                let newDate = { ...date }

                if (field === 'day') {
                    if (date[field] === new Date(date.year, date.month, 0).getDate()) {
                        newDate = { ...newDate, day: 1, month: (date.month % 12) + 1 }
                        if (newDate.month === 1) newDate.year += 1
                    } else {
                        newDate.day += 1
                    }
                }

                if (field === 'month') {
                    if (date[field] === 12) {
                        newDate = { ...newDate, month: 1, year: date.year + 1 }
                    } else {
                        newDate.month += 1
                    }
                }

                if (field === 'year') {
                    newDate.year += 1
                }

                setDate(newDate)
                onChange(new Date(newDate.year, newDate.month - 1, newDate.day))
            } else if (e.key === 'ArrowDown') {
                e.preventDefault()
                let newDate = { ...date }

                if (field === 'day') {
                    if (date[field] === 1) {
                        newDate.month -= 1
                        if (newDate.month === 0) {
                            newDate.month = 12
                            newDate.year -= 1
                        }
                        newDate.day = new Date(newDate.year, newDate.month, 0).getDate()
                    } else {
                        newDate.day -= 1
                    }
                }

                if (field === 'month') {
                    if (date[field] === 1) {
                        newDate = { ...newDate, month: 12, year: date.year - 1 }
                    } else {
                        newDate.month -= 1
                    }
                }

                if (field === 'year') {
                    newDate.year -= 1
                }

                setDate(newDate)
                onChange(new Date(newDate.year, newDate.month - 1, newDate.day))
            }

            if (e.key === 'ArrowRight') {
                if (
                    e.currentTarget.selectionStart === e.currentTarget.value.length ||
                    (e.currentTarget.selectionStart === 0 &&
                        e.currentTarget.selectionEnd === e.currentTarget.value.length)
                ) {
                    e.preventDefault()
                    if (field === 'month') dayRef.current?.focus()
                    if (field === 'day') yearRef.current?.focus()
                }
            } else if (e.key === 'ArrowLeft') {
                if (
                    e.currentTarget.selectionStart === 0 ||
                    (e.currentTarget.selectionStart === 0 &&
                        e.currentTarget.selectionEnd === e.currentTarget.value.length)
                ) {
                    e.preventDefault()
                    if (field === 'day') monthRef.current?.focus()
                    if (field === 'year') dayRef.current?.focus()
                }
            }
        }

    return (
        <div className="flex border rounded-lg items-center text-sm px-1">
            <input
                type="text"
                ref={monthRef}
                max={12}
                maxLength={2}
                value={date.month.toString()}
                onChange={handleInputChange('month')}
                onKeyDown={handleKeyDown('month')}
                onFocus={(e) => {
                    if (window.innerWidth > 1024) {
                        e.target.select()
                    }
                }}
                onBlur={handleBlur('month')}
                className="p-0 min-h-8 outline-none w-6 border-none text-center"
                placeholder="M"
            />
            <span className="opacity-20 -mx-px">/</span>
            <input
                type="text"
                ref={dayRef}
                max={31}
                maxLength={2}
                value={date.day.toString()}
                onChange={handleInputChange('day')}
                onKeyDown={handleKeyDown('day')}
                onFocus={(e) => {
                    if (window.innerWidth > 1024) {
                        e.target.select()
                    }
                }}
                onBlur={handleBlur('day')}
                className="p-0 outline-none w-7 border-none text-center"
                placeholder="D"
            />
            <span className="opacity-20 -mx-px">/</span>
            <input
                type="text"
                ref={yearRef}
                max={9999}
                maxLength={4}
                value={date.year.toString()}
                onChange={handleInputChange('year')}
                onKeyDown={handleKeyDown('year')}
                onFocus={(e) => {
                    if (window.innerWidth > 1024) {
                        e.target.select()
                    }
                }}
                onBlur={handleBlur('year')}
                className="p-0 outline-none w-12 border-none text-center"
                placeholder="YYYY"
            />
        </div>
    )
}

export default function DateRangePicker(props: any) {
    const {
        initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
        initialDateTo,
        onUpdate,
        align = 'end',
        locale = 'en-US'
    } = props
    const [isOpen, setIsOpen] = useState(false)

    const [range, setRange] = useState<DateRange>({
        from: getDateAdjustedForTimezone(initialDateFrom),
        to: initialDateTo
            ? getDateAdjustedForTimezone(initialDateTo)
            : getDateAdjustedForTimezone(initialDateFrom)
    })

    const openedRangeRef = useRef<DateRange | undefined>(undefined)

    const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined)

    const [isSmallScreen, setIsSmallScreen] = useState(
        typeof window !== 'undefined' ? window.innerWidth < 960 : false
    )

    useEffect(() => {
        const handleResize = (): void => {
            setIsSmallScreen(window.innerWidth < 960)
        }

        window.addEventListener('resize', handleResize)

        // Clean up event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const getPresetRange = (presetName: string): DateRange => {
        const preset = PRESETS.find(({ name }) => name === presetName)
        if (!preset) throw new Error(`Unknown date range preset: ${presetName}`)
        const from = new Date()
        const to = new Date()
        const first = from.getDate() - from.getDay()

        switch (preset.name) {
            case 'today':
                from.setHours(0, 0, 0, 0)
                to.setHours(23, 59, 59, 999)
                break
            case 'yesterday':
                from.setDate(from.getDate() - 1)
                from.setHours(0, 0, 0, 0)
                to.setDate(to.getDate() - 1)
                to.setHours(23, 59, 59, 999)
                break
            case 'last7':
                from.setDate(from.getDate() - 6)
                from.setHours(0, 0, 0, 0)
                to.setHours(23, 59, 59, 999)
                break
            case 'last14':
                from.setDate(from.getDate() - 13)
                from.setHours(0, 0, 0, 0)
                to.setHours(23, 59, 59, 999)
                break
            case 'last30':
                from.setDate(from.getDate() - 29)
                from.setHours(0, 0, 0, 0)
                to.setHours(23, 59, 59, 999)
                break
            case 'thisWeek':
                from.setDate(first)
                from.setHours(0, 0, 0, 0)
                to.setHours(23, 59, 59, 999)
                break
            case 'lastWeek':
                from.setDate(from.getDate() - 7 - from.getDay())
                to.setDate(to.getDate() - to.getDay() - 1)
                from.setHours(0, 0, 0, 0)
                to.setHours(23, 59, 59, 999)
                break
            case 'thisMonth':
                from.setDate(1)
                from.setHours(0, 0, 0, 0)
                to.setHours(23, 59, 59, 999)
                break
            case 'lastMonth':
                from.setMonth(from.getMonth() - 1)
                from.setDate(1)
                from.setHours(0, 0, 0, 0)
                to.setDate(0)
                to.setHours(23, 59, 59, 999)
                break
        }

        return { from, to }
    }

    const setPreset = (preset: string): void => {
        const range = getPresetRange(preset)
        setRange(range)
    }

    const checkPreset = (): void => {
        for (const preset of PRESETS) {
            const presetRange = getPresetRange(preset.name)

            const normalizedRangeFrom = new Date(range.from);
            normalizedRangeFrom.setHours(0, 0, 0, 0);
            const normalizedPresetFrom = new Date(
                presetRange.from.setHours(0, 0, 0, 0)
            )

            const normalizedRangeTo = new Date(range.to ?? 0);
            normalizedRangeTo.setHours(0, 0, 0, 0);
            const normalizedPresetTo = new Date(
                presetRange.to?.setHours(0, 0, 0, 0) ?? 0
            )

            if (
                normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
                normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
            ) {
                setSelectedPreset(preset.name)
                return
            }
        }

        setSelectedPreset(undefined)
    }

    const resetValues = (): void => {
        setRange({
            from:
                typeof initialDateFrom === 'string'
                    ? getDateAdjustedForTimezone(initialDateFrom)
                    : initialDateFrom,
            to: initialDateTo
                ? typeof initialDateTo === 'string'
                    ? getDateAdjustedForTimezone(initialDateTo)
                    : initialDateTo
                : typeof initialDateFrom === 'string'
                    ? getDateAdjustedForTimezone(initialDateFrom)
                    : initialDateFrom
        })
    }

    useEffect(() => {
        checkPreset()
    }, [range])

    const PresetButton = ({
                              preset,
                              label,
                              isSelected
                          }: {
        preset: string
        label: string
        isSelected: boolean
    }): any => (
        <Button
            className={cn(isSelected && 'pointer-events-none')}
            variant="ghost"
            onClick={() => {
                setPreset(preset)
            }}
        >
            <>
        <span className={cn('pr-2 opacity-0', isSelected && 'opacity-70')}>
          <CheckIcon width={18} height={18} />
        </span>
                {label}
            </>
        </Button>
    )

    // Helper function to check if two date ranges are equal
    const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
        if (!a || !b) return a === b // If either is undefined, return true if both are undefined
        return (
            a.from.getTime() === b.from.getTime() &&
            (!a.to || !b.to || a.to.getTime() === b.to.getTime())
        )
    }

    useEffect(() => {
        if (isOpen) {
            openedRangeRef.current = range
        }
    }, [isOpen])

    return (
        <Popover
            modal={true}
            open={isOpen}
            onOpenChange={(open: boolean) => {
                if (!open) {
                    resetValues()
                }
                setIsOpen(open)
            }}
        >
            <PopoverTrigger asChild>
                <Button size={'lg'} variant="outline" className="w-full pl-3">
                    <div className="w-full text-left">
                        <div className="py-1">
                            <div>{`${formatDate(range.from, locale)}${
                                range.to != null ? ' - ' + formatDate(range.to, locale) : ''
                            }`}</div>
                        </div>
                    </div>
                    <div className="pl-1 opacity-60 -mr-2 scale-125">
                        {isOpen ? (<ChevronUpIcon width={24} />) : (<ChevronDownIcon width={24} />)}
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent align={align} className="w-auto">
                <div className="flex py-2">
                    <div className="flex">
                        <div className="flex flex-col">
                            <div className="flex flex-col lg:flex-row gap-2 px-3 justify-end items-center lg:items-start pb-4 lg:pb-0">
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <div>
                                            <p className="text-xs text-gray-500">From</p>
                                            <DateInput
                                                value={range.from}
                                                onChange={(date: any) => {
                                                    const toDate = range.to == null || date > range.to ? date : range.to
                                                    setRange((prevRange) => ({
                                                        ...prevRange,
                                                        from: date,
                                                        to: toDate
                                                    }))
                                                }}
                                            />
                                        </div>
                                        <div className="py-1 mt-5">-</div>
                                        <div>
                                            <p className="text-xs text-gray-500">To</p>
                                            <DateInput
                                                value={range.to}
                                                onChange={(date: any) => {
                                                    const fromDate = date < range.from ? date : range.from
                                                    setRange((prevRange) => ({
                                                        ...prevRange,
                                                        from: fromDate,
                                                        to: date
                                                    }))
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            { isSmallScreen && (
                                <Select defaultValue={selectedPreset} onValueChange={(value) => { setPreset(value) }}>
                                    <SelectTrigger className="w-[180px] mx-auto mb-2">
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PRESETS.map((preset) => (
                                            <SelectItem key={preset.name} value={preset.name}>
                                                {preset.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            <div className="mt-6">
                                <Calendar
                                    mode="range"
                                    onSelect={(value: { from?: Date, to?: Date } | undefined) => {
                                        if (value?.from != null) {
                                            setRange({ from: value.from, to: value?.to })
                                        }
                                    }}
                                    selected={range}
                                    numberOfMonths={isSmallScreen ? 1 : 2}
                                    defaultMonth={
                                        new Date(
                                            new Date().setMonth(
                                                new Date().getMonth() - (isSmallScreen ? 0 : 1)
                                            )
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    {!isSmallScreen && (
                        <div className="flex flex-col items-end gap-1 pr-2 pl-6 pb-6">
                            <div className="flex w-full flex-col items-end gap-1 pr-2 pl-6 pb-6">
                                {PRESETS.map((preset) => (
                                    <PresetButton
                                        key={preset.name}
                                        preset={preset.name}
                                        label={preset.label}
                                        isSelected={selectedPreset === preset.name}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-2 py-2 pr-4">
                    <Button
                        onClick={() => {
                            setIsOpen(false)
                            resetValues()
                        }}
                        variant="ghost"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setIsOpen(false)
                            if (!areRangesEqual(range, openedRangeRef.current) ) {
                                onUpdate?.({ range })
                            }
                        }}
                    >
                        Update
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
