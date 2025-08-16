import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: any) {
    const body = await req.json();

    if (!body.socialId && !body.password) {
        return NextResponse.json({error: 'Password is required'});
    }

    if (body?.password) {
        const salt = await bcrypt.genSalt(10);
        body.password = await bcrypt.hash(body.password, salt);
    }

    const result = prisma.users.create({ data: body });
    if (!result) {
        return NextResponse.json({error: 'Register failed.'});
    }

    return NextResponse.json({data: 'Success'});
}
