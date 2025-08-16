import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: any, {params}: any) {
    const { id } = await params;
    const result = await prisma.incomes.findFirst({where: {id}});

    return NextResponse.json(result)
}

export async function PATCH(req: any, {params}: any) {
    const { id } = await params;
    const request = await req.json();

    const result = await prisma.incomes.update({
        where: { id: id },
        data: request
    });

    return NextResponse.json(result)
}
