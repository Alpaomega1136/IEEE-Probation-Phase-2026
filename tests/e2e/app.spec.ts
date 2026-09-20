import { test, expect, type Page } from "@playwright/test";

const origin = process.env.NEXTAUTH_URL || "http://localhost:3000";
const email = process.env.SEED_ADMIN_EMAIL!;
const password = process.env.SEED_ADMIN_PASSWORD!;
async function login(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/events$/);
  await expect(
    page.getByRole("heading", { name: "Events", exact: true }),
  ).toBeVisible();
}
async function noOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    width: window.innerWidth,
    scroll: document.documentElement.scrollWidth,
    overflow: [...document.querySelectorAll("body *")]
      .filter((node) => {
        const rect = node.getBoundingClientRect();
        return rect.right > window.innerWidth + 1;
      })
      .map((node) => ({
        tag: node.tagName,
        className: node.className,
        right: node.getBoundingClientRect().right,
      })),
  }));
  expect(dimensions.scroll, JSON.stringify(dimensions)).toBeLessThanOrEqual(
    dimensions.width + 1,
  );
}

test("unauthenticated routes and mutations are protected; public API is safe", async ({
  page,
  request,
}) => {
  for (const path of [
    "/admin",
    "/admin/events",
    "/admin/events/new",
    "/admin/events/missing/edit",
  ]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/admin\/login/);
  }
  for (const [method, path] of [
    ["POST", "/api/events"],
    ["PATCH", "/api/events/missing"],
    ["DELETE", "/api/events/missing"],
    ["POST", "/api/uploads"],
  ]) {
    const response = await request.fetch(path, {
      method,
      data: {},
      headers: { Origin: origin },
    });
    expect(response.status()).toBe(401);
    expect((await response.json()).error.code).toBe("UNAUTHENTICATED");
  }
  const response = await request.get("/api/events");
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.data.length).toBeGreaterThan(0);
  expect(JSON.stringify(body)).not.toContain("passwordHash");
  expect((await request.get("/api/events/missing-record")).status()).toBe(404);
  expect((await request.get("/api/events?page=-1")).status()).toBe(400);
  await page.goto("/events/missing-record");
  await expect(
    page.getByRole("heading", { name: "This page is missing." }),
  ).toBeVisible();
});

test("public discovery and responsive layouts render real images", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 320, height: 640 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "IEEE ITB Events", exact: true }),
    ).toBeVisible();
    await expect(page.locator(".event-card").first()).toBeVisible();
    await expect
      .poll(() =>
        page
          .locator(".hero-image")
          .evaluate(
            (element) =>
              (element as HTMLImageElement).complete &&
              (element as HTMLImageElement).naturalWidth > 0,
          ),
      )
      .toBe(true);
    await noOverflow(page);
    if (viewport.width === 1440 || viewport.width === 390)
      await page.screenshot({
        path: `.local/screenshots/home-${viewport.width}.png`,
        fullPage: true,
      });
  }
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Events", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Events & experiences" }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Search events", exact: true })
    .fill("no-event-with-this-name-xyz");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "No matching events" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Clear filters" }).click();
  await page.locator(".event-card-link").first().click();
  await expect(
    page.getByRole("heading", { name: "About this event" }),
  ).toBeVisible();
  await noOverflow(page);
  await page.screenshot({
    path: ".local/screenshots/detail-mobile.png",
    fullPage: true,
  });
  await page.goto("/about");
  await noOverflow(page);
});

test("admin login, validation, persistent CRUD, confirmation, and logout", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/admin/login");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByText("Enter a valid email address")).toBeVisible();
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("incorrect-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator(".login-form [role=alert]")).toContainText(
    "Unable to sign in",
  );
  await login(page);
  await expect(page.getByText("Overview", { exact: true })).toHaveCount(0);
  await expect(page.getByText("View public site", { exact: true })).toHaveCount(
    0,
  );
  await expect(page.getByRole("link", { name: "Add event" })).toHaveCount(0);
  await expect(
    page.getByRole("navigation", { name: "Admin actions" }).getByRole("link", {
      name: "Create event",
    }),
  ).toHaveCount(1);
  await expect
    .poll(() =>
      page.locator(".managed-event img").evaluateAll(
        (images) =>
          images.length > 0 &&
          images.every((image) => {
            const img = image as HTMLImageElement;
            return img.complete && img.naturalWidth > 0;
          }),
      ),
    )
    .toBe(true);
  await page
    .locator(".managed-event img")
    .evaluateAll((images) =>
      Promise.all(images.map((image) => (image as HTMLImageElement).decode())),
    );
  await page.screenshot({
    path: ".local/screenshots/admin-desktop.png",
    fullPage: true,
  });
  let id: string | undefined;
  let inlineImageUrl: string | undefined;
  const title = `QA Event ${Date.now()}`;
  try {
    await page.getByRole("link", { name: "Create event" }).click();
    await expect(
      page.getByRole("navigation", { name: "Admin actions" }).getByRole("link", {
        name: "Create event",
      }),
    ).toHaveCount(0);
    await expect(page.getByText("Organizer", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Time zone", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Visibility", { exact: true })).toHaveCount(0);
    await expect(page.getByText("test event description")).toHaveCount(0);
    await page
      .getByRole("button", { name: "Create event", exact: true })
      .click();
    await expect(
      page.getByText("Title is required", { exact: true }),
    ).toBeVisible();
    await page.getByLabel("Event title").fill(title);
    await expect(
      page.getByText("Title is required", { exact: true }),
    ).not.toBeVisible();
    await page
      .getByLabel("Description", { exact: true })
      .fill("A real database-backed event created during the acceptance test.");
    await page.getByRole("combobox", { name: "Text style" }).selectOption("h2");
    await page.getByLabel("Description", { exact: true }).press("End");
    await page.getByLabel("Description", { exact: true }).press("Enter");
    await page.getByRole("button", { name: "Insert link" }).click();
    await page.getByLabel("Link URL").fill("https://www.ieee.org");
    await page.getByRole("button", { name: "Apply link" }).click();
    await expect(page.locator(".rich-editor-content a")).toHaveAttribute(
      "href",
      "https://www.ieee.org",
    );
    await page.getByRole("button", { name: "Insert image" }).click();
    await expect(
      page
        .getByRole("dialog", { name: "Insert image" })
        .getByText("Choose photo"),
    ).toBeVisible();
    await expect(
      page
        .getByRole("dialog", { name: "Insert image" })
        .getByText("No photo selected"),
    ).toBeVisible();
    await page.screenshot({
      path: ".local/screenshots/description-file-picker-desktop.png",
    });
    const [descriptionChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page
        .getByRole("dialog", { name: "Insert image" })
        .getByText("Choose photo")
        .click(),
    ]);
    await descriptionChooser.setFiles("public/images/workshop.jpg");
    await expect(
      page
        .getByRole("dialog", { name: "Insert image" })
        .getByText("workshop.jpg"),
    ).toBeVisible();
    await page
      .getByRole("dialog", { name: "Insert image" })
      .getByRole("button", { name: "Insert image" })
      .click();
    await expect(
      page.getByText("Describe the image for accessibility."),
    ).toBeVisible();
    await page.getByLabel("Image description").fill("Workshop participants");
    await page
      .getByRole("dialog", { name: "Insert image" })
      .getByRole("button", { name: "Insert image" })
      .click();
    await expect(page.locator(".rich-editor-content img")).toHaveAttribute(
      "src",
      /^\/api\/uploads\//,
    );
    inlineImageUrl =
      (await page.locator(".rich-editor-content img").getAttribute("src")) ||
      undefined;
    await page.getByLabel("Date & time (WIB)").fill("2026-12-01T09:00");
    await page.getByLabel("Location", { exact: false }).fill("Test venue, ITB");
    await expect(
      page.getByText("Create something for the community to look forward to."),
    ).toHaveCount(0);
    await expect(page.getByText("Optional", { exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Choose image" }).click();
    await page.getByRole("button", { name: "Image URL" }).click();
    await page
      .getByLabel("Image URL (HTTPS)")
      .fill("http://example.com/image.jpg");
    await page.getByRole("button", { name: "Use image" }).click();
    await expect(
      page.getByText("Enter a valid HTTPS image URL."),
    ).toBeVisible();
    await page
      .getByLabel("Image URL (HTTPS)")
      .fill("https://example.com/image.jpg");
    await page.getByRole("button", { name: "Use image" }).click();
    await expect(
      page
        .getByRole("complementary", { name: "Event preview" })
        .getByRole("img"),
    ).toHaveAttribute("src", "https://example.com/image.jpg");
    await page.getByRole("button", { name: "Change image" }).click();
    await page.getByRole("button", { name: "Upload photo" }).click();
    await expect(
      page
        .getByRole("dialog", { name: "Choose cover image" })
        .getByText("Choose photo"),
    ).toBeVisible();
    await page.screenshot({
      path: ".local/screenshots/cover-file-picker-desktop.png",
    });
    const [coverChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page
        .getByRole("dialog", { name: "Choose cover image" })
        .getByText("Choose photo")
        .click(),
    ]);
    await coverChooser.setFiles("public/images/workshop.jpg");
    await expect(
      page
        .getByRole("complementary", { name: "Event preview" })
        .getByRole("img", { name: "Event cover preview" }),
    ).toHaveAttribute("src", /^blob:/);
    await expect(
      page
        .getByRole("complementary", { name: "Event preview" })
        .getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("complementary", { name: "Event preview" }),
    ).toContainText("09:00 WIB");
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: ".local/screenshots/admin-editor-desktop.png",
      fullPage: true,
    });
    await page.route(
      "**/api/events",
      (route) =>
        route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({
            error: {
              code: "INTERNAL_ERROR",
              message: "Something went wrong. Please try again.",
            },
          }),
        }),
      { times: 1 },
    );
    await page
      .getByRole("button", { name: "Create event", exact: true })
      .click();
    await expect(page.locator(".event-form [role=alert]")).toContainText(
      "Something went wrong",
    );
    await expect(page.getByLabel("Event title")).toHaveValue(title);
    await page
      .getByRole("button", { name: "Create event", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText(
      "Event created successfully",
    );
    const created = await (
      await request.get(`/api/events?search=${encodeURIComponent(title)}`)
    ).json();
    id = created.data[0]?.id;
    expect(id).toBeTruthy();
    expect(created.data[0].date).toBe("2026-12-01T02:00:00.000Z");
    expect(created.data[0].description).toContain("https://www.ieee.org");
    expect(created.data[0].description).toContain(inlineImageUrl);
    expect((await request.get(inlineImageUrl!)).status()).toBe(200);
    const uploadedImage = created.data[0].imageUrl;
    expect(uploadedImage).toMatch(/^\/api\/uploads\//);
    expect((await request.get(uploadedImage)).status()).toBe(200);
    await page.reload();
    await page
      .getByRole("link", { name: `Edit ${title}`, exact: true })
      .click();
    await expect(
      page.getByRole("navigation", { name: "Admin actions" }).getByRole("link", {
        name: "Create event",
      }),
    ).toHaveCount(0);
    await expect(page.getByText("Organizer", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Time zone", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Visibility", { exact: true })).toHaveCount(0);
    await expect(page.getByLabel("Date & time (WIB)")).toHaveValue(
      "2026-12-01T09:00",
    );
    await page.getByLabel("Event title").fill(`${title} updated`);
    await page.getByLabel("Status", { exact: false }).selectOption("ONGOING");
    await page
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText(
      "Event updated successfully",
    );
    const changed = await (await request.get(`/api/events/${id}`)).json();
    expect(changed.data.title).toBe(`${title} updated`);
    expect(changed.data.status).toBe("ONGOING");
    await page.goto(`/events/${id}`);
    await expect(
      page.getByRole("heading", { name: `${title} updated`, exact: true }),
    ).toBeVisible();
    await expect(page.getByText("09:00 WIB", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "A real database-backed event created during the acceptance test.",
      }),
    ).toBeVisible();
    await expect(page.locator(".event-description a")).toHaveAttribute(
      "href",
      "https://www.ieee.org",
    );
    await expect(page.locator(".event-description img")).toHaveAttribute(
      "alt",
      "Workshop participants",
    );
    await expect
      .poll(() =>
        page
          .locator(".event-description img")
          .evaluate((image) => (image as HTMLImageElement).naturalWidth > 0),
      )
      .toBe(true);
    expect(
      (
        await page.request.patch(`/api/events/${id}`, {
          data: { title: "" },
          headers: { Origin: origin },
        })
      ).status(),
    ).toBe(400);
    expect(
      (
        await page.request.patch(`/api/events/${id}`, {
          data: { title: "attack" },
          headers: { Origin: "https://untrusted.example" },
        })
      ).status(),
    ).toBe(403);
    expect(
      (
        await page.request.patch("/api/events/missing", {
          data: { title: "Missing" },
          headers: { Origin: origin },
        })
      ).status(),
    ).toBe(404);
    await page.goto("/admin/events");
    await page
      .getByRole("button", { name: `Delete ${title} updated`, exact: true })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    expect((await request.get(`/api/events/${id}`)).status()).toBe(200);
    await page
      .getByRole("button", { name: `Delete ${title} updated`, exact: true })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Delete event", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText(
      "Event deleted successfully",
    );
    expect((await request.get(`/api/events/${id}`)).status()).toBe(404);
    expect((await request.get(uploadedImage)).status()).toBe(404);
    expect((await request.get(inlineImageUrl!)).status()).toBe(404);
  } finally {
    if (id)
      await page.request.delete(`/api/events/${id}`, {
        headers: { Origin: origin },
      });
    if (inlineImageUrl)
      await page.request.delete(inlineImageUrl, {
        headers: { Origin: origin },
      });
  }
  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/events$/);
    await expect(
      page.getByRole("heading", { name: "Events", exact: true }),
    ).toBeVisible();
    await page.waitForLoadState("networkidle");
    await noOverflow(page);
    if (width === 390) {
      await page.screenshot({
        path: ".local/screenshots/admin-events-mobile.png",
        fullPage: true,
      });
      await page.locator(".danger-icon").first().click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.screenshot({
        path: ".local/screenshots/delete-dialog-mobile.png",
      });
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).not.toBeVisible();
    }
    await page.getByRole("link", { name: "Create event" }).click();
    await expect(
      page.getByRole("heading", { name: "Create event", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Admin actions" }).getByRole("link", {
        name: "Create event",
      }),
    ).toHaveCount(0);
    await noOverflow(page);
    if (width === 390) {
      await page.getByRole("button", { name: "Insert image" }).click();
      await expect(
        page.getByRole("dialog", { name: "Insert image" }),
      ).toBeVisible();
      await noOverflow(page);
      await page.screenshot({
        path: ".local/screenshots/description-file-picker-mobile.png",
      });
      await page.keyboard.press("Escape");
      await page.screenshot({
        path: ".local/screenshots/admin-form-mobile.png",
        fullPage: true,
      });
    }
  }
  await page.locator(".account-menu summary").click();
  await expect(page.locator(".account-menu")).toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await expect(page.locator(".account-menu")).not.toHaveAttribute("open", "");
  await page.locator(".account-menu summary").click();
  await expect(page.locator(".account-popover")).toContainText(email);
  await page.screenshot({
    path: ".local/screenshots/admin-profile-mobile.png",
  });
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  expect(
    (
      await page.request.post("/api/events", {
        data: {},
        headers: { Origin: origin },
      })
    ).status(),
  ).toBe(401);
});
