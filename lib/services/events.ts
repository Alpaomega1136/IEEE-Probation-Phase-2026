import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";
import {
  eventInputSchema,
  eventUpdateSchema,
  type EventQuery,
} from "@/lib/validations/event";

export const PAGE_SIZE = 9;
const statusRank = {
  ONGOING: 0,
  UPCOMING: 1,
  COMPLETED: 2,
  CANCELLED: 3,
};

function paginate<T>(items: T[], requestedPage: number) {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, pages);
  return {
    items: items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total,
    page,
    pages,
  };
}

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
    if (query.status === "all") {
      const events = (await prisma.event.findMany({ where })).sort((a, b) => {
        const rank = statusRank[a.status] - statusRank[b.status];
        if (rank) return rank;
        const date = a.date.getTime() - b.date.getTime();
        return date || a.id.localeCompare(b.id);
      });
      const { items, ...meta } = paginate(events, query.page);
      return { events: items, ...meta };
    }
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
        where: { status: { in: ["COMPLETED", "CANCELLED"] } },
        orderBy: { date: "desc" },
        take: 3,
      }),
    ]);
    return { upcoming, past };
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
