# Product Requirements Document (PRD)

## Product Name

**NHS Health**

### Meaning of NHS

**NHS = Networked Health Services**
*A unified digital infrastructure connecting departments, management, and vendors for efficient healthcare operations.*

---

## 1. Background & Context

NHS Health is a requisition, inventory, and vendor-management platform designed for healthcare organizations. It digitizes and formalizes the internal process of requesting, approving, sourcing, delivering, and verifying medical and operational items across multiple departments and facilities.

The platform is inspired by real operational needs within a health company, where procurement is often manual, opaque, slow, and poorly audited.

---

## 2. Problem Statement

Healthcare organizations struggle with:

* Manual requisition processes (paper, WhatsApp, verbal requests)
* Poor approval visibility and accountability
* Inventory mismanagement and stock uncertainty
* Weak audit trails (no clear logs of who requested, approved, delivered, or verified)
* Delayed fulfillment and vendor coordination issues

These inefficiencies lead to increased costs, delays in care, and operational risk.

---

## 3. Product Vision

To build a **secure, transparent, auditable, and scalable requisition ecosystem** that connects departments, management, stores, and vendors in one seamless workflow.

---

## 4. Target Users & Roles

### 4.1 User Roles

1. **Department Officer (Requester)**

   * Creates requisition requests
   * Tracks request status
   * Confirms receipt (optional)

2. **Head of Department (HOD / Approver)**

   * Reviews and approves/rejects requisitions
   * Verifies delivery completion

3. **Store Manager (Inventory Admin)**

   * Manages inventory
   * Confirms item availability
   * Fulfills or escalates requests

4. **Vendor / Store (External or Internal)**

   * Receives approved requisitions
   * Confirms fulfillment

5. **Operations Manager / Admin**

   * Oversees all departments
   * Views analytics, logs, and reports
   * Manages users, departments, and permissions

6. **Finance / Payments Officer (Future)**

   * Handles payments
   * Verifies procurement costs

---

## 5. Core Features

### 5.1 Department & Organization Management

* Register multiple organizations
* Register multiple departments per organization
* Role-based user assignment

---

### 5.2 Requisition Workflow

**Step-by-step flow:**

1. Department Officer submits requisition:

   * Item name
   * Quantity
   * Priority level
   * Reason/justification

2. Head of Department:

   * Approves or rejects
   * Adds comments

3. Store System (Inventory):

   * Checks availability
   * Reserves stock OR escalates to vendor

4. Vendor / Store:

   * Confirms supply
   * Dispatches item

5. Delivery:

   * Item delivered to department

6. Verification:

   * Head of Department verifies delivery
   * Request marked as completed

---

### 5.3 Inventory Management (store.nhs-health.com)

* Item catalog
* Stock levels
* Low-stock alerts
* Stock reservation per requisition
* Vendor association per item

---

### 5.4 Vendor Management

* Vendor profiles
* Item-vendor mapping
* Fulfillment history
* Performance tracking

---

### 5.5 Logging & Audit Trail (Critical)

Every action must be logged:

* Who requested
* Who approved/rejected
* Inventory checks
* Vendor responses
* Delivery timestamps
* Verification actions

Logs must be:

* Immutable
* Exportable (PDF / CSV)
* Filterable by date, department, user

---

### 5.6 Notifications & Mailing System

The platform includes a robust email notification system to ensure transparency, accountability, and timely action across all stakeholders.

**Email Events:**

* Requisition submitted → Email to Head of Department + CC Operations
* Requisition approved/rejected → Email to Department Officer + CC Operations
* Inventory availability confirmed → Email to Store Manager + HOD
* Vendor fulfillment confirmation → Email to Store Manager + Operations
* Delivery completed → Email to Head of Department + Department Officer
* Verification completed → Email to Operations + Finance (optional)

**Email Features:**

* Role-based recipients (To / CC)
* Organization-branded email templates
* Actionable emails (links to requisition in app)
* Full email delivery logs (sent, failed, opened – future)

---

### 5.7 Dashboards & Analytics

* Pending requisitions
* Approval bottlenecks
* Stock utilization
* Department spend patterns
* Vendor performance

---

## 6. Subdomains & Architecture

* **app.nhs-health.com** → Core requisition & management app
* **store.nhs-health.com** → Inventory & vendor-facing system

---

## 7. Technology Stack

### Backend

* Django
* Django REST Framework
* PostgreSQL
* Celery + Redis (async workflows & notifications)

### Frontend

* React
* Tailwind CSS
* Axios

### Authentication & Security

* JWT authentication
* Role-based access control (RBAC)
* Audit log protection

---

## 8. Web3 (Future / Optional)

### Possible Use Cases

* Blockchain-backed audit logs (tamper-proof)
* Smart contract-based vendor payments
* Tokenized procurement credits

*Note: Web3 integration is optional and phased.*

---

## 9. Non-Functional Requirements

* High availability
* Strong data integrity
* Compliance-friendly (healthcare audit readiness)
* Scalable to multiple organizations
* Mobile-responsive UI

---

## 10. MVP Scope

### Included

* User registration & roles
* Department management
* Requisition workflow
* Inventory tracking
* Logging & audit trail

### Excluded (Phase 2)

* Payments
* Web3 integration
* Advanced analytics
* Mobile app

---

## 11. Success Metrics

* Reduced requisition turnaround time
* Zero unlogged requisitions
* Improved stock accuracy
* Clear accountability per request

---

## 12. Risks & Considerations

* User adoption resistance
* Inventory data accuracy
* Training requirements

---

## 13. Long-Term Vision

NHS Health becomes a **core operational OS for healthcare organizations**, expandable into:

* Asset management
* Staff logistics
* Finance & procurement
* Regulatory reporting

---

**Status:** Draft PRD (v1.0)
