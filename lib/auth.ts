// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "メールアドレス", type: "email" },
        password: { label: "パスワード",     type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(
            `${process.env.ADMIN_API_URL}/api/members/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email:    credentials.email,
                password: credentials.password,
              }),
              cache: "no-store",
            }
          );

          if (!res.ok) return null;
          const data = await res.json();
          if (!data.id) return null;

          return {
            id:    String(data.id),
            email: data.email,
            name:  data.name,
          };
        } catch (e) {
          console.error("[NextAuth] authorize error:", e);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7日間
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/members/login",
    error:  "/members/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
