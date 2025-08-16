import NextAuth from "next-auth";
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

const TOKEN_EXPIRY = 60 * 60 * 24 * 7;

export const authConfig = {
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: '/auth/login',
        error: '/auth/login'
    },
    providers: [
        Google,
        CredentialsProvider({
            type: "credentials",
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const response = await axios.post(`${process.env.AUTH_URL}/api/auth/login`, {
                    email: credentials.email,
                    password: credentials.password
                });

                if (response.status === 200) {
                    return response.data.data;
                }

                return null;
            }
        }),
    ],
    callbacks: {
        async signIn({ account, profile, user }: any) {
            if (account.provider === 'google') {
                const params = {
                    name: profile.name,
                    email: profile.email,
                    socialId: account?.providerAccountId,
                    socialProvider: account?.provider,
                    image: profile?.image
                };
                const userRole = await prisma.roles.findFirst({where: {code: 'user'}});
                if (!userRole) {
                    return null;
                }

                let resUser = await prisma.users.findFirst({where: {email: profile?.email}});
                if (!resUser) {
                    const params = {
                        id: uuidv4(),
                        roleId: userRole.id,
                        name: profile.name,
                        email: profile.email,
                        socialId: account?.providerAccountId,
                        socialProvider: account?.provider
                    };
                    resUser = await prisma.users.create({data: params});
                }
                user.id = resUser.id;
                user.email = resUser.email;
                user.name = resUser.name;
                user.systemAdmin = resUser.systemAdmin;
                if (resUser.image) user.image = resUser.image;

                return user;
            } else if (account.provider === 'credentials') {
                return user;
            }
        },
        async jwt({ token, user }: any) {
            console.log('Get User', user)
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.systemAdmin = user.systemAdmin;
                if (user.image) token.picture = user.image;
                if (user.role) token.role = user.role;
            }
            console.log('Token Returned', token);
            return token;
        },
        async session({ session, token }: any) {
            console.log('Get Token', token);
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.email = token.email;
            session.user.email = token.email;
            session.token = token.accessToken;

            return session;
        },
        async redirect({ baseUrl}: any) {
            return `${baseUrl}/app`;
        }
    },
    debug: process.env.NODE_ENV === "development",
};

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    session: {
        strategy: "jwt",
        maxAge: TOKEN_EXPIRY,
    },
});
