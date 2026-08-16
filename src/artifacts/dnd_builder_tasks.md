# Task List: Drag-and-Drop Invitation Builder

Daftar tugas ini dirancang untuk dieksekusi secara bertahap (*incremental*), berfokus pada pembangunan fondasi yang kuat terlebih dahulu, lalu dilanjutkan dengan pembuatan komponen visual.

## [ ] Task 1: Setup Zod Schemas & State Management
**Target:** Menjamin keamanan dan konsistensi struktur data template JSON dari awal.
- [ ] Buat file `src/lib/validations/wedding-template.ts`.
- [ ] Definisikan `GlobalSettingsSchema`, `BlockSchema`, dan `TemplateConfigSchema` menggunakan Zod.
- [ ] Buat *React Context* atau *Zustand Store* untuk memegang *state* `templateConfig` (daftar blok, blok yang sedang dipilih/aktif, dll).

## [ ] Task 2: Implementasi dnd-kit & Layout Editor Dasar
**Target:** Menghidupkan kanvas *drag-and-drop*.
- [ ] Instal dependensi: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.
- [ ] Buat struktur UI halaman `/dashboard/templates/create`:
  - **Left Sidebar (Palette):** Daftar *draggable items* (Teks, Gambar, Section, dll).
  - **Center Canvas:** Area *SortableContext* tempat blok dijatuhkan dan diurutkan.
  - **Right Sidebar (Properties):** Panel kosong (sementara) yang akan muncul saat sebuah blok di kanvas diklik.

## [ ] Task 3: Block Registry & Core Layout (8 Komponen)
**Target:** Membuat sistem *mapping* dan komponen dasar penyusun layout.
- [ ] Setup `src/components/wedding/registry.ts` (BlockRegistry).
- [ ] Buat `Section` (Menerima Background, Padding, Margin, dll).
- [ ] Buat `Container` (Max Width, Width, Padding).
- [ ] Buat `Row` & `Column` (Responsive grid 50/50 desktop, 100 mobile).
- [ ] Buat `Grid` (Untuk gallery, cards, photos).
- [ ] Buat `Stack` (Layout vertikal).
- [ ] Buat `Spacer` (Mengatur jarak tanpa div manual).
- [ ] Buat `Divider` (Garis pemisah).

## [ ] Task 4: Basic Elements (10 Komponen)
**Target:** Elemen dasar pembangun undangan.
- [ ] Buat `Heading` (H1-H4, mendukung data binding).
- [ ] Buat `Text` (Paragraf standar).
- [ ] Buat `RichText` (Bold, italic, align, link, list).
- [ ] Buat `Image` (Width, height, object-fit, radius, lazy loading).
- [ ] Buat `Button` (Aksi URL, Scroll, Modal, Maps, RSVP, WA).
- [ ] Buat `Icon` (Komponen ikon).
- [ ] Buat `Video` (Video elemen biasa).
- [ ] Buat `Audio` (Audio elemen biasa).
- [ ] Buat `Link` (Tautan teks biasa).
- [ ] Buat `Badge` (Label kecil).

## [ ] Task 5: Property Panel & UI Data Binding
**Target:** Vendor dapat mengedit props komponen dan mengaitkan teks/gambar ke form Klien.
- [ ] Buat form dinamis di *Right Sidebar* berdasarkan `selectedBlock.type`.
- [ ] Buat input untuk mengatur *Props* (teks, *color picker*, slider).
- [ ] **Sistem Data Binding:** Tambahkan opsi *toggle* di samping input (Statis vs Dinamis) dan *dropdown* variabel (misal: `couple.groom.name`).

## [ ] Task 6: Invitation Blocks (17 Komponen Khusus Undangan)
**Target:** Mengisi *library* dengan komponen spesifik undangan.
- [ ] Buat `Cover` (The Wedding Of, Nama, Tanggal, tombol Buka Undangan).
- [ ] Buat `Couple` (Nama pria & wanita, `&`).
- [ ] Buat `Greeting` (Teks pembuka, Assalamu'alaikum).
- [ ] Buat `CoupleProfile` (Foto, nama, detail orang tua).
- [ ] Buat `Events` (Detail acara: Akad, Resepsi, dll, dengan tombol lokasi).
- [ ] Buat `Countdown` (Hitung mundur otomatis ke hari H).
- [ ] Buat `Story` (Timeline perjalanan cinta / Love Story).
- [ ] Buat `Gallery` (Lightbox, Grid, Masonry, Slider).
- [ ] Buat `Video` (Wedding Trailer/Prewed via YouTube/MP4).
- [ ] Buat `RSVP` (Form Kehadiran Klien).
- [ ] Buat `Guestbook` (Daftar ucapan & doa).
- [ ] Buat `WeddingGift` (Rekening BCA, E-Wallet, Salin Nomor).
- [ ] Buat `Map` (Preview statis Google Maps yang membuka maps saat diklik).
- [ ] Buat `Calendar` (Tombol Simpan ke Kalender).
- [ ] Buat `MusicPlayer` (Pemutar musik khusus undangan).
- [ ] Buat `Navigation` (Menu navigasi antar section).
- [ ] Buat `Footer` (Bagian penutup undangan).

## [ ] Task 7: Decorative Components (7 Komponen)
**Target:** Menambahkan elemen dekoratif premium.
- [ ] Buat `Lottie` (Integrasi JSON Lottie animation).
- [ ] Buat `Shape` (Wave, Curve, Blob, dll).
- [ ] Buat `Ornament` (Hiasan sudut/pemisah).
- [ ] Buat `Floral` (Elemen bunga/daun statis).
- [ ] Buat `Pattern` (Pola background).
- [ ] Buat `Sparkle` (Efek kelap-kelip statis).
- [ ] Buat `FloatingElement` (Dekorasi melayang di posisi *fixed*).

## [ ] Task 8: Global Settings, Animations & Rendering Engine
**Target:** Sentuhan akhir, pergerakan, dan rendering publik.
- [ ] Tambahkan pengaturan animasi di Property Panel (`fade-up`, `zoom`, dll).
- [ ] Tambahkan tab **Global Settings** di sidebar (Font, Theme Colors, Background Music).
- [ ] Buat `WeddingRenderer.tsx` untuk membaca JSON hasil *builder* dan injeksi data Klien.
- [ ] Hubungkan tombol "Simpan" ke Server Action `upsertVendorTemplate`.

---

**Saran Eksekusi:**
Kita akan mengeksekusi ini **mulai dari Task 1 & 2**. Jika Anda sudah siap, beri instruksi *"Mulai kerjakan Task 1"* dan saya akan langsung menulis kodenya.
