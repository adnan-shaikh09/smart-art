# 🎨 Smart Art — Full Stack Website

**Owner:** Atik Shaikh | **Location:** Nashik, Maharashtra  
**Stack:** React + Node.js/Express + MySQL + Docker + Nginx

---

## 🚀 EC2 DEPLOYMENT GUIDE (Ubuntu)

### Prerequisites
- Ubuntu EC2 instance (t2.micro or higher)
- Port 80 open in Security Group
- SSH access to instance

---

## STEP 1 — Connect to EC2

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

---

## STEP 2 — Install Docker & Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add ubuntu user to docker group (no sudo needed)
sudo usermod -aG docker ubuntu

# Install Docker Compose plugin
sudo apt install docker-compose-plugin -y

# Apply group change (re-login or use newgrp)
newgrp docker

# Verify installations
docker --version
docker compose version
```

---

## STEP 3 — Upload Project to EC2

**Option A — From your local machine (run this on your PC):**
```bash
scp -i your-key.pem smart-art.zip ubuntu@YOUR_EC2_PUBLIC_IP:~/
```

**Option B — Clone from GitHub (if you push to GitHub):**
```bash
git clone https://github.com/yourusername/smart-art.git
```

---

## STEP 4 — Unzip & Setup

```bash
# On EC2:
cd ~
unzip smart-art.zip
cd smart-art

# Create .env from example
cp .env.example .env
```

---

## STEP 5 — Configure Environment Variables

```bash
nano .env
```

Fill in these values:
```env
MYSQL_ROOT_PASSWORD=StrongPassword123!
MYSQL_DATABASE=smartart_db
MYSQL_USER=smartart_user
MYSQL_PASSWORD=AnotherStrongPass456!

JWT_SECRET=MyVerySecretJWTKey2024SmartArtNashik

# Optional: Gmail SMTP for email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_gmail_app_password
ADMIN_NOTIFY_EMAIL=atik@smartart.in
```

**Save:** `Ctrl+O` → Enter → `Ctrl+X`

---

## STEP 6 — Build & Start

```bash
# Build all containers and start (first time takes 3-5 minutes)
docker compose up -d --build

# Watch logs to confirm startup
docker compose logs -f
```

Wait until you see:  
✅ `Smart Art API running on port 5000`  
✅ `MySQL connected successfully`

---

## STEP 7 — Open Website

Open browser and go to:
```
http://YOUR_EC2_PUBLIC_IP
```

**Admin Panel:**
```
http://YOUR_EC2_PUBLIC_IP/admin/login

Username: admin
Password: Admin@123
```

> ⚠️ **Change the admin password immediately after first login!**  
> Go to Admin → Settings → Account → Change Password

---

## USEFUL COMMANDS

```bash
# Check running containers
docker compose ps

# View logs
docker compose logs -f backend
docker compose logs -f mysql

# Restart all services
docker compose restart

# Stop everything
docker compose down

# Stop and delete database (fresh start)
docker compose down -v

# Rebuild after code changes
docker compose up -d --build

# Shell into backend container
docker compose exec backend sh

# Shell into MySQL
docker compose exec mysql mysql -u smartart_user -p smartart_db
```

---

## GMAIL APP PASSWORD SETUP (for email notifications)

1. Go to **myaccount.google.com**
2. Click **Security** → Enable **2-Step Verification**
3. Go back to Security → **App Passwords**
4. Select app: **Mail**, device: **Other** → type "Smart Art"
5. Click **Generate** → Copy the 16-character password
6. Paste it as `SMTP_PASS` in your `.env`

---

## DEFAULT CREDENTIALS

| Field | Value |
|-------|-------|
| Admin Username | `admin` |
| Admin Password | `Admin@123` |
| Admin Email | `atik@smartart.in` |

---

## PROJECT STRUCTURE

```
smart-art/
├── frontend/          # React app (Vite)
├── backend/           # Node.js + Express API
├── nginx/             # Reverse proxy config
├── mysql/             # Database init SQL
├── docker-compose.yml # Orchestration
└── .env               # Environment config
```

---

## TROUBLESHOOTING

**Port 80 not accessible?**
```bash
# Check EC2 Security Group allows inbound HTTP (port 80) from 0.0.0.0/0
```

**Database not connecting?**
```bash
docker compose logs mysql
docker compose restart backend
```

**Rebuild frontend after changes?**
```bash
docker compose up -d --build frontend
```
