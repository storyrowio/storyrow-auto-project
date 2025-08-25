'use client'

import {BreadcrumbItem} from "@/types";
import {useApp} from "@/contexts/app-context";
import {useEffect, useRef} from "react";

export function useBreadcrumbs(breadcrumbs: BreadcrumbItem[]) {
    const { setBreadcrumbs } = useApp();

    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) {
            setBreadcrumbs(breadcrumbs);
            mounted.current = true;
        }
    }, [breadcrumbs]);

    return breadcrumbs;
}
