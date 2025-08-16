import { generateUniqueId } from "@/lib/utils";
import {
    BanknoteArrowDown,
    BanknoteArrowUp,
    ClipboardCheck,
    FileText,
    FolderKanban,
    Images, Landmark, Layers,
    LayoutGrid,
    Settings
} from "lucide-react";
import {SidebarMenuGroup} from "@/types";

export const MenuIcons = {
    dashboard: LayoutGrid,
    account: Landmark,
    category: Layers,
    expense: BanknoteArrowDown,
    income: BanknoteArrowUp,
    setting: Settings,
    task: ClipboardCheck
};

export const DefaultMenus: SidebarMenuGroup[] = [
    {
        title: 'Main',
        items: [
            { id: generateUniqueId(), title: 'Dashboard', icon: MenuIcons.dashboard, href: '/app' },
        ]
    },
    {
        title: 'Finance',
        items: [
            { id: generateUniqueId(), title: 'Accounts', icon: MenuIcons.account, href: '/app/accounts' },
            { id: generateUniqueId(), title: 'Categories', icon: MenuIcons.category, href: '/app/categories' },
            { id: generateUniqueId(), title: 'Incomes', icon: MenuIcons.income, href: '/app/incomes' },
            { id: generateUniqueId(), title: 'Expenses', icon: MenuIcons.expense, href: '/app/expenses' },
        ]
    },
    {
        title: 'System Setting',
        items: [
            { id: generateUniqueId(), title: 'Setting', icon: MenuIcons.setting, href: '/app/settings' },
        ]
    }
];
