# CarFix frontend

CarFix helps customers find car repair workshops and book available visits online. Workshop owners use it to manage their branches and the resources needed for repairs.

This repository contains the web interface. The [backend README](https://github.com/DmytroHutnyk/carfix-backend#readme) is the main project overview and explains the booking logic, backend architecture, database, and full CI/CD process.

## Customer and owner flows

**Customers** search by location, car, service, and availability. Workshop pages show services, prices, opening hours, reviews, and a map. Customers select up to three services, choose an available time, review the visit, and confirm it. Their account holds saved car profiles and bookings, with options to cancel visits and write reviews.

**Workshop owners** have a separate business area. A step-by-step form collects branch details, opening hours, supported car brands, services, and resources. Branch pages group services, employees, equipment, bays, bookings, and reviews into tabs, keeping daily management in one place.

The interface includes mobile navigation and responsive layouts for smaller screens. Loading, empty, and error states help users understand when data is still arriving or an action needs attention.

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS, and shadcn/ui. TanStack Query manages API data, Zustand stores client state, and React Hook Form with Zod handles forms and validation. Maps use the Google Maps JavaScript API.

## Frontend structure

The Next.js App Router separates public pages, customer account pages, authentication, and the owner area. Page-specific components stay beside their routes; shared UI elements are reused across screens.

| Folder | Purpose |
| --- | --- |
| `app/` | Routes, layouts, and page-specific components |
| `features/` | API calls, types, and query hooks grouped by feature |
| `app/_components/` | Shared interface components |
| `lib/` | API client, state stores, providers, and shared helpers |

## Data and booking updates

TanStack Query caches backend data and refreshes affected queries after changes. Zustand remembers choices such as the search location and selected car profile. Search criteria are represented in the URL, while temporary booking selections stay within the booking flow.

A shared API client sends session cookies and converts backend errors into consistent messages. Protected pages check the signed-in account and role; the backend enforces access permissions. Form validation gives feedback before submission and displays errors returned by the API.

Available times come from the backend booking engine. After booking or cancellation, the frontend invalidates the affected slot data so it can be fetched again. If a chosen time becomes unavailable before confirmation, the flow explains the conflict and returns the customer to time selection.

## Checks and deployment

GitHub Actions checks TypeScript and builds the production application on pull requests and pushes to `dev`. A push to `main` or a manual release checks TypeScript, builds the production Docker image, publishes `latest` and commit-SHA tags to GitHub Container Registry, and triggers shared deployment.

`NEXT_PUBLIC_API_BASE` and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` are supplied during the Docker build. Production uses `/api` through the shared HTTPS entry point. Changing these values requires rebuilding the image.

See the [main CI/CD documentation](https://github.com/DmytroHutnyk/carfix-backend#cicd) for deployment steps and required configuration.
