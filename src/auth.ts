import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { ROUTE_PATHS } from "@/constants/routes";
import { USER_ROLE, type UserRole } from "@/constants/roles";
import { loginSchema } from "@/features/auth/schemas/login-schema";
import { prisma } from "@/lib/prisma";

const authSecret =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV !== "production"
    ? "portal-masjid-local-dev-session-key-must-be-changed-in-prod"
    : undefined);

if (!authSecret && process.env.NODE_ENV === "production") {
  throw new Error(
    "CRITICAL SECURITY CONFIGURATION: AUTH_SECRET or NEXTAUTH_SECRET must be defined in production.",
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret,
  trustHost: true,
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

        const { email, password } = parsed.data;
        const normalizedEmail = email.toLowerCase().trim();

        // 1. Primary: Verify against database if connected
        try {
          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            include: { role: true },
          });

          if (user && user.isActive) {
            const passwordMatches = await compare(
              password,
              user.passwordHash,
            );

            if (passwordMatches) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role.name as UserRole,
              };
            }
          }
        } catch (dbError) {
          console.warn(
            "Database unavailable during authentication, using demo credentials fallback:",
            dbError,
          );
        }

                // 2. Demo & development fallback accounts (strictly restricted to non-production environments)
        if (process.env.NODE_ENV !== "production") {
          const demoAccounts: Record<
            string,
            { name: string; role: UserRole; pass: string }
          > = {
            "admin@nuruljannah.id": {
              name: "Ahmad Fauzi",
              role: USER_ROLE.ADMIN_UTAMA,
              pass: "Admin123!",
            },
            "bendahara@nuruljannah.id": {
              name: "Nur Aini",
              role: USER_ROLE.BENDAHARA,
              pass: "Admin123!",
            },
            "sekretaris@nuruljannah.id": {
              name: "Rizky Hidayat",
              role: USER_ROLE.SEKRETARIS,
              pass: "Admin123!",
            },
          };

          const demo = demoAccounts[normalizedEmail];
          if (demo && (demo.pass === password || password === "Admin123!")) {
            return {
              id: `demo-${demo.role.toLowerCase()}`,
              name: demo.name,
              email: normalizedEmail,
              role: demo.role,
            };
          }
        }

        // Timing attack mitigation: run dummy compare if user not found
        await compare(password, "$2a$10$e7xY6vD4yT7gW6kX5bZ4nOU1m2p3q4r5s6t7u8v9w0x1y2z3a4b5c");
        return null;
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
