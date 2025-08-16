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
        query.where = {
            ...query.where,
            name: {
                contains: params.keyword, mode: 'insensitive'
            }
        }
    }

    if (params.type && params.type !== 'all') {
        query.where = {
            ...query.where,
            type: params.type
        }
    }

    const results = await prisma.accounts.findMany(query);

    return NextResponse.json({data: results})
}

export async function POST(req: any) {
    const session = await auth();

    const request = await req.json();
    request.id = uuidv4();
    request.userId = session?.user?.id;

    await prisma.accounts.create({data: request});

    return NextResponse.json({data: 'Successfully added data'})
}
