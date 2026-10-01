# DECISIONS.md

## Support Ticket Dashboard — Technical Decisions

This document records the important decisions, assumptions, trade-offs, and limitations made while building the Support Ticket Dashboard.

---

## 1. Unclear, Clashing, or Unsafe Points in the Brief

### 1.1 Data source was not completely specified

The brief requires a support-ticket dashboard and live updates, but it does not clearly define a production backend or database.

**Decision:**
I used a structured ticket-data layer with a clear separation between UI and data access. The application is designed so that a real API/backend can replace the initial data source without requiring a complete rewrite of the UI.

**Why:**
This keeps the application functional during development while maintaining a clear path toward production.

---

### 1.2 Meaning of "live updates" was unclear

It was not explicitly stated whether live updates required WebSockets, Server-Sent Events, polling, or simply updating the interface after an action.

**Decision:**
The application treats live updates as changes being reflected across the dashboard without requiring a full page refresh. The architecture can be extended to WebSockets or Server-Sent Events when a production backend is available.

**Why:**
A real-time transport layer requires a persistent backend. Without one, claiming that the application has true production-grade real-time synchronization would be misleading.

---

### 1.3 AI-generated information may not always be reliable

AI-generated ticket summaries, classifications, or suggestions can contain incorrect information.

**Decision:**
AI output is treated as an assistant rather than the source of truth. Important ticket information such as ticket status, priority, customer information, and actual ticket content remains authoritative.

**Why:**
AI can make mistakes, misunderstand context, or generate plausible but incorrect information.

---

### 1.4 Client-side state and server state could become inconsistent

Ticket information can exist both on the server and in the browser.

**Decision:**
The server/backend is considered the source of truth. Redux is used for client-side UI/application state and cached ticket information needed by multiple components.

**Why:**
This avoids treating browser state as the permanent source of ticket data.

---

### 1.5 URL state should not contain sensitive information

Filters and navigation state can be represented in the URL, but sensitive ticket information should not be placed there.

**Decision:**
Only non-sensitive navigation/filter information is stored in the URL, such as selected ticket ID, search parameters, status filters, and pagination where appropriate.

**Why:**
URLs can be copied, bookmarked, logged, or exposed through browser history.

---

## 2. How the App Handles Each Test Ticket

Each test ticket is handled using the same general flow:

1. The ticket is loaded into the dashboard.
2. Its basic information is displayed in the ticket list.
3. Selecting the ticket opens its detailed information.
4. Status, priority, assignee, and other supported fields are displayed.
5. Any supported update changes the client state and is synchronized with the data layer.
6. The UI updates without requiring the user to manually reload the entire page.
7. AI-generated information, where available, is displayed separately from authoritative ticket information.

### Ticket handling principles

* The original ticket content is preserved.
* Ticket status is treated as structured data rather than inferred from AI.
* Priority is treated as explicit ticket metadata when available.
* AI suggestions do not automatically overwrite important ticket fields.
* Invalid or incomplete ticket data should not cause the entire dashboard to fail.
* The same UI components are reused for different tickets to avoid ticket-specific hardcoding.

**Why:**
This makes the application predictable and prevents individual test tickets from receiving special treatment that would not work for real tickets.

---

## 3. Where Each Piece of Data Lives

| Data                        | Location                                                   | Reason                                                    |
| --------------------------- | ---------------------------------------------------------- | --------------------------------------------------------- |
| Ticket records              | Server/backend data layer                                  | The server should be the source of truth                  |
| Ticket ID                   | URL when viewing a specific ticket                         | Makes ticket pages shareable/bookmarkable                 |
| Search/filter parameters    | URL where appropriate                                      | Allows filtered views to be reproduced                    |
| Selected UI state           | Component state / Redux                                    | Only needed by the client                                 |
| Global dashboard state      | Redux                                                      | Shared between multiple components                        |
| Temporary form values       | Component state                                            | No reason to store temporary values globally              |
| UI loading state            | Component/Redux depending on scope                         | Keeps asynchronous UI behaviour manageable                |
| AI suggestions              | Client state / server response depending on implementation | AI output is temporary assistance, not authoritative data |
| Authentication/session data | Server/session layer                                       | Avoid exposing sensitive credentials in client state      |
| Static configuration        | Application configuration                                  | Does not need to be stored as ticket data                 |

### General rule

The decision was to avoid putting everything into Redux.

Redux is used when multiple parts of the application need the same client-side state. Component state is used for local UI state. URL state is used when the state should survive refreshes or be shareable. Server-side storage is used for authoritative application data.

---

## 4. Why Redux Is Used

Redux is used for shared client-side state such as:

* Loaded tickets
* Current dashboard filters where appropriate
* Shared ticket-selection state
* Application-level UI state that needs to be accessed by multiple components

Redux is **not** treated as the permanent database.

**Reason:**
A browser refresh can remove client state, while the server should retain the actual ticket information.

---

## 5. How URL State Works

The URL is used for state that is useful to preserve or share.

Examples include:

* Selected ticket ID
* Search query
* Status filter
* Priority filter
* Pagination information

For example, a URL could conceptually represent:

`/tickets/123`

or:

`/tickets?status=open&priority=high`

The exact URL structure can change without changing the underlying ticket data model.

**Reason:**
URL state makes navigation predictable and allows users to refresh or share a particular dashboard view.

---

## 6. How Live Updates Work

The application is designed so that updates are reflected in the dashboard without requiring a complete page reload.

The general update flow is:

1. A user performs an action, such as changing a ticket status.
2. The application sends the update to the data layer/backend.
3. The successful result updates the client-side state.
4. Components subscribed to that state re-render automatically.
5. The updated ticket becomes visible throughout the dashboard.

### Production consideration

True multi-user real-time synchronization would require a backend mechanism such as:

* WebSockets
* Server-Sent Events
* Another real-time event system

If those services are not available in the current development environment, the application should not claim that it provides production-grade multi-user real-time synchronization.

**Reason:**
Updating the local UI immediately is different from receiving changes made by another user on another computer.

---

## 7. How Much We Trust the AI

AI output is considered **advisory** rather than authoritative.

AI may be useful for:

* Summarizing a ticket
* Suggesting a category
* Suggesting a priority
* Drafting a response
* Identifying possible next steps

AI should not independently be trusted to:

* Change critical ticket information without validation
* Make irreversible decisions
* Override explicit ticket metadata
* Replace the original customer message
* Be treated as factual simply because the response sounds confident

### Trust model

The application follows this principle:

**Ticket data > validated application logic > AI suggestion**

AI suggestions should be clearly distinguishable from confirmed ticket information.

**Why:**
Large language models can produce incorrect or unsupported information. Human review remains important for customer-support decisions.

---

## 8. What Was Skipped Because of Time

The following areas were kept limited or postponed where they were not necessary to demonstrate the core dashboard:

* Full production backend infrastructure
* Complete authentication and role-management system
* Production-grade WebSocket infrastructure
* Comprehensive automated testing
* Extensive error monitoring
* Advanced AI evaluation
* Full audit logging
* Large-scale performance optimization
* Comprehensive accessibility testing
* Production deployment configuration
* Advanced ticket permissions

These omissions were deliberate scope decisions rather than assumptions that the features are unnecessary.

---

## 9. What I Would Do With One More Week

With another week, I would focus on making the application production-ready.

### Day 1–2: Backend and data

* Connect the dashboard to a proper backend/API.
* Add persistent ticket storage.
* Add validation for ticket updates.
* Improve API error handling.

### Day 3: Real-time updates

* Add WebSockets or Server-Sent Events.
* Synchronize ticket changes between multiple users.
* Handle reconnects and connection failures.

### Day 4: Testing

Add automated tests for:

* Ticket loading
* Filtering
* Searching
* Status updates
* Priority changes
* Error states
* AI response handling

### Day 5: Security and permissions

* Add authentication.
* Add role-based permissions.
* Validate all server requests.
* Ensure sensitive information is not exposed through URLs or client state.

### Day 6: AI reliability

* Add validation around AI responses.
* Clearly label AI-generated information.
* Add human confirmation for important actions.
* Test AI behaviour against incorrect and ambiguous tickets.

### Day 7: Polish and deployment

* Improve accessibility.
* Improve loading and empty states.
* Add monitoring/logging.
* Perform final UI testing.
* Deploy the application and verify it in a production-like environment.

---

## 10. Example of a Tool or Suggestion That Was Wrong/Poor

During development, an automatically generated implementation suggestion can appear correct while still referring to a file or component that does not actually exist in the project.

For example, the application initially attempted to import:

`@/components/dashboard/ticket-dashboard`

but the corresponding module was not available at the expected path.

This resulted in a module-resolution error similar to:

`Module not found: Can't resolve '@/components/dashboard/ticket-dashboard'`

### How I noticed it

The Next.js build process reported the missing module and identified the import line in `app/page.tsx`.

I then checked the actual project directory structure instead of assuming that the suggested path existed.

The project contained both:

* `app/page.tsx`
* `src/app/page.tsx`

which also indicated that the project structure needed to be checked carefully before deciding which application entry point should be used.

### Decision

I treated the generated suggestion as a proposal rather than guaranteed truth. The actual filesystem and build errors were used as the source of truth.

**Lesson:**
AI-generated code and tool suggestions must be verified against the actual project structure, dependencies, and runtime behaviour.

---

## 11. Overall Architecture Decision

The overall architecture follows this principle:

**Server = authoritative data**

**URL = shareable/navigation state**

**Redux = shared client-side state**

**Component state = local temporary UI state**

**AI = advisory assistance**

This separation makes the application easier to reason about, debug, test, and extend.

---

## 12. Final Decision Summary

The main goal was to build a functional and understandable support-ticket dashboard without pretending that development-time functionality is equivalent to production infrastructure.

Where the brief was ambiguous, the implementation favours:

* Clear separation of responsibilities
* Server-authoritative data
* Minimal sensitive information in URLs
* Shared state only where necessary
* Reusable ticket components
* Human oversight of AI-generated information
* Explicit acknowledgement of unfinished production features

These decisions are intended to make the current implementation reliable while leaving a clear path for future development.

