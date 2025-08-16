import { ReactNode, ComponentType } from 'react'
import {AuthProvider} from "@/contexts/auth-context";
import {ThemeProvider} from "@/contexts/theme-context";
import {AppProvider} from "@/contexts/app-context";

export function composeProviders(
    providers: ComponentType<{ children: ReactNode }>[]
): ComponentType<{ children: ReactNode }> {
    return ({ children }) =>
        providers.reduceRight(
            (acc, Provider) => <Provider>{acc}</Provider>,
            children
        )
}

const CombinedProvider = composeProviders([
    AuthProvider,
    ThemeProvider,
    AppProvider
])

export const Providers = ({ children }: { children: ReactNode }) => {
    return <CombinedProvider>{children}</CombinedProvider>
}
