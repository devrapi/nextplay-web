# NextPlay - League Management System

## Project Overview

NextPlay is a modern League Management System designed to manage sports leagues, tournaments, teams, players, schedules, standings, statistics, and news.

The system consists of:

- Public Website
- Admin Panel
- REST API

The goal is to build a scalable, maintainable, and production-ready application similar to professional sports websites like PBA.ph.

---

# Tech Stack

Backend

- Laravel 12
- PHP 8.3+
- MySQL

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

Authentication

- Laravel Authentication
- sanctum

Development

- Git
- GitHub
- PHPUnit
- Pest
- ESLint
- Prettier

Deployment

- Docker (future)
- AWS (future)
- CI/CD (future)

---

# Project Goals

The project should be:

- Fast
- Secure
- Responsive
- Maintainable
- Modular
- Reusable
- SEO Friendly
- Mobile Friendly

---

# Public Website

Pages

- Home
- Schedule
- Results
- Teams
- Players
- Standings
- Statistics
- News
- Gallery
- Contact

---

# Admin Modules

Dashboard

League Management

- Seasons
- Categories
- Venues
- Teams
- Players
- Coaches
- Referees
- Tournaments
- Games
- Scoreboard

Content

- News
- Gallery

Administration

- Users
- Roles
- Permissions

Reports

- Attendance
- Game Reports
- Team Reports
- Player Reports

---

# Development Philosophy

Always prefer:

- Reusable Components
- DRY
- SOLID
- Clean Architecture
- Service Layer
- Repository Pattern (when needed)
- Feature Based Structure

Avoid duplicated code.

---

# Coding Standards

Backend

- Fat Models ❌
- Fat Controllers ❌
- Business Logic inside Controller ❌

Business logic belongs inside Services.

Frontend

Pages

pages/

Reusable UI

components/

Business Components

features/

API

services/

Types

types/

Utilities

lib/

---

# Naming Convention

Classes

PascalCase

Variables

camelCase

Database

snake_case

Routes

kebab-case

Components

PascalCase

Files

PascalCase.tsx

---

# Database Rules

Always use

- Foreign Keys
- Indexes
- Soft Deletes when applicable
- Proper Constraints

Never duplicate data unnecessarily.

---

# API Rules

Use

- Form Requests
- API Resources
- Validation
- Pagination
- HTTP Status Codes

Every endpoint should return consistent JSON.

---

# UI/UX Rules

Use

- Responsive Design
- Accessible Components
- Loading States
- Empty States
- Error States
- Confirmation Dialogs

---

# Future Features

- Live Scoreboard
- Live Statistics
- Player Career Stats
- Team History
- Tournament Brackets
- Push Notifications
- Mobile App
- Multi League Support
