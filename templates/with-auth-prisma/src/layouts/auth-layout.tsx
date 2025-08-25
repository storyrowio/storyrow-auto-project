import AuthSplitLayout from "@/layouts/auth/auth-split-layout";
import {ReactNode} from "react";

export default function AuthLayout({ children, ...props }: { children?: ReactNode }) {
    return (
        <AuthSplitLayout {...props}>
            {children}
        </AuthSplitLayout>
    );
}
