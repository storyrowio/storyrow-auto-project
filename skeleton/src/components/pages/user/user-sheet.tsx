'use client'

import {useIsMobile} from "@/hooks/use-mobile";
import {Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {useFormik} from "formik";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import * as React from "react";
import {DatePicker} from "@/components/ui/date-picker";
import MoneyInput from "@/components/shared/money-input";
import axios from "axios";
import useSWR from "swr";
import {DefaultSort} from "@/constants/constants";
import * as Yup from 'yup';
import InputError from "@/components/ui/input-error";

interface UserSheetProps {
    open: boolean;
    onOpenChange: () => void;
    onRefresh: () => void;
    data?: any;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('This field is required'),
    email: Yup.string().required('This field is required'),
    password: Yup.string().required('This field is required'),
    roleId: Yup.string().required('This field is required'),
});

export default function UserSheet(props: UserSheetProps) {
    const { open, onOpenChange, onRefresh, data } = props;
    const isMobile = useIsMobile();

    const { data: resRoles } = useSWR(
        '/api/roles',
        () => axios.get('/api/roles', {params: {sort: DefaultSort.name.value}})
            .then((res) => res.data.data),
        {revalidateOnFocus: false});

    const formik = useFormik({
        initialValues: {
            name: data?.name ?? '',
            email: data?.email ?? '',
            password: data?.password ?? '',
            roleId: data?.roleId ?? '',
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: values => handleSubmit(values)
    });

    const submit = (params: any) => {
        if (data?.id) {
            return axios.patch(`/api/users/${data?.id}`, params)
        }

        return axios.post(`/api/users`, params)
    }

    const handleSubmit = (values: any) => {
        if (resRoles?.find((e: any) => e.id === values.roleId)?.code === 'systemadmin') {
            values.systemAdmin = true;
        }

        return submit(values).then(() => {
            onOpenChange();
            onRefresh();
            formik.resetForm();
        });
    };

    return (
        <Sheet open={open} onOpenChange={() => !formik.isSubmitting ? onOpenChange() : null}>
            <SheetContent
                className="min-h-full lg:min-w-1/3"
                side={isMobile ? 'bottom' : 'right'}>
                <SheetHeader>
                    <SheetTitle>
                        {data ? 'Update' : 'Create'} User
                    </SheetTitle>
                </SheetHeader>

                <div className="p-4 space-y-4">
                    <div className="grid gap-1">
                        <Label>Full name</Label>
                        <Input
                            name="name"
                            onChange={formik.handleChange}
                            value={formik.values.name}/>
                        <InputError message={formik.errors.name}/>
                    </div>
                    <div className="grid gap-1">
                        <Label>Email Address</Label>
                        <Input
                            type="email"
                            name="email"
                            onChange={formik.handleChange}
                            value={formik.values.email}/>
                        <InputError message={formik.errors.email}/>
                    </div>
                    <div className="grid gap-1">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}/>
                        <InputError message={formik.errors.password}/>
                    </div>
                    <div className="grid gap-1">
                        <Label>Role</Label>
                        <Select
                            placeholder="Select role"
                            value={formik.values.roleId}
                            onValueChange={(val: any) => formik.setFieldValue('roleId', val)}>
                            <SelectTrigger className="h-10 bg-white">
                                <SelectValue value={formik.values.roleId}/>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {resRoles?.map((e: any, i: number) => (
                                    <SelectItem
                                        key={i}
                                        value={e.id}
                                        className="rounded-lg"
                                    >
                                        {e.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={formik.errors.roleId}/>
                    </div>
                </div>

                <SheetFooter className="flex-row gap-4">
                    <Button
                        disabled={formik.isSubmitting}
                        className="flex-1"
                        variant="tonal"
                        onClick={onOpenChange}>
                        Cancel
                    </Button>
                    <Button
                        disabled={formik.isSubmitting}
                        className="flex-1"
                        onClick={formik.submitForm}>
                        Save
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
