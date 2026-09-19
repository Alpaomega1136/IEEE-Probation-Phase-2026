import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "@/lib/errors/app-error";

export function apiError(error: unknown) {
  if (error instanceof ZodError)
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Please check the event details.",
          fields: error.flatten().fieldErrors,
        },
      },
      { status: 400 },
    );
  if (error instanceof SyntaxError)
    return Response.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid JSON request." } },
      { status: 400 },
    );
  if (error instanceof AppError)
    return Response.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return Response.json(
      {
        error: {
          code: "EVENT_NOT_FOUND",
          message: "This event no longer exists.",
        },
      },
      { status: 404 },
    );
  }
  console.error(
    "Request failed:",
    error instanceof Error ? error.name : "Unknown error",
  );
  return Response.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong. Please try again.",
      },
    },
    { status: 500 },
  );
}

export async function readJson(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    throw new AppError("VALIDATION_ERROR", "Expected a JSON request.", 400);
  }
  const text = await request.text();
  if (text.length > 64000)
    throw new AppError("VALIDATION_ERROR", "The request is too large.", 413);
  return JSON.parse(text) as unknown;
}
