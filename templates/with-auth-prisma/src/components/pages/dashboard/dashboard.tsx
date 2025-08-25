'use client'

import {useBreadcrumbs} from "@/hooks/use-breadcrumbs";
export default function Dashboard() {
    useBreadcrumbs([
        { title: 'Dashboard', href: '/app' }
    ]);

    return (
        <main className="px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-2 grid lg:grid-cols-3 gap-4">
                {Array(3).fill('').map((e, i) => (
                    <div key={i} className="w-full h-36 bg-gray-200 rounded-md"/>
                ))}
                <div className="col-span-3 w-full h-64 bg-gray-200 rounded-md"/>
            </div>
            <div className="w-full h-full bg-gray-200 rounded-md"/>
            {Array(5).fill('').map((e, i) => (
                <div key={i} className="col-span-3 w-full h-20 bg-gray-200 rounded-md"/>
            ))}
        </main>
    )
}
