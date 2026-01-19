# University Management System - Marketing and Finance Module

## Project Overview
This branch focuses on implementing the **Marketing and Finance Module** for the University Management System. The module handles tuition and bus fee management, payment processing, and financial management & payroll operations.

---

## Functional Requirements

### Tuition and Bus Fee Management

**FR-19:** The system SHALL define tuition fee structures per program/semester.
- Create configurable fee structures
- Support multiple programs and semesters
- Allow fee structure versioning

**FR-20:** The system SHALL define bus routes, stops, timings, and fees.
- Define transportation routes with multiple stops
- Set timings and frequency for each route
- Configure bus service fees

**FR-21:** Students SHALL register for bus service and select route/stop during enrollment.
- Integrate bus registration with enrollment process
- Allow students to select preferred routes and stops
- Track bus service preferences

**FR-22:** The system SHALL auto-generate combined or separate invoices (tuition + bus fee).
- Generate invoices combining tuition and bus fees
- Support separate invoice generation when needed
- Maintain invoice history and audit trail

### Payment Processing

**FR-23:** The system SHALL integrate Stripe, MOMO API, OM API, and Monet Bill.
- Integrate multiple payment gateways
- Support various payment methods
- Handle payment gateway failures and retries

**FR-24:** The system SHALL provide a public payment portal (short code) with PDF receipts.
- Create accessible public payment portal
- Generate unique short codes for payment tracking
- Generate and email PDF receipts automatically

### Financial Management & Payroll

**FR-25:** The system SHALL generate monthly payroll and downloadable payslips.
- Calculate monthly payroll for staff
- Generate detailed payslips
- Support payslip download and archival

**FR-26:** Salary payments SHALL be recorded as expenses in financial reports.
- Log all salary payments as expenses
- Maintain expense categorization
- Link payments to financial reporting

**FR-27:** The system SHALL generate income/expense reports including bus fee revenue.
- Generate comprehensive financial reports
- Include tuition revenue and bus fee revenue
- Provide expense breakdowns including payroll
- Support period-based reporting (monthly, quarterly, annually)

---

## Module Components

### 1. **Tuition Management**
- Fee structure configuration
- Invoice generation
- Fee calculations

### 2. **Bus Service Management**
- Route and stop management
- Bus fee configuration
- Student bus registration

### 3. **Payment Gateway Integration**
- Stripe integration
- MOMO API integration
- OM API integration
- Monet Bill integration

### 4. **Payroll System**
- Salary calculations
- Payslip generation
- Payment recording

### 5. **Financial Reporting**
- Income reports (tuition + bus fees)
- Expense reports (including payroll)
- Financial dashboards

---

## Getting Started

1. Create models for tuition fees, bus routes, and payroll
2. Implement payment gateway integrations
3. Build the payment portal with short code generation
4. Develop financial reporting modules
5. Create admin interfaces for fee and route management

## Frontend (React)

This repository now has a minimal React + Vite scaffold. To run the frontend locally:

- Install dependencies:

```bash
npm install
```

- Start the dev server:

```bash
npm run dev
```

Notes:
- The scaffold uses Vite; edit `src/App.jsx` to start building the UI.
- You must run `npm install` locally to fetch dependencies; I did not install Node packages in the repository.

---

## Branch Information
- **Branch Name:** `marketing-and-finance-module`
- **Purpose:** Implement marketing and finance features for the university management system
- **Status:** In Development

---

## Contributors
- Development Team

## Last Updated
December 23, 2025
