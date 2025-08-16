import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';
import {typeOf} from "uri-js/dist/esnext/util";

export async function GET(req: any) {
    const { searchParams } = req.nextUrl;
    const params = Object.fromEntries(searchParams.entries());
    const query: any = {};

    if (params.sort) {
        const splitted = params.sort?.split(',');
        query.orderBy = [{[splitted[0]]: splitted[1]}]
    }

    if (params.keyword) {
        query.where = {
            ...query.where,
            name: {
                contains: params.keyword, mode: 'insensitive'
            }
        }
    }

    if (params.type) {
        const types = [
            ...typeOf(params.type) === 'string' ? [params.type] : params.type,
            'general'
        ]
        query.where = {
            ...query.where,
            type: {
                in: types
            }
        }
    }

    const results = await prisma.categories.findMany(query);

    return NextResponse.json({data: results})
}

export async function POST(req: any) {
    const request = await req.json();

    request.categories.forEach((item: { id: string; }) => {
        item.id = uuidv4();
    })

    await prisma.categories.createMany({data: request.categories});

    return NextResponse.json({data: 'Successfully added data'})
}
