"use client"

import * as React from "react"
import {
    Collapsible,
    CollapsibleContent,
} from "@/components/ui/collapsible"
import {ReactNode} from "react";

interface FilterTableProps {
    open: boolean;
    onOpenChange: () => void;
    children: ReactNode;
    [key: string]: unknown;
}

export default function FilterTable(props: FilterTableProps) {
    const { open, onOpenChange, children, ...rest } = props;

    return (
        <Collapsible
            open={open}
            onOpenChange={onOpenChange}
            {...rest}>
            <CollapsibleContent className="p-4 bg-gray-50 border shadow-sm rounded-md">
                {children}
            </CollapsibleContent>
        </Collapsible>
    )
}
