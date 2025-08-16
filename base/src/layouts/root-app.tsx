'use client'

import {usePathname} from "next/navigation";
import MainLayout from "@/layouts/main-layout";
import AppLayout from "@/layouts/app-layout";
import {Providers} from "@/contexts/providers";
import React, {PropsWithChildren} from "react";
import AuthLayout from "@/layouts/auth-layout";

export default function RootApp({ children }: PropsWithChildren) {
    const pathname = usePathname();
    let Layout = MainLayout;

    if (pathname.startsWith('/app')) {
        Layout = AppLayout;
    }

    if (pathname.startsWith('/auth')) {
        Layout = AuthLayout;
    }

    return (
        <Providers>
            <Layout>
                <>
                    {children}
                </>
            </Layout>
        </Providers>
    )
}
