import { useState, useEffect, useRef } from "react";

/* ════════════════════════════════════════════════
   TOOLS DATABASE — 37 tools (+ hashtag & faq baru)
════════════════════════════════════════════════ */
const TOOLS = {
  caption:       { title:"Caption Media Sosial",        icon:"📱", color:"#7c5cfc", cat:"konten",    tags:["Viral","Sosmed"],     fields:[{id:"produk",label:"Produk / Topik / Momen",type:"textarea",placeholder:"Contoh: Jualan hijab premium, promo akhir tahun..."},{id:"platform",label:"Platform",type:"options",options:["Instagram","TikTok","Facebook","Twitter / X","LinkedIn","WhatsApp Status","YouTube"]},{id:"tone",label:"Gaya Bahasa",type:"options",options:["Santai & Friendly","Profesional","Lucu & Humor","Inspiratif","Viral / Provokatif","Emosional"]},{id:"jumlah",label:"Jumlah Variasi",type:"options",options:["3 variasi","5 variasi","10 variasi"]}], prompt:(f)=>`Buatkan ${f.jumlah||"3 variasi"} caption ${f.platform||"Instagram"} tentang: "${f.produk}". Gaya: ${f.tone||"Santai"}. Setiap caption: hook kuat, CTA jelas, 10-15 hashtag relevan, emoji. Pisahkan jelas tiap caption dengan nomor.` },
  hashtag:       { title:"Generator Hashtag",           icon:"#️⃣", color:"#1da1f2", cat:"konten",    tags:["Hashtag","Viral"],    fields:[{id:"topik",label:"Topik / Niche / Produk",type:"textarea",placeholder:"Contoh: jualan hijab premium, konten masak, bisnis kuliner..."},{id:"platform",label:"Platform",type:"options",options:["Instagram","TikTok","Twitter / X","LinkedIn","YouTube","Pinterest"]},{id:"tujuan",label:"Tujuan",type:"options",options:["Viral & Jangkauan Luas","Niche & Targeted","Jualan / Konversi","Brand Awareness","Lokal Indonesia"]},{id:"jumlah",label:"Jumlah Hashtag",type:"options",options:["10 hashtag","20 hashtag","30 hashtag","50 hashtag"]}], prompt:(f)=>`Berikan ${f.jumlah||"30 hashtag"} hashtag ${f.platform||"Instagram"} terbaik untuk topik: "${f.topik}". Tujuan: ${f.tujuan||"Viral"}. Kelompokkan dalam 3 kategori: MEGA (>1jt post), MID (100rb-1jt post), NICHE (<100rb post). Sertakan tips penggunaan terbaik dan kombinasi hashtag yang disarankan.` },
  faq:           { title:"Generator FAQ",               icon:"❓", color:"#5cf0c8", cat:"konten",    tags:["FAQ","Konten"],       fields:[{id:"produk",label:"Produk / Layanan / Bisnis",type:"textarea",placeholder:"Contoh: jasa desain logo, toko skincare online, kursus bahasa Inggris..."},{id:"target",label:"Target Audiens",type:"options",options:["Pelanggan Umum","Pembeli Pertama","Pengguna Lanjutan","B2B / Bisnis","Orang Tua / Keluarga"]},{id:"jumlah",label:"Jumlah FAQ",type:"options",options:["10 FAQ","15 FAQ","20 FAQ","30 FAQ"]},{id:"format",label:"Format Output",type:"options",options:["Q&A Standar","Dengan Penjelasan Detail","WhatsApp Friendly","Formal / Resmi"]}], prompt:(f)=>`Buat ${f.jumlah||"15 FAQ"} yang paling sering ditanya untuk: "${f.produk}". Target: ${f.target||"Pelanggan Umum"}. Format: ${f.format||"Q&A Standar"}. Pertanyaan harus realistis, jawaban jelas & persuasif, sertakan variasi dari sisi calon pembeli skeptis.` },
  copywriting:   { title:"Copywriting Produk",           icon:"💼", color:"#fc5c7d", cat:"konten",    tags:["Jualan","E-commerce"], fields:[{id:"produk",label:"Nama & Jenis Produk",type:"textarea",placeholder:"Contoh: Serum Vitamin C 20ml untuk kulit kusam..."},{id:"keunggulan",label:"Keunggulan / Fitur Utama",type:"textarea",placeholder:"Contoh: BPOM, vegan, hasil dalam 7 hari..."},{id:"target",label:"Target Pembeli",type:"options",options:["Remaja 15–22","Dewasa 23–35","Ibu Rumah Tangga","Profesional","Semua Usia"]},{id:"platform",label:"Platform Jualan",type:"options",options:["Tokopedia","Shopee","Instagram Shop","Website","WhatsApp","TikTok Shop"]}], prompt:(f)=>`Copywriting produk persuasif: Produk: ${f.produk}. Keunggulan: ${f.keunggulan}. Target: ${f.target||"Semua"}. Platform: ${f.platform||"Shopee"}. Format: JUDUL, DESKRIPSI SINGKAT, KEUNGGULAN (bullet), DESKRIPSI LENGKAP, CTA kuat.` },
  artikel:       { title:"Artikel & Blog SEO",           icon:"📝", color:"#5cf0c8", cat:"konten",    tags:["SEO","Blog"],          fields:[{id:"topik",label:"Topik / Kata Kunci Utama",type:"input",placeholder:"Contoh: cara memulai bisnis online dari rumah..."},{id:"panjang",label:"Panjang Artikel",type:"options",options:["Pendek (300–500 kata)","Sedang (600–900 kata)","Panjang (1000–1500 kata)","Sangat Panjang (2000+ kata)"]},{id:"gaya",label:"Gaya Penulisan",type:"options",options:["Informatif","How-to / Tutorial","Listicle (Tips)","Review","Storytelling","Opini"]},{id:"audience",label:"Target Pembaca",type:"options",options:["Umum","Pemula","Profesional","Ibu Rumah Tangga","Pengusaha"]}], prompt:(f)=>`Artikel blog ${f.gaya||"Informatif"} untuk ${f.audience||"Umum"} topik: "${f.topik}". Panjang: ${f.panjang||"Sedang"}. Struktur: Judul SEO, Pendahuluan engaging, Isi dengan H2/H3, Kesimpulan+CTA, Meta description.` },
  email:         { title:"Email Marketing",              icon:"📧", color:"#f7c948", cat:"konten",    tags:["Marketing","Email"],   fields:[{id:"tujuan",label:"Tujuan Email",type:"options",options:["Promosi Produk","Newsletter","Welcome Email","Follow-up","Re-engagement","Thank You","Abandoned Cart"]},{id:"produk",label:"Produk / Bisnis",type:"textarea",placeholder:"Ceritakan tentang produk atau bisnis Anda..."},{id:"tone",label:"Tone",type:"options",options:["Profesional","Hangat & Personal","Urgent","Informatif","Eksklusif"]}], prompt:(f)=>`Email marketing ${f.tujuan||"Promosi"}. Tentang: ${f.produk}. Tone: ${f.tone||"Profesional"}. Format: Subject line (5 variasi), Preview text, Pembukaan personal, Isi+CTA, Penutup, Signature.` },
  thread:        { title:"Twitter / X Thread",           icon:"🧵", color:"#1da1f2", cat:"konten",    tags:["Viral","Twitter"],     fields:[{id:"topik",label:"Topik Thread",type:"input",placeholder:"Contoh: 10 kesalahan pemula dalam bisnis online..."},{id:"jumlah",label:"Jumlah Tweet",type:"options",options:["5 tweet","10 tweet","15 tweet","20 tweet"]},{id:"gaya",label:"Gaya",type:"options",options:["Edukatif","Motivasi","Storytelling","Controversial","Listicle"]}], prompt:(f)=>`Twitter/X thread ${f.jumlah||"10 tweet"} gaya ${f.gaya||"Edukatif"} topik: "${f.topik}". Tweet 1: hook. Tweet 2-N: isi. Tweet terakhir: CTA+follow. Maks 280 karakter per tweet. Gunakan emoji & numbering.` },
  iklan:         { title:"Iklan Facebook / Google Ads",  icon:"📣", color:"#ff6b35", cat:"konten",    tags:["Iklan","Ads"],         fields:[{id:"produk",label:"Produk / Layanan",type:"textarea",placeholder:"Contoh: Kursus online desain grafis untuk pemula..."},{id:"target",label:"Target Audiens",type:"input",placeholder:"Contoh: Ibu muda 25-35 tahun..."},{id:"platform",label:"Platform Iklan",type:"options",options:["Facebook Ads","Google Ads","Instagram Ads","TikTok Ads"]},{id:"tujuan",label:"Tujuan Iklan",type:"options",options:["Awareness","Traffic","Konversi / Penjualan","Lead Generation"]}], prompt:(f)=>`3 variasi copy iklan ${f.platform||"Facebook Ads"} tujuan ${f.tujuan||"Konversi"}. Produk: ${f.produk}. Target: ${f.target}. Per variasi: Headline (3 opsi), Primary Text, Description, CTA.` },
  nama_usaha:    { title:"Nama Usaha & Brand",           icon:"🏪", color:"#f7c948", cat:"bisnis",    tags:["Brand","Bisnis"],      fields:[{id:"bidang",label:"Bidang / Jenis Usaha",type:"input",placeholder:"Contoh: Toko kue, salon, laundry..."},{id:"nilai",label:"Kesan yang Diinginkan",type:"options",options:["Elegan & Premium","Lucu & Friendly","Profesional","Lokal & Autentik","Modern & Minimalis","Futuristik"]},{id:"kata_kunci",label:"Kata Kunci (opsional)",type:"input",placeholder:"Contoh: nama kota, bahan utama..."}], prompt:(f)=>`15 nama usaha/brand kreatif untuk: ${f.bidang}. Kesan: ${f.nilai||"Profesional"}. Kata kunci: ${f.kata_kunci||"-"}. Per nama: nama, alasan bagus, tagline pendek, skor memorability (1-10).` },
  rencana_bisnis:{ title:"Ide & Rencana Bisnis",         icon:"📊", color:"#5cf0c8", cat:"bisnis",    tags:["Bisnis","Startup"],    fields:[{id:"modal",label:"Kisaran Modal",type:"options",options:["< Rp 500 ribu","Rp 500 ribu – 5 juta","Rp 5 juta – 50 juta","> Rp 50 juta"]},{id:"minat",label:"Minat / Keahlian",type:"input",placeholder:"Contoh: memasak, desain, teknologi..."},{id:"lokasi",label:"Model Bisnis",type:"options",options:["Online / Digital","Rumahan","Toko Fisik","Online + Offline","Franchise"]}], prompt:(f)=>`5 ide bisnis: Modal: ${f.modal}. Keahlian: ${f.minat}. Model: ${f.lokasi}. Per ide: nama+deskripsi, potensi cuan/bulan, 5 langkah mulai, tantangan+solusi, tips sukses.` },
  swot:          { title:"Analisis SWOT Bisnis",         icon:"🔍", color:"#a78bfa", cat:"bisnis",    tags:["Strategi","Analisis"], fields:[{id:"bisnis",label:"Nama & Deskripsi Bisnis",type:"textarea",placeholder:"Ceritakan bisnis Anda secara singkat..."},{id:"industri",label:"Industri / Sektor",type:"input",placeholder:"Contoh: F&B, Fashion, Teknologi, Pendidikan..."}], prompt:(f)=>`Analisis SWOT lengkap untuk: ${f.bisnis}. Industri: ${f.industri}. Format: STRENGTHS (5 poin), WEAKNESSES (5 poin), OPPORTUNITIES (5 poin), THREATS (5 poin), REKOMENDASI STRATEGI (3 prioritas).` },
  pitch:         { title:"Pitch Deck / Investor Deck",   icon:"🚀", color:"#fc5c7d", cat:"bisnis",    tags:["Startup","Investor"],  fields:[{id:"startup",label:"Nama & Deskripsi Startup",type:"textarea",placeholder:"Contoh: Platform marketplace untuk UMKM di desa..."},{id:"masalah",label:"Masalah yang Diselesaikan",type:"textarea",placeholder:"Apa pain point yang Anda selesaikan?"},{id:"tahap",label:"Tahap Bisnis",type:"options",options:["Ide / Pre-seed","MVP / Prototype","Early Stage","Growth Stage"]}], prompt:(f)=>`Outline pitch deck untuk startup: ${f.startup}. Masalah: ${f.masalah}. Tahap: ${f.tahap}. Format per slide: 1)Cover 2)Problem 3)Solution 4)Market Size 5)Business Model 6)Traction 7)Team 8)Financials 9)Ask. Per slide: judul + poin konten + speaker notes.` },
  bio:           { title:"Bio Profil Profesional",       icon:"👤", color:"#7c5cfc", cat:"bisnis",    tags:["Personal","Profil"],   fields:[{id:"profesi",label:"Profesi / Bidang",type:"input",placeholder:"Contoh: Freelance designer, content creator..."},{id:"keahlian",label:"Keahlian / Pencapaian",type:"textarea",placeholder:"Contoh: 3 tahun pengalaman, 500+ klien..."},{id:"platform",label:"Platform",type:"options",options:["Instagram","LinkedIn","Tokopedia/Shopee","Twitter/X","TikTok","Website","All Platform"]}], prompt:(f)=>`3 variasi bio profil untuk ${f.platform}: Profesi: ${f.profesi}. Keahlian: ${f.keahlian}. Variasi: 1)Singkat 1-2 kalimat 2)Sedang 3-4 kalimat 3)Lengkap 1 paragraf.` },
  slogan:        { title:"Slogan & Tagline Brand",       icon:"🎯", color:"#f7c948", cat:"bisnis",    tags:["Brand","Kreatif"],     fields:[{id:"bisnis",label:"Nama & Jenis Bisnis",type:"input",placeholder:"Contoh: Bakso Pak Joko – warung bakso premium..."},{id:"nilai",label:"Nilai Utama Brand",type:"textarea",placeholder:"Contoh: rasa autentik, harga merakyat..."},{id:"gaya",label:"Gaya Slogan",type:"options",options:["Inspiratif","Catchy & Lucu","Premium & Elegan","Deskriptif","Bold & Berani","Emosional"]}], prompt:(f)=>`10 slogan/tagline untuk: ${f.bisnis}. Nilai: ${f.nilai}. Gaya: ${f.gaya||"Catchy"}. Per slogan: teks, makna, skor (1-10).` },
  proposal:      { title:"Proposal Penawaran Jasa",      icon:"📋", color:"#5cf0c8", cat:"bisnis",    tags:["B2B","Jasa"],          fields:[{id:"jasa",label:"Jenis Jasa",type:"textarea",placeholder:"Contoh: Jasa desain logo dan branding untuk UMKM..."},{id:"klien",label:"Target Klien",type:"input",placeholder:"Contoh: Toko online fashion, startup teknologi..."},{id:"harga",label:"Range Harga",type:"input",placeholder:"Contoh: Rp 500.000 – Rp 5.000.000"}], prompt:(f)=>`Proposal penawaran jasa profesional: Jasa: ${f.jasa}. Klien: ${f.klien}. Harga: ${f.harga}. Format: Intro, Tentang Kami, Layanan, Proses Kerja, Paket Harga, CTA, Terms.` },
  cerpen:        { title:"Cerpen & Cerita Pendek",       icon:"📖", color:"#fc5c7d", cat:"kreatif",   tags:["Fiksi","Kreatif"],     fields:[{id:"genre",label:"Genre",type:"options",options:["Romance","Thriller/Misteri","Drama Keluarga","Komedi","Horor","Motivasi","Sci-Fi","Fantasy"]},{id:"tema",label:"Tema / Ide Cerita",type:"textarea",placeholder:"Contoh: dua orang bertemu kembali setelah 10 tahun..."},{id:"panjang",label:"Panjang Cerita",type:"options",options:["Flash fiction (~300 kata)","Pendek (~600 kata)","Sedang (~1000 kata)","Panjang (~1500 kata)"]}], prompt:(f)=>`Cerpen ${f.genre} tema: ${f.tema}. Panjang: ${f.panjang}. Opening langsung menarik, karakter relatable, konflik kuat, ending berkesan, dialog natural. Beri judul menarik.` },
  puisi:         { title:"Puisi & Pantun",               icon:"🌸", color:"#a78bfa", cat:"kreatif",   tags:["Sastra","Kreatif"],    fields:[{id:"jenis",label:"Jenis",type:"options",options:["Puisi Bebas","Puisi Rima","Pantun 4 Baris","Pantun Berkait","Sajak Cinta","Haiku","Akrostik"]},{id:"tema",label:"Tema / Untuk Siapa",type:"input",placeholder:"Contoh: untuk kekasih, tentang ibu, alam..."},{id:"mood",label:"Suasana",type:"options",options:["Romantis","Sedih & Melankolis","Bahagia","Haru","Semangat","Mistis"]}], prompt:(f)=>`3 ${f.jenis} tema: "${f.tema}". Suasana: ${f.mood}. Orisinal, diksi indah, irama bagus. Beri judul tiap karya.` },
  ucapan:        { title:"Ucapan & Kata-kata Spesial",   icon:"🎉", color:"#f7c948", cat:"kreatif",   tags:["Ucapan","Momen"],      fields:[{id:"momen",label:"Momen / Acara",type:"options",options:["Ulang Tahun","Pernikahan","Lebaran / Idul Fitri","Natal & Tahun Baru","Wisuda","Kelahiran Bayi","Duka Cita","Promosi / Sukses","Anniversary","Valentine"]},{id:"untuk",label:"Untuk Siapa",type:"input",placeholder:"Contoh: sahabat, orang tua, pasangan..."},{id:"gaya",label:"Gaya",type:"options",options:["Formal & Elegan","Hangat & Personal","Lucu & Santai","Religius","Singkat & Padat","Puitis"]}], prompt:(f)=>`5 variasi ucapan ${f.momen} untuk ${f.untuk}. Gaya: ${f.gaya}. Dari sangat singkat (status) hingga panjang & personal.` },
  script:        { title:"Script Video & Konten",        icon:"🎬", color:"#5cf0c8", cat:"kreatif",   tags:["Video","Konten"],      fields:[{id:"platform",label:"Platform",type:"options",options:["YouTube (panjang)","YouTube Shorts","TikTok","Instagram Reels","Podcast","Presentasi","Webinar"]},{id:"topik",label:"Topik / Isi Video",type:"textarea",placeholder:"Contoh: review produk skincare, tips investasi..."},{id:"gaya",label:"Gaya Presenter",type:"options",options:["Energik & Seru","Santai & Ngobrol","Profesional & Serius","Edukatif","Storytelling","Komedi"]}], prompt:(f)=>`Script ${f.platform} topik: "${f.topik}". Gaya: ${f.gaya}. Format: [HOOK 0:00], [INTRO], [ISI per segmen+timestamp], [CTA], [OUTRO]. Catatan B-roll & visual.` },
  jokes:         { title:"Jokes & Konten Humor",         icon:"😂", color:"#ff6b35", cat:"kreatif",   tags:["Humor","Hiburan"],     fields:[{id:"tema",label:"Tema Humor",type:"input",placeholder:"Contoh: kehidupan kantoran, jualan online, mahasiswa..."},{id:"jenis",label:"Jenis Humor",type:"options",options:["One-liner Jokes","Meme Caption","Twit Lucu","Story Lucu","Roasting Halus","Parodi"]},{id:"jumlah",label:"Jumlah",type:"options",options:["5 buah","10 buah","15 buah","20 buah"]}], prompt:(f)=>`${f.jumlah||"10 buah"} ${f.jenis||"Jokes"} lucu tema: "${f.tema}". Segar, tidak SARA, relatable orang Indonesia, cocok diposting sosmed.` },
  translate:     { title:"Terjemahan Profesional",       icon:"🌐", color:"#5cf0c8", cat:"produktif", tags:["Bahasa","Terjemah"],   fields:[{id:"teks",label:"Teks yang Ingin Diterjemahkan",type:"textarea",placeholder:"Tulis atau paste teks di sini..."},{id:"dari",label:"Dari Bahasa",type:"options",options:["Indonesia","Inggris","Arab","Mandarin","Jepang","Korea","Jawa","Sunda"]},{id:"ke",label:"Ke Bahasa",type:"options",options:["Inggris","Indonesia","Arab","Mandarin","Jepang","Korea","Prancis","Jerman","Spanyol","Italia"]},{id:"gaya",label:"Gaya Terjemahan",type:"options",options:["Natural & Mengalir","Formal / Resmi","Kasual / Santai","Literal","Untuk Subtitle"]}], prompt:(f)=>`Terjemahkan dari ${f.dari} ke ${f.ke}: "${f.teks}". Gaya: ${f.gaya}. Berikan: 1)Terjemahan utama 2)Catatan idiom/nuansa 3)Alternatif jika ada.` },
  rangkum:       { title:"Rangkuman Teks Otomatis",      icon:"📋", color:"#a78bfa", cat:"produktif", tags:["Ringkas","Cepat"],     fields:[{id:"teks",label:"Teks yang Ingin Dirangkum",type:"textarea",placeholder:"Paste artikel, materi, atau teks panjang di sini..."},{id:"format",label:"Format Output",type:"options",options:["Poin-poin Bullet","Paragraf Singkat","Mind Map (teks)","Tweet Thread","Executive Summary","ELI5 (Jelaskan Sederhana)"]},{id:"level",label:"Level Detail",type:"options",options:["Sangat Singkat (3-5 poin)","Sedang (10 poin)","Detail (dengan sub-poin)"]}], prompt:(f)=>`Rangkum format ${f.format}, level ${f.level}: "${f.teks}". Sertakan 1 kalimat kesimpulan utama di akhir.` },
  cv:            { title:"CV & Surat Lamaran Kerja",     icon:"📄", color:"#f7c948", cat:"produktif", tags:["Karir","Kerja"],       fields:[{id:"nama",label:"Nama & Profesi",type:"input",placeholder:"Contoh: Budi Santoso, Fresh Graduate Teknik Informatika..."},{id:"pengalaman",label:"Pengalaman & Keahlian",type:"textarea",placeholder:"Contoh: 2 tahun admin, mahir Excel, magang di..."},{id:"posisi",label:"Posisi yang Dilamar",type:"input",placeholder:"Contoh: Staff IT, Social Media Manager..."},{id:"jenis",label:"Yang Dibutuhkan",type:"options",options:["Deskripsi CV Lengkap","Surat Lamaran Formal","Keduanya","LinkedIn Profile"]}], prompt:(f)=>`Buatkan ${f.jenis}: Nama: ${f.nama}. Pengalaman: ${f.pengalaman}. Posisi: ${f.posisi}. Profesional, menarik HRD, standar Indonesia.` },
  qa:            { title:"Tanya Jawab AI Pintar",        icon:"💡", color:"#fc5c7d", cat:"produktif", tags:["Serbaguna","AI"],      fields:[{id:"pertanyaan",label:"Pertanyaan Anda",type:"textarea",placeholder:"Tanyakan apa saja — bisnis, teknologi, hukum, kesehatan, tips..."},{id:"gaya",label:"Gaya Jawaban",type:"options",options:["Detail & Lengkap","Singkat & Padat","Step-by-step","Seperti Teman","Seperti Pakar","Dengan Contoh Nyata"]}], prompt:(f)=>`Jawab gaya ${f.gaya}: "${f.pertanyaan}". Akurat, mudah dipahami, praktis, konteks Indonesia.` },
  grammar:       { title:"Perbaikan Teks & Grammar",     icon:"✏️", color:"#5cf0c8", cat:"produktif", tags:["Bahasa","Editing"],    fields:[{id:"teks",label:"Teks yang Ingin Diperbaiki",type:"textarea",placeholder:"Paste teks Anda di sini untuk diperbaiki..."},{id:"bahasa",label:"Bahasa",type:"options",options:["Indonesia","Inggris","Keduanya (bilingual)"]},{id:"tujuan",label:"Tujuan Perbaikan",type:"options",options:["Grammar & Ejaan","Gaya & Keterbacaan","Formal / Profesional","Lebih Menarik & Engaging","SEO-friendly"]}], prompt:(f)=>`Perbaiki teks ${f.bahasa} untuk tujuan ${f.tujuan}: "${f.teks}". Berikan: 1)Teks yang sudah diperbaiki 2)Penjelasan perubahan utama 3)Tips menulis lebih baik.` },
  mindmap:       { title:"Mind Map & Brainstorming",     icon:"🧠", color:"#7c5cfc", cat:"produktif", tags:["Ide","Kreatif"],       fields:[{id:"topik",label:"Topik / Tema Utama",type:"input",placeholder:"Contoh: strategi pemasaran digital untuk UMKM..."},{id:"tujuan",label:"Tujuan",type:"options",options:["Brainstorming Ide","Perencanaan Proyek","Belajar / Studi","Problem Solving","Business Planning"]},{id:"kedalaman",label:"Kedalaman",type:"options",options:["2 level (cepat)","3 level (sedang)","4 level (detail)"]}], prompt:(f)=>`Mind map ${f.kedalaman} untuk ${f.tujuan} topik: "${f.topik}". Format teks dengan indentasi jelas. Setiap cabang memiliki sub-ide relevan dan actionable.` },
  image_gen:     { title:"Generator Gambar AI",         icon:"🎨", color:"#7c5cfc", cat:"visual",    tags:["AI Image","Gratis"],   type:"image",
    fields:[
      {id:"deskripsi",label:"Deskripsi Gambar (bahasa Indonesia)",type:"textarea",placeholder:"Contoh: foto produk skincare di atas meja marmer putih dengan bunga mawar merah, pencahayaan studio profesional..."},
      {id:"style",label:"Gaya Visual",type:"options",options:["Realistis / Foto","Ilustrasi Digital","Anime / Manga","Cinematic","Oil Painting","3D Render","Watercolor","Minimalis"]},
      {id:"ratio",label:"Rasio Gambar",type:"options",options:["1:1 (Square)","16:9 (Landscape)","9:16 (Portrait)","4:3 (Standard)"]},
      {id:"kualitas",label:"Kualitas",type:"options",options:["Standard (cepat)","HD (lebih detail)"]},
    ],
    prompt:(f)=>f.deskripsi },
  storyboard:    { title:"Storyboard AI",                icon:"🎭", color:"#f7c948", cat:"visual",    tags:["Video","Visual"],      fields:[{id:"ide",label:"Ide / Konsep Cerita",type:"textarea",placeholder:"Contoh: iklan produk minuman energi untuk anak muda..."},{id:"durasi",label:"Durasi",type:"options",options:["15 detik (Reels/TikTok)","30 detik (Iklan)","60 detik (Short)","3-5 menit (YouTube)","Film Pendek"]},{id:"genre",label:"Tone / Genre",type:"options",options:["Dramatis","Komedi","Inspiratif","Thriller","Romantis","Dokumenter"]}], prompt:(f)=>`Storyboard lengkap untuk: "${f.ide}". Durasi: ${f.durasi}. Tone: ${f.genre}. Per adegan: [ADEGAN N] Deskripsi visual | Dialog/Narasi | Angle kamera | Durasi | Efek/Musik. Min 8 adegan cinematik.` },
  prompt_gambar: { title:"Prompt Generator Gambar AI",   icon:"🖼️", color:"#a78bfa", cat:"visual",    tags:["AI Image","Prompt"],   fields:[{id:"ide",label:"Deskripsi Gambar",type:"textarea",placeholder:"Contoh: foto produk skincare di atas meja marmer dengan bunga..."},{id:"style",label:"Gaya Visual",type:"options",options:["Realistis / Foto","Ilustrasi Digital","Anime / Manga","Oil Painting","Minimalis","Cinematic","3D Render","Watercolor"]},{id:"platform",label:"Platform Tujuan",type:"options",options:["Midjourney","DALL-E 3","Stable Diffusion","Adobe Firefly","Leonardo AI"]}], prompt:(f)=>`3 prompt gambar AI optimal untuk ${f.platform||"Midjourney"} gaya ${f.style||"Realistis"}: "${f.ide}". Per prompt: subjek, latar, pencahayaan, komposisi, mood, style keywords, quality tags. Bahasa Inggris. Sertakan negative prompt.` },
  prompt_video:  { title:"Prompt Generator Video AI",    icon:"🎞️", color:"#fc5c7d", cat:"visual",    tags:["AI Video","Prompt"],   fields:[{id:"ide",label:"Konsep Video",type:"textarea",placeholder:"Contoh: seseorang berjalan di pantai saat sunset slow motion..."},{id:"style",label:"Gaya Video",type:"options",options:["Realistis / Sinematik","Animasi 3D","Anime","Fantasi / Sci-Fi","Dokumenter","Music Video"]},{id:"platform",label:"Platform Tujuan",type:"options",options:["Runway Gen-3","Kling AI","Sora (OpenAI)","Pika Labs","HeyGen"]}], prompt:(f)=>`3 prompt video AI optimal untuk ${f.platform||"Runway"} gaya ${f.style||"Sinematik"}: "${f.ide}". Per prompt: scene detail, gerakan kamera, pencahayaan, durasi, mood. Bahasa Inggris. Tips setting terbaik.` },
  meal_plan:     { title:"Meal Plan & Resep Sehat",      icon:"🥗", color:"#5cf0c8", cat:"lifestyle", tags:["Kesehatan","Makanan"],  fields:[{id:"tujuan",label:"Tujuan",type:"options",options:["Diet / Turun Berat Badan","Bulking / Naik Massa Otot","Makan Sehat Umum","Vegetarian / Vegan","Budget Friendly"]},{id:"durasi",label:"Durasi Plan",type:"options",options:["1 hari","3 hari","1 minggu"]},{id:"alergi",label:"Pantangan / Alergi (opsional)",type:"input",placeholder:"Contoh: tidak suka seafood, alergi kacang..."}], prompt:(f)=>`Meal plan ${f.durasi} untuk ${f.tujuan}. Pantangan: ${f.alergi||"tidak ada"}. Format: Sarapan, Snack Pagi, Makan Siang, Snack Sore, Makan Malam per hari. Estimasi kalori, tips, 1 resep sederhana.` },
  itinerary:     { title:"Itinerary Perjalanan Wisata",  icon:"✈️", color:"#f7c948", cat:"lifestyle", tags:["Travel","Wisata"],      fields:[{id:"destinasi",label:"Destinasi Tujuan",type:"input",placeholder:"Contoh: Bali, Yogyakarta, Tokyo, Bangkok..."},{id:"durasi",label:"Durasi",type:"options",options:["Weekend (2 hari)","3 hari","5 hari","1 minggu","2 minggu"]},{id:"budget",label:"Budget",type:"options",options:["Budget / Backpacker","Mid-range","Premium / Luxury"]},{id:"gaya",label:"Gaya Wisata",type:"options",options:["Kuliner & Budaya","Alam & Petualangan","Relaksasi","Belanja","Fotografi","Keluarga"]}], prompt:(f)=>`Itinerary lengkap wisata ${f.durasi} ke ${f.destinasi}. Budget: ${f.budget}. Gaya: ${f.gaya}. Per hari: agenda jam per jam, rekomendasi tempat, estimasi biaya, tips, transportasi, akomodasi rekomendasi.` },
  motivasi:      { title:"Kata Motivasi & Quote",        icon:"🔥", color:"#ff6b35", cat:"lifestyle", tags:["Motivasi","Inspirasi"], fields:[{id:"tema",label:"Tema Motivasi",type:"options",options:["Bisnis & Sukses","Cinta & Hubungan","Kesehatan Mental","Pendidikan","Perjuangan Hidup","Spiritual","Kepemimpinan"]},{id:"jumlah",label:"Jumlah Quote",type:"options",options:["10 quote","20 quote","30 quote","50 quote"]},{id:"bahasa",label:"Bahasa",type:"options",options:["Indonesia","Inggris","Campuran"]}], prompt:(f)=>`${f.jumlah||"20"} quote motivasi tema ${f.tema} dalam bahasa ${f.bahasa}. Orisinal, powerful, mudah diingat, cocok untuk caption sosmed. Format: nomor. "Quote" — konteks singkat.` },
  horoscope:     { title:"Horoskop & Ramalan Kreatif",   icon:"🔮", color:"#a78bfa", cat:"lifestyle", tags:["Fun","Hiburan"],        fields:[{id:"zodiak",label:"Zodiak",type:"options",options:["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]},{id:"topik",label:"Topik Ramalan",type:"options",options:["Cinta & Hubungan","Karir & Bisnis","Keuangan","Kesehatan","Kehidupan Umum"]},{id:"periode",label:"Periode",type:"options",options:["Hari Ini","Minggu Ini","Bulan Ini","Tahun 2025"]}], prompt:(f)=>`Buat ramalan horoskop kreatif dan menghibur untuk ${f.zodiak} topik ${f.topik} periode ${f.periode}. Gaya: misterius tapi menyenangkan, positif, berikan saran praktis, sertakan angka keberuntungan dan warna keberuntungan.` },
  nama_bayi:     { title:"Rekomendasi Nama Bayi",        icon:"👶", color:"#fc5c7d", cat:"lifestyle", tags:["Keluarga","Nama"],      fields:[{id:"jenis",label:"Jenis Kelamin",type:"options",options:["Laki-laki","Perempuan","Unisex"]},{id:"asal",label:"Asal / Tema Nama",type:"options",options:["Islami / Arab","Jawa","Sunda","Indonesia Modern","Internasional","Kombinasi"]},{id:"awalan",label:"Awalan / Inisial (opsional)",type:"input",placeholder:"Contoh: huruf A, nama depan Muhammad..."}], prompt:(f)=>`20 rekomendasi nama bayi ${f.jenis} tema ${f.asal}. Awalan: ${f.awalan||"-"}. Per nama: nama lengkap, arti, asal bahasa, kesan, popularitas (umum/unik). Pilihkan nama-nama yang indah, bermakna, mudah diucapkan.` },
  resep:         { title:"Resep Masakan AI",             icon:"🍳", color:"#ff6b35", cat:"lifestyle", tags:["Masak","Kuliner"],      fields:[{id:"bahan",label:"Bahan-bahan yang Ada",type:"textarea",placeholder:"Contoh: ayam, bawang, tomat, telur, tahu..."},{id:"jenis",label:"Jenis Masakan",type:"options",options:["Masakan Indonesia","Masakan Asia","Masakan Western","Vegetarian","Dessert / Camilan","Minuman"]},{id:"waktu",label:"Waktu Memasak",type:"options",options:["Cepat (< 15 menit)","Sedang (15-30 menit)","Santai (30-60 menit)","Weekend Cooking (1+ jam)"]}], prompt:(f)=>`Buat 3 resep masakan ${f.jenis} menggunakan bahan: ${f.bahan}. Waktu: ${f.waktu}. Per resep: nama, bahan lengkap + takaran, langkah-langkah detail, tips memasak, estimasi kalori, tingkat kesulitan.` },
};

const PREMIUM_TOOLS = [

  { icon:"🎬", title:"Generator Video AI",          desc:"Buat video dari prompt teks atau gambar secara otomatis.",         color:"#fc5c7d",
    options:[
      {name:"Runway Gen-3",     url:"https://app.runwayml.com/video-tools/teams/personal/ai-tools/generative-video", tag:"Pro",      hint:"Butuh akun Runway"},
      {name:"Kling AI",         url:"https://klingai.com/text-to-video",                           tag:"Gratis!",  hint:"Langsung generate"},
      {name:"Pika Labs",        url:"https://pika.art/create",                                     tag:"Mudah",    hint:"Langsung generate"},
      {name:"HeyGen",           url:"https://app.heygen.com/create",                               tag:"Avatar AI",hint:"Butuh akun HeyGen"},
    ]},
  { icon:"⬆️", title:"Upscale & Enhance Gambar",   desc:"Tingkatkan resolusi gambar agar lebih jernih dan tajam.",          color:"#5cf0c8",
    options:[
      {name:"Upscayl",          url:"https://upscayl.org",                                         tag:"GRATIS!",  hint:"App desktop gratis"},
      {name:"Real-ESRGAN",      url:"https://replicate.com/nightmareai/real-esrgan",               tag:"Open Source",hint:"Via Replicate"},
      {name:"Canva Upscale",    url:"https://www.canva.com/features/image-upscaler/",              tag:"Gratis",   hint:"Butuh akun Canva"},
      {name:"Topaz Gigapixel",  url:"https://www.topazlabs.com/gigapixel",                        tag:"Pro",      hint:"Software berbayar"},
    ]},
  { icon:"🎙️", title:"Translate & Dubbing Video",  desc:"Terjemahkan dan dubbing video ke banyak bahasa.",                 color:"#f7c948",
    options:[
      {name:"HeyGen Translate", url:"https://app.heygen.com/video-translate",                     tag:"Terbaik",  hint:"Upload & translate"},
      {name:"ElevenLabs Dub",   url:"https://elevenlabs.io/dubbing",                              tag:"AI Voice", hint:"Dubbing otomatis"},
      {name:"Rask AI",          url:"https://app.rask.ai",                                         tag:"Multi Bahasa",hint:"Butuh akun Rask"},
      {name:"Captions.ai",      url:"https://www.captions.ai",                                    tag:"Mobile",   hint:"App mobile"},
    ]},
  { icon:"⚡", title:"VFX & Efek Video AI",          desc:"Tambahkan efek visual spektakuler hanya dengan ketikan teks.",     color:"#ff6b35",
    options:[
      {name:"Runway Effects",   url:"https://app.runwayml.com",                                   tag:"Canggih",  hint:"Butuh akun Runway"},
      {name:"Haiper AI",        url:"https://haiper.ai/creation",                                 tag:"Gratis!",  hint:"Langsung coba"},
      {name:"Viggle AI",        url:"https://viggle.ai",                                          tag:"Motion",   hint:"Via Discord"},
      {name:"Kling Effects",    url:"https://klingai.com/image-to-video",                         tag:"Terbaru",  hint:"Langsung generate"},
    ]},
  { icon:"✨", title:"Edit Foto AI",                 desc:"Hapus background, enhance, crop, dan edit foto otomatis.",         color:"#a78bfa",
    options:[
      {name:"Remove.bg",        url:"https://www.remove.bg/upload",                               tag:"Hapus BG", hint:"Upload langsung"},
      {name:"Canva AI",         url:"https://www.canva.com/photo-editor/",                        tag:"GRATIS!",  hint:"Editor lengkap"},
      {name:"Adobe Express",    url:"https://new.express.adobe.com",                              tag:"Adobe",    hint:"Butuh Adobe ID"},
      {name:"Fotor AI",         url:"https://www.fotor.com/photo-editor-app/editor/ai",           tag:"Lengkap",  hint:"Editor online"},
    ]},
  { icon:"▶️", title:"Motion Video AI",              desc:"Gerakkan foto diam menjadi video bergerak yang realistis.",        color:"#5cf0c8",
    options:[
      {name:"D-ID",             url:"https://studio.d-id.com",                                   tag:"Avatar",   hint:"Animate wajah/foto"},
      {name:"Kling AI",         url:"https://klingai.com/image-to-video",                         tag:"Realistis",hint:"Upload foto"},
      {name:"Luma Dream Machine",url:"https://lumalabs.ai/dream-machine",                         tag:"Gratis!",  hint:"Langsung generate"},
      {name:"Runway Motion",    url:"https://app.runwayml.com/video-tools/teams/personal/ai-tools/motion-brush",tag:"Pro",hint:"Motion Brush tool"},
    ]},
  { icon:"🎵", title:"Generator Musik AI",           desc:"Buat musik dan lagu orisinal dari deskripsi teks.",               color:"#fc5c7d",
    options:[
      {name:"Suno AI",          url:"https://suno.com/create",                                    tag:"Terbaik",  hint:"Langsung buat lagu"},
      {name:"Udio",             url:"https://www.udio.com/create",                                tag:"Gratis!",  hint:"Langsung buat musik"},
      {name:"Mubert",           url:"https://mubert.com/render",                                  tag:"Royalty Free",hint:"Musik bebas royalti"},
      {name:"Soundraw",         url:"https://soundraw.io/create_music",                           tag:"Pro",      hint:"Butuh akun Soundraw"},
    ]},
  { icon:"🗣️", title:"Text to Speech AI",           desc:"Ubah teks menjadi suara manusia natural berbagai bahasa.",         color:"#7c5cfc",
    options:[
      {name:"ElevenLabs",       url:"https://elevenlabs.io/text-to-speech",                       tag:"Terbaik",  hint:"Langsung coba gratis"},
      {name:"Murf AI",          url:"https://murf.ai/studio",                                     tag:"Pro",      hint:"Studio profesional"},
      {name:"Play.ht",          url:"https://play.ht/studio/",                                    tag:"Multi Voice",hint:"Banyak pilihan suara"},
      {name:"Kokoro TTS",       url:"https://huggingface.co/spaces/hexgrad/Kokoro-TTS",           tag:"Open Source",hint:"Gratis di HuggingFace"},
    ]},
  { icon:"🎨", title:"AI Design & Logo",             desc:"Buat logo, banner, dan desain grafis profesional dengan AI.",      color:"#f7c948",
    options:[
      {name:"Canva AI",         url:"https://www.canva.com/ai-image-generator/",                  tag:"GRATIS!",  hint:"Generator gambar AI"},
      {name:"Looka",            url:"https://looka.com/logo-maker/",                              tag:"Logo AI",  hint:"Buat logo instan"},
      {name:"Adobe Firefly",    url:"https://firefly.adobe.com/generate/images",                  tag:"Adobe",    hint:"Butuh Adobe ID"},
      {name:"Brandmark",        url:"https://brandmark.io/logo-rank/",                            tag:"Brand",    hint:"AI branding lengkap"},
    ]},
];

const CATEGORIES = [
  { id:"konten",   label:"✍️ Konten & Copywriting",    badge_map:{caption:"Populer",artikel:"SEO",thread:"Viral",hashtag:"Baru",faq:"Baru"} },
  { id:"bisnis",   label:"💼 Bisnis & Usaha",           badge_map:{swot:"Analisis",pitch:"Investor",proposal:"Baru"} },
  { id:"kreatif",  label:"🎨 Kreatif & Hiburan",        badge_map:{jokes:"Humor",cerpen:"Fiksi"} },
  { id:"produktif",label:"🧠 Produktivitas & Belajar",  badge_map:{grammar:"Baru",mindmap:"Baru"} },
  { id:"visual",   label:"🎬 Studio Visual AI",         badge_map:{image_gen:"🆓 Gratis",storyboard:"Hot",prompt_gambar:"Hot",prompt_video:"Hot"} },
  { id:"lifestyle",label:"🌟 Lifestyle & Personal",     badge_map:{horoscope:"Fun",nama_bayi:"Baru",resep:"Baru"} },
];

/* ── localStorage helpers ── */
const LS = {
  get:(k,d)=>{ try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;} },
  set:(k,v)=>{ try{localStorage.setItem(k,JSON.stringify(v));}catch{} },
};

/* ════════════════════════════════════════════════
   GLOBAL CSS
════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{font-family:'Plus Jakarta Sans',sans-serif;overflow-x:hidden;}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:#2a2a4a;border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes particleFloat{0%{transform:translateY(0) translateX(0) rotate(0deg);opacity:0.7}100%{transform:translateY(-100vh) translateX(var(--dx)) rotate(360deg);opacity:0}}
  @keyframes shimmerSlide{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes morphBlob{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}}
  @keyframes toastIn{from{transform:translate(-50%,80px);opacity:0}to{transform:translate(-50%,0);opacity:1}}
  @keyframes slideIn{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:none}}
  .fade-up{animation:fadeUp 0.5s ease forwards;}
  .float{animation:floatY 5s ease-in-out infinite;}
  .tool-card{transition:all 0.25s cubic-bezier(0.4,0,0.2,1)!important;}
  .tool-card:hover{transform:translateY(-5px) scale(1.01)!important;}
  .btn-hover{transition:all 0.2s ease!important;}
  .btn-hover:hover{transform:translateY(-2px)!important;opacity:0.9!important;}
  .prem-link{transition:all 0.2s ease!important;}
  .prem-link:hover{transform:translateX(5px)!important;}
  .opt-pill:hover{opacity:0.85!important;}
  .nav-link{transition:all 0.2s ease!important;}
  .star-btn{transition:transform 0.1s ease!important;cursor:pointer!important;}
  .star-btn:hover{transform:scale(1.4)!important;}
  .particle{position:fixed;pointer-events:none;border-radius:50%;animation:particleFloat linear infinite;}
  .shimmer{background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.08) 50%,transparent 100%);background-size:200% 100%;animation:shimmerSlide 1.5s infinite;}
  .history-panel{animation:slideIn 0.3s ease;}
  /* ── MOBILE ── */
  @media(max-width:768px){
    .desktop-nav{display:none!important;}
    .mobile-btn{display:flex!important;}
    .hero-h1{font-size:clamp(1.8rem,7vw,3rem)!important;}
    .stat-grid{grid-template-columns:repeat(2,1fr)!important;}
    .tool-grid{grid-template-columns:repeat(2,1fr)!important;}
    .action-row{flex-direction:column!important;}
    .action-row button{width:100%!important;text-align:center!important;}
    .history-side{width:100%!important;left:0!important;right:0!important;}
    .tool-hdr{flex-direction:column!important;align-items:flex-start!important;}
    .hdr-inner{padding:0 1rem!important;}
  }
  @media(max-width:480px){
    .tool-grid{grid-template-columns:1fr 1fr!important;}
    .premium-grid{grid-template-columns:1fr!important;}
    .filter-row{gap:0.3rem!important;}
    .fpill{font-size:0.7rem!important;padding:5px 9px!important;}
  }
`;

/* ── Particles ── */
function Particles({dark}){
  const pts=Array.from({length:12},(_,i)=>({id:i,size:Math.random()*4+2,left:`${Math.random()*100}%`,delay:`${Math.random()*8}s`,dur:`${Math.random()*10+8}s`,dx:`${(Math.random()-0.5)*200}px`,color:dark?["rgba(124,92,252,0.4)","rgba(252,92,125,0.3)","rgba(92,240,200,0.3)","rgba(247,201,72,0.25)"][i%4]:["rgba(124,92,252,0.2)","rgba(252,92,125,0.15)","rgba(92,240,200,0.2)"][i%3]}));
  return <>{pts.map(p=><div key={p.id} className="particle" style={{width:p.size,height:p.size,left:p.left,bottom:"-10px",background:p.color,animationDuration:p.dur,animationDelay:p.delay,"--dx":p.dx}}/>)}</>;
}

/* ── Typewriter ── */
function TypewriterText({text}){
  const[d,setD]=useState("");const[done,setDone]=useState(false);
  useEffect(()=>{setD("");setDone(false);let i=0;const iv=setInterval(()=>{if(i<text.length){setD(text.slice(0,i+1));i++;}else{setDone(true);clearInterval(iv);}},8);return()=>clearInterval(iv);},[text]);
  return <span style={{whiteSpace:"pre-wrap",lineHeight:1.85}}>{d}{!done&&<span style={{animation:"fadeIn 0.5s infinite alternate",opacity:0.7}}>▌</span>}</span>;
}

/* ── Toast ── */
function Toast({message,type,onClose}){
  const C={"success":"#5cf0c8","error":"#fc5c7d","info":"#7c5cfc","warning":"#f7c948"};
  useEffect(()=>{const t=setTimeout(onClose,3000);return()=>clearTimeout(t);},[]);
  return(
    <div style={{position:"fixed",bottom:"2rem",left:"50%",transform:"translateX(-50%)",zIndex:9999,background:"rgba(8,8,20,0.96)",backdropFilter:"blur(20px)",border:`1px solid ${(C[type]||C.info)}40`,borderRadius:12,padding:"0.75rem 1.5rem",display:"flex",alignItems:"center",gap:"0.65rem",boxShadow:`0 8px 32px ${(C[type]||C.info)}30`,minWidth:220,animation:"toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards"}}>
      <span style={{color:C[type]||C.info,fontSize:"1.1rem"}}>{type==="success"?"✅":type==="error"?"❌":type==="warning"?"⚠️":"💡"}</span>
      <span style={{color:"#e2e2f0",fontSize:"0.85rem",fontWeight:600}}>{message}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════════ */
export default function App(){
  const[page,setPage]=useState("home");
  const[currentTool,setCurrentTool]=useState(null);
  const[fieldValues,setFieldValues]=useState({});
  const[selectedOpts,setSelectedOpts]=useState({});
  const[result,setResult]=useState("");
  const[imageResult,setImageResult]=useState(null);
  const[imageLoading,setImageLoading]=useState(false);
  const[loading,setLoading]=useState(false);
  const[copied,setCopied]=useState(false);
  const[activeTab,setActiveTab]=useState("free");
  const[expandedPrem,setExpandedPrem]=useState(null);
  const[rating,setRating]=useState(0);
  const[history,setHistory]=useState(()=>LS.get("bbtools_hist",[]));
  const[showHistory,setShowHistory]=useState(false);
  const[bookmarks,setBookmarks]=useState(()=>LS.get("bbtools_bm",[]));
  const[darkMode,setDarkMode]=useState(()=>LS.get("bbtools_dark",true));
  const[searchQ,setSearchQ]=useState("");
  const[mounted,setMounted]=useState(false);
  const[wordCount,setWordCount]=useState(0);
  const[activeFilter,setActiveFilter]=useState("all");
  const[lang,setLang]=useState(()=>LS.get("bbtools_lang","id"));
  const[toast,setToast]=useState(null);
  const[mobileMenu,setMobileMenu]=useState(false);
  const resultRef=useRef(null);

  useEffect(()=>{setTimeout(()=>setMounted(true),80);},[]);
  useEffect(()=>{LS.set("bbtools_hist",history);},[history]);
  useEffect(()=>{LS.set("bbtools_bm",bookmarks);},[bookmarks]);
  useEffect(()=>{LS.set("bbtools_dark",darkMode);},[darkMode]);
  useEffect(()=>{LS.set("bbtools_lang",lang);},[lang]);

  const notify=(msg,type="success")=>setToast({message:msg,type,id:Date.now()});

  const D=darkMode;
  const bg=D?"#06060e":"#f0f0f8";
  const surface=D?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.03)";
  const border=D?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.08)";
  const txtMain=D?"#e2e2f0":"#1a1a2e";
  const txtMuted=D?"#6666aa":"#8888aa";
  const cardBg=D?"rgba(255,255,255,0.025)":"rgba(255,255,255,0.85)";
  const inputBg=D?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.04)";
  const headerBg=D?"rgba(6,6,14,0.88)":"rgba(240,240,248,0.92)";

  const openTool=(id)=>{setCurrentTool(id);setFieldValues({});setSelectedOpts({});setResult("");setImageResult(null);setRating(0);setWordCount(0);setPage("tool");window.scrollTo(0,0);};
  const goBack=()=>{setPage("home");setResult("");setCurrentTool(null);};
  const setField=(id,v)=>setFieldValues(p=>({...p,[id]:v}));
  const setOpt=(fid,v)=>setSelectedOpts(p=>({...p,[fid]:v}));

  const toggleBookmark=(id)=>{
    setBookmarks(p=>{
      const has=p.includes(id);
      notify(has?"Bookmark dihapus":"✨ Tool disimpan!",has?"info":"success");
      return has?p.filter(b=>b!==id):[...p,id];
    });
  };

  /* ── GENERATE ── */
  const generate=async()=>{
    const tool=TOOLS[currentTool];
    const fields={};
    tool.fields.forEach(f=>{fields[f.id]=f.type==="options"?(selectedOpts[f.id]||""):(fieldValues[f.id]||"");});
    const needsText=tool.fields.some(f=>f.type!=="options");
    if(needsText&&!tool.fields.filter(f=>f.type!=="options").some(f=>fields[f.id]?.trim())){
      notify("Isi setidaknya satu field dulu ya!","warning");return;
    }
    setLoading(true);setResult("");setRating(0);setWordCount(0);
    try{
      const sys=lang==="en"
        ?"You are a creative AI assistant from BarraBoys Tools. Help users create high-quality content. Answer directly without disclaimers. Natural professional language."
        :"Kamu adalah asisten AI kreatif dari BarraBoys Tools Studio Kreasi AI. Bantu pengguna Indonesia buat konten berkualitas tinggi. Jawab langsung tanpa disclaimer. Bahasa Indonesia natural dan profesional.";
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[{role:"user",content:tool.prompt(fields)}]})
      });
      if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e?.error?.message||`HTTP ${res.status}`);}
      const data=await res.json();
      if(data.error)throw new Error(data.error.message);
      const text=data.content?.map(c=>c.text||"").filter(Boolean).join("")||"";
      if(!text)throw new Error("Respons kosong dari AI");
      setResult(text);
      setWordCount(text.split(/\s+/).filter(Boolean).length);
      setHistory(p=>[{id:Date.now(),tool:tool.title,icon:tool.icon,color:tool.color,result:text,time:new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})},...p.slice(0,19)]);
      setTimeout(()=>resultRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),200);
      notify("Generate berhasil! 🎉","success");
    }catch(e){
      const msg=e.message?.includes("529")?"Server sibuk, coba lagi sebentar.":e.message?.includes("401")?"Kesalahan autentikasi API.":e.message?.includes("Respons kosong")?"AI tidak memberikan respons, coba lagi.":`Gagal generate: ${e.message||"Periksa koneksi internet."}`;
      setResult(`⚠️ ${msg}`);
      notify(msg,"error");
    }
    setLoading(false);
  };

  /* ── GENERATE IMAGE (Pollinations AI) ── */
  const generateImage=async()=>{
    const tool=TOOLS[currentTool];
    const deskripsi=fieldValues["deskripsi"]||"";
    const style=selectedOpts["style"]||"Realistis / Foto";
    const ratio=selectedOpts["ratio"]||"1:1 (Square)";
    const kualitas=selectedOpts["kualitas"]||"Standard (cepat)";
    if(!deskripsi.trim()){notify("Isi deskripsi gambar dulu ya!","warning");return;}
    
    setImageLoading(true);setImageResult(null);
    
    // Map style ke keyword Inggris
    const styleMap={"Realistis / Foto":"photorealistic, professional photography, 8k","Ilustrasi Digital":"digital illustration, vibrant colors, detailed","Anime / Manga":"anime style, manga art, detailed illustration","Cinematic":"cinematic, film photography, dramatic lighting, bokeh","Oil Painting":"oil painting, artistic, textured brushstrokes","3D Render":"3D render, CGI, octane render, high quality","Watercolor":"watercolor painting, soft colors, artistic","Minimalis":"minimalist, clean, simple, white background"};
    const ratioMap={"1:1 (Square)":{w:1024,h:1024},"16:9 (Landscape)":{w:1280,h:720},"9:16 (Portrait)":{w:720,h:1280},"4:3 (Standard)":{w:1024,h:768}};
    
    const styleEn=styleMap[style]||"photorealistic";
    const {w,h}=ratioMap[ratio]||{w:1024,h:1024};
    const enhance=kualitas==="HD (lebih detail)"?"&enhance=true":"";
    
    // Translate prompt via Claude first, then generate image
    try{
      // Step 1: Translate deskripsi to English prompt via Claude
      const transRes=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,
          system:"You are a prompt engineer. Translate the Indonesian image description to an optimized English image generation prompt. Return ONLY the prompt, no explanation, no quotes.",
          messages:[{role:"user",content:`Translate and optimize this for AI image generation: "${deskripsi}". Style: ${styleEn}. Add relevant artistic quality keywords. Max 100 words.`}]
        })
      });
      const transData=await transRes.json();
      const engPrompt=transData.content?.map(c=>c.text||"").join("")?.trim()||deskripsi;
      const fullPrompt=`${engPrompt}, ${styleEn}`;
      const encodedPrompt=encodeURIComponent(fullPrompt);
      const imgUrl=`https://image.pollinations.ai/prompt/${encodedPrompt}?width=${w}&height=${h}&nologo=true${enhance}&seed=${Math.floor(Math.random()*99999)}`;
      setImageResult({url:imgUrl,prompt:engPrompt,deskripsi,style,ratio});
      notify("Gambar berhasil digenerate! 🎨","success");
      setHistory(p=>[{id:Date.now(),tool:tool.title,icon:tool.icon,color:tool.color,result:`[Gambar] ${deskripsi}`,time:new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})},...p.slice(0,19)]);
    }catch(e){
      notify("Gagal generate gambar. Coba lagi!","error");
    }
    setImageLoading(false);
  };

  const copyText=()=>{navigator.clipboard.writeText(result).then(()=>{setCopied(true);notify("Teks berhasil disalin! 📋","success");setTimeout(()=>setCopied(false),2200);});};

  const downloadTxt=()=>{
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([result],{type:"text/plain;charset=utf-8"}));
    a.download=`BarraBoys-${TOOLS[currentTool]?.title||"hasil"}-${Date.now()}.txt`;
    a.click();
    notify("File .txt diunduh! ⬇️","success");
  };

  const exportHTML=()=>{
    const tool=TOOLS[currentTool];
    const html=`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>${tool?.title||"Hasil"} — BarraBoys Tools</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.8;color:#1a1a2e;background:#f9f9f9;}h1{color:#7c5cfc;border-bottom:2px solid #7c5cfc;padding-bottom:10px;margin-bottom:20px;}pre{white-space:pre-wrap;word-wrap:break-word;background:#fff;padding:20px;border-radius:8px;font-size:14px;border:1px solid #e2e2f2;}.footer{margin-top:40px;color:#888;font-size:12px;border-top:1px solid #ddd;padding-top:10px;}</style></head><body><h1>${tool?.icon||""} ${tool?.title||"Hasil Generate"}</h1><pre>${result.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</pre><div class="footer">Dibuat dengan BarraBoys Tools — Studio Kreasi AI Indonesia &middot; ${new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</div></body></html>`;
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([html],{type:"text/html"}));
    a.download=`BarraBoys-${tool?.title||"hasil"}-${Date.now()}.html`;
    a.click();
    notify("File HTML diunduh! 📄","success");
  };

  const shareWA=()=>window.open(`https://wa.me/?text=${encodeURIComponent("Hasil dari BarraBoys Tools:\n\n"+result+"\n\n✨ Coba gratis di BarraBoys Tools!")}`, "_blank");
  const shareTG=()=>window.open(`https://t.me/share/url?text=${encodeURIComponent("Hasil dari BarraBoys Tools:\n\n"+result)}`, "_blank");

  const filteredTools=Object.entries(TOOLS).filter(([id,t])=>{
    const q=searchQ.toLowerCase();
    const mS=!q||t.title.toLowerCase().includes(q)||t.tags.some(tg=>tg.toLowerCase().includes(q));
    const mF=activeFilter==="all"?true:activeFilter==="bookmarks"?bookmarks.includes(id):t.cat===activeFilter;
    return mS&&mF;
  });

  /* ── HEADER ── */
  const Header=({showBack})=>(
    <header style={{position:"sticky",top:0,zIndex:200,background:headerBg,backdropFilter:"blur(28px)",borderBottom:`1px solid ${border}`,height:60,transition:"background 0.3s"}}>
      <div className="hdr-inner" style={{maxWidth:1200,margin:"0 auto",padding:"0 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",height:"100%"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
          {showBack&&<button className="btn-hover" onClick={goBack} style={{background:surface,border:`1px solid ${border}`,color:txtMuted,fontFamily:"inherit",fontSize:"0.8rem",fontWeight:600,padding:"5px 14px",borderRadius:8,cursor:"pointer",marginRight:4,whiteSpace:"nowrap"}}>← Kembali</button>}
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.25rem",background:"linear-gradient(135deg,#7c5cfc,#fc5c7d)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",cursor:"pointer",whiteSpace:"nowrap"}} onClick={goBack}>BarraBoys<span style={{WebkitTextFillColor:"#5cf0c8"}}>Tools</span></div>
          <div style={{background:"rgba(92,240,200,0.12)",border:"1px solid rgba(92,240,200,0.22)",color:"#5cf0c8",fontSize:"0.62rem",fontWeight:800,padding:"3px 9px",borderRadius:100,letterSpacing:0.8}}>✦ FREE</div>
        </div>
        <nav className="desktop-nav" style={{display:"flex",alignItems:"center",gap:"0.15rem"}}>
          {[
            {label:"🏠 Home",action:()=>{setPage("home");setSearchQ("");setActiveFilter("all");}},
            {label:"📚 Tentang",action:()=>setPage("about")},
            {label:`📜 Riwayat${history.length>0?` (${history.length})`:""}`,action:()=>setShowHistory(p=>!p)},
            {label:`🔖 Tersimpan${bookmarks.length>0?` (${bookmarks.length})`:""} `,action:()=>{setPage("home");setActiveFilter("bookmarks");}},
          ].map(n=>(
            <button key={n.label} className="nav-link" onClick={n.action} style={{background:"none",border:"none",color:txtMuted,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"0.78rem",fontWeight:500,padding:"6px 9px",borderRadius:8,cursor:"pointer",opacity:0.8,whiteSpace:"nowrap"}}>{n.label}</button>
          ))}
          <button className="btn-hover" onClick={()=>setLang(l=>l==="id"?"en":"id")} style={{background:surface,border:`1px solid ${border}`,color:txtMuted,fontFamily:"inherit",fontSize:"0.75rem",fontWeight:700,padding:"5px 10px",borderRadius:8,cursor:"pointer",marginLeft:2}}>🌐{lang==="id"?" EN":" ID"}</button>
          <button className="btn-hover" onClick={()=>setDarkMode(p=>!p)} style={{background:surface,border:`1px solid ${border}`,color:txtMuted,fontSize:"1rem",padding:"5px 11px",borderRadius:8,cursor:"pointer",marginLeft:2,border:"none"}}>{D?"☀️":"🌙"}</button>
        </nav>
        {/* Mobile */}
        <div className="mobile-btn" style={{display:"none",alignItems:"center",gap:"0.4rem"}}>
          <button onClick={()=>setDarkMode(p=>!p)} style={{background:surface,border:`1px solid ${border}`,color:txtMuted,fontSize:"1rem",padding:"5px 10px",borderRadius:8,cursor:"pointer"}}>{D?"☀️":"🌙"}</button>
          <button onClick={()=>setMobileMenu(p=>!p)} style={{background:surface,border:`1px solid ${border}`,color:txtMuted,fontSize:"1rem",padding:"5px 10px",borderRadius:8,cursor:"pointer"}}>☰</button>
        </div>
      </div>
      {mobileMenu&&(
        <div style={{background:D?"rgba(8,8,20,0.98)":"rgba(245,245,255,0.98)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${border}`,padding:"0.75rem 1rem",display:"flex",flexDirection:"column",gap:"0.4rem",position:"absolute",width:"100%",zIndex:300}}>
          {[
            {label:"🏠 Home",action:()=>{setPage("home");setSearchQ("");setActiveFilter("all");setMobileMenu(false);}},
            {label:"📚 Tentang",action:()=>{setPage("about");setMobileMenu(false);}},
            {label:`📜 Riwayat${history.length>0?` (${history.length})`:""}`,action:()=>{setShowHistory(p=>!p);setMobileMenu(false);}},
            {label:`🔖 Tersimpan${bookmarks.length>0?` (${bookmarks.length})`:""}`,action:()=>{setPage("home");setActiveFilter("bookmarks");setMobileMenu(false);}},
            {label:`🌐 Bahasa: ${lang==="id"?"Indonesia → English":"English → Indonesia"}`,action:()=>{setLang(l=>l==="id"?"en":"id");setMobileMenu(false);}},
          ].map(n=>(
            <button key={n.label} onClick={n.action} style={{background:"none",border:`1px solid ${border}`,color:txtMain,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"0.85rem",fontWeight:500,padding:"10px 14px",borderRadius:8,cursor:"pointer",textAlign:"left"}}>{n.label}</button>
          ))}
        </div>
      )}
    </header>
  );

  /* ── HISTORY PANEL ── */
  const HistoryPanel=()=>(
    <div className="history-side" style={{position:"fixed",top:60,right:0,width:310,height:"calc(100vh - 60px)",background:D?"rgba(8,8,18,0.98)":"rgba(245,245,255,0.98)",backdropFilter:"blur(24px)",borderLeft:`1px solid ${border}`,zIndex:150,overflowY:"auto",padding:"1.1rem",animation:"slideIn 0.3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
        <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.95rem",color:txtMain}}>📜 Riwayat Generate</span>
        <div style={{display:"flex",gap:"0.4rem"}}>
          {history.length>0&&<button onClick={()=>{setHistory([]);notify("Riwayat dihapus","info");}} style={{background:"none",border:`1px solid ${border}`,color:txtMuted,cursor:"pointer",fontSize:"0.7rem",padding:"3px 8px",borderRadius:6,fontFamily:"inherit"}}>Hapus</button>}
          <button onClick={()=>setShowHistory(false)} style={{background:"none",border:"none",color:txtMuted,cursor:"pointer",fontSize:"1.1rem"}}>✕</button>
        </div>
      </div>
      {history.length===0
        ?<div style={{color:txtMuted,fontSize:"0.82rem",textAlign:"center",marginTop:"3rem",lineHeight:2}}>Belum ada riwayat.<br/>Coba generate sesuatu dulu!</div>
        :history.map(h=>(
          <div key={h.id} onClick={()=>{const id=Object.keys(TOOLS).find(k=>TOOLS[k].title===h.tool);if(id){setCurrentTool(id);setResult(h.result);setPage("tool");setShowHistory(false);}}}
            style={{background:cardBg,border:`1px solid ${border}`,borderRadius:12,padding:"0.85rem",marginBottom:"0.55rem",cursor:"pointer",transition:"all 0.2s",borderLeft:`3px solid ${h.color}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.35rem"}}>
              <span style={{fontWeight:600,fontSize:"0.82rem",color:txtMain}}>{h.icon} {h.tool}</span>
              <span style={{fontSize:"0.68rem",color:txtMuted}}>{h.time}</span>
            </div>
            <div style={{fontSize:"0.75rem",color:txtMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.result.slice(0,55)}...</div>
          </div>
        ))
      }
    </div>
  );

  /* ════════════════════════════════════════════════
     TOOL WORKSPACE PAGE
  ════════════════════════════════════════════════ */
  if(page==="tool"&&currentTool){
    const tool=TOOLS[currentTool];
    const isBookmarked=bookmarks.includes(currentTool);
    return(
      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:bg,color:txtMain,minHeight:"100vh",transition:"background 0.3s,color 0.3s"}}>
        <style>{GLOBAL_CSS}</style>
        <Particles dark={D}/>
        <Header showBack/>
        {showHistory&&<HistoryPanel/>}
        {toast&&<Toast key={toast.id} message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
        <div style={{maxWidth:800,margin:"0 auto",padding:"2rem 1.5rem 6rem"}}>
          {/* Tool Header */}
          <div className="fade-up tool-hdr" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem",flexWrap:"wrap",gap:"0.75rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.85rem"}}>
              <div style={{width:52,height:52,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.6rem",background:`${tool.color}18`,border:`1px solid ${tool.color}30`,flexShrink:0}}>{tool.icon}</div>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.3rem"}}>{tool.title}</div>
                <div style={{display:"flex",gap:"0.3rem",marginTop:"0.3rem",flexWrap:"wrap"}}>{tool.tags.map(t=><span key={t} style={{fontSize:"0.62rem",fontWeight:700,padding:"2px 8px",borderRadius:100,background:`${tool.color}15`,color:tool.color,border:`1px solid ${tool.color}25`}}>{t}</span>)}</div>
              </div>
            </div>
            <button className="btn-hover" onClick={()=>toggleBookmark(currentTool)} style={{background:isBookmarked?"rgba(247,201,72,0.15)":surface,border:`1px solid ${isBookmarked?"rgba(247,201,72,0.4)":border}`,color:isBookmarked?"#f7c948":txtMuted,fontFamily:"inherit",fontSize:"0.82rem",fontWeight:600,padding:"8px 16px",borderRadius:10,cursor:"pointer",whiteSpace:"nowrap"}}>
              {isBookmarked?"🔖 Tersimpan":"🔖 Simpan Tool"}
            </button>
          </div>

          {/* Inputs */}
          <div className="fade-up" style={{background:cardBg,border:`1px solid ${border}`,borderRadius:20,padding:"1.75rem",marginBottom:"1rem",backdropFilter:"blur(12px)"}}>
            {tool.fields.map((f,i)=>(
              <div key={f.id} style={{marginBottom:i<tool.fields.length-1?"1.35rem":0}}>
                <div style={{fontSize:"0.7rem",fontWeight:800,color:txtMuted,textTransform:"uppercase",letterSpacing:1.8,marginBottom:"0.5rem"}}>{f.label}</div>
                {f.type==="textarea"&&<textarea style={{width:"100%",background:inputBg,border:`1px solid ${border}`,borderRadius:12,color:txtMain,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"0.9rem",padding:"0.8rem 1rem",outline:"none",resize:"vertical",minHeight:88,boxSizing:"border-box",transition:"border-color 0.2s"}} placeholder={f.placeholder} value={fieldValues[f.id]||""} onChange={e=>setField(f.id,e.target.value)} onFocus={e=>{e.target.style.borderColor=tool.color;e.target.style.boxShadow=`0 0 0 3px ${tool.color}18`;}} onBlur={e=>{e.target.style.borderColor=border;e.target.style.boxShadow="none";}}/>}
                {f.type==="input"&&<input style={{width:"100%",background:inputBg,border:`1px solid ${border}`,borderRadius:12,color:txtMain,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"0.9rem",padding:"0.8rem 1rem",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"}} type="text" placeholder={f.placeholder} value={fieldValues[f.id]||""} onChange={e=>setField(f.id,e.target.value)} onFocus={e=>{e.target.style.borderColor=tool.color;e.target.style.boxShadow=`0 0 0 3px ${tool.color}18`;}} onBlur={e=>{e.target.style.borderColor=border;e.target.style.boxShadow="none";}}/>}
                {f.type==="options"&&<div style={{display:"flex",flexWrap:"wrap",gap:"0.45rem",marginTop:"0.4rem"}}>
                  {f.options.map(o=><button key={o} className="opt-pill" onClick={()=>setOpt(f.id,o)} style={{background:selectedOpts[f.id]===o?`${tool.color}20`:inputBg,border:`1px solid ${selectedOpts[f.id]===o?tool.color:border}`,borderRadius:9,color:selectedOpts[f.id]===o?tool.color:txtMuted,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"0.81rem",fontWeight:selectedOpts[f.id]===o?700:400,padding:"6px 14px",cursor:"pointer",transition:"all 0.15s"}}>{o}</button>)}
                </div>}
              </div>
            ))}
          </div>

          {/* Generate Button — image tool vs text tool */}
          {tool.type==="image" ? (
            <>
              <button className="btn-hover" onClick={generateImage} disabled={imageLoading} style={{width:"100%",padding:"1rem",background:imageLoading?`${tool.color}40`:`linear-gradient(135deg,${tool.color},#fc5c7d)`,border:"none",borderRadius:14,color:"#fff",fontFamily:"'Syne',sans-serif",fontSize:"1rem",fontWeight:800,cursor:imageLoading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.6rem",marginBottom:"1rem",boxShadow:imageLoading?"none":`0 8px 32px ${tool.color}35`,transition:"all 0.3s"}}>
                {imageLoading?<><div style={{width:18,height:18,border:"2.5px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/> AI sedang melukis...</>:"🎨 Generate Gambar — 100% Gratis!"}
              </button>
              {imageLoading&&(
                <div style={{background:cardBg,border:`1px solid ${border}`,borderRadius:18,padding:"3rem 1rem",marginBottom:"1rem",textAlign:"center"}}>
                  <div style={{fontSize:"3rem",marginBottom:"1rem",animation:"floatY 2s ease-in-out infinite"}}>🎨</div>
                  <div style={{color:txtMuted,fontSize:"0.88rem",fontWeight:600}}>AI sedang melukis gambarmu...</div>
                  <div style={{color:txtMuted,fontSize:"0.75rem",marginTop:"0.4rem",opacity:0.6}}>Biasanya 5–15 detik, sabar ya!</div>
                </div>
              )}
              {imageResult&&!imageLoading&&(
                <div ref={resultRef} className="fade-up">
                  <div style={{background:cardBg,border:`1px solid ${tool.color}30`,borderRadius:18,overflow:"hidden",marginBottom:"0.85rem"}}>
                    {/* Image display */}
                    <div style={{position:"relative",background:"#000",minHeight:200}}>
                      <img
                        src={imageResult.url}
                        alt={imageResult.deskripsi}
                        style={{width:"100%",display:"block",borderRadius:"0",maxHeight:520,objectFit:"contain"}}
                        onLoad={()=>notify("Gambar berhasil dimuat! ✅","success")}
                        onError={()=>notify("Gagal load gambar, coba generate ulang","error")}
                      />
                      <div style={{position:"absolute",top:"0.75rem",right:"0.75rem",display:"flex",gap:"0.4rem"}}>
                        <span style={{fontSize:"0.65rem",fontWeight:800,background:"rgba(92,240,200,0.9)",color:"#06060e",padding:"3px 10px",borderRadius:100}}>✓ Generated</span>
                      </div>
                    </div>
                    {/* Prompt info */}
                    <div style={{padding:"1rem 1.25rem",borderTop:`1px solid ${border}`}}>
                      <div style={{fontSize:"0.68rem",fontWeight:800,color:txtMuted,textTransform:"uppercase",letterSpacing:1.5,marginBottom:"0.4rem"}}>Deskripsi Kamu</div>
                      <div style={{fontSize:"0.82rem",color:txtMain,lineHeight:1.6,marginBottom:"0.5rem"}}>{imageResult.deskripsi}</div>
                      <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap"}}>
                        <span style={{fontSize:"0.65rem",padding:"2px 8px",borderRadius:5,background:`${tool.color}12`,color:tool.color,fontWeight:600}}>{imageResult.style}</span>
                        <span style={{fontSize:"0.65rem",padding:"2px 8px",borderRadius:5,background:`${tool.color}12`,color:tool.color,fontWeight:600}}>{imageResult.ratio}</span>
                      </div>
                    </div>
                  </div>
                  {/* Rating */}
                  <div style={{background:cardBg,border:`1px solid ${border}`,borderRadius:12,padding:"0.85rem 1.2rem",marginBottom:"0.75rem",display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
                    <span style={{fontSize:"0.78rem",color:txtMuted,fontWeight:600}}>Nilai hasil ini:</span>
                    <div style={{display:"flex",gap:"0.25rem"}}>
                      {[1,2,3,4,5].map(s=><span key={s} className="star-btn" style={{fontSize:"1.35rem",opacity:s<=rating?1:0.25,filter:s<=rating?"drop-shadow(0 0 4px gold)":"none"}} onClick={()=>{setRating(s);if(s>=4)notify("Makasih atas bintangnya! 🌟","success");}}>{s<=rating?"⭐":"☆"}</span>)}
                    </div>
                    {rating>0&&<span style={{fontSize:"0.8rem",fontWeight:700,color:rating>=4?"#5cf0c8":rating>=3?"#f7c948":"#fc5c7d"}}>{rating===5?"Luar biasa! 🔥":rating===4?"Bagus sekali! 👍":rating===3?"Lumayan! 👌":rating===2?"Kurang memuaskan 😕":"Tidak bagus 😞"}</span>}
                  </div>
                  {/* Image Action Buttons */}
                  <div className="action-row" style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
                    <a href={imageResult.url} download={`BarraBoys-${Date.now()}.jpg`} target="_blank" rel="noopener noreferrer">
                      <button className="btn-hover" style={{background:`${tool.color}20`,border:`1px solid ${tool.color}`,borderRadius:10,color:tool.color,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"0.82rem",fontWeight:700,padding:"8px 15px",cursor:"pointer"}}>⬇️ Download Gambar</button>
                    </a>
                    <button className="btn-hover" onClick={generateImage} style={{background:surface,border:`1px solid ${border}`,borderRadius:10,color:txtMuted,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"0.82rem",fontWeight:500,padding:"8px 15px",cursor:"pointer"}}>🔄 Generate Ulang</button>
                    <button className="btn-hover" onClick={()=>{navigator.clipboard.writeText(imageResult.url);notify("URL gambar disalin!","success");}} style={{background:surface,border:`1px solid ${border}`,borderRadius:10,color:txtMuted,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"0.82rem",fontWeight:500,padding:"8px 15px",cursor:"pointer"}}>🔗 Salin URL</button>
                    <button className="btn-hover" onClick={shareWA} style={{background:surface,border:`1px solid ${border}`,borderRadius:10,color:txtMuted,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"0.82rem",fontWeight:500,padding:"8px 15px",cursor:"pointer"}}>💬 Share WA</button>
                  </div>
                  <div style={{fontSize:"0.7rem",color:txtMuted,marginTop:"0.75rem",opacity:0.6}}>* Powered by Pollinations AI — gratis tanpa watermark. Gambar bersifat publik.</div>
                </div>
              )}
            </>
          ) : (
            <>
              <button className="btn-hover" onClick={generate} disabled={loading} style={{width:"100%",padding:"1rem",background:loading?`${tool.color}40`:`linear-gradient(135deg,${tool.color},#fc5c7d)`,border:"none",borderRadius:14,color:"#fff",fontFamily:"'Syne',sans-serif",fontSize:"1rem",fontWeight:800,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.6rem",marginBottom:"1rem",boxShadow:loading?"none":`0 8px 32px ${tool.color}35`,transition:"all 0.3s"}}>
                {loading?<><div style={{width:18,height:18,border:"2.5px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/> AI sedang berkreasi...</>:"✨ Generate Sekarang — 100% Gratis!"}
              </button>
              {loading&&<div className="shimmer" style={{height:120,borderRadius:16,marginBottom:"1rem"}}/>}
              {result&&!loading&&(
                <div ref={resultRef} className="fade-up">
                  <div style={{background:D?`linear-gradient(135deg,${tool.color}08,rgba(252,92,125,0.04))`:"rgba(255,255,255,0.9)",border:`1px solid ${tool.color}25`,borderRadius:18,padding:"1.5rem",marginBottom:"0.85rem",position:"relative",backdropFilter:"blur(10px)"}}>
                    <div style={{position:"absolute",top:"1rem",right:"1rem",display:"flex",gap:"0.4rem",alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>
                      <span style={{fontSize:"0.65rem",fontWeight:800,background:"rgba(92,240,200,0.12)",color:"#5cf0c8",border:"1px solid rgba(92,240,200,0.2)",padding:"3px 10px",borderRadius:100}}>✓ Selesai</span>
                      <span style={{fontSize:"0.65rem",color:txtMuted}}>{wordCount} kata</span>
                    </div>
                    <div style={{fontSize:"0.92rem",color:txtMain,paddingTop:"0.5rem"}}>
                      <TypewriterText text={result}/>
                    </div>
                  </div>
                  <div style={{background:cardBg,border:`1px solid ${border}`,borderRadius:12,padding:"0.85rem 1.2rem",marginBottom:"0.75rem",display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
                    <span style={{fontSize:"0.78rem",color:txtMuted,fontWeight:600}}>Nilai hasil ini:</span>
                    <div style={{display:"flex",gap:"0.25rem"}}>
                      {[1,2,3,4,5].map(s=><span key={s} className="star-btn" style={{fontSize:"1.35rem",opacity:s<=rating?1:0.25,filter:s<=rating?"drop-shadow(0 0 4px gold)":"none"}} onClick={()=>{setRating(s);if(s>=4)notify("Makasih atas bintangnya! 🌟","success");}}>{s<=rating?"⭐":"☆"}</span>)}
                    </div>
                    {rating>0&&<span style={{fontSize:"0.8rem",fontWeight:700,color:rating>=4?"#5cf0c8":rating>=3?"#f7c948":"#fc5c7d"}}>{rating===5?"Luar biasa! 🔥":rating===4?"Bagus sekali! 👍":rating===3?"Lumayan! 👌":rating===2?"Kurang memuaskan 😕":"Tidak bagus 😞"}</span>}
                  </div>
                  <div className="action-row" style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
                    {[
                      {label:copied?"✅ Tersalin!":"📋 Salin Teks",action:copyText,primary:true},
                      {label:"⬇️ Download .txt",action:downloadTxt},
                      {label:"📄 Export HTML",action:exportHTML},
                      {label:"💬 Share WA",action:shareWA},
                      {label:"✈️ Telegram",action:shareTG},
                      {label:"🔄 Ulang",action:generate},
                    ].map(b=>(
                      <button key={b.label} className="btn-hover" onClick={b.action} style={{background:b.primary?`${tool.color}20`:surface,border:`1px solid ${b.primary?tool.color:border}`,borderRadius:10,color:b.primary?tool.color:txtMuted,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"0.82rem",fontWeight:b.primary?700:500,padding:"8px 15px",cursor:"pointer"}}>{b.label}</button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════
     ABOUT PAGE
  ════════════════════════════════════════════════ */
  if(page==="about"){
    return(
      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:bg,color:txtMain,minHeight:"100vh",transition:"background 0.3s"}}>
        <style>{GLOBAL_CSS}</style>
        <Particles dark={D}/>
        <Header/>
        {toast&&<Toast key={toast.id} message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
        <div style={{maxWidth:700,margin:"0 auto",padding:"4rem 1.5rem 6rem"}}>
          <div className="fade-up" style={{textAlign:"center",marginBottom:"3.5rem"}}>
            <div className="float" style={{fontSize:"4.5rem",marginBottom:"1.2rem"}}>🚀</div>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"2.5rem",background:"linear-gradient(135deg,#7c5cfc,#fc5c7d)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:"1rem"}}>Tentang BarraBoys Tools</h1>
            <p style={{color:txtMuted,lineHeight:1.85,fontSize:"1rem",maxWidth:520,margin:"0 auto"}}>Studio Kreasi AI yang dibangun dengan satu misi:<br/><span style={{color:txtMain,fontWeight:700}}>memberdayakan semua orang Indonesia</span> untuk berkreasi dan menghasilkan tanpa hambatan biaya.</p>
          </div>
          {[
            {icon:"🎯",title:"Misi Kami",color:"#7c5cfc",text:"Kami percaya teknologi AI seharusnya bisa dinikmati semua orang — bukan hanya mereka yang mampu bayar. BarraBoys Tools hadir sebagai platform kreasi AI 100% gratis, tanpa koin, tanpa daftar, tanpa batas."},
            {icon:"💡",title:"Kenapa Gratis?",color:"#f7c948",text:"Karena akses ke teknologi adalah hak semua orang. Dengan tools ini, seorang pedagang kaki lima bisa membuat caption marketing sekelas brand ternama. UMKM bisa bersaing dengan perusahaan besar. Pelajar bisa berkarya tanpa batas."},
            {icon:"🌟",title:"Visi Kami",color:"#5cf0c8",text:"Menjadi platform kreasi AI #1 di Indonesia yang membantu jutaan orang — pelajar, UMKM, kreator konten, freelancer — meningkatkan kualitas karya dan penghasilan melalui kekuatan AI."},
            {icon:"🛠️",title:"Teknologi",color:"#fc5c7d",text:"BarraBoys Tools ditenagai oleh Claude AI dari Anthropic — salah satu AI terdepan di dunia. Kami mengintegrasikan kemampuan AI terbaik ke dalam interface sederhana agar siapa pun bisa menggunakannya tanpa keahlian teknis."},
            {icon:"🤝",title:"Untuk Siapa?",color:"#ff6b35",text:"Untuk semua orang Indonesia: pemilik UMKM yang ingin promosi lebih baik, content creator yang butuh ide segar, pelajar yang ingin belajar lebih efisien, freelancer yang ingin karya lebih berkualitas, dan siapa pun yang ingin berkreasi!"},
            {icon:"🆕",title:"Update v2.0",color:"#a78bfa",text:"Hadir dengan: 2 tools baru (Hashtag & FAQ Generator), perbaikan mobile responsive, bookmark & riwayat tersimpan permanen di browser, multi-bahasa ID/EN, export HTML, toast notifikasi, hero section v2 dengan morphing blobs, dan validasi input sebelum generate."},
          ].map((item,i)=>(
            <div key={i} className="fade-up" style={{background:cardBg,border:`1px solid ${border}`,borderLeft:`4px solid ${item.color}`,borderRadius:16,padding:"1.4rem",marginBottom:"1rem",display:"flex",gap:"1rem",animationDelay:`${i*0.1}s`,backdropFilter:"blur(10px)"}}>
              <div style={{fontSize:"2rem",flexShrink:0}}>{item.icon}</div>
              <div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"1rem",marginBottom:"0.45rem",color:txtMain}}>{item.title}</div><div style={{color:txtMuted,lineHeight:1.78,fontSize:"0.88rem"}}>{item.text}</div></div>
            </div>
          ))}
          <div style={{textAlign:"center",marginTop:"2.5rem"}}>
            <button className="btn-hover" onClick={()=>setPage("home")} style={{padding:"0.95rem 2.5rem",background:"linear-gradient(135deg,#7c5cfc,#fc5c7d)",border:"none",borderRadius:14,color:"#fff",fontFamily:"'Syne',sans-serif",fontSize:"1rem",fontWeight:800,cursor:"pointer",boxShadow:"0 8px 32px rgba(124,92,252,0.35)"}}>🚀 Mulai Berkreasi — Gratis!</button>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════
     HOME PAGE
  ════════════════════════════════════════════════ */
  return(
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:bg,color:txtMain,minHeight:"100vh",position:"relative",overflow:"hidden",transition:"background 0.3s,color 0.3s"}}>
      <style>{GLOBAL_CSS}</style>
      <Particles dark={D}/>
      {D&&<>
        <div style={{position:"fixed",top:-120,left:-100,width:600,height:600,background:"radial-gradient(circle,rgba(124,92,252,0.12) 0%,transparent 70%)",filter:"blur(80px)",pointerEvents:"none",zIndex:0}}/>
        <div style={{position:"fixed",top:200,right:-100,width:500,height:500,background:"radial-gradient(circle,rgba(252,92,125,0.08) 0%,transparent 70%)",filter:"blur(80px)",pointerEvents:"none",zIndex:0}}/>
        <div style={{position:"fixed",bottom:0,left:"30%",width:400,height:400,background:"radial-gradient(circle,rgba(92,240,200,0.06) 0%,transparent 70%)",filter:"blur(80px)",pointerEvents:"none",zIndex:0}}/>
      </>}
      <Header/>
      {showHistory&&<HistoryPanel/>}
      {toast&&<Toast key={toast.id} message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}

      {/* ══ HERO v2 ══ */}
      <section style={{position:"relative",textAlign:"center",padding:"60px 1.5rem 44px",zIndex:1,overflow:"hidden"}}>
        {D&&<>
          <div style={{position:"absolute",top:"50%",left:"8%",width:220,height:220,background:"radial-gradient(circle,rgba(124,92,252,0.15),transparent)",filter:"blur(50px)",transform:"translateY(-50%)",animation:"morphBlob 10s ease-in-out infinite",pointerEvents:"none",borderRadius:"60% 40% 30% 70%/60% 30% 70% 40%"}}/>
          <div style={{position:"absolute",top:"50%",right:"8%",width:180,height:180,background:"radial-gradient(circle,rgba(92,240,200,0.12),transparent)",filter:"blur(40px)",transform:"translateY(-50%)",animation:"morphBlob 12s ease-in-out infinite 2s",pointerEvents:"none",borderRadius:"30% 60% 70% 40%/50% 60% 30% 60%"}}/>
        </>}

        {/* Badge row */}
        <div style={{display:"flex",justifyContent:"center",gap:"0.5rem",marginBottom:"1.2rem",flexWrap:"wrap",opacity:mounted?1:0,transition:"all 0.6s ease"}}>
          <div style={{display:"inline-block",background:"rgba(124,92,252,0.12)",border:"1px solid rgba(124,92,252,0.25)",color:"#a78bfa",fontSize:"0.73rem",fontWeight:800,padding:"5px 16px",borderRadius:100,letterSpacing:1.2}}>🇮🇩 STUDIO KREASI AI #1 INDONESIA</div>
          <div style={{display:"inline-block",background:"rgba(92,240,200,0.1)",border:"1px solid rgba(92,240,200,0.22)",color:"#5cf0c8",fontSize:"0.73rem",fontWeight:800,padding:"5px 16px",borderRadius:100,letterSpacing:1.2}}>🆕 v2.0 — 37 Tools</div>
        </div>

        <h1 className="hero-h1" style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(2rem,5.5vw,3.8rem)",lineHeight:1.06,letterSpacing:-1.5,marginBottom:"1.2rem",opacity:mounted?1:0,transform:mounted?"none":"translateY(24px)",transition:"all 0.75s ease"}}>
          Berkreasi Tanpa Batas<br/>
          <span style={{background:"linear-gradient(135deg,#7c5cfc 0%,#fc5c7d 40%,#f7c948 100%)",backgroundSize:"200% 200%",animation:"gradShift 4s ease infinite",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Tanpa Bayar Sepeser pun</span>
        </h1>

        <p style={{color:txtMuted,fontSize:"1.05rem",maxWidth:520,margin:"0 auto 2.2rem",lineHeight:1.78,opacity:mounted?1:0,transition:"all 0.75s ease 0.15s"}}>
          <strong style={{color:txtMain}}>37+ tools AI</strong> untuk konten, bisnis, kreatif, dan lifestyle — semua gratis, tanpa koin, tanpa daftar, untuk semua orang Indonesia.
        </p>

        {/* CTA */}
        <div style={{display:"flex",justifyContent:"center",gap:"0.75rem",marginBottom:"2.2rem",flexWrap:"wrap",opacity:mounted?1:0,transition:"all 0.75s ease 0.2s"}}>
          <button className="btn-hover" onClick={()=>document.querySelector(".tools-sec")?.scrollIntoView({behavior:"smooth"})} style={{padding:"0.85rem 2rem",background:"linear-gradient(135deg,#7c5cfc,#fc5c7d)",border:"none",borderRadius:12,color:"#fff",fontFamily:"'Syne',sans-serif",fontSize:"0.95rem",fontWeight:800,cursor:"pointer",boxShadow:"0 8px 32px rgba(124,92,252,0.35)"}}>🚀 Mulai Sekarang — Gratis!</button>
          <button className="btn-hover" onClick={()=>setPage("about")} style={{padding:"0.85rem 2rem",background:surface,border:`1px solid ${border}`,borderRadius:12,color:txtMuted,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"0.9rem",fontWeight:600,cursor:"pointer",backdropFilter:"blur(10px)"}}>📖 Tentang Kami</button>
        </div>

        {/* Stats */}
        <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.75rem",maxWidth:520,margin:"0 auto 1.8rem",opacity:mounted?1:0,transition:"all 0.75s ease 0.25s"}}>
          {[["37+","Tools AI"],["10+","Platform Visual"],["∞","Tanpa Batas"],["0","Biaya"]].map(([n,l],i)=>(
            <div key={i} style={{background:cardBg,border:`1px solid ${border}`,borderRadius:14,padding:"0.9rem 0.5rem",textAlign:"center",backdropFilter:"blur(10px)"}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.55rem",background:"linear-gradient(135deg,#7c5cfc,#fc5c7d)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{n}</div>
              <div style={{fontSize:"0.68rem",color:txtMuted,marginTop:"0.15rem",fontWeight:500}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Feature tags */}
        <div style={{display:"flex",justifyContent:"center",gap:"0.45rem",flexWrap:"wrap",opacity:mounted?1:0,transition:"all 0.75s ease 0.35s"}}>
          {["⚡ Instan","🔓 Tanpa Daftar","🆓 Selamanya Gratis","🇮🇩 Bahasa Indonesia","🌐 Multi-bahasa","🤖 Claude AI","💾 Tersimpan Otomatis","📄 Export Hasil"].map(t=>(
            <span key={t} style={{background:surface,border:`1px solid ${border}`,fontSize:"0.72rem",padding:"5px 12px",borderRadius:100,color:txtMuted,backdropFilter:"blur(8px)"}}>{t}</span>
          ))}
        </div>
      </section>

      {/* ══ SEARCH & FILTER ══ */}
      <div className="tools-sec" style={{maxWidth:1100,margin:"0 auto",padding:"0 1.25rem 1.5rem",position:"relative",zIndex:1}}>
        <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap",alignItems:"center",marginBottom:"0.85rem"}}>
          <div style={{flex:1,minWidth:200,position:"relative"}}>
            <span style={{position:"absolute",left:"1rem",top:"50%",transform:"translateY(-50%)",color:txtMuted,pointerEvents:"none",fontSize:"0.9rem"}}>🔍</span>
            <input type="text" placeholder="Cari tools..." value={searchQ} onChange={e=>setSearchQ(e.target.value)} style={{width:"100%",background:cardBg,border:`1px solid ${border}`,borderRadius:12,color:txtMain,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"0.88rem",padding:"0.75rem 1rem 0.75rem 2.5rem",outline:"none",boxSizing:"border-box",backdropFilter:"blur(10px)"}}/>
          </div>
        </div>
        <div className="filter-row" style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
          {[["all","Semua"],["bookmarks",`🔖${bookmarks.length>0?` (${bookmarks.length})`:""}`],["konten","✍️ Konten"],["bisnis","💼 Bisnis"],["kreatif","🎨 Kreatif"],["produktif","🧠 Produktif"],["visual","🎬 Visual"],["lifestyle","🌟 Lifestyle"]].map(([fid,flabel])=>(
            <button key={fid} className="btn-hover fpill" onClick={()=>setActiveFilter(fid)} style={{padding:"7px 13px",borderRadius:9,border:`1px solid ${activeFilter===fid?"rgba(124,92,252,0.5)":border}`,background:activeFilter===fid?"rgba(124,92,252,0.15)":surface,color:activeFilter===fid?"#c4b5fd":txtMuted,fontFamily:"inherit",fontSize:"0.78rem",fontWeight:activeFilter===fid?700:400,cursor:"pointer",backdropFilter:"blur(8px)",whiteSpace:"nowrap"}}>
              {flabel}
            </button>
          ))}
        </div>
        {searchQ&&<div style={{fontSize:"0.78rem",color:txtMuted,marginTop:"0.6rem"}}>Ditemukan {filteredTools.length} tools untuk "{searchQ}"</div>}
      </div>

      {/* ══ TAB ══ */}
      <div style={{display:"flex",justifyContent:"center",gap:"0.6rem",padding:"0 1.25rem 2rem",flexWrap:"wrap",position:"relative",zIndex:1}}>
        {[{id:"free",label:"✅ Tools Gratis — Langsung Pakai"},{id:"premium",label:"🔗 Tools Visual & Media AI"}].map(t=>(
          <button key={t.id} className="btn-hover" onClick={()=>setActiveTab(t.id)} style={{padding:"10px 24px",borderRadius:100,border:`1px solid ${activeTab===t.id?"rgba(124,92,252,0.45)":border}`,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"0.88rem",fontWeight:700,cursor:"pointer",background:activeTab===t.id?"linear-gradient(135deg,rgba(124,92,252,0.22),rgba(252,92,125,0.14))":surface,color:activeTab===t.id?txtMain:txtMuted,boxShadow:activeTab===t.id?"0 4px 24px rgba(124,92,252,0.2)":"none",backdropFilter:"blur(10px)"}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ FREE TOOLS ══ */}
      {activeTab==="free"&&(
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 1.25rem 80px",position:"relative",zIndex:1}}>
          {activeFilter==="bookmarks"?(
            bookmarks.length===0
              ?<div style={{textAlign:"center",padding:"4rem",color:txtMuted}}><div style={{fontSize:"3rem",marginBottom:"1rem"}}>🔖</div><div style={{fontWeight:600,fontSize:"1.1rem",marginBottom:"0.5rem"}}>Belum ada yang tersimpan</div><div style={{fontSize:"0.88rem"}}>Buka suatu tool dan klik "Simpan Tool" untuk bookmark</div></div>
              :<div>
                <div style={{fontWeight:700,fontSize:"0.78rem",color:txtMuted,textTransform:"uppercase",letterSpacing:2.5,marginBottom:"1.1rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>🔖 Tools Tersimpan<div style={{flex:1,height:1,background:`linear-gradient(90deg,${border},transparent)`}}/></div>
                <div className="tool-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))",gap:"0.75rem"}}>
                  {bookmarks.map(id=>{const tool=TOOLS[id];if(!tool)return null;return<ToolCard key={id} id={id} tool={tool} bookmarks={bookmarks} toggleBookmark={toggleBookmark} openTool={openTool} cardBg={cardBg} border={border} txtMain={txtMain} txtMuted={txtMuted} badge={null}/>;
                  })}
                </div>
              </div>
          ):(
            searchQ||activeFilter!=="all"
              ?filteredTools.length===0
                ?<div style={{textAlign:"center",padding:"4rem",color:txtMuted}}><div style={{fontSize:"3rem",marginBottom:"1rem"}}>🔍</div><div>Tidak ada tools yang ditemukan</div></div>
                :<div>
                  <div style={{fontWeight:700,fontSize:"0.78rem",color:txtMuted,textTransform:"uppercase",letterSpacing:2.5,marginBottom:"1.1rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>Hasil Pencarian<div style={{flex:1,height:1,background:`linear-gradient(90deg,${border},transparent)`}}/></div>
                  <div className="tool-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))",gap:"0.75rem"}}>
                    {filteredTools.map(([id,tool])=><ToolCard key={id} id={id} tool={tool} bookmarks={bookmarks} toggleBookmark={toggleBookmark} openTool={openTool} cardBg={cardBg} border={border} txtMain={txtMain} txtMuted={txtMuted} badge={null}/>)}
                  </div>
                </div>
              :CATEGORIES.map((cat,ci)=>{
                const ids=Object.keys(TOOLS).filter(id=>TOOLS[id].cat===cat.id);
                return(
                  <div key={cat.id} style={{marginBottom:"2.5rem",opacity:mounted?1:0,transform:mounted?"none":"translateY(18px)",transition:`all 0.6s ease ${ci*0.07}s`}}>
                    <div style={{fontWeight:700,fontSize:"0.78rem",color:txtMuted,textTransform:"uppercase",letterSpacing:2.5,marginBottom:"1.1rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
                      {cat.label}<div style={{flex:1,height:1,background:`linear-gradient(90deg,${border},transparent)`}}/>
                      <span style={{fontSize:"0.7rem",color:txtMuted,fontWeight:400}}>{ids.length} tools</span>
                    </div>
                    <div className="tool-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))",gap:"0.75rem"}}>
                      {ids.map(id=><ToolCard key={id} id={id} tool={TOOLS[id]} bookmarks={bookmarks} toggleBookmark={toggleBookmark} openTool={openTool} cardBg={cardBg} border={border} txtMain={txtMain} txtMuted={txtMuted} badge={cat.badge_map?.[id]||null}/>)}
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}

      {/* ══ PREMIUM ══ */}
      {activeTab==="premium"&&(
        <div style={{position:"relative",zIndex:1}}>
          <div style={{maxWidth:1100,margin:"0 auto 1.25rem",padding:"0 1.25rem"}}>
            <div style={{background:D?"linear-gradient(135deg,rgba(124,92,252,0.08),rgba(252,92,125,0.05))":"rgba(255,255,255,0.8)",border:`1px solid ${border}`,borderRadius:14,padding:"1rem 1.5rem",display:"flex",alignItems:"center",gap:"0.85rem",backdropFilter:"blur(10px)"}}>
              <span style={{fontSize:"1.4rem"}}>💡</span>
              <div><div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:"0.18rem",color:txtMain}}>Tools Visual & Media AI (Platform Eksternal)</div><div style={{fontSize:"0.78rem",color:txtMuted,lineHeight:1.65}}>Klik kartu → pilih platform → buka langsung. 💡 <span style={{color:"#7c5cfc",fontWeight:700}}>Generator Gambar AI</span> sudah tersedia langsung di tab <span style={{color:"#5cf0c8",fontWeight:700}}>Tools Gratis</span>!</div></div>
            </div>
          </div>
          <div className="premium-grid" style={{maxWidth:1100,margin:"0 auto",padding:"0 1.25rem 80px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:"0.85rem"}}>
            {PREMIUM_TOOLS.map((pt,i)=>(
              <div key={i} style={{background:cardBg,border:`1px solid ${expandedPrem===i?pt.color+"60":border}`,borderRadius:16,overflow:"hidden",transition:"all 0.25s",backdropFilter:"blur(10px)"}}>
                <div style={{padding:"1.3rem",cursor:"pointer"}} onClick={()=>setExpandedPrem(expandedPrem===i?null:i)}>
                  <div style={{width:46,height:46,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",marginBottom:"0.8rem",background:`${pt.color}15`,border:`1px solid ${pt.color}25`}}>{pt.icon}</div>
                  <div style={{fontWeight:700,fontSize:"0.92rem",marginBottom:"0.25rem",color:txtMain}}>{pt.title}</div>
                  <div style={{fontSize:"0.78rem",color:txtMuted,lineHeight:1.55,marginBottom:"0.6rem"}}>{pt.desc}</div>
                  <div style={{fontSize:"0.74rem",color:expandedPrem===i?"#fc5c7d":"#7c5cfc",fontWeight:700}}>{expandedPrem===i?"▲ Tutup":"▼ Lihat Platform"}</div>
                </div>
                {expandedPrem===i&&(
                  <div style={{borderTop:`1px solid ${border}`,padding:"0.8rem 1.3rem 1.1rem"}}>
                    {pt.options.map((opt,j)=>(
                      <a key={j} href={opt.url} target="_blank" rel="noopener noreferrer" className="prem-link"
                        style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 13px",borderRadius:10,marginBottom:"0.45rem",background:inputBg,cursor:"pointer",textDecoration:"none",border:`1px solid ${border}`,gap:"0.5rem"}}>
                        <div style={{display:"flex",flexDirection:"column",gap:"2px",overflow:"hidden"}}>
                          <span style={{fontSize:"0.84rem",fontWeight:700,color:txtMain,display:"flex",alignItems:"center",gap:"5px"}}>
                            <span style={{fontSize:"0.75rem",opacity:0.6}}>↗</span>{opt.name}
                          </span>
                          {opt.hint&&<span style={{fontSize:"0.68rem",color:txtMuted,opacity:0.75}}>{opt.hint}</span>}
                        </div>
                        <span style={{fontSize:"0.62rem",fontWeight:800,padding:"3px 10px",borderRadius:6,background:`${pt.color}18`,color:pt.color,border:`1px solid ${pt.color}30`,whiteSpace:"nowrap",flexShrink:0}}>{opt.tag}</span>
                      </a>
                    ))}
                    <div style={{fontSize:"0.69rem",color:txtMuted,marginTop:"0.5rem",fontStyle:"italic",opacity:0.7}}>* Beberapa platform memerlukan akun / berlangganan.</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{borderTop:`1px solid ${border}`,textAlign:"center",padding:"2.5rem 1.5rem",position:"relative",zIndex:1,backdropFilter:"blur(10px)"}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.6rem",background:"linear-gradient(135deg,#7c5cfc,#fc5c7d)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:"0.5rem"}}>BarraBoys<span style={{WebkitTextFillColor:"#5cf0c8"}}>Tools</span></div>
        <p style={{color:txtMuted,fontSize:"0.82rem",marginBottom:"0.3rem"}}>Dibuat dengan ❤️ untuk semua kreator Indonesia</p>
        <p style={{color:D?"#3a3a5a":"#aaaacc",fontSize:"0.72rem",marginBottom:"0.75rem"}}>37+ Tools AI · Tanpa koin · Tanpa daftar · Tanpa batas · Powered by Claude AI</p>
        <div style={{display:"flex",justifyContent:"center",gap:"0.45rem",flexWrap:"wrap"}}>
          {["💾 Auto-save","🌐 Multi-bahasa","📄 Export Hasil","📱 Mobile-Friendly","🔔 Toast Notifikasi"].map(f=>(
            <span key={f} style={{fontSize:"0.7rem",color:txtMuted,background:surface,border:`1px solid ${border}`,padding:"3px 10px",borderRadius:100}}>{f}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

/* ── TOOL CARD ── */
function ToolCard({id,tool,bookmarks,toggleBookmark,openTool,cardBg,border,txtMain,txtMuted,badge}){
  const[hovered,setHovered]=useState(false);
  const isBookmarked=bookmarks.includes(id);
  return(
    <div className="tool-card" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{background:hovered?`linear-gradient(135deg,${tool.color}0a,${cardBg})`:cardBg,border:`1px solid ${hovered?tool.color+"60":border}`,borderRadius:16,padding:"1.2rem",cursor:"pointer",position:"relative",overflow:"hidden",boxShadow:hovered?`0 16px 40px ${tool.color}18`:"none",backdropFilter:"blur(10px)"}}>
      {badge&&<div style={{position:"absolute",top:"0.8rem",right:"0.8rem",fontSize:"0.58rem",fontWeight:800,padding:"2px 8px",borderRadius:5,background:badge==="Hot"?"rgba(252,92,125,0.15)":badge==="Populer"?"rgba(247,201,72,0.15)":"rgba(92,240,200,0.1)",color:badge==="Hot"?"#fc5c7d":badge==="Populer"?"#f7c948":"#5cf0c8",border:`1px solid ${badge==="Hot"?"rgba(252,92,125,0.25)":badge==="Populer"?"rgba(247,201,72,0.2)":"rgba(92,240,200,0.2)"}`,textTransform:"uppercase",letterSpacing:0.5}}>{badge}</div>}
      <button onClick={e=>{e.stopPropagation();toggleBookmark(id);}} style={{position:"absolute",bottom:"0.8rem",right:"0.8rem",background:"none",border:"none",fontSize:"0.9rem",cursor:"pointer",opacity:isBookmarked?1:0.25,transition:"opacity 0.2s"}} title={isBookmarked?"Hapus bookmark":"Simpan"}>🔖</button>
      <div onClick={()=>openTool(id)}>
        <div style={{width:44,height:44,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",marginBottom:"0.78rem",background:`${tool.color}15`,border:`1px solid ${tool.color}25`,transition:"all 0.2s",transform:hovered?"scale(1.08)":"scale(1)"}}>{tool.icon}</div>
        <div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:"0.3rem",color:txtMain}}>{tool.title}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.28rem"}}>
          {tool.tags.map(t=><span key={t} style={{fontSize:"0.6rem",color:tool.color,background:`${tool.color}12`,padding:"2px 7px",borderRadius:4,fontWeight:600}}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}
