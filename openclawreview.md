# GM-Test - OpenClaw Review

## What It Is
A test/template repository containing a Product Requirements Document (PRD) and AI prompt for building a Business Central Customer Portal. It also includes a starter Next.js portal application with authentication, dashboard, and document viewing capabilities.

## 5 Main Functions

1. **PRD Documentation** - Contains comprehensive Product Requirements Document for a BC Customer Portal with technical architecture (Next.js frontend + BC AL extension backend)
2. **AI Agent Prompt** - Detailed prompt for generating the full-stack BC Customer Portal solution
3. **Next.js Portal Starter** - Working Next.js 15+ application with TypeScript and Tailwind CSS
4. **Authentication System** - Session-based login with Customer No. + Password validation
5. **Document Management** - Views for invoices, orders, shipments, returns, and transactions with PDF download capability

## Suggested Improvements

1. **Add .gitignore to portal** - The portal folder is missing a proper .gitignore (node_modules, .next should be ignored)
2. **Environment variable validation** - Add runtime validation for required env vars (BC_TENANT_ID, BC_CLIENT_ID, etc.)
3. **Error handling** - Add error boundaries and user-friendly error messages for API failures
4. **Type safety** - Some areas lack proper TypeScript types; add comprehensive type definitions for BC API responses
5. **Testing** - No test files present; add unit tests for API routes and component tests for UI
