# PipelineIQ Case Study

## Project Overview

PipelineIQ is a multi-user B2B Sales CRM built to help users manage companies, contacts, deals, and sales pipeline movement inside one focused workspace. The project was built using Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth, Supabase PostgreSQL, Supabase Row Level Security, GitHub, and Vercel.

The goal was to build a real, deployed, full-stack product instead of a simple demo. PipelineIQ focuses on practical CRM workflows: creating company records, attaching contacts, creating deals, and moving those deals through a pipeline from new opportunity to closed outcome.

## Problem

Sales data often becomes scattered when companies, people, and opportunities are managed separately. A user may know the deal value but not the linked contact, or may have contacts without clear company context. This makes follow-ups, tracking, and decision-making harder.

PipelineIQ solves this by enforcing a clear workflow:

Company → Contact → Deal → Pipeline → Dashboard

## Target Users

PipelineIQ is designed for small B2B teams, founders, freelancers, and sales operators who need a simple CRM workspace to track business relationships and opportunities without unnecessary complexity.

## Approach

The first decision was to model the core CRM entities clearly. Companies act as the base account record. Contacts belong to companies. Deals belong to companies and can optionally be connected to contacts. This structure keeps the CRM data relational and easier to understand.

Supabase Auth was used for authentication, while Supabase PostgreSQL stores the CRM data. Row Level Security was used to make sure users can only access their own records. Companies and contacts are scoped using `user_id`, while deals are scoped using `owner_id`.

The UI was designed around usability. The dashboard gives a quick overview, the company and contact pages focus on clean record management, the deals page supports search/filter/sort, and the pipeline page gives a Kanban-style view for stage movement.

## Core Features

- Public landing page
- Register, login, and logout flow
- Protected dashboard workspace
- Company management
- Contact management
- Deal creation, detail, edit, and delete flow
- Pipeline board with stage movement
- Active, inactive, and archived lifecycle states
- Archived record protection in new creation forms
- Responsive UI
- Production deployment on Vercel

## Security and Data Protection

A major focus was user-scoped access. Dashboard data is fetched only for the authenticated user. Deal updates use both the deal ID and the authenticated owner ID, reducing the risk of cross-user access.

Archived records are preserved for historical context but hidden from new creation forms. This keeps the CRM clean while avoiding accidental loss of important business history.

## UI/UX Decisions

The product uses a dark, focused dashboard interface with clear navigation and strong hierarchy. The landing page explains the product, while the dashboard prioritizes actions and data. Empty, loading, error, and success states were added so users do not face blank or confusing screens.

The pipeline board supports stage movement through dropdowns and previous/next buttons instead of relying only on drag-and-drop. This keeps the interaction simple, accessible, and reliable.

## Challenges

One challenge was keeping the relationship between companies, contacts, and deals consistent while still allowing flexibility. Another challenge was handling archived records correctly so old data remains visible where needed but does not appear in new creation flows.

The pipeline also required careful handling because stage movement affects deal status. Moving a deal to Won sets it as won, moving it to Lost sets it as lost, and other stages keep it open.

## Result

PipelineIQ is deployed, documented, and usable as a real full-stack CRM project. It includes authentication, relational data modeling, protected routes, CRUD workflows, lifecycle handling, pipeline movement, responsive UI, README documentation, demo credentials, screenshots, and a demo video.

## Known Limitations

The current version focuses on the core CRM workflow. It does not yet include team workspaces, role-based permissions, drag-and-drop pipeline movement, activity logs, reminders, CSV export, or advanced analytics.

## Future Improvements

Future improvements could include organization/team support, role-based access, activity history, notes, reminders, CSV export, charts, email integration, and drag-and-drop pipeline interactions.

## What I Learned

This project helped me understand how full-stack SaaS products are structured beyond just UI. I learned how to think about data relationships, authentication, RLS security, protected routes, lifecycle states, user experience, deployment, and documentation. It also helped me practice building with product thinking: not just making features work, but making them understandable, safe, and useful for a real reviewer.