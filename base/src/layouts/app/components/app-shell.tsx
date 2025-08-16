import { SidebarProvider } from '@/components/ui/sidebar';
import {ReactNode} from "react";
import {useTheme} from "@/contexts/theme-context";

interface AppShellProps {
    children: ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const { sidebarOpen } = useTheme();

    if (variant === 'header') {
        return <div className="flex min-h-screen w-full flex-col">{children}</div>;
    }

    return <SidebarProvider defaultOpen={sidebarOpen}>{children}</SidebarProvider>;
}
