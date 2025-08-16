import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';
import {typeOf} from "uri-js/dist/esnext/util";
import {auth} from "@/auth";

export async function GET(req: any) {
    const session = await auth();
    const { searchParams } = req.nextUrl;
    const params = Object.fromEntries(searchParams.entries());
    const query: any = {
        where: {
            userId: session?.user?.id
        }
    };

    if (params.sort) {
        const splitted = params.sort?.split(',');
        query.orderBy = [{[splitted[0]]: splitted[1]}]
    }

    if (params.keyword) {
        query.where = { ...query.where, name: { contains: params.keyword, mode: 'insensitive' } }
    }

    if (params.type) {
        query.where = {...query.where, type: { in: typeOf(params.type) === 'string' ? [params.type] : params.type } }
    }

    if (params.category) {
        query.where = {
            ...query.where,
            categoryId: params.category
        }
    }

    if (params.startDate && params.endDate) {
        query.where = {
            ...query.where,
            date: {
                gte: new Date(params.startDate), // startDate as string or Date
                lte: new Date(params.endDate),   // endDate as string or Date
            }
        }
    }

    const results = await prisma.incomes.findMany(query);

    for (const item of results) {
        item.category = await prisma.categories.findFirst({where: {id: item.categoryId}});
    }

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
