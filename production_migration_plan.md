# 🌐 Panduan Migrasi ke Server Produksi (AITECHID Portal)

Dokumen ini menyediakan panduan langkah-demi-langkah bagi administrator sistem untuk memigrasikan aplikasi **Portal Penanggulangan Kemiskinan** dari lingkungan lokal (Development) ke server produksi (Production) berskala *enterprise*.

---

## 1. Persiapan Infrastruktur Server

### Kebutuhan Minimum Server
* **OS**: Linux Ubuntu 22.04 LTS atau 24.04 LTS (Direkomendasikan)
* **CPU**: 2 Core atau lebih
* **RAM**: Minimal 4 GB (untuk mengoptimalkan proses kompilasi Next.js)
* **Penyimpanan**: SSD/NVMe minimal 20 GB (untuk menampung database SQLite nasional)

### Menginstal Dependensi Sistem
Jalankan perintah berikut untuk memperbarui server dan menginstal dependensi dasar:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget build-essential unzip sqlite3 nginx
```

---

## 2. Instalasi Runtime Node.js & Node Package Manager

Instal runtime Node.js v20.x LTS menggunakan NodeSource:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```
Verifikasi instalasi runtime dengan perintah:
```bash
node -v
npm -v
```

---

## 3. Clone Proyek & Struktur Direktori Produksi

Direkomendasikan meletakkan file proyek di bawah direktori `/var/www/aitechid`.

```bash
# Buat folder kerja dan atur kepemilikan user
sudo mkdir -p /var/www/aitechid
sudo chown -R $USER:$USER /var/www/aitechid

# Masuk ke folder kerja
cd /var/www/aitechid

# Tarik kode dari repositori Git
git clone <URL_REPOS_ANDA> .
```

Pastikan struktur folder produksi Anda adalah sebagai berikut:
```text
/var/www/aitechid/
├── aitech/               # Berkas database (aitech.db & databases.json)
└── poverty-portal/       # Source code Next.js
```

---

## 4. Konfigurasi Environment Variable Produksi

Buat berkas `.env` di dalam folder `/var/www/aitechid/poverty-portal/.env`:
```bash
nano /var/www/aitechid/poverty-portal/.env
```

Isi dengan konfigurasi produksi:
```env
# Mode Next.js
NODE_ENV=production

# URL Domain Utama
NEXT_PUBLIC_APP_URL=https://aitech.id

# Port Aplikasi Internal (Nginx akan mem-forward ke port ini)
PORT=3000
```

---

## 5. Kompilasi & Build Produksi Next.js

1. Masuk ke folder web app:
   ```bash
   cd /var/www/aitechid/poverty-portal
   ```
2. Install dependensi secara bersih (mengecualikan devDependencies jika memungkinkan):
   ```bash
   npm ci
   ```
3. Kompilasi aplikasi Next.js untuk mendapatkan bundel produksi teroptimasi:
   ```bash
   npm run build
   ```
   *Proses ini akan menghasilkan folder terkompresi `.next` yang siap didistribusikan.*

---

## 6. Manajemen Proses Daemon Menggunakan PM2

PM2 digunakan untuk menjaga agar aplikasi Next.js tetap berjalan di latar belakang (daemon) dan melakukan *auto-restart* jika terjadi crash sistem.

1. Instal PM2 secara global:
   ```bash
   sudo npm install -g pm2
   ```
2. Jalankan aplikasi Next.js menggunakan PM2:
   ```bash
   pm2 start npm --name "aitech-portal" -- run start -- -p 3000
   ```
3. Konfigurasikan PM2 agar otomatis berjalan saat OS Linux melakukan booting:
   ```bash
   pm2 startup systemd
   ```
   *(Salin dan jalankan perintah keluaran yang diinstruksikan oleh terminal Anda)*
4. Simpan status proses aktif saat ini:
   ```bash
   pm2 save
   ```

---

## 7. Konfigurasi Reverse Proxy Nginx & SSL Certbot

Nginx digunakan sebagai gerbang terdepan (Reverse Proxy) untuk meneruskan request port HTTPS `443` ke port internal aplikasi Node `3000`.

1. Buat file konfigurasi block server Nginx baru:
   ```bash
   sudo nano /etc/nginx/sites-available/aitechid
   ```
2. Isi dengan blok konfigurasi berikut (sesuaikan `server_name` dengan domain Anda):
   ```nginx
   server {
       listen 80;
       server_name aitech.id www.aitech.id;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       client_max_body_size 50M; # Mengakomodasi upload database berukuran besar
   }
   ```
2. Aktifkan konfigurasi dengan membuat symlink ke direktori `sites-enabled`:
   ```bash
   sudo ln -s /etc/nginx/sites-available/aitechid /etc/nginx/sites-enabled/
   ```
3. Uji konfigurasi Nginx dan muat ulang service:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```
4. Instal Certbot untuk menerbitkan sertifikat SSL Let's Encrypt gratis:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d aitech.id -d www.aitech.id
   ```
   *Pilih opsi redirect otomatis seluruh lalu lintas HTTP ke HTTPS.*

---

## 8. Skema Auto-Backup Database SQLite Produksi

Karena SQLite menyimpan seluruh data nasional dalam satu file fisik (`aitech.db`), sangat direkomendasikan untuk melakukan backup harian otomatis ke folder eksternal.

1. Buat folder cadangan backup:
   ```bash
   mkdir -p /home/$USER/db_backups
   ```
2. Buat script shell backup:
   ```bash
   nano /home/$USER/backup_db.sh
   ```
3. Isi dengan script pencadangan berikut:
   ```bash
   #!/bin/bash
   BACKUP_DIR="/home/$USER/db_backups"
   DB_PATH="/var/www/aitechid/aitech/aitech.db"
   TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
   
   # Lakukan kueri backup SQLite aman (mencegah korupsi data saat kueri berjalan)
   sqlite3 "$DB_PATH" ".backup '$BACKUP_DIR/aitech_backup_$TIMESTAMP.db'"
   
   # Kompres file cadangan
   gzip "$BACKUP_DIR/aitech_backup_$TIMESTAMP.db"
   
   # Hapus backup yang berusia lebih dari 7 hari
   find "$BACKUP_DIR" -name "*.db.gz" -mtime +7 -exec rm {} \;
   ```
4. Berikan hak akses eksekusi pada script:
   ```bash
   chmod +x /home/$USER/backup_db.sh
   ```
5. Masukkan ke dalam scheduler cron harian (berjalan setiap pukul 02:00 pagi):
   ```bash
   crontab -e
   ```
   *Tambahkan baris berikut di bagian akhir:*
   ```text
   0 2 * * * /home/$USER/backup_db.sh > /dev/null 2>&1
   ```

---

## 9. Pemantauan & Troubleshooting

* **Melihat Log Aplikasi**:
  ```bash
  pm2 logs aitech-portal
  ```
* **Melihat Status PM2**:
  ```bash
  pm2 status
  ```
* **Melihat Log Nginx Error**:
  ```bash
  sudo tail -f /var/log/nginx/error.log
  ```
* **Restart Aplikasi**:
  ```bash
  pm2 restart aitech-portal
  ```
