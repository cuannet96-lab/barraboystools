# 🚀 Panduan Deploy BarraBoys Tools v2.0

## 📁 Struktur Project

```
barraboystools-deploy/
├── src/
│   ├── main.jsx        ← Entry point React
│   └── App.jsx         ← Semua kode aplikasi
├── public/
│   └── favicon.svg     ← Icon website
├── index.html          ← HTML utama
├── package.json        ← Dependencies
├── vite.config.js      ← Config build
├── vercel.json         ← Config Vercel
├── netlify.toml        ← Config Netlify
└── .gitignore
```

---

## ✅ PERSIAPAN AWAL (wajib semua cara)

Install Node.js dulu jika belum ada:
→ Download di: https://nodejs.org (pilih versi LTS)

---

## 🥇 CARA 1: Vercel (PALING MUDAH — Recommended)

### Opsi A: Via GitHub (Auto-deploy setiap update)

1. **Buat akun GitHub** di https://github.com (gratis)

2. **Buat repository baru**
   - Klik tombol `+` → `New repository`
   - Nama: `barraboystools`
   - Visibility: `Public`
   - Klik `Create repository`

3. **Upload project ke GitHub**
   Buka terminal/command prompt di folder project:
   ```bash
   git init
   git add .
   git commit -m "BarraBoys Tools v2.0 🚀"
   git branch -M main
   git remote add origin https://github.com/NAMA_KAMU/barraboystools.git
   git push -u origin main
   ```

4. **Deploy ke Vercel**
   - Buka https://vercel.com → Sign up/Login (bisa pakai akun GitHub)
   - Klik `Add New Project`
   - Pilih repository `barraboystools`
   - Framework Preset: pilih `Vite`
   - Klik `Deploy`
   - Tunggu ~2 menit ✅

5. **Website kamu live di:**
   `https://barraboystools.vercel.app`
   (atau nama custom yang Vercel berikan)

### Opsi B: Via Vercel CLI (Tanpa GitHub)

```bash
# Install Vercel CLI
npm install -g vercel

# Masuk ke folder project
cd barraboystools-deploy

# Install dependencies
npm install

# Deploy langsung!
vercel

# Ikuti instruksi:
# - Login dengan email
# - Confirm project name
# - Done! Link website langsung muncul ✅
```

---

## 🥈 CARA 2: Netlify (Drag & Drop — Termudah!)

### Opsi A: Drag & Drop (Tanpa GitHub, Tanpa Terminal!)

1. **Build project dulu di terminal:**
   ```bash
   cd barraboystools-deploy
   npm install
   npm run build
   ```
   Ini akan membuat folder `dist/`

2. **Buka** https://netlify.com → Sign up gratis

3. **Drag folder `dist/`** ke halaman Netlify
   (ada area drop di dashboard: *"Drag and drop your site folder here"*)

4. **Done! Website langsung live** ✅
   URL: `https://nama-random.netlify.app`

5. **Ganti nama domain** (opsional):
   - Site settings → Domain management → Custom domain
   - Ubah jadi: `barraboystools.netlify.app`

### Opsi B: Via GitHub (Auto-deploy)

1. Push ke GitHub (sama seperti langkah Vercel di atas)
2. Di Netlify: `Add new site` → `Import from Git`
3. Pilih repo → Build command: `npm run build` → Publish dir: `dist`
4. Klik `Deploy site` ✅

---

## 🥉 CARA 3: GitHub Pages

1. **Push ke GitHub** (langkah sama seperti di atas)

2. **Edit `vite.config.js`** — tambahkan base URL:
   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/barraboystools/',  // ← tambahkan ini
   })
   ```

3. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

4. **Tambahkan script di `package.json`:**
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

5. **Deploy:**
   ```bash
   npm run deploy
   ```

6. **Aktifkan GitHub Pages:**
   - Repo → Settings → Pages
   - Source: `gh-pages` branch
   - Klik Save

7. **Website live di:**
   `https://nama_kamu.github.io/barraboystools` ✅

---

## 🔧 TEST LOKAL SEBELUM DEPLOY

Jalankan di komputer kamu dulu:
```bash
cd barraboystools-deploy
npm install        # install dependencies (sekali saja)
npm run dev        # jalankan local server
```
Buka browser: `http://localhost:5173`

---

## 🌐 CUSTOM DOMAIN (Opsional)

Mau domain sendiri seperti `barraboytools.com`?
1. Beli domain di Niagahoster / Domainesia (~Rp 100rb/tahun)
2. Di Vercel/Netlify: Settings → Domain → Add custom domain
3. Ikuti instruksi DNS yang diberikan
4. Selesai! ✅

---

## ❓ TROUBLESHOOTING

**Error: `npm: command not found`**
→ Install Node.js dulu di https://nodejs.org

**Error saat build: `Cannot find module`**
→ Jalankan `npm install` dulu

**Gambar AI tidak muncul**
→ Pollinations API kadang lambat, tunggu 10-20 detik atau generate ulang

**Website tidak update setelah push**
→ Vercel/Netlify otomatis redeploy, tunggu 1-2 menit

---

## 📱 SHARE WEBSITE KAMU

Setelah deploy, share linknya ke:
- WhatsApp, Instagram, TikTok
- Tulis di bio: "Tools AI gratis: barraboystools.vercel.app"

---

Dibuat dengan ❤️ — BarraBoys Tools v2.0
Powered by Claude AI × Pollinations AI
