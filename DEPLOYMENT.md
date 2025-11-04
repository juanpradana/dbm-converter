# 🚀 Deployment Guide - Signal Meter Pro

Guide untuk deploy aplikasi Signal Meter Pro ke VPS Ubuntu dengan domain farzani.space.

## 📋 Prerequisites

- VPS Ubuntu 20.04 atau lebih baru
- Domain `farzani.space` sudah di-point ke IP VPS
- Akses SSH ke VPS dengan user sudo/root
- Node.js dan npm sudah terinstall (atau akan diinstall)

## 🔧 Step 1: Setup Server (VPS Ubuntu)

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Node.js & npm
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Verify installation
npm --version
```

### 1.3 Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 1.4 Install PM2 (Optional, untuk process management)
```bash
sudo npm install -g pm2
```

## 📦 Step 2: Build Aplikasi (Lokal)

### 2.1 Build untuk Production
```bash
# Di komputer lokal, jalankan:
npm run build
```

### 2.2 Transfer File ke VPS
```bash
# Ganti dengan IP VPS dan user yang sesuai
scp -r dist/* user@your-vps-ip:/var/www/signal-meter-pro/
scp public/maintenance.html user@your-vps-ip:/var/www/farzani-space/
```

Atau menggunakan rsync:
```bash
rsync -avz --delete dist/ user@your-vps-ip:/var/www/signal-meter-pro/
rsync -avz public/maintenance.html user@your-vps-ip:/var/www/farzani-space/
```

## 🗂️ Step 3: Setup Directories di VPS

```bash
# Login ke VPS
ssh user@your-vps-ip

# Buat directories
sudo mkdir -p /var/www/signal-meter-pro
sudo mkdir -p /var/www/farzani-space

# Set permissions
sudo chown -R $USER:$USER /var/www/signal-meter-pro
sudo chown -R $USER:$USER /var/www/farzani-space
```

## 🌐 Step 4: Setup Nginx

### 4.1 Konfigurasi Subdomain untuk Aplikasi

Buat file konfigurasi untuk subdomain (misal: `app.farzani.space`):

```bash
sudo nano /etc/nginx/sites-available/app.farzani.space
```

Isi dengan konfigurasi berikut (ganti `app.farzani.space` dengan subdomain yang diinginkan):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name app.farzani.space;  # Ganti dengan subdomain Anda

    root /var/www/signal-meter-pro;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # PWA service worker
    location /sw.js {
        add_header Cache-Control "no-cache";
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4.2 Konfigurasi Domain Utama (Under Maintenance)

```bash
sudo nano /etc/nginx/sites-available/farzani.space
```

Isi dengan:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name farzani.space www.farzani.space;

    root /var/www/farzani-space;
    index maintenance.html;

    location / {
        try_files $uri /maintenance.html;
    }
}
```

### 4.3 Enable Sites dan Test Konfigurasi

```bash
# Enable sites
sudo ln -s /etc/nginx/sites-available/app.farzani.space /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/farzani.space /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 🔒 Step 5: Setup SSL dengan Let's Encrypt (Recommended)

### 5.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 5.2 Generate SSL Certificate untuk Subdomain

```bash
sudo certbot --nginx -d app.farzani.space
```

### 5.3 Generate SSL Certificate untuk Domain Utama

```bash
sudo certbot --nginx -d farzani.space -d www.farzani.space
```

### 5.4 Auto-renewal (Sudah otomatis, tapi verify)

```bash
sudo certbot renew --dry-run
```

Setelah SSL di-setup, Nginx akan otomatis update konfigurasi untuk menggunakan HTTPS.

## 📝 Step 6: Setup DNS di Namecheap

### 6.1 Login ke Namecheap

1. Login ke account Namecheap
2. Pilih domain `farzani.space`
3. Go to **Advanced DNS**

### 6.2 Add DNS Records

Tambahkan record berikut:

**Untuk Domain Utama:**
```
Type: A Record
Host: @
Value: [IP VPS Anda]
TTL: Automatic
```

**Untuk Subdomain (misal: app):**
```
Type: A Record
Host: app
Value: [IP VPS Anda]
TTL: Automatic
```

**Untuk WWW (optional):**
```
Type: A Record
Host: www
Value: [IP VPS Anda]
TTL: Automatic
```

## ✅ Step 7: Verify Deployment

1. Test domain utama: `http://farzani.space` - harus menampilkan halaman under maintenance
2. Test subdomain: `http://app.farzani.space` - harus menampilkan aplikasi Signal Meter Pro
3. Setelah SSL setup: Test dengan `https://`

## 🔄 Step 8: Update Deployment (Future)

Ketika ada update aplikasi:

```bash
# Di komputer lokal:
npm run build

# Transfer file baru ke VPS:
rsync -avz --delete dist/ user@your-vps-ip:/var/www/signal-meter-pro/

# Di VPS, reload Nginx:
sudo systemctl reload nginx
```

## 🛠️ Troubleshooting

### Nginx tidak start
```bash
sudo nginx -t  # Check untuk error
sudo systemctl status nginx
sudo journalctl -xe  # Check logs
```

### Permission denied
```bash
sudo chown -R www-data:www-data /var/www/signal-meter-pro
sudo chmod -R 755 /var/www/signal-meter-pro
```

### Port 80/443 sudah digunakan
```bash
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

### DNS belum propagate
Gunakan tool seperti `whatsmydns.net` untuk check DNS propagation.

## 📚 Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Vue.js Deployment Guide](https://vuejs.org/guide/best-practices/production-deployment.html)

---

**Note:** Ganti `app.farzani.space` dengan subdomain yang diinginkan, misal:
- `s-meter.farzani.space`
- `converter.farzani.space`
- `signal.farzani.space`
- dll
