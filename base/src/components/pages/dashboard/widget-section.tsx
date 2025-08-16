'use client'

import useSWR from "swr";
import axios from "axios";
import {Skeleton} from "@/components/ui/skeleton";
import {formatCurrencyNumber} from "@/lib/utils";
import {Card, CardContent} from "@/components/ui/card";
import {endOfMonth, startOfMonth} from "date-fns";

const WidgetCard = ({title, content}: {title: string; content: any}) => {
    return (
        <Card className="h-26 flex items-center justify-start">
            <CardContent className="w-full">
                <p className="font-medium text-gray-500 text-sm">{title}</p>
                <h1 className="text-2xl font-bold">{content}</h1>
            </CardContent>
        </Card>
    )
};

export default function WidgetSection(props: {accounts: object[]; loadingAccounts: boolean}) {
    const { accounts, loadingAccounts } = props;
    const firstDayOfMonth = startOfMonth(new Date());
    const lastDayOfMonth = endOfMonth(new Date());

    const { data: resIncomes, isLoading: loadingIncomes } = useSWR(
        '/api/incomes',
        () => axios.get('/api/incomes', {params: { startDate: firstDayOfMonth, endDate: lastDayOfMonth }}).then((res) => res.data.data),
        {revalidateOnFocus: false});

    const { data: resExpenses, isLoading: loadingExpenses } = useSWR(
        '/api/expenses',
        () => axios.get('/api/expenses', {params: { startDate: firstDayOfMonth, endDate: lastDayOfMonth }}).then((res) => res.data.data),
        {revalidateOnFocus: false});

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {loadingAccounts ? (
                <Skeleton className="w-full h-26 rounded-xl bg-gray-200"/>
            ) : (
                <WidgetCard
                    title="My Balance"
                    content={<>
                        <span className="text-gray-700 text-xl font-medium">IDR </span>
                        {accounts?.length > 0 && formatCurrencyNumber(accounts?.reduce((n: any, {balance}: any) =>
                            n + balance, 0).toString())}
                    </>}/>
            )}
            {/*<WidgetCard*/}
            {/*    title="Investment"*/}
            {/*    content={<>*/}
            {/*        <span className="text-gray-700 text-xl font-medium">IDR </span>*/}
            {/*        {accounts?.length > 0 && formatCurrencyNumber(accounts?.reduce((n: any, {balance}: any) =>*/}
            {/*            n + balance, 0).toString())}*/}
            {/*    </>}/>*/}
            {loadingIncomes ? (
                <Skeleton className="w-full h-26 rounded-xl bg-gray-200"/>
            ) : (
                <WidgetCard
                    title="Monthly Income"
                    content={<>
                        <span className="text-gray-700 text-xl font-medium">IDR </span>
                        {resIncomes?.length > 0 ? formatCurrencyNumber(resIncomes?.reduce((n: any, {balance}: any) =>
                            n + balance, 0).toString()) : 0}
                    </>}/>
            )}
            {loadingExpenses ? (
                <Skeleton className="w-full h-26 rounded-xl bg-gray-200"/>
            ) : (
                <WidgetCard
                    title="Monthly Expense"
                    content={<>
                        <span className="text-gray-700 text-xl font-medium">IDR </span>
                        {resExpenses?.length > 0 ? formatCurrencyNumber(resExpenses?.reduce((n: any, {balance}: any) =>
                            n + balance, 0).toString()) : 0}
                    </>}/>
            )}
        </div>
    )
}
