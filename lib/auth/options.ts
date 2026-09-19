import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { credentialsSchema } from "@/lib/validations/auth";

// ponytail: bounded process-local throttling; use a shared store for multiple instances.
const attempts = new Map<string, { count: number; until: number }>();
const dummyHash =
  "$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Admin credentials",
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const now = Date.now();
        for (const [key, value] of attempts)
          if (value.until <= now) attempts.delete(key);
        const attempt = attempts.get(email) ?? {
          count: 0,
          until: now + 15 * 60 * 1000,
        };
        if (
          attempt.count >= 10 ||
          (!attempts.has(email) && attempts.size >= 1000)
        )
          return null;
        attempt.count++;
        attempts.set(email, attempt);
        try {
          const user = await prisma.user.findUnique({ where: { email } });
          const valid = await verifyPassword(
            password,
            user?.passwordHash ?? dummyHash,
          );
          if (!user || !valid) return null;
          attempts.delete(email);
          return { id: user.id, name: user.name, email: user.email };
        } catch {
          // NextAuth forwards authorize error messages to the client.
          throw new Error("Unable to sign in. Please try again later.");
        }
      },
    }),
  ],
};
