# System Flow

## 1. System Context

```mermaid
flowchart LR
    P[Public User] --> WEB[IEEE Event Web]
    A[Admin] --> WEB
    WEB --> AUTH[Authentication]
    WEB --> API[Application Logic]
    API --> DB[(PostgreSQL)]
```

---

## 2. Public Event Flow

```mermaid
flowchart TD
    H[Open Homepage] --> U[View Upcoming Events]
    U --> E[Open Events Page]
    E --> L[Load Event List]
    L -->|Success| C[Display Event Cards]
    L -->|No Data| X[Display Empty State]
    L -->|Failure| R[Display Error + Retry]
    C --> S[Select Event]
    S --> D[Load Event Detail]
    D -->|Found| V[Display Event Detail]
    D -->|Not Found| N[404 / Not Found]
```

---

## 3. Admin Login Flow

```mermaid
flowchart TD
    L[Admin Login Page] --> F[Submit Credentials]
    F --> V[Validate Input]
    V -->|Invalid| FE[Show Form Error]
    V -->|Valid| C[Check Credentials]
    C -->|Invalid| CE[Show Invalid Credentials]
    C -->|Valid| S[Create Secure Session]
    S --> D[Redirect to Dashboard]
```

---

## 4. Protected Route Flow

```mermaid
flowchart TD
    R[Request /admin route] --> S{Valid Session?}
    S -->|No| L[Redirect /admin/login]
    S -->|Yes| A{Authorized Admin?}
    A -->|No| F[Forbidden]
    A -->|Yes| P[Render Protected Page]
```

---

## 5. Create Event

```mermaid
flowchart TD
    A[Admin opens Create Event] --> F[Fill Form]
    F --> C[Client Validation]
    C -->|Invalid| E1[Show Field Errors]
    C -->|Valid| S[Submit to Server]
    S --> AU[Authenticate + Authorize]
    AU --> Z[Server Zod Validation]
    Z -->|Invalid| E2[Return Validation Error]
    Z -->|Valid| DB[Insert Event]
    DB -->|Success| OK[Success Feedback]
    OK --> R[Redirect/Revalidate Event List]
    DB -->|Failure| E3[Show Safe Server Error]
```

---

## 6. Edit Event

```mermaid
flowchart TD
    A[Open Edit Page] --> G[Get Event]
    G -->|Missing| N[Not Found]
    G -->|Found| P[Prefill Form]
    P --> S[Submit Changes]
    S --> AU[Authenticate + Authorize]
    AU --> V[Validate]
    V -->|Invalid| E[Show Errors]
    V -->|Valid| U[Update DB]
    U --> O[Success + Revalidate]
```

---

## 7. Delete Event

```mermaid
flowchart TD
    D[Click Delete] --> M[Open Confirmation Dialog]
    M -->|Cancel| X[Close Dialog]
    M -->|Confirm| S[Send Delete Request]
    S --> A[Authenticate + Authorize]
    A --> F[Find Event]
    F -->|Missing| N[Not Found Error]
    F -->|Found| R[Delete Record]
    R --> O[Success + Refresh List]
```

---

## 8. Database Interaction Rule

All production CRUD flows must follow:

```text
UI
 ↓
Server Boundary
 ↓
Authentication/Authorization (when protected)
 ↓
Validation
 ↓
Service/Data Access
 ↓
Prisma
 ↓
PostgreSQL
```

The UI must never write directly to the database.

---

## 9. State Model

Data pages should explicitly support:

```text
Idle → Loading → Success
              ↘ Empty
              ↘ Error
```

Mutations should support:

```text
Idle → Submitting → Success
                ↘ Validation Error
                ↘ Server Error
```
