'use client'

import {useIsMobile} from "@/hooks/use-mobile";
import {Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
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

interface TransactionSheetProps {
    open: boolean;
    onOpenChange: () => void;
    onRefresh: () => void;
    type: string;
    data?: any;
    categories: any[];
}

export default function TransactionSheet(props: TransactionSheetProps) {
    const { open, onOpenChange, onRefresh, type, data, categories } = props;
    const isMobile = useIsMobile();

    const { data: resAccounts } = useSWR(
        '/api/accounts',
        () => axios.get('/api/accounts', {params: {sort: DefaultSort.name.value}})
            .then((res) => res.data.data),
        {revalidateOnFocus: false});

    const formik = useFormik({
        initialValues: {
            title: data?.title ?? '',
            amount: data?.amount ?? null,
            description: data?.description ?? '',
            categoryId: data?.categoryId ?? null,
            accountId: data?.accountId ?? null,
            date: data?.date ?? null,
            recurring: data?.reccuring ?? false
        },
        enableReinitialize: true,
        onSubmit: values => handleSubmit(values)
    });

    const submit = (params: any) => {
        const endpoint = type === 'income' ? 'incomes' : 'expenses';
        if (data?.id) {
            return axios.patch(`/api/${endpoint}/${data?.id}`, params)
        }

        return axios.post(`/api/${endpoint}`, params)
    }

    const handleSubmit = (values: any) => {
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
                        {data ? 'Update' : 'Create'} {type === 'income' ? 'Income' : 'Expense'}
                    </SheetTitle>
                </SheetHeader>

                <div className="p-4 space-y-4">
                    <div className="grid gap-1">
                        <Label>Title</Label>
                        <Input
                            name="title"
                            onChange={formik.handleChange}
                            value={formik.values.title}/>
                    </div>
                    <div className="grid gap-1">
                        <Label>Amount</Label>
                        <MoneyInput
                            onChange={(amount) => formik.setFieldValue('amount', amount)}
                            value={formik.values.amount ?? null}/>
                    </div>
                    <div className="grid gap-1">
                        <Label>Description</Label>
                        <Textarea
                            rows={4}
                            name="description"
                            onChange={formik.handleChange}
                            value={formik.values.description}/>
                    </div>
                    <div className="grid gap-1">
                        <Label>Date</Label>
                        <DatePicker
                            buttonClassName="w-full"
                            defaultValue={formik.values.date ?? null}
                            onChange={(date) => formik.setFieldValue('date', date)}/>
                    </div>
                    <div className="grid gap-1">
                        <Label>Category</Label>
                        <Select
                            placeholder="Select category"
                            value={formik.values.categoryId}
                            onValueChange={(val: any) => formik.setFieldValue('categoryId', val)}>
                            <SelectTrigger className="h-10 bg-white">
                                <SelectValue value={formik.values.categoryId}/>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {categories?.map((e, i) => (
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
                    </div>
                    <div className="grid gap-1">
                        <Label>Account</Label>
                        <Select
                            placeholder="Select account"
                            value={formik.values.accountId}
                            onValueChange={(val: any) => formik.setFieldValue('accountId', val)}>
                            <SelectTrigger className="h-10 bg-white">
                                <SelectValue value={formik.values.accountId}/>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {resAccounts?.map((e: any, i: number) => (
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
