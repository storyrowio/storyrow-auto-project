import {Input} from "@/components/ui/input";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import {ClassValue} from "clsx";

interface InputAdornmentsProps {
    prefix?: ReactNode;
    suffix?: ReactNode;
    className?: ClassValue;
    placeholder?: string | undefined;
    [key: string]: unknown;
}

export default function InputAdornments(props: InputAdornmentsProps) {
    const { prefix, suffix, className, placeholder, ...rest } = props;

    return (
        <div className={cn(
            'relative flex items-center',
            className
        )}>
            {prefix && (
                <div className="absolute left-0 pl-3">
                    {prefix}
                </div>
            )}

            <Input
                type="text"
                placeholder={placeholder}
                className={cn(
                    prefix ? 'pl-9' : 'pl-3',
                    suffix ? 'pr-9' : 'pr-3',
                )}
                {...rest}
            />

            {suffix && (
                <div className="absolute right-0">
                    {suffix}
                </div>
            )}
        </div>
    )
}
