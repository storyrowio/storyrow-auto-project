import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import {AppShell} from "@/layouts/app/components/app-shell";
import {AppContent} from "@/layouts/app/components/app-content";
import {AppSidebar} from "@/layouts/app/components/app-sidebar";
import {AppSidebarHeader} from "@/layouts/app/components/app-sidebar-header";

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
