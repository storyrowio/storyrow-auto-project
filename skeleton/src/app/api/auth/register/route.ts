import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: any) {
    const request = await req.json();

    const userRole = await prisma.roles.findFirst({where: {code: 'user'}});
    if (!userRole) {
        return NextResponse.json({error: 'Something wrong with our server!'});
    }

    if (!request.socialId && !request.password) {
        return NextResponse.json({error: 'Password is required'});
    }

    request.id = uuidv4();
    request.roleId = userRole?.id;

    if (request?.password) {
        const salt = await bcrypt.genSalt(10);
        request.password = await bcrypt.hash(request.password, salt);
    }
    const result = await prisma.users.create({ data: request });

    if (!result) {
        return NextResponse.json({error: 'Register failed.'});
    }

    return NextResponse.json({data: 'Success'});
}
