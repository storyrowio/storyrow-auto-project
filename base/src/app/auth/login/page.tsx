'use client'

import { useFormik } from 'formik';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import InputError from '@/components/ui/input-error';
import TextLink from "@/components/ui/text-link";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {LoaderCircle} from "lucide-react";
import {signIn, signOut} from "next-auth/react";
import {Separator} from "@/components/ui/separator";
import GoogleIcon from "@/components/icons/google";
import {useSearchParams} from "next/navigation";
import {Alert, AlertDescription} from "@/components/ui/alert";

interface LoginProps {
    email: string;
    password?: string;
    remember: boolean;
}

export default function Page() {
    const searchParams = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());
    const canResetPassword = true;
    const formik: any = useFormik({
        initialValues: {
            email: '',
            password: '',
            remember: false
        },
        onSubmit: (values: LoginProps) => handleSubmit(values)
    });

    const handleSignInGoogle = () => {
        return signIn('google', {
            redirectTo: '/app',
        });
    };

    const handleSubmit = (values: any) => {
        return signIn('credentials', values, {
            redirectTo: '/app',
            redirect: true,
        });
    };

    return (
        <>
            <Button
                variant="outline"
                className="bg-gray-100 hover:bg-gray-200"
                onClick={handleSignInGoogle}>
                <GoogleIcon className="size-4"/>
                Sign In with Google
            </Button>
            <div className="w-full flex items-center justify-start gap-4">
                <Separator className="flex-1"/>
                <p className="px-2 text-sm font-medium text-gray-500">Or</p>
                <Separator className="flex-1"/>
            </div>
            {params.error && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {params.error}
                    </AlertDescription>
                </Alert>
            )}
            <form className="space-y-6" onSubmit={formik.handleSubmit}>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="email"
                        value={formik.values.email}
                        name="email"
                        onChange={formik.handleChange}
                        placeholder="email@example.com"
                    />
                    <InputError message={formik.errors.email} />
                </div>

                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        {canResetPassword && (
                            <TextLink href={'/password-request'} className="ml-auto text-sm" tabIndex={5}>
                                Forgot password?
                            </TextLink>
                        )}
                    </div>
                    <Input
                        id="password"
                        type="password"
                        required
                        tabIndex={2}
                        autoComplete="current-password"
                        value={formik.values.password}
                        name="password"
                        onChange={formik.handleChange}
                        placeholder="Password"
                    />
                    <InputError message={formik.errors.password} />
                </div>

                <div className="flex items-center space-x-3">
                    <Checkbox
                        id="remember"
                        name="remember"
                        checked={formik.values.remember}
                        onClick={() => formik.setFieldValue('remember', !formik.values.remember)}
                        tabIndex={3}
                    />
                    <Label htmlFor="remember">Remember me</Label>
                </div>

                <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={formik.isSubmitting}>
                    {formik.isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Log in
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
                Don&#39;t have an account?{' '}
                <TextLink href={'/auth/register'} tabIndex={5}>
                    Sign up
                </TextLink>
            </div>
        </>
    )
}
