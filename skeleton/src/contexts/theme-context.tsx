'use client'
import {createContext, useState, useContext, ReactNode} from 'react'

const ThemeContext = createContext({
    sidebarOpen: true,
    toggleSidebarOpen: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebarOpen = () => setSidebarOpen(prev => !prev)

    return (
        <ThemeContext.Provider value={{
            sidebarOpen,
            toggleSidebarOpen,
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
