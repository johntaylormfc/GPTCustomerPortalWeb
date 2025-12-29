### Product Requirement Document (PRD)

**Product Name:** Business Central Customer Portal
**Version:** 1.0
**Date:** December 27, 2025

#### 1. Executive Summary
The Business Central Customer Portal is a secure, web-based self-service application that allows B2B customers to interact with their account data stored in Dynamics 365 Business Central. It enables customers to view invoices, orders, and shipments, download documents (PDFs), track account balances, and initiate return orders. The solution consists of a "headless" Next.js frontend and a custom Business Central AL extension that exposes necessary data via REST APIs.

#### 2. Technical Architecture
*   **Frontend:** Next.js 15+ (App Router), TypeScript, Tailwind CSS.
*   **Backend:** Dynamics 365 Business Central (SaaS).
*   **Middleware:** Custom AL Extension exposing API pages.
*   **Authentication:**
    *   **Portal Auth:** Custom session-based authentication (Customer No. + Password).
    *   **BC Auth:** OAuth2 Client Credentials flow (Service-to-Service) for API communication.

#### 3. Functional Requirements

**3.1. Business Central Extension (Backend)**
The AL extension must expose the following data points via standard API pages (OData/REST):
*   **Company Information:** Name, Address, Logo (Base64).
*   **Customer Profile:** Details (Name, Address, Balance, Sales YTD), Edit capability.
*   **Documents (Read-Only Lists):**
    *   Posted Sales Invoices
    *   Sales Orders
    *   Posted Sales Shipments (Header & Lines)
    *   Posted Sales Credit Memos
    *   Sales Return Orders
*   **Financials:** Open Customer Ledger Entries (Transactions).
*   **PDF Generation:** Actions to generate and return Base64 PDF data for:
    *   Invoices, Orders, Credit Memos, Customer Statements.
*   **Write Operations:**
    *   Create Sales Return Order (from Shipment Lines).
    *   Update Customer Contact Details.

**3.2. Web Portal (Frontend)**
*   **Theming:** System-wide Light/Dark mode support using `next-themes`.
    *   *Dark Mode Spec:* Backgrounds must be `#0a0a0a` (gray-950), Cards `#171717` (gray-900), Text `#ededed` (gray-100).
*   **Login:** Secure login form validating credentials against BC.
*   **Dashboard:**
    *   **Summary Cards:** Current Balance, Overdue Amount, Sales YTD.
    *   **Quick Actions:** Navigation to key lists.
*   **List Views:** Searchable, sortable data tables for all document types.
*   **Detail Views:**
    *   **Shipment Details:** View lines, select quantities, and "Create Return Order".
*   **Profile Management:** Form to update email, phone, and address.

#### 4. User Interface Guidelines
*   **Framework:** Tailwind CSS.
*   **Components:** Reusable `DataTable`, `NavigationCard`, `SummaryCard`.
*   **Responsiveness:** Fully responsive mobile-first design.
*   **Accessibility:** High contrast text in both light and dark modes.

---

### Prompt for AI Agent

**Role:** You are an expert Full Stack Developer specializing in Dynamics 365 Business Central (AL) and Next.js (TypeScript).

**Task:** Create a complete workspace containing two distinct projects:
1.  `CustomerPortal`: A Business Central AL Extension.
2.  `BCCustomerPortalWeb`: A Next.js Web Application.

**Context:** You are building a self-service portal where customers log in to view their Business Central data. The Next.js app acts as the frontend, communicating with BC via the custom APIs defined in the AL extension.

**Step 1: Create the Business Central Extension (`CustomerPortal`)**
Create a standard AL project structure with `app.json` (Publisher: "BC Dev Limited", Name: "CustomerPortal").
Implement the following **API Pages** (Publisher: `bcDev`, Group: `portal`, Version: `v1.0`):

1.  **Core APIs:**
    *   `CustomerPortalCompanyInfoApi.al`: Exposes Company Information (Name, Picture/Logo).
    *   `CustomerPortalCustomerApi.al`: Read-only Customer financial data (Balance, Balance Due, Sales YTD).
    *   `CustomerPortalCustomerDetailsApi.al`: Read/Write Customer contact info (Address, Email, Phone).
2.  **Document APIs (List Pages):**
    *   `CustomerPortalSalesInvoicesApi.al`: Posted Sales Invoices.
    *   `CustomerPortalSalesOrdersApi.al`: Sales Orders.
    *   `CustomerPortalSalesCreditMemosApi.al`: Posted Sales Credit Memos.
    *   `CustomerPortalSalesReturnOrdersApi.al`: Sales Return Orders.
    *   `CustomerPortalSalesShipmentsApi.al`: Posted Sales Shipments.
    *   `CustomerPortalSalesShipmentLinesApi.al`: Lines for a specific shipment.
    *   `CustomerPortalOpenCustLedgerApi.al`: Open Customer Ledger Entries (Transactions).
3.  **PDF Generation APIs:**
    *   Create API pages that accept an ID and return a Base64 encoded PDF string using `Report.SaveAs`.
    *   `CustomerPortalSalesInvoicePdfApi.al`, `CustomerPortalSalesOrderPdfApi.al`, `CustomerPortalSalesCreditMemoPdfApi.al`, `CustomerPortalStatementPdfApi.al`.

**Step 2: Create the Next.js Application (`BCCustomerPortalWeb/portal`)**
Initialize a Next.js 15+ project using TypeScript, Tailwind CSS, and ESLint.

**Dependencies:**
*   `lucide-react` (Icons)
*   `next-themes` (Dark mode)
*   `clsx`, `tailwind-merge` (Utility)

**Configuration:**
*   **Environment:** Create `.env.local` support for `BC_TENANT_ID`, `BC_ENVIRONMENT`, `BC_CLIENT_ID`, `BC_CLIENT_SECRET`, `BC_COMPANY_ID`.
*   **API Client (`src/lib/bc.ts`):** Implement a robust HTTP client that handles OAuth2 Client Credentials flow (getting/caching tokens) and calls the BC APIs defined in Step 1.

**Features & Pages:**
1.  **Global Layout:**
    *   Implement `ThemeProvider` for Light/Dark mode.
    *   **Dark Mode Style:** Use `bg-gray-950` for backgrounds and `text-gray-100` for text. Avoid pure black.
2.  **Login (`/login`):** A form taking Customer No. and Password.
3.  **Dashboard (`/portal`):**
    *   Fetch and display Customer Summary (Balance, etc.).
    *   Show "Quick Action" cards linking to document lists.
4.  **List Pages:**
    *   Create a reusable `DataTable` component with sorting and searching.
    *   Implement pages for `/portal/invoices`, `/portal/orders`, `/portal/returns`, `/portal/transactions`.
5.  **Shipment Details (`/portal/shipments/[no]`):**
    *   Display shipment header and lines.
    *   Add logic to select lines and quantities to return.
    *   Add a "Create Return Order" button that calls a server action to post data back to BC.
6.  **PDF Downloads:**
    *   Implement API routes (e.g., `/api/invoices/[no]/pdf`) that fetch the Base64 PDF from BC and stream it to the browser.

**Deliverables:**
Please generate the file structure and the code for the key files in both projects. Ensure the AL code uses correct API Page syntax and the Next.js code uses Server Components where appropriate.
