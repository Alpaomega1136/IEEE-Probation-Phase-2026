# Product Requirements Document — IEEE ITB Event Management

## 1. Product Overview

**IEEE ITB Event Management** is a lightweight fullstack web application used to showcase and manage IEEE ITB Student Branch events.

The product has two primary interfaces:

1. **Public interface** for visitors to browse events.
2. **Admin interface** for authorized administrators to manage event data.

The project is intended to demonstrate end-to-end fullstack engineering skills: frontend implementation, backend logic, database persistence, authentication, validation, and integration.

---

## 2. Problem Statement

IEEE ITB requires a simple platform where public users can discover event information while administrators can maintain event records without modifying source code.

Without such a platform:

- Event information can become fragmented or difficult to browse.
- Updating event information may require technical intervention.
- There is no centralized CRUD workflow for event data.

---

## 3. Product Goals

### G-01
Provide an accessible public event catalogue.

### G-02
Provide complete event details for each listed event.

### G-03
Provide secure admin authentication.

### G-04
Allow authenticated admins to create, edit, and delete events.

### G-05
Persist application data in a real database.

### G-06
Provide clear user feedback through validation, loading, empty, success, and error states.

### G-07
Provide a responsive experience across mobile and desktop.

### G-08
Maintain a clean and explainable fullstack architecture suitable for technical evaluation.

---

## 4. Non-Goals

The initial release does **not** require:

- Event registration/payment
- Public user accounts
- Ticketing
- Email campaigns
- Complex role hierarchy
- Advanced analytics
- CMS page builder
- Microservices
- Real-time features
- Production-scale infrastructure
- Complex asset management

These may only be considered after all core requirements are complete.

---

## 5. Users

### 5.1 Public Visitor

A user who wants to discover IEEE ITB events without logging in.

Needs:

- Understand what events are available.
- Quickly see dates, status, and location.
- Open complete event information.
- Use the site comfortably on mobile.

### 5.2 Administrator

An authorized IEEE ITB staff member responsible for maintaining event information.

Needs:

- Secure login.
- Quick overview of event records.
- Create new events.
- Update existing events.
- Safely delete events.
- Receive clear validation/error feedback.

---

## 6. Primary User Flows

### Public

```text
Home
  ↓
Event List
  ↓
Select Event
  ↓
Event Detail
```

### Admin

```text
Admin Login
  ↓
Authentication
  ↓
Dashboard
  ↓
Event Management
  ├── Create Event
  ├── Edit Event
  └── Delete Event
```

---

## 7. Functional Requirements

### Public

#### FR-PUB-001 — Homepage
The system shall provide a public homepage introducing IEEE ITB events and highlighting upcoming events.

#### FR-PUB-002 — Event List
The system shall provide an event list page showing available events and key information.

Minimum event-card information:

- Title
- Date
- Location
- Status

Optional:

- Event image
- Short description

#### FR-PUB-003 — Event Detail
A public user shall be able to open an event and view full information.

Minimum:

- Title
- Description
- Date
- Location
- Status

#### FR-PUB-004 — Empty State
If no events are available, the event list shall show a clear empty state.

#### FR-PUB-005 — Loading State
Data-dependent interfaces shall provide visible loading feedback.

#### FR-PUB-006 — Error State
If event retrieval fails, the user shall see an understandable error state.

### Authentication

#### FR-AUTH-001 — Admin Login
The system shall provide an admin login form.

#### FR-AUTH-002 — Protected Admin Routes
Unauthenticated users shall not access protected admin pages.

#### FR-AUTH-003 — Logout
Authenticated admins shall be able to log out.

#### FR-AUTH-004 — Server Authorization
Protected mutations shall be authorized on the server.

### Admin

#### FR-ADM-001 — Dashboard
The admin shall have a dashboard after successful authentication.

#### FR-ADM-002 — Manage Event List
The admin shall see existing event records.

#### FR-ADM-003 — Create Event
The admin shall be able to create an event.

#### FR-ADM-004 — Edit Event
The admin shall be able to update an existing event.

#### FR-ADM-005 — Delete Event
The admin shall be able to delete an event.

#### FR-ADM-006 — Delete Confirmation
Deletion shall require explicit confirmation before execution.

#### FR-ADM-007 — Form Validation
Create/edit forms shall validate required input before submission.

#### FR-ADM-008 — Backend Validation
The server shall validate event data before persistence.

---

## 8. Event Data Requirements

Each event must contain at least:

- `id`
- `title`
- `description`
- `date`
- `location`
- `status`

Recommended additions:

- `imageUrl`
- `createdAt`
- `updatedAt`

---

## 9. Non-Functional Requirements

### NFR-RESP-001
Core flows shall be functional on mobile and desktop.

### NFR-SEC-001
Passwords shall never be stored as plaintext.

### NFR-SEC-002
Sensitive secrets shall never be committed to Git.

### NFR-SEC-003
Client-side hiding shall never be treated as authorization.

### NFR-QUAL-001
The project shall use readable, modular, reusable code where appropriate.

### NFR-QUAL-002
Avoid unnecessary duplication.

### NFR-QUAL-003
Avoid premature abstraction and over-engineering.

### NFR-DATA-001
Event data shall persist in a database and shall not depend on hardcoded production mock data.

### NFR-GIT-001
Git history should use clear, meaningful commit messages.

---

## 10. MUST HAVE

- Public Event List
- Public Event Detail
- Admin Login
- Protected Admin Dashboard
- Create Event
- Edit Event
- Delete Event
- Delete confirmation
- Persistent database
- Frontend validation
- Backend validation
- Responsive core flows
- Loading state
- Empty state
- Error state
- README documentation

---

## 11. SHOULD HAVE

Only implement after MUST HAVE is complete:

- Event search
- Upcoming/Past filtering
- Pagination
- Event image upload or image URL workflow
- Improved authentication UX
- Reusable API/service layer
- Dashboard summary statistics

---

## 12. Acceptance Criteria

### Public
- [ ] `/` loads successfully.
- [ ] `/events` displays database-backed events.
- [ ] Clicking an event opens its detail.
- [ ] Invalid event IDs return a not-found experience.
- [ ] Empty event data produces an empty state.
- [ ] Loading and error states are visible.

### Authentication
- [ ] Valid admin credentials create a valid authenticated session.
- [ ] Invalid credentials show a safe error.
- [ ] Unauthenticated users cannot access protected admin pages.
- [ ] Logout invalidates the active session.

### CRUD
- [ ] Admin can create a valid event.
- [ ] Invalid event input is rejected.
- [ ] Admin can edit an event.
- [ ] Admin can delete an event.
- [ ] Delete requires confirmation.
- [ ] Public pages reflect persisted CRUD changes.

### Responsive UI
- [ ] Public navigation works on mobile.
- [ ] Event grid changes appropriately across breakpoints.
- [ ] Admin area remains usable on mobile.
- [ ] Forms do not overflow small screens.

---

## 13. Definition of Done

A feature is complete when:

1. The requirement is implemented.
2. Input is validated where applicable.
3. Error cases are handled.
4. Loading/empty states are implemented when data-dependent.
5. Mobile behavior is acceptable.
6. No secrets or unsafe authorization are introduced.
7. Relevant tests pass.
8. Documentation is updated if behavior/architecture changed.
