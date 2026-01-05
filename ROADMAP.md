# 🚀 NHS Health – Module-Based Development Phases

---

## 1️⃣ **Users Module (Authentication & Roles)**

**Purpose:** Handle all users, roles, and login/auth workflows.

### Core Features

* CustomUser model
* JWT Authentication
* Role-based access (Officer, HOD, Store Manager, Operations, Admin)
* Password reset & email verification
* Multi-org & multi-department assignment

### Development Phases

| Step                              | Status    | Deliverables                                              |
| --------------------------------- | --------- | --------------------------------------------------------- |
| User model & roles                | ✅ Done    | CustomUser with org, department, role, notification prefs |
| Authentication                    | ✅ Done    | DRF SimpleJWT setup                                       |
| Password reset/email verification | ⏳ Next    | Django built-in + custom email templates                  |
| Permissions enforcement           | ⏳ Planned | Role-based action control                                 |
| Audit & login logging             | ⏳ Planned | Track login/logout and failed attempts                    |

**Current Focus:** Lock in **user model + roles**, password reset, and multi-org isolation.

---

## 2️⃣ **Organization & Department Module**

**Purpose:** Manage organizations, departments, and link users.

### Core Features

* Register organizations
* Register departments per organization
* Link users to departments/orgs
* Org-level data isolation

### Development Phases

| Step                                  | Status    | Deliverables                   |
| ------------------------------------- | --------- | ------------------------------ |
| Models (Organization & Department)    | ✅ Done    | With FK relationships to users |
| Create Organization & Department APIs | ⏳ Next    | CRUD via DRF, org admins only  |
| Audit logs                            | ⏳ Planned | Log creation & updates         |
| Permissions                           | ⏳ Planned | Only admins can create/update  |

**Current Focus:** Finish **CRUD APIs** and **admin audit logging**.

---

## 3️⃣ **Inventory Module**

**Purpose:** Handle items, stores, vendors, stock levels, and movements.

### Core Features

* Items (name, SKU, unit)
* Stores (internal vs vendor)
* Inventory (per store)
* Inventory Movements (stock_in, stock_out, reserve, release)
* Low-stock alerts

### Development Phases

| Step                                               | Status    | Deliverables                               |
| -------------------------------------------------- | --------- | ------------------------------------------ |
| Models (Item, Store, Inventory, InventoryMovement) | ✅ Done    | Core domain structure                      |
| CRUD APIs                                          | ⏳ Next    | DRF endpoints for items, stores, inventory |
| Stock movement logic                               | ⏳ Planned | Service layer to handle all stock updates  |
| Low-stock triggers                                 | ⏳ Planned | Email notifications, thresholds            |
| Vendor association                                 | ⏳ Planned | Items linked to multiple vendors           |

**Current Focus:** Finish **models + CRUD APIs**, then implement **service layer logic** for movements.

---

## 4️⃣ **Requisition / Services Module**

**Purpose:** Handle requisition workflow and business logic.

### Core Features

* Request → Approve → Reserve → Deliver → Verify → Complete
* State machine enforcement
* Role-based actions
* Stock reservation via Inventory service
* Event hooks for notifications

### Development Phases

| Step                    | Status    | Deliverables                                     |
| ----------------------- | --------- | ------------------------------------------------ |
| Requisition model       | ✅ Done    | Includes statuses, requester, approver, verifier |
| Service layer           | ⏳ Next    | Business logic for each transition               |
| State transition guards | ⏳ Planned | Prevent illegal status changes                   |
| Audit logging           | ⏳ Planned | Track each status change                         |
| Email triggers          | ⏳ Planned | Notify relevant users per action                 |

**Current Focus:** Build **service layer** + **state guards**, then integrate with **Inventory module**.

---

## 5️⃣ **Audit & Logging Module**

**Purpose:** Immutable logs of all critical actions for compliance.

### Core Features

* Log creation, approval, rejection, delivery, verification
* Stock movements logged
* User actions logged (multi-org aware)
* UUID-based hash (`nhs-xxxx`) for optional tamper-proof audit

### Development Phases

| Step                   | Status     | Deliverables                                |
| ---------------------- | ---------- | ------------------------------------------- |
| AuditLog model         | ✅ Done     | Tracks object type, user, action, timestamp |
| Integration w/ modules | ⏳ Next     | Requisition + Inventory + Users logging     |
| Immutable logs         | ⏳ Planned  | Prevent updates/deletes                     |
| Export                 | ⏳ Planned  | CSV / PDF reports for compliance            |
| Blockchain-style hash  | ⏳ Optional | UUID chain per action                       |

**Current Focus:** Integrate **audit logging across all modules** and generate **UUID hash**.

---

## 6️⃣ **Notifications / Mailing Module**

**Purpose:** Keep all users informed of relevant events.

### Core Features

* Role-based emails
* Event-driven (not manual)
* Templates & branding
* Email logs

### Development Phases

| Step             | Status    | Deliverables                                                             |
| ---------------- | --------- | ------------------------------------------------------------------------ |
| Email service    | ✅ Done    | Basic send_notification function                                         |
| Trigger points   | ⏳ Next    | Low stock, requisition approval, fulfillment, vendor delay, verification |
| Async processing | ⏳ Planned | Celery + Redis                                                           |
| Email audit logs | ⏳ Planned | Track sent, failed, opened                                               |
| Templates        | ⏳ Planned | Org-branded HTML emails                                                  |

**Current Focus:** Wire **triggers for events** from **Inventory + Requisition modules**.

---

## 7️⃣ **Dashboards / Analytics (Phase 2+ / Optional)**

**Purpose:** Visualize pending requisitions, stock levels, approvals, and vendor performance.

### Core Features

* Pending requisitions
* Approval bottlenecks
* Low stock items
* Department spend / vendor performance

### Development Phases

| Step                | Status    | Deliverables                         |
| ------------------- | --------- | ------------------------------------ |
| Admin dashboards    | ⏳ Planned | DRF + React tables / charts          |
| Analytics endpoints | ⏳ Planned | Aggregated data per org / department |
| Reporting           | ⏳ Planned | CSV / PDF exports                    |
| Alerts              | ⏳ Planned | Optional dashboard warnings          |

---

# 📍 **Summary of Current Phase per Module**

| Module                    | Current Phase | Immediate Next Steps                                                     |
| ------------------------- | ------------- | ------------------------------------------------------------------------ |
| Users                     | Phase 1/2     | Password reset, role enforcement, multi-org validation                   |
| Organization & Department | Phase 1       | CRUD APIs, audit logging                                                 |
| Inventory                 | Phase 1       | CRUD APIs for items, stores, inventory                                   |
| Requisition / Services    | Phase 1 → 2   | Build service layer, enforce state transitions, link inventory movements |
| Audit / Logging           | Phase 1       | Integrate logging into all actions, generate UUID hashes                 |
| Notifications / Mailing   | Phase 1       | Wire email triggers from inventory & requisitions                        |
| Dashboards / Analytics    | Phase 2+      | Build after modules are stable                                           |

---
