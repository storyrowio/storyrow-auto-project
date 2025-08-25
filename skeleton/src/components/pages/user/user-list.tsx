'use client'

import {useIsMobile} from "@/hooks/use-mobile";
import {useEffect, useState} from "react";
import {DefaultSort, SortKey} from "@/constants/constants";
import useSWR from "swr";
import axios from "axios";
import {useBreadcrumbs} from "@/hooks/use-breadcrumbs";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight, Edit, Filter, Plus, Trash} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import {ListFilter} from "@/types";
import FilterTable from "@/components/shared/filter-table";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Skeleton} from "@/components/ui/skeleton";
import UserSheet from "@/components/pages/user/user-sheet";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination";

export default function UserList() {
    const isMobile = useIsMobile();
    const [filter, setFilter] = useState<ListFilter>({
        sort: DefaultSort.newest.value
    });
    const [filterOpen, setFilterOpen] = useState(false);
    const [formDialog, setFormDialog] = useState({open: false, data: null});
    const [deleteConfirm, setDeleteConfirm] = useState({open: false, id: null});

    useEffect(() => {
        if (isMobile !== null && !isMobile) {
            setFilterOpen(true);
        }
    }, [isMobile]);

    const { data: resData, isLoading: loading, mutate } = useSWR(
        [filter, '/api/users'],
        () => axios.get('/api/users', {params: filter}).then((res) => res.data),
        {revalidateOnFocus: false});

    useBreadcrumbs([
        { title: 'Users', href: '/app/users'}
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

    const roleBadge = (role: any) => {
        switch (role.code) {
            case 'systemadmin': {
                return {color: 'primary'};
            }
            case 'user': {
                return {className: 'bg-pink-500/15 text-pink-700'}
            }
            default:
                return {label: 'Other', color: 'default'};
        }
    }

    const handleDelete = () => {
        return axios.delete(`/api/users/${deleteConfirm.id}`)
            .then(() => {
                setDeleteConfirm({open: false, id: null})
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
                <>
                    <div className="overflow-hidden rounded-lg border shadow-sm">
                        <Table>
                            <TableHeader className="rounded-t-lg">
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right">Option</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resData?.data?.length > 0 ? resData?.data?.map((e: any, i: number) => (
                                    <TableRow key={i}>
                                        <TableCell>{e.name}</TableCell>
                                        <TableCell className="font-medium">
                                            {e.email}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="tonal"
                                                color={roleBadge(e.role).color}
                                                className={roleBadge(e.role).className}>
                                                {e.role?.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                className="bg-secondary-500/20 hover:bg-secondary-500/25 mr-2" size="icon"
                                                onClick={() => setFormDialog({open: true, data: e})}>
                                                <Edit className="text-secondary-700"/>
                                            </Button>
                                            <Button
                                                className="bg-destructive/10 hover:bg-destructive/15 mr-2" size="icon"
                                                onClick={() => setDeleteConfirm({open: true, id: e.id})}>
                                                <Trash className="text-destructive"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4
                                        } className="text-center text-gray-500 font-semibold">
                                            No Data
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <Pagination className="mt-8">
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    disabled={resData?.pagination?.page === 1}
                                    variant="ghost"
                                    onClick={() => setFilter({...filter, page: resData?.pagination?.page - 1})}>
                                    <ChevronLeft/>
                                </Button>
                            </PaginationItem>
                            {Array(resData?.pagination?.totalPage).fill('').map((e, i) => {
                                const activePage = resData?.pagination?.page;

                                return (
                                    <PaginationItem key={i}>
                                        <Button
                                            className="px-3.25"
                                            variant={activePage === i + 1 ? 'outline' : 'ghost'}
                                            onClick={() => setFilter({...filter, page: i + 1})}>
                                            {i + 1}
                                        </Button>
                                    </PaginationItem>
                                )
                            })}
                            <PaginationItem>
                                <Button
                                    disabled={resData?.pagination?.page === resData?.pagination?.totalPage}
                                    variant="ghost"
                                    onClick={() => setFilter({...filter, page: resData?.pagination?.page - 1})}>
                                    <ChevronRight/>
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}

            <UserSheet
                data={formDialog.data}
                open={formDialog.open}
                onOpenChange={() => setFormDialog({open: false, data: null})}
                onRefresh={mutate}/>

            <DeleteConfirmation
                open={deleteConfirm?.open}
                onClose={() => setDeleteConfirm({open: false, id: null})}
                onSubmit={handleDelete}/>
        </main>
    )
}
