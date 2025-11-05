# Appmixer Development Guide - Index

Quick navigation for AI agents and developers.

## Structure

**Parts**: 1-5 below. Each part contains focused modules for specific needs.

---

## Part 1: Connectors

Start here to understand connector architecture.

- **[Overview](01-connectors/overview.md)** - What are connectors and their role
- **[Connector Structure](01-connectors/structure.md)** - File organization and layout
- **[service.json](01-connectors/service-json.md)** - Service metadata configuration
- **[bundle.json](01-connectors/bundle-json.md)** - Bundle versioning and changelog
- **[quota.js](01-connectors/quota.md)** - Rate limiting configuration

---

## Part 2: Authentication

Choose the right authentication method for your service.

- **[Overview](02-authentication/overview.md)** - Authentication types available
- **[API Key Authentication](02-authentication/api-key.md)** - For token/API key based services
- **[OAuth 2.0 Authentication](02-authentication/oauth2.md)** - For OAuth2 services

---

## Part 3: Components

The core building blocks of workflows.

### Component Fundamentals

- **[Overview](03-components/overview.md)** - What are components
- **[Configuration (component.json)](03-components/configuration.md)** - Full schema and structure
- **[Behavior (JavaScript)](03-components/behavior.md)** - Implementation patterns

### Component Types & Patterns

- **[Find Components](03-components/types/find-components.md)** - Search/filter with array output
- **[List Components](03-components/types/list-components.md)** - Retrieve all items
- **[Get Components](03-components/types/get-components.md)** - Fetch single item by ID
- **[Create Components](03-components/types/create-components.md)** - Create new items
- **[Delete Components](03-components/types/delete-components.md)** - Remove items
- **[Update Components](03-components/types/update-components.md)** - Modify items
- **[Trigger Components](03-components/types/triggers.md)** - Monitor for events

---

## Part 4: Advanced Topics

- **[Plugins, Routes & Jobs](04-plugins-routes-jobs.md)** - Server-side extensions

---

## Part 5: Best Practices

- **[Code Style](05-best-practices/code-style.md)** - Formatting and naming conventions
- **[Development Guidelines](05-best-practices/development-guidelines.md)** - Rules and requirements
- **[Performance](05-best-practices/performance.md)** - Optimization strategies
- **[Testing](05-best-practices/testing.md)** - Unit testing patterns
- **[Common Patterns](05-best-practices/common-patterns.md)** - Reusable solutions

---

## For AI Agents: LangGraph Workflow Recommendations

### Step 1: Generate Authentication

**Load**: `02-authentication/overview.md` → specific auth type file  
**Output**: `auth.js`

### Step 2: Generate Components

**Load**: `03-components/overview.md` → `03-components/types/{component-type}.md`  
**Output**: `component.json` and `{ComponentName}.js`

### Step 3: Test & Refactor

**Load**: `05-best-practices/testing.md` + `05-best-practices/code-style.md`  
**Output**: Updated component files

---

## Quick Reference

| Need | Location |
|------|----------|
| Understand component.json schema | `03-components/configuration.md` |
| Create a Find component | `03-components/types/find-components.md` |
| Setup OAuth2 | `02-authentication/oauth2.md` |
| Code style rules | `05-best-practices/code-style.md` |
| Testing guidelines | `05-best-practices/testing.md` |

---

## Document Information

- **Last Updated**: November 5, 2025
- **Purpose**: Comprehensive guide for developing Appmixer connectors and components
- **Target Audience**: AI agents (LangGraph), developers, and technical leads
