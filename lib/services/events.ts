import { prisma } from "@/lib/db/prisma";
import { eventInputSchema, type EventInput } from "@/lib/validations/event";

export const eventService = {
  getAll() {
    return prisma.event.findMany({
      orderBy: { date: "asc" },
    });
  },

  getById(id: string) {
    return prisma.event.findUnique({
      where: { id },
    });
  },

  create(input: EventInput) {
    const data = eventInputSchema.parse(input);

    return prisma.event.create({
      data: {
        ...data,
        imageUrl: data.imageUrl || null,
      },
    });
  },
};

