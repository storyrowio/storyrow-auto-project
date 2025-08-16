import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
    const resRole = await prisma.roles.findFirst();
    if (!resRole) {
        const roles = [
            { id: 'f8d4c878-2831-40b1-a8d2-841d585fd2f9', name: 'System Admin', code: 'systemadmin' },
            { id: 'aed467ae-1c1c-4238-8064-96e7caf2757a', name: 'User', code: 'user' },
        ];
        await prisma.roles.createMany({data: roles}).then(() => console.log('Default roles created'));
    }

    const resUser = await prisma.users.findFirst();
    if (!resUser) {
        const users = [
            {
                id: 'd514e754-652f-49e4-9a5d-fc0edf299dc9',
                roleId: 'f8d4c878-2831-40b1-a8d2-841d585fd2f9',
                name: 'Admin Peniato',
                email: 'admin@example.com',
                password: 'admin',
                systemAdmin: true
            },
            {
                id: 'e07b6fef-2ab3-4344-891f-36bc068c2d85',
                roleId: 'aed467ae-1c1c-4238-8064-96e7caf2757a',
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'johndoe'
            }
        ];

        for (const item of users) {
            item.password = await bcrypt.hash(item.password, 10);
        }

        await prisma.users.createMany({data: users}).then(() => console.log('Default users created'));
    }

    return NextResponse.json({data: 'Successfully added default data'})
}
