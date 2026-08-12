 AGENT RULES: SaaS Undangan Digital Platform

## 1. System Context & Overview
You are acting as the Lead Full-Stack Software Engineer and System Architect for **SaaS Undangan Digital**, a B2B multi-tenant platform designed for digital invitation vendors (Wedding Organizers, digital agencies, freelancers) to manage, build, and distribute digital wedding invitations at scale.

### Target Personas & Architecture Overview
1. **Vendor Dashboard (`/dashboard`)**: Next.js App Router for vendors to manage orders, quotas, guests, templates, billing, and WA blasts.
2. **Klien Form Page (`/form/[client_token]`)**: Mobile-first multi-step dynamic client form with token-based access (30-day validity, single-use write guard).
3. **Undangan Page (`/[slug]`)**: Dynamic JSON-rendered invitation pages optimized via Next.js ISR/SSG with personalized guest parameter `?to=`.
4. **Admin Panel (`/admin`)**: SaaS owner dashboard for vendor management, billing analytics, template config publishing, and platform monitoring.

---

## 2. Tech Stack & Infrastructure
Strict adherence to the following technology stack is mandatory across all code implementations:

| Layer | Primary Technology | Guidelines & Constraints |
| :--- | :--- | :--- |
| **Framework** | Next.js 14+ (App Router, TypeScript) | Strict TypeScript typing (`noImplicitAny: true`), Server Actions or Route Handlers for mutations. |
| **Styling & UI** | Tailwind CSS + shadcn/ui | Utilize CSS variables for theme tokens; maintain consistent component primitives. |
| **Database & ORM** | PostgreSQL + Prisma ORM | Multi-tenant schema with application-level tenant isolation via Prisma Client Extensions. |(RLS) on `vendor_id`. |
| **Cache & Queue** | Upstash Redis + BullMQ | Handles rate-limiting, guest open-tracking caching, and queued WA blast jobs. |
| **Storage** | Cloudflare R2 | S3-compatible asset bucket for gallery images and audio files. |
| **Auth** | Supabase Auth / NextAuth.js | Multi-tenant auth, session validation, OAuth (Google) support. |
| **Payments** | Midtrans / Xendit API | Webhook idempotency handling, automated subscription billing, status callbacks. |

---

## 3. Database Schema & Multi-Tenancy Rules

### 3.1 Strict Data Isolation Rule
Every query modifying or reading tenant-specific data **MUST** filter by `vendorId`. Relying on manual query filtering alone is error-prone; Prisma Client Extensions must be implemented to enforce `vendorId` isolation on relevant models automatically.

### 3.2 Prisma Schema (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum PlanType {
  FREE_TRIAL
  STARTER
  PRO
  BUSINESS
}

enum OrderStatus {
  PENDING
  FILLING
  LIVE
  EXPIRED
}

enum RsvpStatus {
  PENDING
  HADIR
  TIDAK_HADIR
  RAGU
}

enum WaStatus {
  PENDING
  SENT
  DELIVERED
  FAILED
}

enum TemplateTier {
  BASIC
  PREMIUM
}

model Vendor {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  waNumber      String?
  planType      PlanType  @default(FREE_TRIAL)
  planExpiresAt DateTime?
  quotaUsed     Int       @default(0)
  customDomain  String?
  whiteLabel    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  orders   Order[]
  accounts Account[]
  sessions Session[]

  @@map("vendors")
}

model Order {
  id          String      @id @default(uuid())
  vendorId    String
  templateId  String
  clientName  String
  clientWa    String
  slug        String      @unique
  clientToken String      @unique
  status      OrderStatus @default(PENDING)
  dataJson    Json        @default("{}")
  isApproved  Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  liveAt      DateTime?

  vendor   Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  template Template @relation(fields: [templateId], references: [id])
  guests   Guest[]

  @@index([vendorId])
  @@index([slug])
  @@index([clientToken])
  @@map("orders")
}

model Guest {
  id           String     @id @default(uuid())
  orderId      String
  name         String
  waNumber     String?
  slug         String
  seatCount    Int        @default(1)
  category     String?
  rsvpStatus   RsvpStatus @default(PENDING)
  rsvpCount    Int        @default(0)
  message      String?    @db.Text
  openedAt     DateTime?
  openCount    Int        @default(0)
  lastOpenedAt DateTime?
  waSentAt     DateTime?
  waStatus     WaStatus   @default(PENDING)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
  @@index([slug])
  @@map("guests")
}

model Template {
  id           String       @id @default(uuid())
  name         String
  category     String
  tier         TemplateTier @default(BASIC)
  configJson   Json
  thumbnailUrl String?
  isActive     Boolean      @default(true)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  orders Order[]

  @@map("templates")
}

// NextAuth Models
model Account {
  id                String  @id @default(uuid())
  vendorId          String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  vendor Vendor @relation(fields: [vendorId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  vendorId     String
  expires      DateTime

  vendor Vendor @relation(fields: [vendorId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

---

## 4. Feature Implementation Guidelines

### 4.1 JSON-Driven Template Engine Architecture
- **Never** hardcode HTML templates for individual invitations.
- All templates must be dynamically compiled from `config_json` schema:
```json
{
  "theme": {
    "primaryColor": "#2D6A4F",
    "accentColor": "#52B788",
    "fontHeading": "Playfair Display",
    "fontBody": "Lato",
    "borderRadius": "12px"
  },
  "sections": [
    { "type": "cover", "variant": "fullscreen-photo" },
    { "type": "couple-info", "layout": "centered" },
    { "type": "event-detail", "showMap": true },
    { "type": "gallery", "columns": 2 },
    { "type": "rsvp-form" },
    { "type": "guestbook" }
  ],
  "animations": "fade-slide",
  "musicAutoPlay": true
}
```
- Components rendering the invitation page must accept standard `data_json` (bride/groom data, schedule, photos, music) merged with `config_json`.

### 4.2 Guest Tracking & Personalized Link Engine
1. URL Format: `https://[domain]/[slug]?to=[Nama+Tamu]`
2. The `?to=` parameter is read client-side via `useSearchParams()`.
3. Track unique page opens asynchronously to avoid blocking render speed:
   - On initial page view, dispatch a non-blocking background query/fetch to update `guests` tracking columns (`opened_at`, `open_count`, `last_opened_at`).
   - Use Redis deduplication (key: `guest_open:[order_id]:[guest_slug]`) with a 5-minute cooldown before incrementing `open_count` to prevent spam inflations.

### 4.3 Automated WA Blast Queue
- Use BullMQ queue with Redis for processing bulk messaging.
- Enforce strict delay parameters to prevent WhatsApp phone number banning:
  - **Randomized Delay**: 1,000ms to 3,000ms between messages.
  - **Error handling**: Max 3 retries per message with exponential backoff.
- Standard Blast Template:
  ```text
  Kepada Yth. {nama_tamu} 🙏

  Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu untuk hadir di pernikahan kami:

  👰🤵 {nama_pengantin_pria} & {nama_pengantin_wanita}
  📅 {tanggal_acara}
  📍 {lokasi_acara}

  Buka undangan kami di sini:
  👇
  {link_personal_tamu}

  Mohon konfirmasi kehadiran melalui link di atas. Terima kasih 🙏
  ```

### 4.4 Tier Limits & Quota Enforcement Rules
Validate tier rules prior to execution in both UI and Server Actions/API Endpoints:

| Feature | Free Trial | Starter | Pro | Business |
| :--- | :--- | :--- | :--- | :--- |
| Monthly Quota | 3 | 15–20 | 100 / Unlimited | Unlimited |
| Max Guests/Order | 50 | 100 | Unlimited | Unlimited |
| Premium Templates | ❌ | ❌ | ✅ | ✅ |
| Automated WA Blast | ❌ | ❌ | ✅ | ✅ |
| Custom Domain | ❌ | ❌ | ❌ | ✅ |
| White-label | ❌ | ❌ | ❌ | ✅ |

---

## 5. Coding Standards & Conventions

### 5.1 Project Directory Structure
```
├── src/
│   ├── app/
│   │   ├── (admin)/admin/          # SaaS Owner Panel
│   │   ├── (auth)/                 # Auth routes (login, register)
│   │   ├── (dashboard)/dashboard/  # Vendor Management Area
│   │   ├── (form)/form/[token]/    # Multi-step Client Form
│   │   ├── (invitation)/[slug]/    # End-user Invitation Page (ISR)
│   │   └── api/                    # System Webhooks & APIs
│   ├── components/
│   │   ├── dashboard/              # Vendor UI Components
│   │   ├── form/                   # Step form components
│   │   ├── invitation/             # JSON-rendered Invitation Sections
│   │   └── ui/                     # shadcn/ui base primitives
│   ├── lib/
│   │   ├── config/                 # Plan tier configurations
│   │   ├── db/                     # Supabase client & queries
│   │   ├── queue/                  # BullMQ workers & Redis setups
│   │   ├── templates/              # Render engine helpers
│   │   └── utils/                  # Helper functions
│   └── types/                      # Global TypeScript definitions
```

### 5.2 TypeScript & Code Quality
- **Strict Typing**: All API responses, form inputs, database outputs, and JSON templates must have explicit Typescript interface definitions.
- **Form Validation**: Use Zod schemas paired with React Hook Form for all input structures (especially client forms and guest inputs).
- **Server Actions**: Preferred method for database writes from Next.js UI components. Always wrap in authentication/authorization checks.

### 5.3 Security & API Protection
- **Token Security**: `client_token` generated via cryptographic 64-character UUID or random bytes. Token auto-expires in 30 days.
- **Upload Validation**: Image and audio uploads must be validated on backend for MIME types (`image/jpeg`, `image/png`, `audio/mpeg`) and max filesize limits (Images max 5MB, Audio max 10MB).
- **Rate Limiting**: Apply rate-limiting middleware to `/api/submit-form`, `/api/rsvp`, and public endpoints.

---

## 6. Development Phasing Execution
Align code generation with the platform development phase roadmap:
- **Phase 1 (MVP)**: Core authentication, Vendor order creation, Client smart link form, Next.js dynamic invitation renderer, RSVP form, manual WA trigger link, Midtrans billing integration.
- **Phase 2 (Growth)**: Automated WA Blast Queue (BullMQ + Redis), automated reminder jobs, template engine expansions, vendor analytics dashboard.
- **Phase 3 (Scale)**: Custom domain routing via Cloudflare API, white-label configurations, multi-admin vendor teams.