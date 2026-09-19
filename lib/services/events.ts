import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";
import {
  eventInputSchema,
  eventUpdateSchema,
  type EventQuery,
} from "@/lib/validations/event";

export const PAGE_SIZE = 9;

function whereFor({ search, status }: EventQuery): Prisma.EventWhereInput {
  return {
    ...(search
      ? {
          OR: ["title", "description", "location"].map((field) => ({
            [field]: { contains: search, mode: "insensitive" },
          })),
        }
      : {}),
    ...(status === "upcoming"
      ? { status: { in: ["UPCOMING", "ONGOING"] } }
      : status === "past"
        ? { status: "COMPLETED" }
        : status !== "all"
          ? { status }
          : {}),
  };
}

export const eventService = {
  async list(query: EventQuery) {
    const where = whereFor(query);
    const total = await prisma.event.count({ where });
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(query.page, pages);
    const events = await prisma.event.findMany({
      where,
      orderBy: [
        { date: query.status === "past" ? "desc" : "asc" },
        { id: "asc" },
      ],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });
    return { events, total, page, pages };
  },
  getById(id: string) {
    return prisma.event.findUnique({ where: { id } });
  },
  async home() {
    const [upcoming, past] = await Promise.all([
      prisma.event.findMany({
        where: { status: { in: ["UPCOMING", "ONGOING"] } },
        orderBy: { date: "asc" },
        take: 3,
      }),
      prisma.event.findMany({
        where: { status: "COMPLETED" },
        orderBy: { date: "desc" },
        take: 3,
      }),
    ]);
    return { upcoming, past };
  },
  async summary() {
    const [total, upcoming, completed, recent, cancelled, next] =
      await Promise.all([
        prisma.event.count(),
        prisma.event.count({
          where: { status: { in: ["UPCOMING", "ONGOING"] } },
        }),
        prisma.event.count({ where: { status: "COMPLETED" } }),
        prisma.event.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
        prisma.event.count({ where: { status: "CANCELLED" } }),
        prisma.event.findMany({
          where: { status: { in: ["UPCOMING", "ONGOING"] } },
          orderBy: { date: "asc" },
          take: 3,
        }),
      ]);
    return { total, upcoming, completed, recent, cancelled, next };
  },
  create(input: unknown) {
    const data = eventInputSchema.parse(input);
    return prisma.event.create({
      data: { ...data, imageUrl: data.imageUrl || null },
    });
  },
  update(id: string, input: unknown) {
    const data = eventUpdateSchema.parse(input);
    return prisma.event.update({
      where: { id },
      data: {
        ...data,
        ...(data.imageUrl !== undefined
          ? { imageUrl: data.imageUrl || null }
          : {}),
      },
    });
  },
  delete(id: string) {
    return prisma.event.delete({ where: { id } });
  },
};
