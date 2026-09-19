import "dotenv/config";
import { PrismaClient, EventStatus } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";
import { z } from "zod";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = z
    .email()
    .parse(process.env.SEED_ADMIN_EMAIL)
    .toLowerCase();
  const adminPassword = z
    .string()
    .min(12)
    .max(72)
    .parse(process.env.SEED_ADMIN_PASSWORD);
  const adminName = z
    .string()
    .trim()
    .min(1)
    .max(120)
    .parse(process.env.SEED_ADMIN_NAME ?? "IEEE Admin");

  await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {},
    create: {
      name: adminName,
      email: adminEmail.toLowerCase(),
      passwordHash: await hashPassword(adminPassword),
    },
  });

  await prisma.event.createMany({
    data: [
      {
        id: "demo-tech-conference",
        title: "IEEE Technology Conference 2026",
        description:
          "An exchange of ideas at the intersection of engineering, computing, and society. Join students and technology enthusiasts for talks and conversations on the technologies shaping our future.\n\nThe day brings together technical sessions, student perspectives, and time to meet fellow innovators. Open to students from every discipline.\n\nDoors open at 08:30 WIB. Please bring your student ID and a notebook.",
        date: new Date("2026-09-24T02:00:00.000Z"),
        location: "Aula Barat, ITB",
        status: EventStatus.UPCOMING,
        imageUrl: "/images/conference.jpg",
      },
      {
        id: "demo-research-showcase",
        title: "Student Research Showcase",
        description:
          "A showcase of student research projects and discussions with IEEE ITB members.",
        date: new Date("2026-08-15T13:00:00.000Z"),
        location: "IEEE ITB Student Branch Room",
        status: EventStatus.COMPLETED,
        imageUrl: "/images/collaboration.jpg",
      },
      {
        id: "demo-embedded-workshop",
        title: "Embedded Systems Workshop",
        description:
          "Turn ideas into working hardware. Explore microcontrollers, sensors, and practical embedded system design through a guided, hands-on session.\n\nWork in small groups to build and test a sensor-based prototype. Basic programming familiarity is helpful; curiosity is essential.\n\nBring a laptop and charging cable. Workshop equipment will be available at the venue.",
        date: new Date("2026-10-10T02:00:00.000Z"),
        location: "Labtek V, ITB",
        status: EventStatus.UPCOMING,
        imageUrl: "/images/workshop.jpg",
      },
      {
        id: "demo-ai-forum",
        title: "AI & Engineering: Student Forum",
        description:
          "Explore how artificial intelligence is changing the way we solve engineering problems. A student-led forum with short presentations, a moderated discussion, and an open exchange of project ideas.\n\nTopics include responsible AI, applied machine learning, and getting started with student research. All experience levels are welcome.",
        date: new Date("2026-11-21T06:00:00Z"),
        location: "East Campus Center, ITB",
        status: EventStatus.UPCOMING,
        imageUrl: "/images/collaboration.jpg",
      },
      {
        id: "demo-engineering-meetup",
        title: "Engineering Community Meetup",
        description:
          "An informal gathering to connect with the IEEE ITB community. Students shared their interests, exchanged project ideas, and met potential collaborators across disciplines.\n\nThe session featured introductions to student initiatives and a discussion of the next semester's activities.",
        date: new Date("2026-07-18T02:00:00Z"),
        location: "Campus Center, ITB",
        status: EventStatus.COMPLETED,
        imageUrl: "/images/conference.jpg",
      },
      {
        id: "demo-iot-lab",
        title: "Internet of Things: Open Lab",
        description:
          "An introduction to connected devices and sensor networks through an open laboratory session.\n\nThis event has been cancelled. A new date will be announced as a separate event when available.",
        date: new Date("2026-06-20T02:00:00Z"),
        location: "Labtek VIII, ITB",
        status: EventStatus.CANCELLED,
        imageUrl: "/images/workshop.jpg",
      },
    ],
    skipDuplicates: true,
  });
  console.log(
    "Seed complete. Existing admin and sample events were preserved.",
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(
      error instanceof z.ZodError
        ? "Set a valid seed email and a 12-72 character password in .env."
        : "Seed failed. Check the database connection.",
    );
    await prisma.$disconnect();
    process.exit(1);
  });
