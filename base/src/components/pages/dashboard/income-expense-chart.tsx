"use client"

import {Area, AreaChart, CartesianGrid, XAxis} from "recharts"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {add, endOfMonth, format, startOfMonth, sub} from "date-fns";
import useSWR from "swr";
import axios from "axios";
import {useMemo} from "react";

const chartConfig = {
    income: {
        label: "Income",
        color: "var(--chart-1)",
    },
    expense: {
        label: "Expense",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

export function IncomeExpenseChart() {
    const firstDate = startOfMonth(sub(new Date(), {months: 5}));
    const lastDate = endOfMonth(new Date());

    const { data: resIncomes, isLoading: loadingIncomes } = useSWR(
        '/api/incomes/chart',
        () => axios.get('/api/incomes', {params: {startDate: firstDate, endDate: lastDate}})
            .then((res) => res.data.data),
        {revalidateOnFocus: false});

    const { data: resExpenses, isLoading: loadingExpenses } = useSWR(
        '/api/expenses/chart',
        () => axios.get('/api/expenses', {params: {startDate: firstDate, endDate: lastDate}})
            .then((res) => res.data.data),
        {revalidateOnFocus: false});

    const data = useMemo(() => {
        const data: any = {};
        Array(6).fill('').forEach((e, i) => {
            const key = format(add(firstDate, {months: i}), 'LLLL');
            data[key] = { month: key, income: 0, expense: 0 }
        })

        if (resIncomes && resExpenses) {
            const incomeGroupedWithSum = resIncomes.reduce((result: any, item: any) => {
                const date = new Date(item.date);
                const key = format(date, 'LLLL');

                if (!result[key]) {
                    data[key].income = 0;
                }

                data[key].income += item.amount || 0;

                return data;
            }, {});

            const expenseGroupedWithSum = resExpenses.reduce((result: any, item: any) => {
                const date = new Date(item.date);
                const key = format(date, 'LLLL');

                if (!result[key]) {
                    data[key].expense = 0;
                }

                data[key].expense += item.expense || 0;

                return data;
            }, {});

            return Object.keys(data).map(key => {
                data[key].income = incomeGroupedWithSum[key]?.income ?? 0;
                data[key].expense = expenseGroupedWithSum[key]?.expense ?? 0;

                return data[key];
            });
        }

        return [];
    }, [resIncomes, resExpenses]);

    if (loadingIncomes || loadingExpenses) {
        return (
            <div className="w-full h-[400px] rounded-lg bg-gray-200"/>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Incomes Expenses</CardTitle>
                <CardDescription>
                    Showing income and expense for the last 6 months
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="w-full max-h-[400px]">
                    <AreaChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                            dataKey="income"
                            type="natural"
                            fill="var(--color-primary)"
                            fillOpacity={0.4}
                            stroke="var(--color-primary)"
                            stackId="a"
                        />
                        <Area
                            dataKey="expense"
                            type="natural"
                            fill="var(--color-secondary)"
                            fillOpacity={0.4}
                            stroke="var(--color-secondary)"
                            stackId="b"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
