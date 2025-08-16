import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import {v4 as uuidv4} from "uuid";

export async function POST(req: any) {
    const request = await req.json();

    if (!request.socialId && !request.password) {
        return NextResponse.json({error: 'Password is required'});
    }

    let user = await prisma.users.findFirst({where: {email: request?.email}});
    if (!user) {
        if (request.socialId) {
            const userRole = await prisma.roles.findFirst({where: {code: 'user'}});
            if (!userRole) {
                return null;
            }

            request.id = uuidv4();
            request.roleId = userRole.id;
            request.systemAdmin = false;

            user = await prisma.users.create({data: request});

            return NextResponse.json({data: user});
        }

        return NextResponse.json({error: 'Invalid Credentials.'});
    }

    if (request?.password) {
        const checkPassword = await bcrypt.compare(request?.password, user.password);
        if (!checkPassword) {
            return NextResponse.json({error: 'Invalid Credentials.'});
        }
    }

    const role = await prisma.roles.findFirst({where: {id: user.roleId}});

    const result = {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        systemAdmin: user?.systemAdmin,
        ...role && {
            id: role?.id,
            name: role?.name,
            code: role?.code
        },
        ...user?.image && {
            image: user?.image
        }
    }

    return NextResponse.json({data: result});
}
