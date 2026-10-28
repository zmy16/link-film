<div align="center">

<img src="./app/icon.svg" width="80" height="80" alt="Golden Movie Hub" />

# Golden Movie Hub

**Direktori situs streaming film & series Indonesia maupun luar negeri, dengan subtitle Bahasa Indonesia.**

Satu halaman, tanpa iklan pop-up, tanpa player sendiri. Pilih provider, langsung tonton.

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4.6-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=flat-square&logo=greensock&logoColor=black)


[**link-film.eu.org**](https://www.link-film.eu.org)

</div>

---

## Daftar Isi

- [Tentang Project](#tentang-project)
- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Cara Kerja](#cara-kerja)
- [Struktur Project](#struktur-project)
- [Menjalankan Lokal](#menjalankan-lokal)
- [Menambah Provider](#menambah-provider)
- [Design Tokens](#design-tokens)
- [SEO](#seo)
- [Aksesibilitas](#aksesibilitas)
- [Deployment](#deployment)
- [Catatan Teknis](#catatan-teknis)
- [Credits](#credits)

---

## Tentang Project

Golden Movie Hub adalah **satu halaman statis** yang berfungsi sebagai direktori cepat menuju situs-situs streaming film & series.

Project ini **tidak menyimpan, tidak menyediakan, dan tidak mengalirkan konten apa pun**. Semua film dan series berada di situs masing-masing provider. Yang dilakukan halaman ini hanya dua: menampilkan daftar provider dengan rapi, lalu mengarahkan pengunjung ke sana.

Saat ini terdaftar **7 provider** dalam **2 region**:

| Region | Provider |
|---|---|
| 🇮🇩 **Film Indonesia** (aksen gold) | Rebahin, Kita Nonton, NgeFilm21, PusatFilm21, Duta Film |
| 🌐 **Film Luar Negeri** (aksen teal) | Layar Kaca 21, IDLIX |

---

## Fitur

- **Filter region** — tab Semua Situs / Film Indonesia / Film Luar Negeri, mengikuti pola ARIA tabs
- **Pencarian real-time** — mencocokkan nama, tagline, kicker, dan label region, dengan debounce 200ms
- **Pencarian tahan diakritik** — `kitanonton`, `Kita Nonton`, dan `KÍTA NÓNTON` semuanya menemukan hasil yang sama
- **Resolusi domain otomatis** — provider yang domainnya berputar dibaca langsung dari halaman info-nya di sisi server, jadi kartu menunjuk ke alamat yang aktif hari ini
- **Aksen warna per region** — gold untuk lokal, teal untuk mancanegara
- **Badge kualitas** — HD / Full HD / 4K
- **Gambar logo dengan fallback** — jika logo gagal dimuat, tampil ikon default
- **Motion yang menghormati `prefers-reduced-motion`** — animasi masuk, count-up statistik, dan gradient headline dimatikan otomatis
- **Halaman 404 kustom**
- **SEO lengkap** — metadata, canonical, Open Graph, Twitter card, `robots.txt`, `sitemap.xml`
- **Vercel Analytics** terintegrasi

---

## Tech Stack

| Kategori | Tools |
|---|---|
| **Framework** | [Next.js 16.2.6](https://nextjs.org/) — App Router, Turbopack |
| **UI Library** | [React 19.2.3](https://react.dev/) |
| **Language** | [TypeScript 5.5.3](https://www.typescriptlang.org/) — `strict: true` |
| **Styling** | [Tailwind CSS 3.4.6](https://tailwindcss.com/) — design tokens di `tailwind.config.ts` |
| **Animasi** | [GSAP 3.15](https://gsap.com/) + [`@gsap/react`](https://gsap.com/resources/React/) |
| **Fonts** | [Sora](https://fonts.google.com/specimen/Sora) (display) + [Inter](https://rsms.me/inter/) (body) via `next/font/google` |
| **Icons** | SVG line-art buatan sendiri — zero dependency |
| **Image Processing** | [sharp](https://sharp.pixelplumbing.com/) — AVIF + WebP |
| **Analytics** | [@vercel/analytics](https://vercel.com/docs/analytics) |
| **Package Manager** | npm |

### Kenapa pilihan ini?

- **`next/font`** — font di-host otomatis, tanpa request ke Google Fonts saat runtime, dan `display: swap` mencegah FOUT.
- **GSAP** — timeline animasi lebih presisi dibanding CSS keyframes saat butuh stagger dan sinkronisasi antar elemen.
- **Ikon SVG sendiri** — kontrol penuh atas stroke width, dan bundle jauh lebih kecil dibanding library ikon.
- **Data provider di satu file** (`lib/providers.ts`) — satu sumber kebenaran, mudah diaudit, tanpa database.

> **Catatan:** project ini memakai **Tailwind v3**, bukan v4. Tidak ada blok `@theme` dan tidak ada `@tailwindcss/postcss`. Semua token ada di `tailwind.config.ts` (`theme.extend`, `theme.screens`).

---

## Cara Kerja

### Data provider

Seluruh data provider hidup di **`lib/providers.ts`** sebagai array `REGIONS`. Tidak ada `components/ProviderDirectory.tsx` yang menyimpan data — komponen itu hanya membaca.

Dari data mentah itu diturunkan:

| Export | Isi |
|---|---|
| `REGIONS` | Dua region asli (`id`, `int`) beserta `items`-nya |
| `ALL_REGION` | Region sintetis "Semua Situs" — gabungan keduanya |
| `REGION_TABS` / `REGION_COUNTS` | Untuk `RegionTabs` |
| `TOTAL_PROVIDERS` | Jumlah provider, dipakai statistik di Hero |
| `accentClasses()` | Peta aksen (`gold` / `teal`) ke kelas Tailwind |

### Resolusi domain (`lib/live-link.ts`)

Sebagian provider tidak punya domain tetap — mereka menerbitkan satu halaman "info domain" yang mengumumkan alamat yang berlaku hari ini, dan alamat itu berubah tiap beberapa minggu.

`resolveLiveUrls()` dijalankan **di server** (lihat `app/page.tsx`, `revalidate = 900`) dan membaca halaman info itu untuk mengambil satu tautan yang berarti "nonton film". Tautan sosial — Telegram, anime portal, bookmark — sengaja diabaikan.

Kalau pembacaan gagal (timeout 6 detik, halaman error, atau tidak ada anchor yang cocok), provider **tetap memakai `url` cadangannya**, yaitu halaman info itu sendiri: masih benar, hanya kurang satu klik. **Kegagalan fetch tidak pernah mematikan halaman.**

Saat ini hanya `ngefilm21` dan `pusatfilm` yang punya aturan resolusi. Provider lain tidak pernah di-fetch.

### Pencarian (`lib/normalize.ts`)

Normalisasi dilakukan identik pada query maupun pada setiap field yang dicari:

```
NFD → buang combining marks → lowercase → sisakan a-z0-9
```

Input dipotong di `MAX_QUERY_LENGTH` (100 karakter) sebelum diproses.

---

## Struktur Project

```
link-film/
├── app/
│   ├── layout.tsx              # Root layout, metadata, font loader
│   ├── page.tsx                # Homepage — Header + Hero + Directory + Footer
│   ├── not-found.tsx           # Halaman 404 kustom
│   ├── globals.css             # Design tokens, @layer components/utilities, reduced-motion
│   ├── icon.svg                # Favicon
│   ├── opengraph-image.png     # OG image
│   ├── robots.ts               # /robots.txt
│   └── sitemap.ts              # /sitemap.xml
│
├── components/
│   ├── Header.tsx              # Logo + wordmark, sticky, backdrop-blur
│   ├── Hero.tsx                # Headline + blurb + statistik
│   ├── ProviderDirectory.tsx   # ⭐ INTI — state region, search, stagger GSAP
│   ├── ProviderCard.tsx        # Kartu poster (aspect 4:5)
│   ├── RegionTabs.tsx          # Tab region (ARIA tabs pattern)
│   ├── SearchBar.tsx           # Input pencarian
│   ├── EmptyState.tsx          # Kondisi kosong / tidak ada hasil
│   ├── Footer.tsx              # Disclaimer + copyright
│   ├── Logo.tsx                # Clapperboard SVG
│   ├── Icons.tsx               # Ikon line-art
│   ├── ScrollProgress.tsx      # Indikator scroll di header
│   └── motion/
│       ├── MotionFx.tsx        # Aurora
│       └── MotionText.tsx      # CountUp, GradientText, SplitText
│
├── lib/
│   ├── providers.ts            # ⭐ SUMBER DATA — region, provider, aksen
│   ├── live-link.ts            # Resolusi domain berputar (server-only)
│   └── normalize.ts            # Normalisasi query pencarian
│
├── public/
│   └── logos/                  # 7 logo provider (PNG)
│
├── docs/
│   ├── requirements.md
│   ├── design.md
│   └── design-decisions.md
│
├── scripts/
│   └── count-components.mjs    # Hitung komponen (rujukan: docs/design-decisions.md)
│
├── tailwind.config.ts          # Design tokens & theme extensions
├── next.config.mjs             # Turbopack root, format gambar, responsive sizes
├── postcss.config.mjs          # Tailwind + Autoprefixer
├── tsconfig.json               # strict mode
└── AGENTS.md                   # Panduan handover untuk agent/AI berikutnya
```

---

## Menjalankan Lokal

**Prasyarat:** Node.js 18.17+ dan npm.

```bash
# 1. Clone
git clone https://github.com/zmy16/link-film.git
cd link-film

# 2. Install dependencies
npm install

# 3. Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Project ini sehari-hari dijalankan di **port 3100**:

```bash
npm run dev -- -p 3100
```

**Script:**

| Command | Fungsi |
|---|---|
| `npm run dev` | Dev server dengan Turbopack hot reload |
| `npm run build` | Build production |
| `npm run start` | Jalankan hasil build |
| `npm run lint` | ⚠️ **Belum berfungsi** — `eslint` tidak ada di `devDependencies` (lihat [Catatan Teknis](#catatan-teknis)) |

> **Jangan jalankan `npm run build` saat dev server sedang hidup.** Keduanya berebut `.next/` dan dev server akan rusak. Untuk verifikasi cepat, `npx tsc --noEmit` sudah cukup.

---

## Menambah Provider

Semua data ada di array `REGIONS` di **`lib/providers.ts`**.

### 1. Siapkan logo

Taruh di `public/logos/`, ukuran **1000×1000 PNG** dengan latar transparan (kecuali memang didesain solid).

- Untuk logo normal, pakai **static import**:
  ```ts
  import namasitusLogo from "@/public/logos/namasitus.png";
  ```
- Kalau optimizer gambar dev server bermasalah dengan nama file ber-hash, rujuk lewat **path publik**: `logo: "/logos/namasitus.png"`. (Lihat komentar `dutafilmLogo` di `lib/providers.ts` untuk kasus yang pernah terjadi.)

### 2. Tambahkan entry

```ts
{
  id: "nama-situs",              // slug stabil, dipakai sebagai React key
  name: "Nama Situs",
  tagline: "Deskripsi singkat maksimal dua baris.",
  quality: "HD",                 // "HD" | "Full HD" | "4K"
  url: "https://situs-tujuan.com/",
  kicker: "FILM & SERIES",       // kicker pendek di atas nama
  logo: namasitusLogo,
  region: "id",                  // "id" | "int"
}
```

### 3. Kalau domainnya berputar

Tambahkan `liveInfoUrl` dan daftarkan aturan di `RULES` pada `lib/live-link.ts`:

```ts
liveInfoUrl: "https://situs-tujuan.com/info"
```

```ts
const RULES: Record<string, Rule> = {
  "nama-situs": {
    infoPage: "https://situs-tujuan.com/info",
    prefer: /nonton\s+film/i,                        // teks anchor tujuan
    deny: /anime|telegram|t\.me|whatsapp/i,          // yang tidak boleh terpilih
  },
};
```

Tanpa aturan di `RULES`, provider tidak pernah di-fetch dan kartunya memakai `url` statis.

### 4. Region baru

Buat object baru di `REGIONS` dengan `accent` (`gold` atau `teal`). Menambah nilai aksen baru berarti menambah cabang di `accentClasses()`.

---

## Design Tokens

Didefinisikan di `tailwind.config.ts`.

### Warna

| Token | Hex | Penggunaan |
|---|---|---|
| `base` | `#08080A` | Background halaman |
| `elevated` | `#101013` | Kartu provider |
| `surface` | `#16161A` | Container |
| `surface-2` | `#1E1E24` | Lapisan lebih terang |
| `line` | `#2A2A31` | Border 1px |
| `line-strong` | `#3A3A44` | Border tegas |
| `ink` | `#F2F2F4` | Teks utama |
| `ink-soft` | `#B4B4BC` | Teks sekunder |
| `muted` | `#8A8A95` | Metadata |
| `gold` | `#FFD700` | Aksen region Indonesia |
| `teal` | `#2DD4BF` | Aksen region mancanegara |
| `on-accent` | `#08080A` | Teks di atas fill aksen |

> **`on-accent` jangan diganti `base`.** Tailwind juga punya utility ukuran font bernama `text-base`; begitu `base` didefinisikan sebagai warna, kelas `text-base` memicu **dua** deklarasi sekaligus — warna *dan* ukuran/line-height — yang pernah membuat tab aktif membengkak jadi 44px (dari 35px). Token terpisah ini ada untuk mencegahnya.

### Tipografi

| Family | Font | Variable |
|---|---|---|
| `font-display` | Sora | `--font-display` |
| `font-sans` | Inter | `--font-body` |

### Motion

- Timing: `ease-cine` = `cubic-bezier(0.16, 1, 0.3, 1)`
- Animation: `animate-rise` (0.55s), `animate-breathe` (2.4s)
- Semua dimatikan di bawah `prefers-reduced-motion: reduce`

---

## SEO

| Berkas | Fungsi |
|---|---|
| `app/layout.tsx` | `metadataBase`, title, description, canonical, Open Graph, Twitter card, `robots: index/follow` |
| `app/robots.ts` | Menghasilkan `/robots.txt`, mengizinkan semua crawler dan menunjuk ke sitemap |
| `app/sitemap.ts` | Menghasilkan `/sitemap.xml`, `changeFrequency: daily` |
| `app/icon.svg` | Favicon |
| `app/opengraph-image.png` | Gambar social sharing |

**Domain muncul di tiga tempat** — kalau domain berubah, ubah ketiganya:

1. `app/layout.tsx` → `metadataBase` dan `openGraph.url`
2. `app/robots.ts` → `sitemap`
3. `app/sitemap.ts` → `url`

Langkah produksi yang tidak bisa dilakukan dari repo: daftarkan situs di **Google Search Console** lalu submit `https://www.link-film.eu.org/sitemap.xml`.

---

## Aksesibilitas

- Semantik HTML: heading hierarchy, landmark elements
- Skip link dan `:focus-visible` outline
- `RegionTabs` mengikuti ARIA tabs pattern
- Ikon dekoratif selalu `aria-hidden="true"`
- Touch target CTA minimal 44×44px
- `prefers-reduced-motion` mematikan semua animasi dan transisi
- Nama aksesibel dari label dan hitungan, bukan dari ikon saja

---

## Deployment

### Vercel (rekomendasi)

1. Push repo ke GitHub
2. [vercel.com](https://vercel.com) → login dengan GitHub
3. **Add New → Project** → pilih repo → **Deploy**

**Jangan lupa** sesuaikan domain di tiga tempat pada bagian [SEO](#seo) sebelum deploy produksi.

### Alternatif

- **Netlify** / **Cloudflare Pages** — tanpa konfigurasi tambahan
- **GitHub Pages** — butuh `output: 'export'` di `next.config.mjs`; catat bahwa `lib/live-link.ts` melakukan fetch saat request, jadi model static export mengubah perilakunya

---

## Catatan Teknis

Hal-hal yang perlu diketahui sebelum mengubah project ini:

- **`npm run lint` tidak berjalan.** `package.json` mendefinisikan `next lint`, tetapi `eslint` tidak ada di `devDependencies`. Gunakan `npx tsc --noEmit` sebagai gerbang verifikasi.
- **Tailwind v3, bukan v4.** Token ada di `tailwind.config.ts`. Beberapa dokumen di `docs/` ditulis dengan asumsi v4 dan tidak sesuai kondisi kode.
- **Jangan `npm run build` saat dev server hidup** — keduanya memakai `.next/` yang sama.
- **`next.config.mjs` mengunci `turbopack.root`** ke `process.cwd()` untuk mencegah warning "multiple lockfiles" saat repo ini berada di samping worktree lain.
- **Path `public/` vs static import** — static import memberi nama file ber-hash Turbopack, dan optimizer gambar dev server pernah menggantung tanpa batas pada nama tersebut di `w=640`. Bila sebuah logo tampil sebagai kotak buram, ini penyebab pertamanya.
- **Nama brand dan domain berbeda.** Halaman ini menampilkan "Golden Movie Hub", sementara domain dan nama repo adalah `link-film`. `package.json` masih bernama `golden-movie-hub`. Belum disatukan.
- **Tidak ada berkas `LICENSE`** di repo ini.

---

## Credits

- Tipografi: [Sora](https://fonts.google.com/specimen/Sora) & [Inter](https://rsms.me/inter/) oleh Rasmus Andersson
- Framework: [Next.js](https://nextjs.org/) oleh Vercel
- Animasi: [GSAP](https://gsap.com/)

---

<div align="center">

**Direktori tautan. Seluruh konten berada di situs masing-masing provider, bukan di sini.**

</div>
