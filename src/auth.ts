import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { ROUTE_PATHS } from "@/constants/routes";
import { USER_ROLE, type UserRole } from "@/constants/roles";
import { loginSchema } from "@/features/auth/schemas/login-schema";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: ROUTE_PATHS.login,
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Kredensial",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Kata Sandi", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          include: { role: true },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const passwordMatches = await compare(
          parsed.data.password,
          user.passwordHash,
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.name as UserRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      if (!token.role) {
        token.role = USER_ROLE.JAMAAH_UMUM;
      }

      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        return session;
      }

      session.user.id = token.sub ?? "";
      session.user.role =
        (token.role as UserRole | undefined) ?? USER_ROLE.JAMAAH_UMUM;

      return session;
    },
    authorized({ auth: session, request }) {
      const pathname = request.nextUrl.pathname;
      const isDashboardRoute = pathname.startsWith(ROUTE_PATHS.dashboard);

      if (!isDashboardRoute) {
        return true;
      }

      return !!session?.user;
    },
  },
});
