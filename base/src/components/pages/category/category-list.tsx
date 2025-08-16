'use client'

import {CategoryTypes, DefaultSort, SortKey} from "@/constants/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {Edit, Filter, Plus, Trash, X} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {useIsMobile} from "@/hooks/use-mobile";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Label} from "@/components/ui/label";
import {useBreadcrumbs} from "@/hooks/use-breadcrumbs";
import {
    Sidebar,
    SidebarHeader,
} from "@/components/ui/sidebar";
import CategoryForm from "@/components/pages/category/category-form";
import {Skeleton} from "@/components/ui/skeleton";
import InputAdornments from "@/components/ui/input-adornments";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";

export default function CategoryList() {
    const isMobile = useIsMobile();
    const router = useRouter();
    const [filter, setFilter] = useState<any>({sort: DefaultSort.newest.value});
    const [filterOpen, setFilterOpen] = useState(false);
    const [formDialog, setFormDialog] = useState({open: false, data: null});
    const [deleteConfirm, setDeleteConfirm] = useState({open: false, data: null});

    const { data: resData, isLoading: loading, mutate } = useSWR(
        [filter, '/api/categories'],
        () => axios.get('/api/categories', {params: filter}).then(res => res.data),
        {revalidateOnFocus: false});

    useBreadcrumbs([
        { title: 'Categories', href: '/app/categories'}
    ]);

    const SelectSort = () => {
        return (
            <Select value={filter.sort} onValueChange={(val: any) => setFilter({...filter, sort: val})}>
                <SelectTrigger className="w-full rounded-lg sm:ml-auto">
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
        )
    };

    const FilterMobile = () => {
        return (
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="relative inline-block cursor-pointer items-center justify-center bg-none"
                        onClick={(e) => {
                            e.stopPropagation()
                            setFilterOpen(!filterOpen)
                        }}>
                        <Filter className="size-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="min-w-screen px-4 space-y-4">
                    <div>
                        <Label>Sort By</Label>
                        <SelectSort/>
                    </div>
                    <div>
                        <Label>Category Type</Label>
                        <Select
                            value={filter.type}
                            onValueChange={(val: any) => setFilter({...filter, type: val})}>
                            <SelectTrigger className="w-full rounded-lg sm:ml-auto">
                                <SelectValue placeholder="Last 3 months" value={filter.type}/>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {CategoryTypes.map((e, i) => (
                                    <SelectItem key={i} value={e.value} className="rounded-lg">
                                        {e.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </PopoverContent>
            </Popover>
        )
    };

    const handleDelete = () => {
        return axios.delete(`/api/blog/post/${deleteConfirm?.data}`)
            .then(res => {
                mutate();
            });
    };

    return (
        <>
            <main className="px-4 lg:px-8 py-6">
                <div className="mb-6 flex justify-between gap-4">
                    <div className="flex gap-4">
                        {isMobile ? (
                            <FilterMobile/>
                        ) : (
                            <>
                                <ToggleGroup variant="outline" type="single" onValueChange={(val) => setFilter({...filter, type: val})}>
                                    {CategoryTypes.map((e, i) => (
                                        <ToggleGroupItem key={i} value={e.value}>
                                            {e.name}
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            </>
                        )}
                        <InputAdornments
                            className="w-full"
                            placeholder="Search here ..."
                            onChange={(e: any) => setFilter({...filter, keyword: e.target.value})}
                            value={filter.keyword}
                            suffix={filter.keyword !== '' && filter.keyword && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="hover:bg-transparent"
                                    onClick={() => setFilter({...filter, keyword: ''})}>
                                    <X className="size-4"/>
                                </Button>
                            )}/>
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={() => setFormDialog({open: true, data: null})}>
                            <Plus/>
                            {!isMobile && 'Add Data'}
                        </Button>
                    </div>
                </div>

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
                                    <TableHead>Type</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Option</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resData?.data?.length > 0 ? resData?.data?.map((e: any, i: number) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Badge
                                                variant="tonal"
                                                color={e.type === 'income' ? 'secondary' : e.type === 'general' ? 'default' : 'primary'}>
                                                {e.type === 'income' ? 'Income' : e.type === 'general' ? 'General' : 'Expense'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{e.name}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                className="bg-secondary-500/20 hover:bg-secondary-500/25 mr-2" size="icon"
                                                onClick={() => router.push(`/app/blog/post/${e.id}/update`)}>
                                                <Edit className="text-secondary-700"/>
                                            </Button>
                                            <Button
                                                className="bg-destructive/10 hover:bg-destructive/15" size="icon"
                                                onClick={() => setDeleteConfirm({open: true, data: e.id})}>
                                                <Trash className="text-destructive"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-gray-500 font-semibold">
                                            No Data
                                        </TableCell>
                                    </TableRow>
                                )}

                            </TableBody>
                        </Table>
                    </div>
                )}

                <DeleteConfirmation
                    open={deleteConfirm?.open}
                    onClose={() => setDeleteConfirm({open: false, data: null})}
                    onSubmit={handleDelete}/>
            </main>

            <Sidebar
                side="right"
                collapsible="offcanvas"
                className="min-w-full lg:min-w-[500px]"
                open={formDialog.open}
                onOpenChange={() => setFormDialog({open: false, data: null})}>
                <SidebarHeader className="px-4 pt-6 font-medium">
                    {formDialog.data ? 'Update Category' : 'Create Category'}
                </SidebarHeader>

                <CategoryForm
                    data={formDialog.data}
                    onRefresh={mutate}
                    onClose={() => setFormDialog({open: false, data: null})}/>
            </Sidebar>
        </>
    )
}
