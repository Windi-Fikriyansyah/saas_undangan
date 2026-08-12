# SaaS Undangan Digital - Master Development Tasks

Berdasarkan `TaskList_SaaS_Undangan_Digital.xlsx`. Status: `[x]` (Selesai), `[/]` (Dalam Proses), `[ ]` (Belum).

## Phase 1: Setup Proyek, Foundation & MVP Core
- [x] **INF-01**: Setup Proyek Next.js 14, Tailwind, shadcn/ui & Prisma Schema
- [x] **INF-02 & INF-03**: Setup Database PostgreSQL & Multi-Tenancy (Isolasi data `vendor_id`)
- [x] **AUTH-01 & AUTH-02**: Registrasi & Login vendor (NextAuth)
- [x] **DASH-01**: Pembuatan Vendor Dashboard Dasar (Layout, Routing, Ringkasan)
- [x] **DASH-04**: Pengaturan Profil Vendor (Nama bisnis, nomor WA)
- [ ] **INF-04**: Setup Cloudflare R2 Storage (CDN, Signed URL, Bucket config)
- [ ] **AUTH-03 & AUTH-04**: Verifikasi Email & Lupa Password
- [ ] **AUTH-05**: Onboarding Wizard Vendor Baru

## Phase 2: Client Form & Template Engine (MVP)
- [x] **ORD-01 & ORD-07**: Buat order baru & Smart link generator (Endpoint API & Token)
- [x] **FORM-02 s/d FORM-05**: Pengembangan Multi-step Klien Form Page (Step 1-5 + Uploads)
- [x] **TPL-01 & TPL-02**: Pembuatan JSON-driven Template Engine
- [x] **TPL-03 s/d TPL-11**: Implementasi Desain Template Dasar & Komponennya
- [ ] **FORM-11**: Auto-save per step Klien Form (localStorage + backend)
- [ ] **FORM-12**: Preview live sebelum submit di Klien Form
- [ ] **ORD-04**: Vendor bisa edit minor data undangan setelah klien submit

## Phase 3: Guest Management, RSVP & Payment (MVP)
- [x] **TPL-14**: Implementasi Undangan Page (Dynamic Routing, SSR/ISR) dengan personalized URL (`?to=`)
- [x] **TAMU-11 & TAMU-12**: Fitur RSVP, Guestbook, & Tracking Undangan (Opened, Counter)
- [x] **BILL-01**: Integrasi Payment Gateway untuk Subscription
- [x] **ORD-08**: Manual WA Notifikasi (Generate Link WA Web)
- [ ] **TAMU-01 s/d TAMU-06**: Manajemen Tamu (Input manual, Edit, Hapus, Filter)
- [ ] **TAMU-03 & TAMU-04**: Parse upload Excel Tamu & Download template Excel
- [ ] **TAMU-08 & TAMU-10**: Halaman daftar link tamu & Salin semua link

## Phase 4: Automation & SaaS Management (Growth)
- [ ] **INF-05 & WA-02**: Setup Queueing System (BullMQ + Redis) untuk Job Queue
- [ ] **WA-01, WA-03, WA-04**: Implementasi Blast WA API (Fonnte/Wablas) ke tamu
- [ ] **WA-06, WA-07, WA-09**: Fitur Reminder Otomatis (H-7 ke Tamu & H-3 ke Klien)
- [ ] **ADM-01 s/d ADM-04**: Pembuatan Admin Panel SaaS Owner (Dashboard, Manajemen Vendor & Template)

## Phase 5: Advanced Features & Analytics (Growth)
- [x] **ANL-01**: Implementasi Analitik Dashboard Vendor (Grafik RSVP, Opens)
- [ ] **ANL-04**: Fitur Export Data Tamu ke Excel/CSV
- [ ] **TPL-09, TPL-12**: Penambahan Template Premium (Timeline, Animasi, Elegan)
- [ ] **BILL-02 s/d BILL-07**: Manajemen Quota, Tier Limits, Riwayat Pembayaran, & Free Trial Enforcement

## Phase 6: Scale, Custom Domain & Integrations (Scale)
- [ ] **DASH-06**: Implementasi Custom Domain Mapping (Cloudflare API) & White-label
- [ ] **AUTH-06**: Fitur Multi-admin per Vendor (Owner / Admin / Staff)
- [ ] **ADM-05, ADM-06, INF-10**: Monitoring Server, Error Tracking (Sentry), Log Notifikasi Platform
- [ ] **INF-08**: Rate Limiting API
- [ ] **INF-09**: File Upload Security (Virus scan, Validasi tipe)
