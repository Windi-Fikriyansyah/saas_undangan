# Rencana Implementasi: Drag & Drop Invitation Builder

Sistem ini akan mengubah cara Vendor membuat template undangan, beralih dari sekadar memanipulasi *Custom HTML* menjadi ekosistem **Component-Based Drag and Drop** yang interaktif, modular, dan terstruktur.

## 1. Arsitektur & Struktur Data (Zod)
Semua konfigurasi template akan divalidasi ketat menggunakan Zod untuk menjamin konsistensi data antara Editor dan Engine Render.

```typescript
import { z } from "zod";

// 1. Global Configuration
export const GlobalSettingsSchema = z.object({
  theme: z.string().default("classic"),
  music: z.object({
    enabled: z.boolean().default(true),
    url: z.string().optional(),
    autoplay: z.boolean().default(true),
  }),
  typography: z.object({
    headingFont: z.string().default("Playfair Display"),
    bodyFont: z.string().default("Inter"),
  }),
  background: z.object({
    color: z.string().default("#ffffff"),
    imageUrl: z.string().optional(),
  })
});

// 2. Block Schema Base
export const BlockSchema = z.object({
  id: z.string(), // Unik per instance di kanvas
  type: z.string(), // Sesuai dengan BlockRegistry (misal: "cover", "event", "heading")
  props: z.record(z.any()), // Konfigurasi khusus komponen (warna, ukuran, padding)
  bindings: z.record(z.string()).optional(), // Map props ke variabel data (misal: text -> couple.groom.name)
  animation: z.object({
    type: z.string(),
    duration: z.number().default(600),
    delay: z.number().default(0),
  }).optional(),
  children: z.lazy(() => z.array(BlockSchema)).optional(), // Untuk Container/Layout blocks
});

// 3. Root Template Schema
export const TemplateConfigSchema = z.object({
  version: z.string().default("2.0.0"),
  global: GlobalSettingsSchema,
  blocks: z.array(BlockSchema), // Urutan blok dari atas ke bawah
});
```

## 2. Block Registry System
Kita akan memetakan tipe block ke komponen React sesungguhnya. Engine ini akan memisahkan mode `isEditor` (dimana elemen bisa diklik untuk dimunculkan panel properti) dan mode Publik.

```typescript
// src/engine/registry.tsx
export const BlockRegistry = {
  // Layouts
  section: SectionBlock,
  row: RowBlock,
  
  // Elements
  heading: HeadingBlock,
  image: ImageBlock,
  
  // Invitation Specific
  cover: CoverBlock,
  couple: CoupleBlock,
  event: EventBlock,
  countdown: CountdownBlock,
  gallery: GalleryBlock,
  rsvp: RsvpBlock,
  gift: GiftBlock,
};
```

## 3. Sistem Drag and Drop (dnd-kit)
Kita akan menggunakan `@dnd-kit` untuk membangun Editor UI.

*   **Droppable Canvas:** Area tengah dimana vendor menjatuhkan blok komponen. Ini menggunakan `SortableContext` agar komponen bisa digeser naik/turun.
*   **Draggable Sidebar:** Sidebar sebelah kiri berisi *Library* komponen (Bagan Layout, Elements, Invitation Blocks).
*   **Property Panel:** Sidebar kanan yang akan merender form input (berdasarkan definisi properti komponen yang sedang diklik). Jika blok `Heading` diklik, panel kanan akan menampilkan input teks, warna, ukuran font, dan *dropdown* untuk *Data Binding*.

## 4. Sistem Data Binding
Data binding tidak digabung di dalam komponen secara hard-code. Kita membuat *wrapper function* di engine render:

```typescript
function interpolateBindings(props, bindings, clientData) {
  const mergedProps = { ...props };
  if (bindings) {
    for (const [propName, dataKey] of Object.entries(bindings)) {
      // Jika dataKey = "couple.groom.name", ambil dari clientData
      const value = getNestedValue(clientData, dataKey);
      if (value) mergedProps[propName] = value;
    }
  }
  return mergedProps;
}
```
Sehingga komponen `HeadingBlock` tetap menerima properti `text`, tanpa peduli apakah itu teks statis statis atau dinamis dari form Klien.

## 5. Fase Pengerjaan (Step-by-Step)

### **Fase 1: Infrastruktur Dasar & UI Editor (Drafting)**
*   Menyiapkan Zod Schemas di `/src/lib/validations/template.ts`.
*   Membuat struktur halaman `/dashboard/templates/create` (Layout Editor: Kiri Sidebar Library, Tengah Canvas, Kanan Property Panel).
*   Instalasi dan implementasi `@dnd-kit/core` & `@dnd-kit/sortable` untuk kanvas tengah.

### **Fase 2: Block Registry & Basic Elements**
*   Membuat file `BlockRegistry.tsx`.
*   Membangun komponen fundamental: `Section`, `Container`, `Heading`, `Text`, `Image`.
*   Menghubungkan Property Panel di sebelah kanan agar saat blok `Heading` diklik, vendor bisa mengubah teks dan ukurannya secara *real-time*.

### **Fase 3: Invitation Blocks (Inti Undangan)**
*   Membuat komponen kompleks khusus undangan: `Cover`, `Couple`, `Events`, `Countdown`, `Gallery`, `WeddingGift`, `RSVP`.
*   Menyiapkan state visual di dalam kanvas (misalnya: RSVP form tidak akan bisa disubmit di dalam Editor, hanya *preview* UI).

### **Fase 4: Sistem Data Binding & Rendering Engine Publik**
*   Memasukkan UI di Property Panel agar Vendor bisa mengaitkan props dengan *Variabel Form Klien* (seperti memilih "Ambil dari Nama Mempelai Pria").
*   Membangun `WeddingRenderer.tsx` untuk menampilkan hasil akhir undangan tanpa fitur *Drag and Drop* (Bersih, statis, ringan).
*   Menyambungkan konfigurasi JSON hasil Builder ke Database (`configJson`).

### **Fase 5: Global Settings & Finalisasi**
*   Menambahkan tab *Global Settings* di Editor untuk mengatur Font (Google Fonts), Tema Warna (Palet CSS Variables), dan Background Music.
*   Uji coba *end-to-end* (Buat tema di Vendor -> Klien isi form -> Undangan *Live* dirender sempurna).
