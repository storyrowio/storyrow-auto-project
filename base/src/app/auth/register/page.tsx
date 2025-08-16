'use client'

import { useFormik } from 'formik';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import InputError from '@/components/ui/input-error';
import TextLink from "@/components/ui/text-link";
import {Button} from "@/components/ui/button";
import {LoaderCircle} from "lucide-react";
import GoogleIcon from "@/components/icons/google";
import {Separator} from "@/components/ui/separator";

export default function Page() {
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            passwordConfirmation: ''
        },
        onSubmit: values => handleSubmit(values)
    });

    const handleSubmit = (values: { email: string; }) => {

    };

    return (
        <>
            <Button variant="outline" className="bg-gray-100 hover:bg-gray-200">
                <GoogleIcon className="size-4"/>
                Sign Up with Google
            </Button>
            <div className="w-full flex items-center justify-start gap-4">
                <Separator className="flex-1"/>
                <p className="px-2 text-sm font-medium text-gray-500">Or</p>
                <Separator className="flex-1"/>
            </div>
            <form className="space-y-6" onSubmit={formik.handleSubmit}>
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="name"
                        value={formik.values.name}
                        name="name"
                        onChange={formik.handleChange}
                        disabled={formik.isSubmitting}
                        placeholder="Full name"
                    />
                    <InputError message={formik.errors.name} className="mt-2" />
                </div>

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
                    <Label htmlFor="password">Password</Label>
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

                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">Confirm password</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        required
                        tabIndex={4}
                        autoComplete="new-password"
                        value={formik.values.passwordConfirmation}
                        onChange={formik.handleChange}
                        disabled={formik.isSubmitting}
                        placeholder="Confirm password"
                    />
                    <InputError message={formik.errors.passwordConfirmation} />
                </div>

                <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={formik.isSubmitting}>
                    {formik.isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Create Account
                </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <TextLink href={'/auth/login'} tabIndex={6}>
                    Log in
                </TextLink>
            </div>
        </>
    )
}
