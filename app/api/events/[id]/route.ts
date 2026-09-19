import { revalidatePath } from "next/cache";
import { eventService } from "@/lib/services/events";
import { requireAdminMutation } from "@/lib/auth/session";
import { apiError, readJson } from "@/lib/errors/api";
import { AppError } from "@/lib/errors/app-error";

type Context = { params: Promise<{ id: string }> };
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: Context) {
  try {
    const event = await eventService.getById((await params).id);
    if (!event)
      throw new AppError(
        "EVENT_NOT_FOUND",
        "This event could not be found.",
        404,
      );
    return Response.json({ data: event });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    await requireAdminMutation(request);
    const event = await eventService.update(
      (await params).id,
      await readJson(request),
    );
    revalidatePath("/", "layout");
    return Response.json({ data: event });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  try {
    await requireAdminMutation(request);
    await eventService.delete((await params).id);
    revalidatePath("/", "layout");
    return Response.json({ data: { deleted: true } });
  } catch (error) {
    return apiError(error);
  }
}
