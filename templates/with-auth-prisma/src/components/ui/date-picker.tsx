"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import {ChevronDownIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useEffect, useRef} from "react";

interface DatePickerProps {
    buttonClassName?: string;
    defaultValue?: Date;
    onChange: (date: Date | undefined) => void;
}

export function DatePicker(props: DatePickerProps) {
    const { buttonClassName, defaultValue, onChange } = props;
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)

    const mounted = useRef(false);
    useEffect(() => {
        if (defaultValue && !mounted.current) {
            setDate(new Date(defaultValue));
            mounted.current = true;
        }
    }, [defaultValue]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id="date"
                    className={cn(
                        'w-48 justify-between font-normal',
                        buttonClassName
                    )}
                >
                    {date ? date?.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    // captionLayout="dropdown"
                    onSelect={(date) => {
                        onChange(date);
                        setDate(date);
                        setOpen(false);
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}
