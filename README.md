# CarFix frontend

CarFix helps customers find car repair workshops and book available visits online. Workshop owners use it to manage their branches and the resources needed for repairs.

This repository contains the web interface. The [backend README](https://github.com/DmytroHutnyk/carfix-backend#readme) is the main project overview and explains the booking logic, backend architecture, database, and full CI/CD process.

## Features

- Workshop search by location, car, services, and availability, with workshop details and maps.
- A booking flow for up to three services in one visit.
- Customer accounts, saved car profiles, bookings, cancellations, and reviews.
- An owner dashboard for branches, services, employees, equipment, bays, and bookings.

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS, and shadcn/ui. TanStack Query manages API data, Zustand stores client state, and React Hook Form with Zod handles forms and validation. Maps use the Google Maps JavaScript API.

## Checks and deployment

GitHub Actions checks TypeScript and builds the production application on pull requests and pushes to `dev`. A push to `main` or a manual release checks TypeScript, builds the production Docker image, publishes `latest` and commit-SHA tags to GitHub Container Registry, and triggers shared deployment.

`NEXT_PUBLIC_API_BASE` and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` are supplied during the Docker build. Production uses `/api` through the shared HTTPS entry point. Changing these values requires rebuilding the image.

See the [main CI/CD documentation](https://github.com/DmytroHutnyk/carfix-backend#cicd) for deployment steps and required configuration.
