import "dotenv/config";
import { PrismaClient, EventStatus } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "change-me";

  await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {},
    create: {
      name: process.env.SEED_ADMIN_NAME ?? "IEEE Admin",
      email: adminEmail.toLowerCase(),
      passwordHash: await hashPassword(adminPassword),
    },
  });

  await prisma.event.createMany({
    data: [
      {
        title: "IEEE Technology Conference 2026",
        description:
          "A technical conference for students interested in engineering, computing, and innovation.",
        date: new Date("2026-09-24T09:00:00.000Z"),
        location: "Institut Teknologi Bandung",
        status: EventStatus.UPCOMING,
      },
      {
        title: "Student Research Showcase",
        description:
          "A showcase of student research projects and discussions with IEEE ITB members.",
        date: new Date("2026-08-15T13:00:00.000Z"),
        location: "IEEE ITB Student Branch Room",
        status: EventStatus.COMPLETED,
      },
      {
        title: "Embedded Systems Workshop",
        description:
          "Hands-on workshop covering microcontrollers, sensors, and practical embedded system design.",
        date: new Date("2026-10-10T02:00:00.000Z"),
        location: "Labtek V, ITB",
        status: EventStatus.UPCOMING,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
