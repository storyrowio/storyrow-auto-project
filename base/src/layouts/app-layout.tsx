import {PropsWithChildren, useEffect, useRef} from 'react';
import {useApp} from "@/contexts/app-context";
import AppSidebarLayout from "@/layouts/app/app-sidebar-layout";
import {useSession} from "next-auth/react";
import {useAuth} from "@/contexts/auth-context";

export default function AppLayout({ children, ...props }: PropsWithChildren) {
    const { breadcrumbs } = useApp();
    const { setUser } = useAuth();
    const session = useSession();

    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current && session.data?.user) {
            setUser(session.data?.user);
            mounted.current = true;
        }
    }, [session.data?.user, setUser]);

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppSidebarLayout>
    )
}
