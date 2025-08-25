import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: any, {params}: any) {
    const { id } = await params;
    const result = await prisma.roles.findFirst({where: {id}});

    return NextResponse.json({data: result})
}

export async function PATCH(req: any, {params}: any) {
    const { id } = await params;
    const request = await req.json();

    const result = await prisma.roles.update({
        where: { id: id },
        data: request
    });

    return NextResponse.json({data: result})
}

export async function DELETE(req: any, {params}: any) {
    const { id } = await params;

    await prisma.roles.delete({where: { id: id }});

    return NextResponse.json({data: 'Successfully deleted data'})
}
