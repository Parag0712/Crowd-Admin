import { loginAdmin } from "@/service/auth";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { loginAdmin } from '@/services/auth/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(
            JSON.stringify({
              statusCode: 400,
              message: "Email and password are required",
            }),
          );
        }
        console.log(credentials);

        const response = await loginAdmin(
          credentials.email,
          credentials.password,
        );
        console.log(response);
        if (response.success && response.data) {
          return response.data;
        }

        throw new Error(
          JSON.stringify({
            statusCode: response.statusCode,
            message: response.message,
          }),
        );
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as User;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as User;
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
