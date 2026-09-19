import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/lib/errors/app-error";

export async function currentAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  // Only database-provisioned users are administrators; deleted users lose access.
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true },
  });
}

export async function requireAdminPage() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function requireAdminMutation(request: Request) {
  const admin = await currentAdmin();
  if (!admin)
    throw new AppError(
      "UNAUTHENTICATED",
      "Your session has expired. Please sign in again.",
      401,
    );
  const origin = request.headers.get("origin");
  const expected = new URL(process.env.NEXTAUTH_URL || request.url).origin;
  if (!origin || origin !== expected)
    throw new AppError("FORBIDDEN", "Request origin is not allowed.", 403);
  return admin;
}
