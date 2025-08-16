import {LucideIcon, LucideProps} from 'lucide-react';
import {ForwardRefExoticComponent, RefAttributes} from "react";

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    id?: string;
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface SidebarMenuItem {
    id: string;
    title: string;
    icon?: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
    href: string;
}

export interface SidebarMenuGroup {
    title: string;
    items: SidebarMenuItem[]
}

export interface ListFilter {
    keyword?: string;
    sort?: string;
    [key: string]: unknown;
}
