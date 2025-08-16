import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import Link from "next/link";
import {useApp} from "@/contexts/app-context";
import {SidebarMenuGroup} from "@/types";
import {usePathname} from "next/navigation";

export function NavMain() {
    const { sidebarMenus } = useApp();
    const pathname = usePathname();

    return sidebarMenus.map((e: SidebarMenuGroup, i: number) => (
        <SidebarGroup key={i} className="px-2 py-0">
            <SidebarGroupLabel>{e.title}</SidebarGroupLabel>
            <SidebarMenu>
                <>
                    {e.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={{ children: item.title }}>
                                <Link href={item.href} prefetch>
                                    <>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </>
            </SidebarMenu>
        </SidebarGroup>
    ));
}
