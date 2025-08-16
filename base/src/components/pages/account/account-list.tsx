'use client'

import {useIsMobile} from "@/hooks/use-mobile";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {DefaultSort, SortKey} from "@/constants/constants";
import useSWR from "swr";
import axios from "axios";
import {useBreadcrumbs} from "@/hooks/use-breadcrumbs";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Edit, Filter, Plus, Trash} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import {ListFilter} from "@/types";
import FilterTable from "@/components/shared/filter-table";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Skeleton} from "@/components/ui/skeleton";
import AccountSheet from "@/components/pages/account/account-sheet";
import {$Enums} from "@/generated/prisma";
import AccountType = $Enums.AccountType;
import {formatCurrencyNumber} from "@/lib/utils";

export default function AccountList() {
    const isMobile = useIsMobile();
    const router = useRouter();
    const accountTypes = Object.values(AccountType);

    const [filter, setFilter] = useState<ListFilter>({sort: DefaultSort.newest.value});
    const [filterOpen, setFilterOpen] = useState(false);
    const [formDialog, setFormDialog] = useState({open: false, data: null});
    const [deleteConfirm, setDeleteConfirm] = useState({open: false, data: null});

    useEffect(() => {
        if (isMobile !== null && !isMobile) {
            setFilterOpen(true);
        }
    }, [isMobile]);

    const { data: resData, isLoading: loading, mutate } = useSWR(
        [filter, '/api/accounts'],
        () => axios.get('/api/accounts', {params: filter}).then((res) => res.data),
        {revalidateOnFocus: false});

    useBreadcrumbs([
        { title: 'Accounts', href: '/app/accounts'}
    ]);

    const ContentFilter = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <Label>Sort By</Label>
                    <Select value={filter.sort} onValueChange={(val: any) => setFilter({...filter, sort: val})}>
                        <SelectTrigger className="h-10 bg-white">
                            <SelectValue placeholder="Last 3 months" value={filter.sort}/>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {(Object.keys(DefaultSort) as SortKey[]).map((key) => (
                                <SelectItem
                                    key={key}
                                    value={DefaultSort[key].value}
                                    className="rounded-lg"
                                >
                                    {DefaultSort[key].name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Account Type</Label>
                    <Select
                        value={filter.type}
                        onValueChange={(val: any) => setFilter({...filter, type: val})}>
                        <SelectTrigger className="h-10 bg-white">
                            <SelectValue placeholder="Select account type" value={filter.type}/>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">All Type</SelectItem>
                            {accountTypes?.map((e: any, i: number) => (
                                <SelectItem key={i} value={e}>
                                    {e}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        );
    }

    const FilterDesktop = () => {
        return (
            <>
                <FilterTable
                    open={filterOpen}
                    onOpenChange={() => setFilterOpen(!filterOpen)}
                    className="mt-2">
                    <ContentFilter/>
                </FilterTable>
            </>
        )
    };

    const FilterMobile = () => {
        return (
            <Sheet open={filterOpen} onOpenChange={() => setFilterOpen(!filterOpen)}>
                <SheetContent side="bottom">
                    <SheetHeader>
                        <SheetTitle>Filter</SheetTitle>
                        <SheetDescription className="pt-6 pb-4">
                            <ContentFilter/>
                            <Button className="w-full mt-6">
                                Search
                            </Button>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        )
    };

    const accountTypeBadge = (type: string) => {
        switch (type) {
            case AccountType.BANK: {
                return {label: 'Bank', color: 'primary'};
            }
            case AccountType.CASH: {
                return {label: 'Cash', className: 'bg-green-500/15 text-green-700'}
            }
            case AccountType.E_WALLET: {
                return {label: 'E-Wallet', className: 'bg-pink-500/15 text-pink-700'}
            }
            case AccountType.CRYPTO: {
                return {label: 'Crypto', className: 'bg-amber-500/15 text-amber-700'}
            }
            default:
                return {label: 'Other', color: 'default'};
        }
    }

    const handleDelete = () => {
        return axios.delete(`/api/blog/post/${deleteConfirm?.data}`)
            .then(() => {
                mutate();
            });
    };

    return (
        <main className="px-4 lg:px-8 py-6">
            <div className="flex gap-4">
                <Input
                    className="flex-1"
                    placeholder="Search here ..."
                    onChange={(e) => setFilter({...filter, keyword: e.target.value})}/>
                <Button
                    variant="outline"
                    onClick={() => setFilterOpen(!filterOpen)}>
                    <Filter/>
                    {!isMobile && 'Filter'}
                </Button>
                <Button onClick={() => setFormDialog({open: true, data: null})}>
                    <Plus/>
                    {!isMobile && 'Add Data'}
                </Button>
            </div>

            {isMobile ? (
                <FilterMobile/>
            ) : (
                <FilterDesktop/>
            )}
            <div className="h-8"/>
            {loading ? (
                <div className="space-y-4">
                    {Array(10).fill('').map((e, i) => (
                        <Skeleton key={i} className="w-full h-14 bg-gray-100 rounded-md"/>
                    ))}
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border shadow-sm">
                    <Table>
                        <TableHeader className="rounded-t-lg">
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Balance</TableHead>
                                <TableHead className="text-right">Option</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {resData?.data?.length > 0 ? resData?.data?.map((e: any, i: number) => (
                                <TableRow key={i}>
                                    <TableCell>{e.name}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={accountTypeBadge(e.type).className}
                                            color={accountTypeBadge(e.type).color ?? 'default'}
                                            variant="tonal">
                                            {accountTypeBadge(e.type).label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        <span className="text-xs text-gray-500">IDR</span> {formatCurrencyNumber(e.balance.toString())}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            className="bg-secondary-500/20 hover:bg-secondary-500/25 mr-2" size="icon"
                                            onClick={() => setFormDialog({open: true, data: e})}>
                                            <Edit className="text-secondary-700"/>
                                        </Button>
                                        <Button
                                            className="bg-destructive/10 hover:bg-destructive/15 mr-2" size="icon"
                                            onClick={() => setDeleteConfirm({open: true, data: e.id})}>
                                            <Trash className="text-destructive"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-gray-500 font-semibold">
                                        No Data
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            <AccountSheet
                data={formDialog.data}
                open={formDialog.open}
                onOpenChange={() => setFormDialog({open: false, data: null})}
                onRefresh={mutate}/>

            <DeleteConfirmation
                open={deleteConfirm?.open}
                onClose={() => setDeleteConfirm({open: false, data: null})}
                onSubmit={handleDelete}/>
        </main>
    )
}
