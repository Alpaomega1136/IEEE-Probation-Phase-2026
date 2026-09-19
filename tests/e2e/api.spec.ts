import { test, expect } from "@playwright/test";

const origin = process.env.NEXTAUTH_URL || "http://localhost:3000";

test("API pagination, partial update, and validation retain stored data", async ({
  page,
  request,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email address").fill(process.env.SEED_ADMIN_EMAIL!);
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.SEED_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto("/admin/events?notice=__proto__");
  await expect(page.getByRole("heading", { name: "Events", exact: true })).toBeVisible();
  const prefix = `QA Paging ${Date.now()}`;
  const ids: string[] = [];
  const input = {
    title: prefix,
    description: "Pagination acceptance test",
    date: "2026-12-01T02:00:00Z",
    location: "ITB",
    status: "UPCOMING",
  };
  try {
    expect(
      (
        await page.request.post("/api/events", {
          data: { ...input, date: null },
          headers: { Origin: origin },
        })
      ).status(),
    ).toBe(400);
    expect(
      (
        await page.request.post("/api/events", {
          data: "{",
          headers: { Origin: origin, "Content-Type": "application/json" },
        })
      ).status(),
    ).toBe(400);
    for (let i = 0; i < 10; i++) {
      const response = await page.request.post("/api/events", {
        data: { ...input, title: `${prefix} ${i}` },
        headers: { Origin: origin },
      });
      expect(response.status()).toBe(201);
      ids.push((await response.json()).data.id);
    }
    const first = await (
      await request.get(`/api/events?search=${encodeURIComponent(prefix)}`)
    ).json();
    expect(first.data).toHaveLength(9);
    expect(first.meta).toEqual({ total: 10, pages: 2, page: 1 });
    const second = await (
      await request.get(
        `/api/events?search=${encodeURIComponent(prefix)}&page=99`,
      )
    ).json();
    expect(second.data).toHaveLength(1);
    expect(second.meta.page).toBe(2);
    const changed = await page.request.patch(`/api/events/${ids[0]}`, {
      data: { status: "CANCELLED" },
      headers: { Origin: origin },
    });
    expect(changed.status()).toBe(200);
    expect((await changed.json()).data.description).toBe(input.description);
    const filtered = await (
      await request.get(
        `/api/events?search=${encodeURIComponent(prefix)}&status=CANCELLED`,
      )
    ).json();
    expect(filtered.meta.total).toBe(1);
    await page.goto(`/events?search=${encodeURIComponent(prefix)}`);
    await page.getByRole("link", { name: "Next page", exact: true }).click();
    await expect(
      page.getByRole("navigation", { name: "Pagination" }),
    ).toContainText("Page 2 of 2");
  } finally {
    for (const id of ids)
      await page.request.delete(`/api/events/${id}`, {
        headers: { Origin: origin },
      });
  }
});
