import { generateUniqueId } from "@/lib/utils";
import {
    BanknoteArrowDown,
    BanknoteArrowUp, ChartCandlestick,
    ClipboardCheck,
    FileText,
    FolderKanban, HandCoins, Handshake,
    Images, Landmark, Layers,
    LayoutGrid, ListTodo,
    Settings, Users
} from "lucide-react";
import {SidebarMenuGroup} from "@/types";

export const MenuIcons = {
    dashboard: LayoutGrid,

    project: FolderKanban,
    task: ClipboardCheck,

    user: Users,
    setting: Settings,
};

export const DefaultMenus: SidebarMenuGroup[] = [
    {
        title: 'Main',
        items: [
            { id: generateUniqueId(), title: 'Dashboard', icon: MenuIcons.dashboard, href: '/app' },
        ]
    },
    {
        title: 'Project',
        items: [
            { id: generateUniqueId(), title: 'Projects', icon: MenuIcons.project, href: '/app/projects' },
            { id: generateUniqueId(), title: 'Tasks', icon: MenuIcons.task, href: '/app/tasks' },
        ]
    },
    {
        title: 'System Setting',
        system: true,
        items: [
            { id: generateUniqueId(), title: 'Users', icon: MenuIcons.user, href: '/app/users', system: true },
            { id: generateUniqueId(), title: 'Setting', icon: MenuIcons.setting, href: '/app/settings', system: true },
        ]
    }
];
