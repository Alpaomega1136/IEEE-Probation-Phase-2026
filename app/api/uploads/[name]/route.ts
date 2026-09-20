import { requireAdminMutation } from "@/lib/auth/session";
import { apiError } from "@/lib/errors/api";
import { readUpload, removeUpload } from "@/lib/uploads";

type Context = { params: Promise<{ name: string }> };
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: Context) {
  try {
    const name = (await params).name;
    const bytes = await readUpload(name);
    if (!bytes) return new Response(null, { status: 404 });
    const type = name.endsWith(".png")
      ? "image/png"
      : name.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg";
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  try {
    await requireAdminMutation(request);
    await removeUpload(`/api/uploads/${(await params).name}`);
    return Response.json({ data: { deleted: true } });
  } catch (error) {
    return apiError(error);
  }
}
