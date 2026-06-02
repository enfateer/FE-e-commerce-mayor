# Business Requirement Document (BRD)

| | |
|---|---|
| **Nama Sistem** | Sistem Jasa Digital — **ORVIX** |
| **Versi** | 1.0 |
| **Disusun oleh** | Muhamad Fathir Rahman |
| **Tujuan** | Menawarkan layanan jasa digital secara terstruktur, menerima dan mengelola pesanan (order), serta memantau aktivitas platform melalui dashboard dan laporan. |

---

# BRD Sistem Jasa Digital ORVIX

## 1. Latar Belakang

**Fungsi bagian ini:** menjelaskan permasalahan bisnis dan alasan sistem dibutuhkan.

Perkembangan teknologi saat ini mendorong berbagai aktivitas bisnis beralih ke sistem digital untuk meningkatkan efisiensi dan kemudahan proses. Namun, masih banyak penyedia jasa digital (freelancer, UMKM, profesional) yang kesulitan memasarkan layanan mereka secara terstruktur, sementara pengguna jasa juga kesulitan mencari layanan yang sesuai kebutuhan, membandingkan paket harga, dan memantau progres pekerjaan.

Berdasarkan permasalahan tersebut, diperlukan sebuah **marketplace jasa digital** yang dapat menghubungkan **seller** (penyedia jasa) dan **buyer** (pembeli jasa) dalam satu platform. Sistem **ORVIX** diharapkan dapat mempermudah proses pencarian jasa, pemesanan, pengelolaan paket layanan (Basic, Gold, Pro), pelacakan status order, serta monitoring oleh admin—secara lebih cepat, terstruktur, dan efisien.

---

## 2. Tujuan Sistem

**Fungsi bagian ini:** menjelaskan hasil atau manfaat utama yang ingin dicapai dari pembangunan sistem.

- Memfasilitasi proses jual beli jasa digital secara online dalam satu platform.
- Mempermudah seller dalam menawarkan, mengelola layanan, dan paket harga (tier Basic, Gold, Pro).
- Mempermudah buyer dalam mencari, membandingkan, dan memesan jasa sesuai kebutuhan.
- Mempercepat proses transaksi/order antara buyer dan seller secara terstruktur.
- Menyediakan sistem pengelolaan order dan status pekerjaan (pending hingga selesai).
- Menyediakan profil seller publik beserta daftar layanan milik seller.
- Menyediakan dashboard dan laporan (admin/seller) serta ekspor data (PDF/Excel).
- Menyediakan notifikasi dan moderasi platform oleh admin.

---

## 3. Ruang Lingkup

**Fungsi bagian ini:** menentukan batasan pekerjaan sistem—fitur atau proses apa saja yang termasuk dalam pengembangan.

Sistem mencakup:

- **Autentikasi & manajemen akun** (registrasi, login, profil, upgrade menjadi seller).
- **Manajemen kategori jasa** (kategori layanan untuk filter dan klasifikasi).
- **Manajemen layanan (service)** oleh seller (judul, deskripsi, thumbnail, kategori).
- **Manajemen paket layanan** per service (nama tier: Basic, Gold, Pro; harga; estimasi waktu; deskripsi).
- **Katalog & pencarian layanan** untuk buyer (daftar layanan, detail layanan, profil seller).
- **Pemesanan (order)** oleh buyer dengan catatan kebutuhan (requirements).
- **Alur status order:** pending → accepted/rejected → in_progress → delivered → completed / cancelled.
- **Dashboard seller** (statistik order, pendapatan, order terbaru).
- **Dashboard buyer** (ringkasan order).
- **Notifikasi** dalam aplikasi.
- **Panel admin:** pengguna, seller, layanan, laporan platform, peringatan/ban user, broadcast notifikasi.
- **Ekspor laporan:** PDF detail order, PDF riwayat order, Excel order seller.
- **Kontak seller** melalui nomor WhatsApp pada profil publik (opsional).

**Di luar ruang lingkup versi 1.0 (opsional / belum termasuk):**

- Pembayaran online terintegrasi (payment gateway).
- Fitur portfolio karya seller.
- Fitur revisi order setelah pengiriman.
- Rating & review layanan.
- Chat internal real-time antar buyer–seller.

---

## 4. Pengguna Sistem

**Fungsi bagian ini:** mengidentifikasi siapa saja pihak yang akan menggunakan atau berkepentingan terhadap sistem.

| Pengguna | Peran Utama |
|----------|-------------|
| **Buyer** | Mencari layanan, memesan jasa, memantau status order, menyelesaikan order setelah hasil dikirim, mengelola profil. |
| **Seller** | Menjadi penyedia jasa (setelah upgrade akun), mengelola layanan & paket, menerima/menolak order, mengerjakan dan menandai pengiriman hasil. |
| **Admin** | Memantau platform, mengelola user/seller, moderasi layanan, laporan agregat, peringatan/ban, notifikasi massal. |

*Catatan:* Satu akun dapat berperan sebagai **buyer** dan **seller** (`isSeller = true`) secara bersamaan.

---

## 5. Alur Proses Utama

**Fungsi bagian ini:** menggambarkan urutan proses bisnis dari awal sampai akhir.

### 5.1 Alur Seller (penyedia jasa)

1. User mendaftar dan login.
2. User mengajukan **Become Seller** (profil diperbarui, `isSeller = true`).
3. Seller membuat **layanan** (service) beserta **paket** Basic/Gold/Pro.
4. Seller menunggu order masuk berstatus **pending**.
5. Seller **menerima** (accepted) atau **menolak** (rejected) order.
6. Seller memulai pengerjaan (**in_progress**).
7. Seller menandai hasil sudah dikirim (**delivered**).
8. Buyer menyelesaikan order (**completed**).

### 5.2 Alur Buyer (pembeli jasa)

1. Buyer mendaftar/login dan menjelajahi katalog **Services**.
2. Buyer membuka **detail layanan**, memilih paket, mengisi kebutuhan (opsional), lalu **place order** (status **pending**).
3. Buyer dapat **membatalkan** order saat masih **pending**.
4. Buyer memantau progres order hingga status **delivered**.
5. Buyer menekan **Selesaikan order** → status **completed**.

### 5.3 Alur Admin

1. Admin login ke panel admin.
2. Admin memantau **users**, **sellers**, **services**, dan **reports**.
3. Admin dapat memberi **peringatan** atau **ban** user yang melanggar aturan.
4. Admin dapat menghapus layanan yang tidak sesuai kebijakan.
5. Admin mengirim **notifikasi** ke pengguna platform.

---

## 6. Kebutuhan Fungsional Utama

**Fungsi bagian ini:** menjelaskan fitur utama yang harus tersedia agar sistem dapat berjalan sesuai kebutuhan bisnis.

| Kode | Kebutuhan |
|------|-----------|
| **FR-01** | Sistem dapat mengelola akun: registrasi, login, logout, profil, dan foto profil. |
| **FR-02** | Sistem dapat membedakan peran **buyer**, **seller** (`isSeller`), dan **admin** dengan hak akses berbeda. |
| **FR-03** | Sistem dapat mengupgrade akun buyer menjadi **seller** (become seller). |
| **FR-04** | Sistem dapat mengelola **kategori** layanan untuk klasifikasi jasa. |
| **FR-05** | Seller dapat membuat, mengubah, dan menghapus **layanan (service)** beserta thumbnail. |
| **FR-06** | Seller dapat mengelola **paket layanan** per service (tier Basic, Gold, Pro: harga, waktu, deskripsi). |
| **FR-07** | Buyer dapat melihat katalog layanan, filter/cari, dan detail layanan beserta paket. |
| **FR-08** | Buyer dapat melihat **profil seller** dan daftar layanan milik seller tersebut. |
| **FR-09** | Buyer dapat **membuat order** dengan memilih service, paket, dan requirements. |
| **FR-10** | Sistem dapat mengelola **status order**: pending, accepted, rejected, in_progress, delivered, completed, cancelled. |
| **FR-11** | Seller dapat menerima/menolak order; memulai pengerjaan; menandai hasil dikirim. |
| **FR-12** | Buyer dapat membatalkan order (pending) dan menyelesaikan order (delivered → completed). |
| **FR-13** | Sistem dapat menampilkan **daftar order** sesuai peran (buyer melihat pembelian; seller melihat penjualan + pembelian; admin melihat semua). |
| **FR-14** | Sistem dapat menampilkan **detail order** (layanan, paket, buyer, seller, status, requirements). |
| **FR-15** | Sistem dapat menyediakan **dashboard seller** (statistik order & pendapatan). |
| **FR-16** | Sistem dapat menyediakan **dashboard buyer** (ringkasan order). |
| **FR-17** | Sistem dapat mengirim dan menampilkan **notifikasi** kepada pengguna. |
| **FR-18** | Admin dapat mengelola user, seller, layanan, laporan, peringatan, dan ban. |
| **FR-19** | Sistem dapat **mengekspor** laporan order (PDF detail, PDF riwayat, Excel seller). |
| **FR-20** | Seller dapat mencantumkan **nomor WhatsApp** pada profil untuk kontak buyer. |

---

## 7. Kebutuhan Non-Fungsional

**Fungsi bagian ini:** menjelaskan kualitas atau standar sistem.

- Sistem berbasis **web** dan **responsif** (desktop & mobile).
- Menggunakan keamanan berbasis **autentikasi token (JWT)** dan **role-based access control**.
- Data pribadi pengguna (email, profil) harus terlindungi; hanya pihak berwenang yang mengakses order terkait.
- Upload file (gambar profil, thumbnail layanan) dibatasi tipe dan ukuran file.
- Mendukung **ekspor laporan** ke **PDF** dan **Excel**.
- Antarmuka menggunakan tema modern (dark/light) dan navigasi yang jelas per peran.
- API terstruktur (REST) dengan response format konsisten.
- Performa stabil untuk operasi daftar layanan dan order pada skala Uji kelayakan / demo produksi kecil.
- **Backup database** secara berkala (disarankan di lingkungan produksi).

---

## 8. Data Utama yang Dikelola

**Fungsi bagian ini:** menjelaskan jenis data utama yang disimpan dan diproses sistem.

| Entitas | Deskripsi singkat |
|---------|-------------------|
| **User** | Akun (nama, email, password, role, isSeller, bio, foto profil, WhatsApp, status ban/warning). |
| **Category** | Kategori jasa (nama, dll.). |
| **Service** | Layanan jasa (seller, kategori, judul, deskripsi, thumbnail). |
| **ServicePackage** | Paket per layanan (nama tier, harga, waktu pengiriman, deskripsi). |
| **Order** | Pesanan (buyer, seller, service, package, requirements, status, timestamp). |
| **Notification** | Notifikasi pengguna (judul, pesan, status baca). |

---

## 9. Output / Laporan

**Fungsi bagian ini:** keluaran sistem untuk monitoring dan evaluasi.

- **Dashboard buyer:** jumlah order, pending, in progress, completed.
- **Dashboard seller:** total order, pending, completed, cancelled, estimasi revenue.
- **Dashboard admin:** statistik user, seller, layanan, order platform.
- **Daftar order** dengan filter status (All, Pending, Accepted, In Progress, Delivered, Completed, Cancelled, Rejected).
- **PDF detail order** per transaksi.
- **PDF riwayat order** (buyer/seller sesuai hak akses).
- **Excel riwayat penjualan** seller.
- **Notifikasi** status perubahan order dan aktivitas penting.

---

## 10. Kriteria Keberhasilan

**Fungsi bagian ini:** ukuran apakah sistem memenuhi kebutuhan bisnis.

Sistem dianggap berhasil apabila:

- Buyer dapat **registrasi, login**, mencari layanan, dan **membuat order** hingga status pending.
- Seller dapat **upgrade akun**, membuat layanan & paket, serta **mengelola order** (terima → kerjakan → kirim).
- Buyer dapat **memantau status** order dan **menyelesaikan** order setelah delivered.
- **Profil seller** menampilkan informasi dan **layanan milik seller** saja.
- **Hak akses** buyer, seller, dan admin berjalan sesuai peran (termasuk admin tidak membuat order).
- Admin dapat **memantau laporan**, moderasi user/layanan, dan mengirim notifikasi.
- Laporan dapat **dieksport** ke PDF/Excel sesuai peran.
- Tidak ada celah akses order oleh pihak yang bukan buyer/seller/admin terkait.

---

## 11. User Story

**Fungsi bagian ini:** kebutuhan dari sudut pandang pengguna.

| Role | User Story | Acceptance Criteria |
|------|------------|---------------------|
| **Buyer** | Sebagai buyer, saya ingin membuat akun agar dapat memesan layanan. | User dapat registrasi, login, dan mengelola profil. |
| **Buyer** | Sebagai buyer, saya ingin melihat daftar layanan agar dapat memilih jasa yang sesuai. | Katalog tampil dengan kategori, harga minimum, dan thumbnail. |
| **Buyer** | Sebagai buyer, saya ingin melihat detail layanan dan paket (Basic/Gold/Pro) agar dapat membandingkan harga. | Detail menampilkan deskripsi, paket, dan tombol order. |
| **Buyer** | Sebagai buyer, saya ingin memesan layanan dengan paket tertentu agar kebutuhan saya tercatat. | Order tersimpan status **pending** dengan service, package, requirements. |
| **Buyer** | Sebagai buyer, saya ingin membatalkan order yang masih pending. | Status berubah menjadi **cancelled**. |
| **Buyer** | Sebagai buyer, saya ingin melihat status order agar mengetahui progres pekerjaan. | Status order diperbarui sesuai aksi seller/buyer. |
| **Buyer** | Sebagai buyer, saya ingin menyelesaikan order setelah hasil dikirim. | Dari **delivered** dapat diubah ke **completed**. |
| **Buyer** | Sebagai buyer, saya ingin melihat profil seller dan layanannya. | Halaman seller menampilkan bio, WhatsApp (jika ada), dan daftar service seller. |
| **Seller** | Sebagai seller, saya ingin upgrade akun agar dapat menjual jasa. | `isSeller` aktif setelah become seller. |
| **Seller** | Sebagai seller, saya ingin membuat dan mengelola layanan beserta paket. | CRUD service & package (tier Basic/Gold/Pro) berfungsi. |
| **Seller** | Sebagai seller, saya ingin menerima atau menolak order masuk. | Status **accepted** atau **rejected** dari **pending**. |
| **Seller** | Sebagai seller, saya ingin menandai mulai kerja dan hasil terkirim. | Status **in_progress** lalu **delivered**. |
| **Seller** | Sebagai seller, saya ingin melihat dashboard penjualan. | Statistik order dan revenue tampil. |
| **Seller** | Sebagai seller, saya ingin mengekspor data order ke Excel. | File Excel terunduh dengan data order seller. |
| **Admin** | Sebagai admin, saya ingin melihat laporan platform. | Dashboard admin menampilkan agregat user, seller, order, layanan. |
| **Admin** | Sebagai admin, saya ingin mengelola user dan seller. | Daftar user/seller dapat dilihat; warn/ban dapat diterapkan. |
| **Admin** | Sebagai admin, saya ingin memoderasi layanan yang melanggar. | Admin dapat menghapus layanan tidak sesuai kebijakan. |
| **Admin** | Sebagai admin, saya ingin mengirim notifikasi ke pengguna. | Notifikasi tercatat dan dapat dibaca user. |
| **Admin** | Sebagai admin, saya ingin mengekspor laporan. | Laporan dapat diakses sesuai modul export yang tersedia. |

---

## 12. Aturan Bisnis Penting (Ringkas)

| No | Aturan |
|----|--------|
| 1 | Admin **tidak dapat** membuat order. |
| 2 | Seller **tidak dapat** memesan layanan milik sendiri. |
| 3 | Nama paket layanan mengikuti tier tetap: **Basic**, **Gold**, **Pro**. |
| 4 | Transisi status order mengikuti peran: seller (terima/tolak/kerja/kirim), buyer (batal/selesai). |
| 5 | Admin memantau order; **tidak** mengubah alur operasional order melalui tombol aksi seller/buyer di UI. |
| 6 | Nomor WhatsApp hanya relevan untuk akun **seller**. |

---

## 13. Diagram Konteks (Ringkas)

```
                    ┌─────────────┐
                    │    Admin    │
                    └──────┬──────┘
                           │ kelola & pantau
┌──────────┐         ┌─────▼─────────────────────┐         ┌──────────┐
│  Buyer   │◄───────►│   Sistem ORVIX (Web App)   │◄───────►│  Seller  │
└──────────┘  order  │  API + Database + Upload   │  layanan └──────────┘
                     └────────────────────────────┘
```

---

## 14. Pengesahan Dokumen

**Fungsi bagian ini:** menunjukkan bahwa dokumen BRD telah ditinjau dan disetujui.

| No | Nama/Jabatan | Peran dalam Dokumen | Tanda Tangan | Tanggal |
|----|--------------|---------------------|--------------|---------|
| 1 | Perwakilan Manajemen | Menyetujui kebutuhan bisnis | | |
| 2 | Product Owner | Memvalidasi kebutuhan pengguna | | |
| 3 | Business Analyst | Menyusun dokumen BRD | Muhamad Fathir Rahman | |
| 4 | Project Manager / IT Lead | Menyetujui kelayakan implementasi | | |

---

*Dokumen ini disusun berdasarkan implementasi sistem ORVIX (Frontend React + Backend Node.js/Express + MySQL) versi 1.0.*
