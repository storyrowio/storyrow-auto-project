import NextAuth, {NextAuthConfig} from "next-auth";
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const TOKEN_EXPIRY = 60 * 60 * 24 * 7;

export const authConfig: NextAuthConfig = {
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: '/auth/login',
        error: '/auth/login'
    },
    session: {
        strategy: "jwt",
        maxAge: TOKEN_EXPIRY,
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
            async authorize(credentials: any) {
                const response = await axios.post(`${process.env.AUTH_URL}/api/auth/login`, {
                    email: credentials.email,
                    password: credentials.password
                });

                if (response.status === 200) {
                    // console.log('Response from api', response.data.data);
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
                    image: profile?.image,
                    socialId: account?.providerAccountId,
                    socialProvider: account?.provider
                };

                const response = await axios.post(`${process.env.AUTH_URL}/api/auth/login`, params);
                if (response.status === 200) {
                    const resUser = response.data.data;
                    // console.log('Response from api', response.data.data);
                    user.id = resUser.id;
                    user.email = resUser.email;
                    user.name = resUser.name;
                    user.systemAdmin = resUser.systemAdmin;
                    if (resUser.image) user.image = resUser.image;

                    return user;
                }

                return null
            } else if (account.provider === 'credentials') {
                return user;
            }
        },
        async jwt({ token, user }: any) {
            // console.log('Get User', user)
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.systemAdmin = user.systemAdmin;
                if (user.image) token.picture = user.image;
                if (user.role) token.role = user.role;
            }
            // console.log('Token Returned', token);
            return token;
        },
        async session({ session, token }: any) {
            // console.log('Get Token', token);
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.systemAdmin = token.systemAdmin;
            if (token.role) session.user.role = token.role;
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
} = NextAuth(authConfig);
