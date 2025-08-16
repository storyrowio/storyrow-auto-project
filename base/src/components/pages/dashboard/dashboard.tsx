'use client'

import {useBreadcrumbs} from "@/hooks/use-breadcrumbs";
import WidgetSection from "@/components/pages/dashboard/widget-section";
import useSWR from "swr";
import axios from "axios";
import AccountSection from "@/components/pages/dashboard/account-section";
import {IncomeExpenseChart} from "@/components/pages/dashboard/income-expense-chart";
import TransactionList from "@/components/pages/dashboard/transaction-list";

export default function Dashboard() {
    useBreadcrumbs([
        { title: 'Dashboard', href: '/app' }
    ]);

    const { data: resAccounts, isLoading: loadingAccounts } = useSWR(
        '/api/accounts',
        () => axios.get('/api/accounts', {params: { sort: 'balance,desc' }}).then((res) => res.data.data),
        {revalidateOnFocus: false});

    return (
        <main className="px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <section className="col-span-3 lg:col-span-2 space-y-4">
                <WidgetSection accounts={resAccounts} loadingAccounts={loadingAccounts}/>
                <IncomeExpenseChart/>
            </section>
            <section className="sm:my-4">
                <AccountSection accounts={resAccounts} loadingAccounts={loadingAccounts}/>
            </section>
            <section className="col-span-3">
                <TransactionList/>
            </section>
        </main>
    )
}
