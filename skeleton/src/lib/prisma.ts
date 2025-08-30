import {PrismaClient} from "@/generated/prisma";

const globalForPrisma = globalThis;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const prisma = globalForPrisma.prisma || new PrismaClient();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
if (process.env.NODE_ENV !== 'production') { // @ts-expect-error
    globalForPrisma.prisma = prisma;
}

export default prisma;
