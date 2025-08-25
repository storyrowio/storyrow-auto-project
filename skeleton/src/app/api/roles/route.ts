import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';
import {auth} from "@/auth";
import bcrypt from "bcryptjs";

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
            OR: [
                {name: {contains: params.keyword, mode: 'insensitive'}},
                {code: {contains: params.keyword, mode: 'insensitive'}}
            ]
        }
    }

    const results = await prisma.roles.findMany(query);

    return NextResponse.json({data: results})
}

export async function POST(req: any) {
    const request = await req.json();
    request.id = uuidv4();

    if (request?.password) {
        const salt = await bcrypt.genSalt(10);
        request.password = await bcrypt.hash(request.password, salt);
    }

    const result = await prisma.roles.create({ data: request });
    if (!result) {
        return NextResponse.json({error: 'Create user failed.'});
    }

    await prisma.roles.create({data: request});

    return NextResponse.json({data: 'Successfully added data'})
}
