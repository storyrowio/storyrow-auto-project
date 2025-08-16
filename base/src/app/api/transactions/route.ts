import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';
import {typeOf} from "uri-js/dist/esnext/util";
import {auth} from "@/auth";

export async function GET() {
    const session = await auth();
    const query: any = {
        where: { userId: session?.user?.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
    };

    let incomes = await prisma.incomes.findMany(query);
    incomes = incomes.map((e: any) => ({...e, type: 'income'}));

    let expenses = await prisma.expenses.findMany(query);
    expenses = expenses.map((e: any) => ({...e, type: 'expense'}));

    const results = [...incomes, ...expenses];
    results.sort((a, b) => {
        const dateA: any = new Date(a.date);
        const dateB: any = new Date(b.date);
        return dateA - dateB;
    });

    return NextResponse.json({data: results})
}

export async function POST(req: any) {
    const session = await auth();

    const request = await req.json();
    request.id = uuidv4();
    request.userId = session?.user?.id;

    await prisma.incomes.create({data: request});

    return NextResponse.json({data: 'Successfully added data'})
}
