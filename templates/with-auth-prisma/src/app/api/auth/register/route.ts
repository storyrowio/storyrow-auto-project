import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import {v4 as uuidv4} from "uuid";

export async function POST(req: any) {
    const request = await req.json();

    if (!request.socialId && !request.password) {
        return NextResponse.json({error: 'Password is required'});
    }

    const user = await prisma.users.findFirst({where: {email: request.email}});
    if (user) {
        return NextResponse.json({error: 'Email already exist'});
    }

    const userRole = await prisma.roles.findFirst({where: {code: 'user'}});
    if (!userRole) {
        return NextResponse.json({error: 'Role does not exist'});
    }

    request.id = uuidv4();
    request.roleId = userRole.id;
    request.systemAdmin = false;

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
