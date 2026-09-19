# Design Specification

## Implemented Design Note

The September 2026 visual revision adopts a campus technology publication direction: oversized poster typography over workbench photography, a yellow-green next-event band driven by database data, asymmetric upcoming-event composition, date-stamped catalogue entries, and an editorial archive list. Forest, off-white, and signal-yellow accents distinguish the public identity, with serif italics reserved for section headings and monospace metadata. The admin workspace uses restrained matching accents. Existing navigation, data contracts, status labels, and CRUD workflows remain in place. Mobile layouts reflow without hiding essential event information; motion respects reduced-motion preferences.

The finished homepage uses a full-width photographic hero with the literal heading "IEEE ITB Events" and a visible lead-in to the upcoming-events section. This supersedes the split-column hero recommendation below. Public pages retain the specified conference-style hierarchy; the admin area uses a separate, compact workspace. Images and seeded event schedules are illustrative demo content. Interface copy is in English, with dates and times displayed in WIB.

## 1. Direction

The public interface should use the visual hierarchy of a modern conference/event website inspired by a **Symposium-style layout**, but it should not copy the template directly.

The admin interface must use a separate application/dashboard layout.

Design qualities:

- Clean
- Professional
- Technical
- Academic
- Minimal
- Readable
- Responsive

Avoid:

- Excessive gradients
- Excessive animation
- Heavy glassmorphism
- Decorative elements without function
- Overly long marketing pages
- Dashboard visual clutter

---

## 2. Public Information Architecture

```text
Navbar
  ↓
Hero
  ↓
Upcoming Events
  ↓
About IEEE ITB
  ↓
Past Events
  ↓
CTA
  ↓
Footer
```

Recommended navigation:

```text
IEEE ITB | Home | Events | About | Admin Login
```

Mobile navigation:

```text
IEEE ITB                  [Menu]
```

---

## 3. Homepage

### Hero

Desktop: two columns.

```text
┌─────────────────────────────────────────────────────────────┐
│ IEEE ITB | Home | Events | About | Admin Login             │
├───────────────────────────────┬─────────────────────────────┤
│ Eyebrow                       │                             │
│ Main headline                 │      Event/IEEE visual      │
│ Supporting paragraph          │                             │
│ [Explore Events]              │                             │
└───────────────────────────────┴─────────────────────────────┘
```

Mobile: image and content stack vertically.

Primary CTA: **Explore Events**.

### Upcoming Events

Desktop: 3-column card grid.

Tablet: 2 columns.

Mobile: 1 column.

Event card:

```text
┌──────────────────────┐
│      Event Image     │
├──────────────────────┤
│ SEP 24     UPCOMING  │
│ Event Title          │
│ Location             │
│ View Details →       │
└──────────────────────┘
```

### About

Short section only. Do not turn the project into a corporate website.

### Past Events

Reuse the same event-card component with a different status.

---

## 4. Event List Page

Route: `/events`

```text
Events
Discover IEEE ITB events.

[ Search events... ] [ All / Upcoming / Past ]

[ Event Card ][ Event Card ][ Event Card ]
[ Event Card ][ Event Card ][ Event Card ]
```

Search/filter are optional SHOULD HAVE functionality.

Required states:

### Loading
Use skeleton cards.

### Empty
Message:

> No events are available at the moment.

### Error
Message with retry:

> Failed to load events.

---

## 5. Event Detail

Route: `/events/[id]`

```text
← Back to Events

[ Full-width / large cover ]

Event Title
[STATUS]

Date
Location

────────────────────────────────────

Event Description           Event Information
Long content                Date
                            Location
                            Status
```

Desktop: two-column lower content.

Mobile: one column.

---

## 6. Admin Layout

Do not reuse the public marketing navigation.

```text
┌───────────────┬──────────────────────────────────────────────┐
│ IEEE Admin    │ Header                                       │
│               ├──────────────────────────────────────────────┤
│ Dashboard     │ Main Content                                 │
│ Events        │                                              │
│               │                                              │
│ Logout        │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

Mobile:

- Sidebar becomes drawer/sheet.
- Main content uses full width.
- Critical actions remain reachable.

---

## 7. Admin Dashboard

Keep analytics simple.

Suggested cards:

- Total Events
- Upcoming Events
- Past/Completed Events

Below cards:

- Recent Events
- Link to Event Management

Do not implement advanced charts for the core version.

---

## 8. Event Management

Desktop table:

| Event | Date | Location | Status | Actions |
|---|---|---|---|---|

Actions:

- Edit
- Delete

Header action:

`+ Add Event`

Mobile can use horizontally scrollable table or event management cards.

---

## 9. Forms

Create and Edit should reuse one form component.

Fields:

- Title
- Description
- Date
- Location
- Status
- Image URL (optional)

Form states:

- Default
- Invalid
- Submitting
- Success
- Server Error

Error messages must appear near relevant fields.

---

## 10. Delete Dialog

```text
Delete Event?

Are you sure you want to delete
"IEEE Technology Conference 2026"?

This action cannot be undone.

[Cancel] [Delete Event]
```

Delete button should visually communicate destructive action.

---

## 11. Design Tokens

Exact branding colors may be adjusted during implementation.

Recommended structural tokens:

### Spacing
Use a consistent scale:

- 4
- 8
- 12
- 16
- 24
- 32
- 48
- 64
- 96

### Radius
Use moderate rounding. Avoid excessive pill-shaped surfaces.

### Shadow
Use subtle elevation only where hierarchy benefits.

### Typography
Hierarchy:

- Display / Hero
- H1
- H2
- H3
- Body
- Small / Metadata

Prefer strong heading contrast and highly readable body text.

---

## 12. Accessibility

- Use semantic headings.
- Inputs require labels.
- Dialog must be keyboard accessible.
- Interactive elements need visible focus states.
- Images require meaningful `alt` where applicable.
- Do not rely only on color to communicate status.
