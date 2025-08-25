'use client'
import {
    createContext,
    useState,
    useContext,
    ReactNode,
    SetStateAction, Dispatch
} from 'react'
import {BreadcrumbItem, SidebarMenuGroup} from "@/types";
import {DefaultMenus} from "@/constants/menus";

interface AppContextType {
    sidebarMenus: SidebarMenuGroup[]
    setSidebarMenus: Dispatch<SetStateAction<SidebarMenuGroup[]>>
    breadcrumbs: BreadcrumbItem[]
    setBreadcrumbs: Dispatch<SetStateAction<BreadcrumbItem[]>>
}

const AppContext = createContext<AppContextType>({
    sidebarMenus: [],
    setSidebarMenus: () => {},
    breadcrumbs: [],
    setBreadcrumbs: () => {}
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [sidebarMenus, setSidebarMenus] = useState<SidebarMenuGroup[]>(DefaultMenus);
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

    return (
        <AppContext.Provider value={{
            sidebarMenus,
            setSidebarMenus,
            breadcrumbs,
            setBreadcrumbs
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => useContext(AppContext)
