import { revalidatePath } from "next/cache";
import { eventService } from "@/lib/services/events";
import { eventQuerySchema } from "@/lib/validations/event";
import { requireAdminMutation } from "@/lib/auth/session";
import { apiError, readJson } from "@/lib/errors/api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const query = eventQuerySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams),
    );
    const { events, ...meta } = await eventService.list(query);
    return Response.json({ data: events, meta });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminMutation(request);
    const event = await eventService.create(await readJson(request));
    revalidatePath("/", "layout");
    return Response.json({ data: event }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
