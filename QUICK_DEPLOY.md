# ⚡ Quick Deploy Guide

Panduan cepat deploy Signal Meter Pro ke VPS Ubuntu.

## 🎯 Quick Steps

### 1. Di Komputer Lokal (Windows)

```bash
# Build aplikasi
npm run build

# File siap di folder 'dist'
```

### 2. Di VPS Ubuntu (via SSH)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (untuk build, optional jika sudah build di lokal)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Buat directories
sudo mkdir -p /var/www/signal-meter-pro
sudo mkdir -p /var/www/farzani-space

# Copy file dari lokal ke VPS (dari komputer lokal):
# scp -r dist/* user@your-vps-ip:/var/www/signal-meter-pro/
# scp public/maintenance.html user@your-vps-ip:/var/www/farzani-space/
```

### 3. Setup Nginx Config

Copy isi dari `nginx-app.conf` ke:
```bash
sudo nano /etc/nginx/sites-available/app.farzani.space
```
(Ganti `app.farzani.space` dengan subdomain yang diinginkan)

Copy isi dari `nginx-main.conf` ke:
```bash
sudo nano /etc/nginx/sites-available/farzani.space
```

Enable sites:
```bash
sudo ln -s /etc/nginx/sites-available/app.farzani.space /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/farzani.space /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Setup DNS di Namecheap

1. Login ke Namecheap
2. Domain: `farzani.space` → **Advanced DNS**
3. Add records:
   - **A Record**: `@` → IP VPS
   - **A Record**: `app` → IP VPS (atau subdomain lain)

### 5. Setup SSL (Optional tapi Recommended)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d app.farzani.space
sudo certbot --nginx -d farzani.space -d www.farzani.space
```

## 📁 File Structure di VPS

```
/var/www/
├── signal-meter-pro/     # Aplikasi Signal Meter Pro (subdomain)
│   ├── index.html
│   ├── assets/
│   └── ...
└── farzani-space/        # Halaman maintenance (domain utama)
    └── maintenance.html
```

## 🔄 Update Deployment

```bash
# Di lokal: build
npm run build

# Transfer ke VPS (dari lokal)
scp -r dist/* user@vps-ip:/var/www/signal-meter-pro/

# Reload Nginx di VPS
sudo systemctl reload nginx
```

## 📝 Subdomain Options

Ganti `app.farzani.space` dengan salah satu:
- `app.farzani.space`
- `s-meter.farzani.space`
- `converter.farzani.space`
- `signal.farzani.space`

Untuk detail lengkap, lihat `DEPLOYMENT.md`
