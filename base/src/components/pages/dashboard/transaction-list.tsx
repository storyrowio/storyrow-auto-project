import useSWR from "swr";
import axios from "axios";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import {formatCurrencyNumber} from "@/lib/utils";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function TransactionList() {
    const { data: resTransactions, isLoading: loading } = useSWR(
        '/api/transactions',
        () => axios.get('/api/transactions').then((res) => res.data.data),
        {revalidateOnFocus: false});

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="col-span-3 w-full h-20 rounded-lg bg-gray-200"/>
                <div className="col-span-3 w-full h-20 rounded-lg bg-gray-200"/>
                <div className="col-span-3 w-full h-20 rounded-lg bg-gray-200"/>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Transaction</CardTitle>
                <CardDescription>
                    Show recent transactions
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader className="rounded-t-lg">
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {resTransactions?.length > 0 ? resTransactions?.map((e: any, i: number) => (
                                <TableRow key={i}>
                                    <TableCell>{e.title}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="tonal"
                                            color={e.type === 'income' ? 'primary' : 'secondary'}>
                                            {e.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatCurrencyNumber(e.amount.toString())}</TableCell>
                                    <TableCell>{format(e.date, 'eee, dd MMM yyyy')}</TableCell>
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
            </CardContent>
        </Card>
    )
}
