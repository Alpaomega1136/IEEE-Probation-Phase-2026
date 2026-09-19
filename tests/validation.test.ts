import assert from "node:assert/strict";
import test from "node:test";
import {
  eventInputSchema,
  eventUpdateSchema,
  eventQuerySchema,
} from "../lib/validations/event";
import { credentialsSchema } from "../lib/validations/auth";
import { fromDateTimeInput, toDateTimeInput, formatTime } from "../lib/events";
import { hashPassword, verifyPassword } from "../lib/auth/password";

const valid = {
  title: " Test event ",
  description: "An event",
  location: "ITB",
  date: "2026-10-24T09:00:00+07:00",
  status: "UPCOMING",
};
test("event validation rejects invalid data and preserves optional image workflow", () => {
  assert.equal(eventInputSchema.parse(valid).title, "Test event");
  for (const invalid of [
    { title: " " },
    { description: "" },
    { location: "" },
    { date: "not-a-date" },
    { date: null },
    { date: true },
    { date: 0 },
    { date: "2026-02-30T09:00:00Z" },
    { status: "UNKNOWN" },
    { imageUrl: "javascript:alert(1)" },
    { imageUrl: "http://example.com/a.jpg" },
    { imageUrl: "/etc/passwd" },
    { imageUrl: "data:image/svg+xml,abc" },
    { description: "a".repeat(10001) },
    { title: "x".repeat(121) },
    { unauthorized: true },
  ])
    assert.equal(
      eventInputSchema.safeParse({ ...valid, ...invalid }).success,
      false,
      JSON.stringify(invalid).slice(0, 100),
    );
  for (const imageUrl of [
    undefined,
    "",
    "https://example.com/photo.jpg",
    "/images/conference.jpg",
  ]) {
    assert.equal(
      eventInputSchema.safeParse({ ...valid, imageUrl }).success,
      true,
    );
  }
  assert.equal(eventUpdateSchema.safeParse({}).success, false);
  assert.equal(eventUpdateSchema.safeParse({ title: "Updated" }).success, true);
  assert.equal(
    eventUpdateSchema.safeParse({ passwordHash: "injected" }).success,
    false,
  );
  assert.equal(eventQuerySchema.parse({ page: "2" }).page, 2);
  assert.equal(eventQuerySchema.safeParse({ page: "-1" }).success, false);
});
test("WIB date round-trip is independent of host timezone", () => {
  const input = "2026-10-24T09:00";
  const date = eventInputSchema.parse({
    ...valid,
    date: fromDateTimeInput(input),
  }).date;
  assert.equal(date.toISOString(), "2026-10-24T02:00:00.000Z");
  assert.equal(toDateTimeInput(date), input);
  assert.equal(formatTime(date), "09:00 WIB");
});
test("credentials normalize email and bcrypt verifies only the correct password", async () => {
  assert.equal(
    credentialsSchema.parse({ email: "ADMIN@example.com", password: "a" })
      .email,
    "admin@example.com",
  );
  assert.equal(
    credentialsSchema.safeParse({ email: "bad", password: "" }).success,
    false,
  );
  const hash = await hashPassword("test-only-strong-password");
  assert.notEqual(hash, "test-only-strong-password");
  assert.equal(await verifyPassword("test-only-strong-password", hash), true);
  assert.equal(await verifyPassword("wrong", hash), false);
  assert.throws(() => hashPassword("\u00e9".repeat(40)), /72 UTF-8 bytes/);
  assert.equal(await verifyPassword("\u00e9".repeat(40), hash), false);
});
