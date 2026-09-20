import "dotenv/config";
import { PrismaClient, EventStatus } from "@prisma/client";
import { z } from "zod";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

const covers = [
  "/images/conference.jpg",
  "/images/workshop.jpg",
  "/images/collaboration.jpg",
] as const;

type SeedEvent = {
  id: string;
  title: string;
  theme: string;
  date: string;
  location: string;
  status: EventStatus;
  imageUrl: (typeof covers)[number];
};

const events: SeedEvent[] = [
  {
    id: "connected-reality-hackathon-playbook",
    title: "Connected Reality Hackathon Playbook",
    theme: "mixed reality, campus mapping, and product prototyping",
    date: "2026-09-20T02:00:00.000Z",
    location: "Aula Timur, ITB",
    status: EventStatus.ONGOING,
    imageUrl: "/images/conference.jpg",
  },
  {
    id: "embedded-systems-sprint",
    title: "Embedded Systems Sprint",
    theme: "sensor boards, firmware basics, and rapid hardware validation",
    date: "2026-09-21T06:00:00.000Z",
    location: "Labtek V, ITB",
    status: EventStatus.ONGOING,
    imageUrl: "/images/workshop.jpg",
  },
  {
    id: "ai-for-engineering-open-forum",
    title: "AI for Engineering Open Forum",
    theme: "responsible AI, student research workflows, and applied models",
    date: "2026-09-22T09:00:00.000Z",
    location: "Campus Center, ITB",
    status: EventStatus.ONGOING,
    imageUrl: "/images/collaboration.jpg",
  },
  {
    id: "technology-conference-2026",
    title: "IEEE Technology Conference 2026",
    theme: "future networks, intelligent systems, and engineering leadership",
    date: "2026-09-24T02:00:00.000Z",
    location: "Aula Barat, ITB",
    status: EventStatus.UPCOMING,
    imageUrl: "/images/conference.jpg",
  },
  {
    id: "computer-vision-study-jam",
    title: "Computer Vision Study Jam",
    theme: "image classification, dataset preparation, and model evaluation",
    date: "2026-09-28T08:00:00.000Z",
    location: "Ruang Multimedia STEI, ITB",
    status: EventStatus.UPCOMING,
    imageUrl: "/images/collaboration.jpg",
  },
  {
    id: "iot-open-lab",
    title: "Internet of Things Open Lab",
    theme: "connected devices, telemetry, and small-scale automation",
    date: "2026-10-03T02:30:00.000Z",
    location: "Labtek VIII, ITB",
    status: EventStatus.UPCOMING,
    imageUrl: "/images/workshop.jpg",
  },
  {
    id: "cybersecurity-capture-the-flag",
    title: "Cybersecurity Capture The Flag",
    theme: "web security, cryptography clues, and defensive thinking",
    date: "2026-10-07T10:00:00.000Z",
    location: "Common Labs ITB",
    status: EventStatus.UPCOMING,
    imageUrl: "/images/conference.jpg",
  },
  {
    id: "embedded-systems-workshop",
    title: "Embedded Systems Workshop",
    theme: "microcontrollers, sensors, and practical debugging",
    date: "2026-10-10T02:00:00.000Z",
    location: "Labtek V, ITB",
    status: EventStatus.UPCOMING,
    imageUrl: "/images/workshop.jpg",
  },
  {
    id: "women-in-engineering-roundtable",
    title: "Women in Engineering Roundtable",
    theme: "inclusive teams, career stories, and peer mentoring",
    date: "2026-10-14T06:30:00.000Z",
    location: "Ruang Seminar CC Timur, ITB",
    status: EventStatus.UPCOMING,
    imageUrl: "/images/collaboration.jpg",
  },
  {
    id: "robotics-control-mini-bootcamp",
    title: "Robotics Control Mini Bootcamp",
    theme: "motion planning, control loops, and robot testing",
    date: "2026-10-18T02:00:00.000Z",
    location: "Robotics Lab, ITB",
    status: EventStatus.UPCOMING,
    imageUrl: "/images/workshop.jpg",
  },
  {
    id: "cloud-native-student-clinic",
    title: "Cloud Native Student Clinic",
    theme: "deployment basics, observability, and resilient services",
    date: "2026-10-23T07:00:00.000Z",
    location: "STEI Innovation Room, ITB",
    status: EventStatus.UPCOMING,
    imageUrl: "/images/conference.jpg",
  },
  {
    id: "data-visualization-night",
    title: "Data Visualization Night",
    theme: "storytelling with charts, dashboards, and public datasets",
    date: "2026-10-29T11:00:00.000Z",
    location: "Perpustakaan Pusat ITB",
    status: EventStatus.UPCOMING,
    imageUrl: "/images/collaboration.jpg",
  },
  {
    id: "startup-engineering-showcase",
    title: "Startup Engineering Showcase",
    theme: "prototype demos, product validation, and technical pitching",
    date: "2026-11-04T06:00:00.000Z",
    location: "CRCS Multipurpose Hall, ITB",
    status: EventStatus.UPCOMING,
    imageUrl: "/images/conference.jpg",
  },
  {
    id: "signal-processing-masterclass",
    title: "Signal Processing Masterclass",
    theme: "audio signals, filtering, and applied mathematics",
    date: "2026-11-10T02:00:00.000Z",
    location: "Lab Sinyal STEI, ITB",
    status: EventStatus.UPCOMING,
    imageUrl: "/images/workshop.jpg",
  },
  {
    id: "student-research-roadshow",
    title: "Student Research Roadshow",
    theme: "paper reading, poster feedback, and research planning",
    date: "2026-11-15T04:00:00.000Z",
    location: "Aula Timur, ITB",
    status: EventStatus.UPCOMING,
    imageUrl: "/images/collaboration.jpg",
  },
  {
    id: "engineering-community-meetup",
    title: "Engineering Community Meetup",
    theme: "student initiatives, shared interests, and project matchmaking",
    date: "2026-07-18T02:00:00.000Z",
    location: "Campus Center, ITB",
    status: EventStatus.COMPLETED,
    imageUrl: "/images/conference.jpg",
  },
  {
    id: "student-research-showcase",
    title: "Student Research Showcase",
    theme: "student papers, laboratory demos, and poster presentations",
    date: "2026-08-15T13:00:00.000Z",
    location: "IEEE ITB Student Branch Room",
    status: EventStatus.COMPLETED,
    imageUrl: "/images/collaboration.jpg",
  },
  {
    id: "ras-introduction-day",
    title: "RAS Introduction Day",
    theme: "robotics society programs, member onboarding, and lab tours",
    date: "2026-08-22T03:00:00.000Z",
    location: "Robotics Lab, ITB",
    status: EventStatus.COMPLETED,
    imageUrl: "/images/workshop.jpg",
  },
  {
    id: "pes-renewable-energy-talk",
    title: "PES Renewable Energy Talk",
    theme: "power systems, grid reliability, and clean energy transition",
    date: "2026-08-29T06:00:00.000Z",
    location: "Aula PLN, ITB",
    status: EventStatus.COMPLETED,
    imageUrl: "/images/conference.jpg",
  },
  {
    id: "python-for-data-workshop",
    title: "Python for Data Workshop",
    theme: "data cleaning, notebooks, and reproducible analysis",
    date: "2026-09-02T07:00:00.000Z",
    location: "Common Labs ITB",
    status: EventStatus.COMPLETED,
    imageUrl: "/images/workshop.jpg",
  },
  {
    id: "membership-orientation-2026",
    title: "IEEE Membership Orientation 2026",
    theme: "chapter introduction, benefits, and volunteer pathways",
    date: "2026-09-05T02:00:00.000Z",
    location: "Ruang Seminar STEI, ITB",
    status: EventStatus.COMPLETED,
    imageUrl: "/images/collaboration.jpg",
  },
  {
    id: "technical-writing-clinic",
    title: "Technical Writing Clinic",
    theme: "abstract writing, citation hygiene, and research clarity",
    date: "2026-09-09T08:00:00.000Z",
    location: "Perpustakaan Pusat ITB",
    status: EventStatus.COMPLETED,
    imageUrl: "/images/conference.jpg",
  },
  {
    id: "project-management-for-engineers",
    title: "Project Management for Engineers",
    theme: "scope, milestones, and collaboration routines",
    date: "2026-09-13T03:00:00.000Z",
    location: "Campus Center, ITB",
    status: EventStatus.COMPLETED,
    imageUrl: "/images/collaboration.jpg",
  },
  {
    id: "digital-circuit-design-lab",
    title: "Digital Circuit Design Lab",
    theme: "logic design, simulation, and verification basics",
    date: "2026-09-17T06:00:00.000Z",
    location: "Lab Dasar Elektronika, ITB",
    status: EventStatus.COMPLETED,
    imageUrl: "/images/workshop.jpg",
  },
  {
    id: "smart-campus-ideathon",
    title: "Smart Campus Ideathon",
    theme: "campus services, rapid ideation, and student-centered design",
    date: "2026-06-20T02:00:00.000Z",
    location: "Aula Timur, ITB",
    status: EventStatus.CANCELLED,
    imageUrl: "/images/collaboration.jpg",
  },
  {
    id: "blockchain-application-talk",
    title: "Blockchain Application Talk",
    theme: "distributed ledgers, trust models, and practical constraints",
    date: "2026-07-05T06:00:00.000Z",
    location: "Ruang Seminar CC Barat, ITB",
    status: EventStatus.CANCELLED,
    imageUrl: "/images/conference.jpg",
  },
  {
    id: "hardware-repair-open-bench",
    title: "Hardware Repair Open Bench",
    theme: "diagnostics, soldering practice, and repair documentation",
    date: "2026-08-04T03:00:00.000Z",
    location: "Labtek V, ITB",
    status: EventStatus.CANCELLED,
    imageUrl: "/images/workshop.jpg",
  },
  {
    id: "career-night-with-alumni",
    title: "Career Night with Alumni",
    theme: "career paths, interview preparation, and industry expectations",
    date: "2026-09-01T11:00:00.000Z",
    location: "Aula Barat, ITB",
    status: EventStatus.CANCELLED,
    imageUrl: "/images/collaboration.jpg",
  },
  {
    id: "green-computing-panel",
    title: "Green Computing Panel",
    theme: "energy-efficient software, hardware lifecycle, and sustainability",
    date: "2026-09-11T07:00:00.000Z",
    location: "STEI Innovation Room, ITB",
    status: EventStatus.CANCELLED,
    imageUrl: "/images/conference.jpg",
  },
  {
    id: "rf-antenna-demo-day",
    title: "RF Antenna Demo Day",
    theme: "radio frequency measurement, antenna design, and lab safety",
    date: "2026-09-18T02:00:00.000Z",
    location: "Telecommunication Lab, ITB",
    status: EventStatus.CANCELLED,
    imageUrl: "/images/workshop.jpg",
  },
];

function richDescription(event: SeedEvent, index: number) {
  const image = covers[(index + 1) % covers.length];
  return `
    <h2>${event.title}</h2>
    <p><strong>${event.title}</strong> is an IEEE ITB Student Branch program focused on ${event.theme}. The session is designed for students who want a practical entry point, clear examples, and a space to discuss ideas with peers.</p>
    <p>Participants will move through short context-setting talks, guided activities, and a closing reflection so the topic feels easier to connect with real student projects.</p>
    <img src="${image}" alt="${event.title} session preview">
    <h3>What participants will do</h3>
    <ul>
      <li>Explore the core concept through approachable examples.</li>
      <li>Discuss implementation trade-offs with IEEE ITB members.</li>
      <li>Leave with a small action plan for continued learning.</li>
    </ul>
    <blockquote>Built for curious students who want to learn by making, asking, and sharing.</blockquote>
    <p>More context about IEEE student activities is available from <a href="https://www.ieee.org/">IEEE</a>.</p>
  `
    .replace(/\n\s+/g, "")
    .trim();
}

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
    where: { email: adminEmail },
    update: { name: adminName },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
    },
  });

  await prisma.event.deleteMany();
  await prisma.event.createMany({
    data: events.map((event, index) => ({
      id: event.id,
      title: event.title,
      description: richDescription(event, index),
      date: new Date(event.date),
      location: event.location,
      status: event.status,
      imageUrl: event.imageUrl,
    })),
  });

  console.log(`Seed complete. Reset ${events.length} events.`);
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
