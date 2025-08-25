import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs";

export async function GET(req: any) {
    const { searchParams } = req.nextUrl;
    const params = Object.fromEntries(searchParams.entries());
    const { page = '1', limit = '10' } = params;
    const query: any = {
        omit: { password: true },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
    };

    if (params.sort) {
        const splitted = params.sort?.split(',');
        query.orderBy = [{[splitted[0]]: splitted[1]}]
    }

    if (params.keyword) {
        query.where = {
            ...query.where,
            OR: [
                {name: {contains: params.keyword, mode: 'insensitive'}},
                {email: {contains: params.keyword, mode: 'insensitive'}}
            ]
        }
    }

    const [users, total] = await Promise.all([
        prisma.users.findMany(query),
        prisma.users.count(),
    ]);

    for (const item of users) {
        item.role = await prisma.roles.findFirst({where: {id: item.roleId}});
    }

    const pagination = {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPage: Math.ceil(total / limit),
    }

    return NextResponse.json({data: users, pagination})
}

export async function POST(req: any) {
    const request = await req.json();

    const user = await prisma.users.findFirst({where: {email: request.email}});
    if (user) {
        return NextResponse.json({error: 'Email already exist.'});
    }

    request.id = uuidv4();

    if (request?.password) {
        const salt = await bcrypt.genSalt(10);
        request.password = await bcrypt.hash(request.password, salt);
    }

    const result = await prisma.users.create({ data: request });
    if (!result) {
        return NextResponse.json({error: 'Create user failed.'});
    }

    return NextResponse.json({data: 'Successfully added data'})
}
