import { requireAdminMutation } from "@/lib/auth/session";
import { apiError } from "@/lib/errors/api";
import { AppError } from "@/lib/errors/app-error";
import { saveUpload } from "@/lib/uploads";

export async function POST(request: Request) {
  try {
    await requireAdminMutation(request);
    if (!request.headers.get("content-type")?.startsWith("multipart/form-data"))
      throw new AppError("VALIDATION_ERROR", "Expected an image upload.", 400);
    const image = (await request.formData()).get("image");
    if (!(image instanceof File))
      throw new AppError("VALIDATION_ERROR", "Choose an image to upload.", 400);
    return Response.json(
      { data: { url: await saveUpload(image) } },
      { status: 201 },
    );
  } catch (error) {
    return apiError(error);
  }
}
