# 🎬 Golden Movie Hub

Kumpulan link situs streaming film & series Indonesia dan luar negeri, dikurasi dan disajikan dalam satu halaman yang rapi.

## Fitur

- **Kategori terpisah** — Film Indonesia dan Luar Negeri ditampilkan dalam seksi masing-masing
- **Filter cepat** — Tombol filter Semua / Indonesia / Luar Negeri
- **Stats bar** — Menampilkan jumlah total situs, situs Indo, dan situs Luar
- **Design sinematik** — Tema gelap hitam + emas dengan animasi halus
- **Responsive** — Tampil optimal di desktop maupun mobile

## Struktur File

```
link-film/
├── index.html              # Halaman utama
├── assets/
│   ├── css/
│   │   └── styles.css      # Custom styles & animasi
│   └── js/
│       ├── app.js          # Data situs & logika render
│       ├── main.js         # Filter handler (legacy)
│       ├── tailwind-config.js  # Konfigurasi warna Tailwind
│       └── cf.js           # Cloudflare challenge script
```

## Daftar Situs

| Nama | Kategori | URL |
|------|----------|-----|
| Rebahin | 🇮🇩 Indonesia | https://rebahinxxi1.lol/ |
| Kita Nonton | 🇮🇩 Indonesia | http://124.150.139.91/ |
| NgeFilm21 | 🇮🇩 Indonesia | https://ngefilm21.pw/ |
| Layar Kaca 21 | 🌍 Luar Negeri | https://lk21.de/ |
| IDLIX | 🌍 Luar Negeri | https://idlixian.com/ |

## Cara Menambah Situs

Buka `assets/js/app.js` dan tambahkan objek baru ke array `sitesData`:

```js
{
  id: 6,                          // ID unik
  name: "Nama Situs",
  category: "indonesia",          // "indonesia" atau "foreign"
  tags: ["indonesia"],
  description: "Deskripsi singkat situs.",
  url: "https://contoh.com/",
  badge: "🇮🇩 Indo",              // Label badge
  badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
  quality: "HD",                  // "HD" atau "Full HD"
  qualityColor: "text-green-400",
},
```

Untuk situs luar negeri, gunakan:
```js
category: "foreign",
tags: ["foreign"],
badge: "🌍 Luar Negeri",
badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
qualityColor: "text-blue-400",
```

## Tech Stack

- [Tailwind CSS v3](https://tailwindcss.com/) — utility-first CSS framework
- [Google Fonts — Poppins](https://fonts.google.com/specimen/Poppins) — tipografi
- Vanilla JavaScript (ES6+)
- CSS custom animations & backdrop-filter

## Disclaimer

Situs ini hanya mengumpulkan dan menampilkan link. Seluruh konten tersedia di situs pihak ketiga masing-masing.
