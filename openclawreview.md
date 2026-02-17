# GPTCustomerPortalWeb - OpenClaw Review

## What It Is

A B2B self-service web portal built with Next.js 14 that integrates with Dynamics 365 Business Central. Allows customers to view invoices, orders, shipments, track balances, and initiate return orders. Consists of a Next.js frontend and a companion Business Central AL extension (separate repo).

## 5 Main Functions

1. **Customer Authentication** - Session-based login using Customer No. and Password, validated against Business Central customer records.

2. **Dashboard & Financial Summary** - Summary cards showing current balance, overdue amounts, and sales YTD with quick navigation to key sections.

3. **Document Management** - Searchable, sortable list views for invoices, orders, shipments, credit memos, and return orders with detail pages.

4. **Return Order Creation** - From shipment details, customers can select lines and quantities to create sales return orders directly in Business Central.

5. **PDF Document Generation** - API routes that fetch Base64-encoded PDFs from Business Central for invoices, orders, credit memos, and statements, then stream to the browser.

## Suggested Improvements

- **Upgrade to Next.js 15** - Current version is 14.2.5; upgrading to 15 would provide latest App Router features and performance improvements.
- **Add OAuth2 Authentication** - Replace session-based auth with proper OAuth2 for BC API calls to improve security.
- **Add Unit Tests** - No test files present; add Jest/Vitest for component and API route testing.
- **Improve Error Handling** - Add user-friendly error messages and loading states across all pages.
- **Add Audit Logging** - Track customer actions (login, document views, return orders) for security and support.
