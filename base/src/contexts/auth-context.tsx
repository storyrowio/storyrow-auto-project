'use client'
import {createContext, useState, useContext, ReactNode, Dispatch, SetStateAction} from 'react'
import {User} from "@/types";


interface AuthContextType {
    user?: User | null
    setUser: Dispatch<SetStateAction<any>>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(null)

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
