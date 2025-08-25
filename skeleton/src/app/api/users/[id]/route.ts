import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: any, {params}: any) {
    const { id } = await params;
    const result = await prisma.users.findFirst({where: {id}});

    return NextResponse.json({data: result})
}

export async function PATCH(req: any, {params}: any) {
    const { id } = await params;
    const request = await req.json();

    if (request?.password) {
        const salt = await bcrypt.genSalt(10);
        request.password = await bcrypt.hash(request.password, salt);
    }

    const result = await prisma.users.update({
        where: { id: id },
        data: request
    });

    return NextResponse.json({data: result})
}

export async function DELETE(req: any, {params}: any) {
    const { id } = await params;

    await prisma.users.delete({where: { id: id }});

    return NextResponse.json({data: 'Successfully deleted data'})
}
