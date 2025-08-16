'use client'

import {useIsMobile} from "@/hooks/use-mobile";
import {Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {useFormik} from "formik";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import * as React from "react";
import MoneyInput from "@/components/shared/money-input";
import axios from "axios";
import {AccountType} from "@/generated/prisma";

interface AccountSheetProps {
    open: boolean;
    onOpenChange: () => void;
    onRefresh: () => void;
    data?: any;
}

export default function AccountSheet(props: AccountSheetProps) {
    const { open, onOpenChange, onRefresh, data } = props;
    const isMobile = useIsMobile();
    const accountTypes = Object.values(AccountType);

    const formik = useFormik({
        initialValues: {
            name: data?.name ?? '',
            balance: data?.balance ?? null,
            type: data?.type ?? null,
        },
        enableReinitialize: true,
        onSubmit: values => handleSubmit(values)
    });

    const submit = (params: any) => {
        if (data?.id) {
            return axios.patch(`/api/accounts/${data?.id}`, params)
        }

        return axios.post('/api/accounts', params)
    }

    const handleSubmit = async (values: any) => {
        await submit(values);
        onOpenChange();
        onRefresh();
        formik.resetForm();
    };

    return (
        <Sheet open={open} onOpenChange={() => !formik.isSubmitting ? onOpenChange() : null}>
            <SheetContent
                className="min-h-full lg:min-w-1/3"
                side={isMobile ? 'bottom' : 'right'}>
                <SheetHeader>
                    <SheetTitle>
                        {data ? 'Update' : 'Create'} Account
                    </SheetTitle>
                </SheetHeader>

                <div className="p-4 space-y-4">
                    <div className="grid gap-1">
                        <Label>Name</Label>
                        <Input
                            placeholder="Account name"
                            name="name"
                            onChange={formik.handleChange}
                            value={formik.values.name}/>
                    </div>
                    <div className="grid gap-1">
                        <Label>Account Type</Label>
                        <Select
                            placeholder="Select account type"
                            value={formik.values.type}
                            onValueChange={(val: any) => formik.setFieldValue('type', val)}>
                            <SelectTrigger className="h-10 bg-white">
                                <SelectValue value={formik.values.type}/>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {accountTypes?.map((e, i) => (
                                    <SelectItem
                                        key={i}
                                        value={e}
                                        className="rounded-lg"
                                    >
                                        {e.toLowerCase()
                                            .replace(/_/g, ' ')
                                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-1">
                        <Label>Balance</Label>
                        <MoneyInput
                            onChange={(amount) => formik.setFieldValue('balance', amount)}
                            value={formik.values.balance ?? null}/>
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
