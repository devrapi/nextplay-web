# Optimization Guide

## Backend

Prefer

- eager loading
- pagination
- query scopes
- caching
- indexes

Avoid

- N+1 queries
- duplicated queries
- nested loops

---

## Frontend

Prefer

- React.memo
- useMemo
- useCallback
- Lazy Loading
- Code Splitting

Avoid

- unnecessary re-render
- duplicated state
- prop drilling

---

## Database

Always

- index foreign keys
- paginate lists
- optimize joins

Never

SELECT \*

when unnecessary.

---

## Components

Every component should have:

Single responsibility.

Reusable props.

Strict TypeScript types.

No duplicated JSX.

---

## Forms

Always

Validate frontend.

Validate backend.

Display errors.

Disable submit while processing.

---

## Tables

Support

Search

Pagination

Sorting

Filtering

Bulk Actions

Loading

Empty State

Error State

---

## Images

Lazy load.

Compress.

Responsive sizes.

WebP when possible.

---

## Accessibility

Keyboard navigation.

ARIA labels.

Proper headings.

Color contrast.

Screen reader support.

---

## SEO

Unique titles.

Meta description.

Open Graph.

Twitter Cards.

Structured Data.

Canonical URLs.

Sitemap.

Robots.txt.

---

## Production Checklist

- No debug code
- No console.log
- No commented code
- No unused imports
- No dead code
- Optimized queries
- Optimized assets
- Minified build
- Security reviewed
- Tested
