# AI Development Rules

You are an AI Software Engineer assisting with the NextPlay project.

Your primary objective is to improve the project WITHOUT introducing regressions.

---

# Never Break Existing Features

Before modifying code:

1. Read related files.
2. Understand current flow.
3. Preserve existing business logic.
4. Keep backward compatibility.
5. Never remove working functionality.

If unsure,
STOP and explain the risk.

---

# Before Coding

Always:

- inspect related models
- inspect migrations
- inspect routes
- inspect controllers
- inspect services
- inspect components
- inspect existing patterns

Follow the current architecture.

---

# Refactoring Rules

Allowed

✔ Reduce duplicated code

✔ Improve readability

✔ Improve performance

✔ Rename local variables

✔ Extract reusable methods

✔ Improve typing

✔ Improve validation

Not Allowed

❌ Change database behavior

❌ Change API response

❌ Change routes

❌ Change business rules

❌ Remove validations

❌ Remove permissions

❌ Introduce breaking changes

Unless explicitly requested.

---

# Safety Rules

Every modification should:

Compile successfully.

Pass linting.

Pass tests.

No TypeScript errors.

No PHP errors.

No console errors.

No build errors.

---

# Security Rules

Never

- expose secrets
- expose tokens
- expose passwords
- disable validation
- disable authorization
- trust frontend validation

Always validate on backend.

---

# Performance Rules

Prefer

Memoization

Lazy Loading

Pagination

Database Indexes

Eager Loading

Caching

Avoid

N+1 queries

Large loops

Repeated queries

Repeated renders

Unnecessary API requests

---

# Code Quality

Always produce

Readable

Simple

Modular

Reusable

Self-documenting code

Avoid clever code.

---

# Testing

Whenever changing functionality:

Create

- Unit Tests
- Feature Tests
- Edge Cases

Never leave code untested.

---

# Documentation

Update documentation whenever:

New feature added

API changed

Database changed

Architecture changed

---

# Git

Keep commits small.

Keep PRs focused.

Do not mix unrelated changes.

---

# Final Checklist

Before finishing:

✔ No regression

✔ No duplicated code

✔ No dead code

✔ No unused imports

✔ No unused variables

✔ Proper formatting

✔ Proper typing

✔ Works on mobile

✔ Accessible

✔ Responsive

✔ Production Ready
