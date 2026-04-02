import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Docker', slug: 'docker', color: '#3b82f6', icon: '🐳' },
  { name: 'VPS', slug: 'vps', color: '#a855f7', icon: '🖥️' },
  { name: 'Nginx', slug: 'nginx', color: '#22c55e', icon: '🔀' },
  { name: 'Databases', slug: 'databases', color: '#f97316', icon: '🗄️' },
  { name: 'Security', slug: 'security', color: '#ef4444', icon: '🔒' },
  { name: 'Monitoring', slug: 'monitoring', color: '#eab308', icon: '📊' },
  { name: 'Blockchain', slug: 'blockchain', color: '#6366f1', icon: '🔗' },
  { name: 'Media', slug: 'media', color: '#ec4899', icon: '🍿' },
  { name: 'Files', slug: 'files', color: '#14b8a6', icon: '📁' },
  { name: 'VPN', slug: 'vpn', color: '#06b6d4', icon: '🌐' },
  { name: 'Automation', slug: 'automation', color: '#f59e0b', icon: '⚡' },
  { name: 'CI/CD', slug: 'cicd', color: '#f43f5e', icon: '🔄' },
  { name: 'Communication', slug: 'communication', color: '#d946ef', icon: '💬' },
];

const posts = [
  {
    title: 'Getting Started with Docker: Self-Host Your First App',
    slug: 'getting-started-with-docker-self-host-your-first-app',
    excerpt:
      'Learn how to containerize and self-host your first application using Docker. We cover installation, basic commands, and deploying a real app from scratch.',
    category: 'Docker',
    tags: ['docker', 'containers', 'self-hosting', 'beginner'],
    published: true,
    featured: true,
    readingTime: 8,
    publishedAt: new Date('2024-01-15'),
    content: `## Introduction

Docker has revolutionized how we deploy and manage applications. Instead of wrestling with dependency conflicts and environment differences, Docker packages your app and everything it needs into a portable container. This guide will walk you through self-hosting your first application using Docker.

## Prerequisites

Before we begin, make sure you have:
- A Linux VPS or local Linux machine (Ubuntu 22.04 recommended)
- SSH access to your server
- Basic command-line knowledge

## Installing Docker

First, let's install Docker on Ubuntu:

\`\`\`bash
# Update package index
sudo apt-get update

# Install required packages
sudo apt-get install -y ca-certificates curl gnupg

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
\`\`\`

## Running Your First Container

Let's verify Docker is working by running a simple container:

\`\`\`bash
sudo docker run hello-world
\`\`\`

You should see a message confirming Docker is installed and working correctly.

## Deploying a Real Application

Let's deploy a simple Node.js application. First, create a \`docker-compose.yml\` file:

\`\`\`yaml
version: '3.8'

services:
  app:
    image: node:18-alpine
    container_name: my-app
    working_dir: /app
    volumes:
      - ./app:/app
    ports:
      - "3000:3000"
    command: node server.js
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3000
\`\`\`

Now create a simple \`app/server.js\`:

\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello from Docker!</h1><p>My first self-hosted app.</p>');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

Start the application:

\`\`\`bash
docker compose up -d
\`\`\`

## Managing Containers

Here are the essential Docker commands you'll use daily:

\`\`\`bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container logs
docker logs my-app

# Follow logs in real-time
docker logs -f my-app

# Stop a container
docker stop my-app

# Start a stopped container
docker start my-app

# Remove a container
docker rm my-app

# Remove unused images
docker image prune
\`\`\`

## Next Steps

Now that you have Docker running, consider:
- Setting up Docker Compose for multi-container applications
- Configuring Nginx as a reverse proxy
- Adding SSL certificates with Let's Encrypt
- Setting up automatic container restarts

Docker is the foundation of modern self-hosting. Once you master it, deploying complex applications becomes straightforward.`,
  },
  {
    title: 'Setting Up Nginx as a Reverse Proxy for Self-Hosted Services',
    slug: 'setting-up-nginx-as-a-reverse-proxy',
    excerpt:
      "Nginx is the backbone of self-hosted infrastructure. Learn how to configure it as a reverse proxy to route traffic to multiple services, handle SSL termination, and improve performance.",
    category: 'Nginx',
    tags: ['nginx', 'reverse-proxy', 'ssl', 'web-server'],
    published: true,
    featured: true,
    readingTime: 10,
    publishedAt: new Date('2024-01-22'),
    content: `## Why Nginx for Reverse Proxying?

When you self-host multiple services, you need a way to route incoming traffic to the right application. Nginx excels at this as a reverse proxy — it sits in front of your services, handles SSL termination, and forwards requests to the appropriate backend.

## Installing Nginx

\`\`\`bash
sudo apt-get update
sudo apt-get install -y nginx

# Enable and start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Verify it's running
sudo systemctl status nginx
\`\`\`

## Basic Reverse Proxy Configuration

Let's say you have three services running locally:
- A blog on port 3000
- Uptime Kuma on port 3001
- Portainer on port 9000

Create a configuration file for each:

\`\`\`nginx
# /etc/nginx/sites-available/blog.conf
server {
    listen 80;
    server_name blog.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

Enable the site:

\`\`\`bash
sudo ln -s /etc/nginx/sites-available/blog.conf /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
\`\`\`

## Adding SSL with Let's Encrypt

Install Certbot:

\`\`\`bash
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d blog.yourdomain.com

# Certbot automatically updates your Nginx config
# Verify auto-renewal
sudo certbot renew --dry-run
\`\`\`

After Certbot runs, your config will look like:

\`\`\`nginx
server {
    listen 443 ssl;
    server_name blog.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/blog.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/blog.yourdomain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name blog.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
\`\`\`

## Performance Optimization

Add these settings to your \`/etc/nginx/nginx.conf\` for better performance:

\`\`\`nginx
http {
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss text/javascript;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    # Timeouts
    keepalive_timeout 65;
    client_body_timeout 12;
    client_header_timeout 12;
    send_timeout 10;
}
\`\`\`

## Security Headers

Add security headers to your server blocks:

\`\`\`nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
\`\`\`

## Monitoring Nginx

Check logs to troubleshoot issues:

\`\`\`bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log

# Check configuration syntax
sudo nginx -t
\`\`\`

With Nginx properly configured, you have a solid foundation for hosting multiple services securely.`,
  },
  {
    title: 'Choosing the Right VPS Provider for Self-Hosting',
    slug: 'choosing-a-vps-provider-for-self-hosting',
    excerpt:
      'Comparing top VPS providers for self-hosting: Hetzner, DigitalOcean, Linode, and Vultr. Learn what specs you need, how to evaluate pricing, and which provider fits your use case.',
    category: 'VPS',
    tags: ['vps', 'hosting', 'hetzner', 'digitalocean', 'infrastructure'],
    published: true,
    featured: true,
    readingTime: 7,
    publishedAt: new Date('2024-02-05'),
    content: `## Picking Your Self-Hosting Home

Your VPS is the foundation of your self-hosted infrastructure. Choose wrong and you'll deal with poor performance, unexpected costs, or reliability issues. This guide cuts through the noise to help you pick the right provider.

## What You Actually Need

Before comparing providers, define your requirements:

\`\`\`
Minimum specs for a starter self-hosting setup:
- CPU: 2 vCPUs
- RAM: 4 GB
- Storage: 40 GB SSD
- Bandwidth: 2-4 TB/month
- Network: 1 Gbps
\`\`\`

For running multiple services (blog + monitoring + databases + apps):
- **RAM** is usually the bottleneck — get at least 8 GB
- **Storage** fills up fast with Docker images and database backups
- **Bandwidth** matters if you serve media files

## Provider Comparison

### Hetzner Cloud (Recommended for most users)

Hetzner is the price-performance champion for European self-hosters:

| Plan | CPU | RAM | Storage | Price |
|------|-----|-----|---------|-------|
| CX22 | 2 vCPU | 4 GB | 40 GB | €4.35/mo |
| CX32 | 4 vCPU | 8 GB | 80 GB | €8.03/mo |
| CX42 | 8 vCPU | 16 GB | 160 GB | €16.96/mo |

**Pros:** Excellent price-to-performance, fast NVMe storage, great network
**Cons:** Fewer data center locations than US providers

### DigitalOcean (Best developer experience)

\`\`\`
Droplets pricing (as of 2024):
- Basic: $6/mo — 1 vCPU, 1 GB RAM, 25 GB SSD
- Regular: $12/mo — 2 vCPU, 2 GB RAM, 60 GB SSD
- Regular: $18/mo — 2 vCPU, 4 GB RAM, 80 GB SSD
\`\`\`

**Pros:** Excellent UI/UX, good documentation, managed databases available
**Cons:** More expensive than Hetzner for equivalent specs

### Vultr

Good middle ground with 32 global data centers:

\`\`\`
Cloud Compute pricing:
- 1 vCPU, 1 GB RAM: $5/mo
- 1 vCPU, 2 GB RAM: $10/mo
- 2 vCPU, 4 GB RAM: $20/mo
\`\`\`

**Pros:** Many locations, hourly billing, good performance
**Cons:** More expensive than Hetzner

### Linode (now Akamai Cloud)

Reliable US-focused provider:

\`\`\`
Nanode 1 GB: $5/mo
Linode 2 GB: $12/mo
Linode 4 GB: $24/mo
\`\`\`

**Pros:** Long track record, good documentation, US-focused
**Cons:** Higher prices, recent acquisition uncertainty

## My Recommendation

For most self-hosters starting out:

1. **Budget-conscious**: Hetzner CX22 or CX32 — unbeatable value
2. **US-based users**: DigitalOcean or Vultr for lower latency
3. **Growth-oriented**: Start with Hetzner CX32, scale vertically

## Initial Server Setup

After you spin up your VPS, always do this first:

\`\`\`bash
# Update the system
sudo apt-get update && sudo apt-get upgrade -y

# Create a non-root user
adduser deploy
usermod -aG sudo deploy

# Set up SSH key auth
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Disable password auth and root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Set up firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
\`\`\`

## Backup Strategy

Always set up automated backups:

\`\`\`bash
# Install restic for backups
sudo apt-get install -y restic

# Initialize backup repository (example with Backblaze B2)
restic -r b2:my-bucket:server-backups init

# Create backup script
cat > /usr/local/bin/backup.sh << 'EOF'
#!/bin/bash
restic -r b2:my-bucket:server-backups backup \
  --password-file /root/.restic-password \
  /etc /home /var/www /opt
EOF

chmod +x /usr/local/bin/backup.sh

# Schedule daily backups
echo "0 2 * * * root /usr/local/bin/backup.sh" >> /etc/crontab
\`\`\`

Choose your VPS wisely — it's easier to start on the right platform than to migrate later.`,
  },
  {
    title: 'Self-Hosting PostgreSQL: A Complete Production Guide',
    slug: 'self-hosting-postgresql-complete-guide',
    excerpt:
      'Everything you need to know about running PostgreSQL in production on your own server. Covers installation, configuration, security hardening, backups, and performance tuning.',
    category: 'Databases',
    tags: ['postgresql', 'database', 'self-hosting', 'production', 'backups'],
    published: true,
    featured: false,
    readingTime: 12,
    publishedAt: new Date('2024-02-19'),
    content: `## Why Self-Host PostgreSQL?

PostgreSQL is one of the world's most advanced open-source databases. Self-hosting it gives you full control over your data, eliminates per-row pricing, and can be significantly cheaper than managed services for large datasets.

## Installation

\`\`\`bash
# Install PostgreSQL 16 on Ubuntu 22.04
sudo apt-get install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh

sudo apt-get install -y postgresql-16

# Check service status
sudo systemctl status postgresql
\`\`\`

## Initial Configuration

The main config file is at \`/etc/postgresql/16/main/postgresql.conf\`. Key settings to tune:

\`\`\`ini
# Memory settings (adjust based on your RAM)
# For a 4 GB server dedicated to PostgreSQL:
shared_buffers = 1GB              # 25% of RAM
effective_cache_size = 3GB        # 75% of RAM
maintenance_work_mem = 256MB
work_mem = 13MB                   # RAM / (max_connections * 4)

# Write performance
wal_buffers = 16MB
checkpoint_completion_target = 0.9
default_statistics_target = 100

# Connection settings
max_connections = 100
listen_addresses = 'localhost'    # Only listen locally initially

# Logging
log_min_duration_statement = 1000 # Log slow queries (>1s)
log_checkpoints = on
log_connections = on
log_disconnections = on
\`\`\`

## Security Hardening

Edit \`/etc/postgresql/16/main/pg_hba.conf\` for authentication:

\`\`\`
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                peer
local   all             all                                     md5
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256
# Only add remote access if truly needed, and use specific IPs:
# host  mydb            myapp           192.168.1.100/32        scram-sha-256
\`\`\`

Create a dedicated application user:

\`\`\`sql
-- Connect as postgres superuser
sudo -u postgres psql

-- Create application database and user
CREATE DATABASE myapp_production;
CREATE USER myapp WITH ENCRYPTED PASSWORD 'strong-random-password-here';
GRANT ALL PRIVILEGES ON DATABASE myapp_production TO myapp;

-- Limit privileges
\c myapp_production
GRANT USAGE ON SCHEMA public TO myapp;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO myapp;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO myapp;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO myapp;
\`\`\`

## Automated Backups

Never run PostgreSQL without a backup strategy. Here's a reliable setup:

\`\`\`bash
#!/bin/bash
# /usr/local/bin/pg-backup.sh

set -euo pipefail

BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
RETENTION_DAYS=30
DB_NAME="myapp_production"

mkdir -p "$BACKUP_DIR"

# Create compressed backup
sudo -u postgres pg_dump "$DB_NAME" | gzip > "$BACKUP_DIR/\${DB_NAME}_\${DATE}.sql.gz"

# Remove backups older than retention period
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: \${DB_NAME}_\${DATE}.sql.gz"
\`\`\`

\`\`\`bash
# Make executable and schedule
chmod +x /usr/local/bin/pg-backup.sh

# Add to crontab - run daily at 3 AM
echo "0 3 * * * root /usr/local/bin/pg-backup.sh >> /var/log/pg-backup.log 2>&1" | sudo tee -a /etc/crontab
\`\`\`

## Restore from Backup

\`\`\`bash
# Restore a backup
gunzip -c /var/backups/postgresql/myapp_production_2024-02-19_03-00-00.sql.gz | sudo -u postgres psql myapp_production
\`\`\`

## Connection Pooling with PgBouncer

For applications with many connections, use PgBouncer:

\`\`\`bash
sudo apt-get install -y pgbouncer
\`\`\`

\`\`\`ini
# /etc/pgbouncer/pgbouncer.ini
[databases]
myapp_production = host=127.0.0.1 port=5432 dbname=myapp_production

[pgbouncer]
listen_port = 6432
listen_addr = 127.0.0.1
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
\`\`\`

## Monitoring Queries

\`\`\`sql
-- Find slow queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';

-- Check database size
SELECT pg_size_pretty(pg_database_size('myapp_production'));

-- Check table sizes
SELECT schemaname, tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;

-- Check index usage
SELECT relname, idx_scan, seq_scan
FROM pg_stat_user_tables
ORDER BY seq_scan DESC;
\`\`\`

With these configurations in place, your self-hosted PostgreSQL will be secure, performant, and reliably backed up.`,
  },
  {
    title: 'Securing Self-Hosted Services with SSL/TLS and Best Practices',
    slug: 'securing-self-hosted-services-with-ssl',
    excerpt:
      'A comprehensive guide to securing your self-hosted infrastructure. Covers SSL/TLS certificates, firewall configuration, fail2ban, and hardening your services against common attacks.',
    category: 'Security',
    tags: ['security', 'ssl', 'tls', 'firewall', 'fail2ban', 'hardening'],
    published: true,
    featured: false,
    readingTime: 9,
    publishedAt: new Date('2024-03-04'),
    content: `## Security is Not Optional

When you self-host services, you're directly responsible for their security. Unlike managed services, there's no vendor security team watching your back. This guide covers the essential security measures every self-hoster should implement.

## SSL/TLS Certificates with Let's Encrypt

Free, automatic SSL certificates are now standard. Here's the complete setup:

\`\`\`bash
# Install Certbot with Nginx plugin
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain certificates for your domains
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run

# Auto-renewal is configured automatically via systemd timer
systemctl status certbot.timer
\`\`\`

## Firewall Configuration with UFW

\`\`\`bash
# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow essential services
sudo ufw allow ssh        # or: ufw allow 22/tcp
sudo ufw allow http       # port 80
sudo ufw allow https      # port 443

# Allow specific IPs for admin services
sudo ufw allow from 203.0.113.10 to any port 5432  # PostgreSQL from your IP only

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
\`\`\`

## Fail2Ban — Automatic Attack Mitigation

Fail2Ban monitors logs and automatically bans IPs that show malicious activity:

\`\`\`bash
sudo apt-get install -y fail2ban

# Create local config (never edit the .conf file directly)
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
\`\`\`

Edit \`/etc/fail2ban/jail.local\`:

\`\`\`ini
[DEFAULT]
bantime  = 3600      # 1 hour ban
findtime = 600       # Look at last 10 minutes
maxretry = 5         # Allow 5 attempts

# Email notifications (optional)
# destemail = admin@yourdomain.com
# sender = fail2ban@yourdomain.com
# action = %(action_mwl)s

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 86400      # 24 hour ban for SSH

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
\`\`\`

\`\`\`bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check banned IPs
sudo fail2ban-client status sshd
\`\`\`

## SSH Hardening

\`\`\`bash
# /etc/ssh/sshd_config
\`\`\`

\`\`\`ini
# Disable root login
PermitRootLogin no

# Disable password authentication (use keys only)
PasswordAuthentication no
ChallengeResponseAuthentication no

# Only allow specific users
AllowUsers deploy

# Use strong algorithms only
Protocol 2
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com

# Reduce attack surface
X11Forwarding no
AllowTcpForwarding no
MaxAuthTries 3
LoginGraceTime 30
\`\`\`

\`\`\`bash
sudo systemctl restart sshd
\`\`\`

## Docker Security

When running services in Docker, apply these settings:

\`\`\`yaml
# docker-compose.yml security best practices
version: '3.8'

services:
  app:
    image: myapp:latest
    security_opt:
      - no-new-privileges:true    # Prevent privilege escalation
    read_only: true               # Read-only filesystem
    tmpfs:
      - /tmp                      # Writable temp dir
    cap_drop:
      - ALL                       # Drop all capabilities
    cap_add:
      - NET_BIND_SERVICE          # Add back only what's needed
    user: "1000:1000"             # Run as non-root
    environment:
      - NODE_ENV=production
    networks:
      - internal                  # Isolated network

networks:
  internal:
    driver: bridge
    internal: true                # No external access
\`\`\`

## Automated Security Updates

\`\`\`bash
sudo apt-get install -y unattended-upgrades

# Configure automatic security updates
sudo dpkg-reconfigure --priority=low unattended-upgrades

# Edit /etc/apt/apt.conf.d/50unattended-upgrades
\`\`\`

\`\`\`
Unattended-Upgrade::Allowed-Origins {
  "\${distro_id}:\${distro_codename}";
  "\${distro_id}:\${distro_codename}-security";
  "\${distro_id}ESMApps:\${distro_codename}-apps-security";
  "\${distro_id}ESM:\${distro_codename}-infra-security";
};

Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Mail "admin@yourdomain.com";
\`\`\`

## Security Checklist

Before going live, verify:

- [ ] SSH key authentication only (no passwords)
- [ ] Non-root user for all operations
- [ ] UFW firewall enabled with minimal open ports
- [ ] Fail2Ban running and monitoring logs
- [ ] SSL/TLS certificates installed
- [ ] HTTP redirects to HTTPS
- [ ] Security headers in Nginx
- [ ] Docker containers running as non-root
- [ ] Automated security updates enabled
- [ ] Regular backup verification

Security is an ongoing practice, not a one-time setup. Review your logs regularly and stay informed about vulnerabilities in your stack.`,
  },
  {
    title: 'Self-Hosting Uptime Kuma: Monitor All Your Services for Free',
    slug: 'self-hosting-uptime-kuma-monitor-your-services',
    excerpt: 'Uptime Kuma is a beautiful, self-hosted monitoring tool. Learn how to deploy it with Docker, set up monitors for all your services, and configure alerts via Telegram, Discord, or email.',
    category: 'Monitoring',
    tags: ['monitoring', 'uptime-kuma', 'docker', 'alerts', 'self-hosting'],
    published: true,
    featured: true,
    readingTime: 7,
    publishedAt: new Date('2024-03-10'),
    content: `## What is Uptime Kuma?

Uptime Kuma is a self-hosted monitoring tool that looks and feels like a premium uptime service — but it's completely free and runs on your own server. It supports HTTP, TCP, ping, DNS, and more monitoring types.

## Deploy with Docker Compose

\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  uptime-kuma:
    image: louislam/uptime-kuma:latest
    container_name: uptime-kuma
    volumes:
      - uptime-kuma-data:/app/data
    ports:
      - "3001:3001"
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true

volumes:
  uptime-kuma-data:
\`\`\`

\`\`\`bash
docker compose up -d
\`\`\`

Access the UI at \`http://your-server:3001\`.

## Nginx Reverse Proxy

\`\`\`nginx
server {
    listen 80;
    server_name status.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

## Setting Up Monitors

After logging in, add monitors for your services:

1. **HTTP(s)** — monitors your website and API endpoints
2. **TCP Port** — checks if a port is open (databases, SSH)
3. **Ping** — ICMP ping check for servers
4. **Docker Container** — monitor container health via Docker socket
5. **DNS** — checks DNS resolution

Example HTTP monitor settings:
\`\`\`
Name: Main Website
URL: https://yourdomain.com
Heartbeat Interval: 60 seconds
Retries: 3
\`\`\`

## Telegram Alert Setup

\`\`\`bash
# 1. Create a bot via @BotFather on Telegram
# 2. Get your bot token
# 3. Get your chat ID by messaging @userinfobot
\`\`\`

In Uptime Kuma → Settings → Notifications → Add Telegram:
- Bot Token: \`1234567890:ABCdefGHIjklmNOPQrstuvWXYZ\`
- Chat ID: \`-1001234567890\`

## Status Page

Create a public status page at \`status.yourdomain.com\`:

1. Settings → Status Pages → New Status Page
2. Add your monitors to the page
3. Customize the title, description, and logo
4. Share the URL with your users

With Uptime Kuma you'll know about downtime before your users do.`,
  },
  {
    title: 'Deploy Portainer: The Docker GUI That Changes Everything',
    slug: 'deploy-portainer-docker-gui',
    excerpt: 'Portainer gives you a powerful web UI to manage Docker containers, stacks, images, and volumes without touching the command line. Here is how to deploy and secure it.',
    category: 'Docker',
    tags: ['portainer', 'docker', 'gui', 'container-management', 'self-hosting'],
    published: true,
    featured: false,
    readingTime: 6,
    publishedAt: new Date('2024-03-18'),
    content: `## Why Portainer?

Managing Docker from the command line works fine for a few containers. But when you're running 10+ services, a GUI makes life dramatically easier. Portainer gives you container management, log viewing, shell access, and stack deployment all in a browser.

## Install Portainer CE

\`\`\`bash
# Create a volume for Portainer data
docker volume create portainer_data

# Run Portainer
docker run -d \\
  -p 8000:8000 \\
  -p 9443:9443 \\
  --name portainer \\
  --restart=always \\
  -v /var/run/docker.sock:/var/run/docker.sock \\
  -v portainer_data:/data \\
  portainer/portainer-ce:latest
\`\`\`

Access at \`https://your-server:9443\` — you'll be prompted to set an admin password.

## Docker Compose Alternative

\`\`\`yaml
version: '3.8'

services:
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: unless-stopped
    ports:
      - "9443:9443"
      - "8000:8000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data
    security_opt:
      - no-new-privileges:true

volumes:
  portainer_data:
\`\`\`

## Secure with Nginx

\`\`\`nginx
server {
    listen 443 ssl;
    server_name portainer.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/portainer.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/portainer.yourdomain.com/privkey.pem;

    location / {
        proxy_pass https://localhost:9443;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_ssl_verify off;
    }
}
\`\`\`

## Key Features to Know

**Stacks** — Deploy Docker Compose files directly from the UI or a Git repo.

**Container Console** — Get a shell inside any running container without \`docker exec\`.

**Log Viewer** — Real-time log streaming with search and filtering.

**Image Management** — Pull, build, and remove images with one click.

**Volumes & Networks** — Create and manage Docker resources visually.

## Restrict Access

For security, restrict Portainer to a VPN or specific IP:

\`\`\`nginx
location / {
    allow 10.0.0.0/8;     # VPN subnet
    allow 192.168.1.10;   # Your IP
    deny all;
    proxy_pass https://localhost:9443;
}
\`\`\`

Portainer dramatically lowers the barrier to managing complex Docker environments.`,
  },
  {
    title: 'WireGuard VPN on Your VPS: Private and Fast',
    slug: 'wireguard-vpn-on-your-vps',
    excerpt: 'Set up a blazing-fast WireGuard VPN on your own VPS. Access your self-hosted services securely from anywhere, tunnel all traffic, or just connect your home and server networks.',
    category: 'Security',
    tags: ['wireguard', 'vpn', 'security', 'vps', 'networking'],
    published: true,
    featured: false,
    readingTime: 9,
    publishedAt: new Date('2024-03-25'),
    content: `## Why WireGuard?

WireGuard is a modern VPN protocol that's faster, simpler, and more secure than OpenVPN or IPSec. It runs in the Linux kernel and has an incredibly small codebase (~4,000 lines vs OpenVPN's ~70,000).

## Install WireGuard

\`\`\`bash
# Ubuntu 22.04
sudo apt-get update
sudo apt-get install -y wireguard

# Generate server keys
cd /etc/wireguard
wg genkey | tee server_private.key | wg pubkey > server_public.key
chmod 600 server_private.key

# Generate client keys
wg genkey | tee client_private.key | wg pubkey > client_public.key
\`\`\`

## Server Configuration

\`\`\`bash
# /etc/wireguard/wg0.conf

[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = <SERVER_PRIVATE_KEY>

# Enable IP forwarding for traffic routing
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
# Client 1 - My Laptop
PublicKey = <CLIENT_PUBLIC_KEY>
AllowedIPs = 10.0.0.2/32
\`\`\`

\`\`\`bash
# Enable IP forwarding
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Start WireGuard
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0

# Open firewall port
sudo ufw allow 51820/udp
\`\`\`

## Client Configuration

Create this on your local machine:

\`\`\`ini
[Interface]
Address = 10.0.0.2/24
PrivateKey = <CLIENT_PRIVATE_KEY>
DNS = 1.1.1.1

[Peer]
PublicKey = <SERVER_PUBLIC_KEY>
Endpoint = your-server-ip:51820
AllowedIPs = 0.0.0.0/0    # Route ALL traffic through VPN
# AllowedIPs = 10.0.0.0/24  # Only route VPN traffic (split tunnel)
PersistentKeepalive = 25
\`\`\`

## Add More Clients

\`\`\`bash
# Generate new client keys on server
wg genkey | tee client2_private.key | wg pubkey > client2_public.key

# Add peer to running WireGuard interface (no restart needed!)
sudo wg set wg0 peer <CLIENT2_PUBLIC_KEY> allowed-ips 10.0.0.3/32

# Save config
sudo wg-quick save wg0
\`\`\`

## Verify Connection

\`\`\`bash
# On server - show active peers
sudo wg show

# Check if VPN is routing traffic (on client)
curl ifconfig.me   # Should show your VPS IP
\`\`\`

## Use WireGuard for Internal Services

Instead of exposing Portainer, Uptime Kuma, and databases to the internet, put them on your VPN subnet:

\`\`\`nginx
# Only allow access from VPN IP range
server {
    listen 80;
    server_name portainer.yourdomain.com;
    allow 10.0.0.0/24;
    deny all;
    # ...
}
\`\`\`

WireGuard is the most elegant VPN solution available — set it up once and forget about it.`,
  },
  {
    title: 'Self-Host Ghost Blog with Docker Compose',
    slug: 'self-host-ghost-blog-docker-compose',
    excerpt: 'Ghost is a powerful, modern publishing platform. Learn how to self-host it with Docker Compose, connect a custom domain, configure email, and keep it updated.',
    category: 'Docker',
    tags: ['ghost', 'blog', 'docker', 'mysql', 'self-hosting'],
    published: true,
    featured: false,
    readingTime: 8,
    publishedAt: new Date('2024-04-02'),
    content: `## Ghost vs WordPress

Ghost is purpose-built for publishing. It's faster, cleaner, and has first-class support for newsletters, memberships, and SEO. Unlike WordPress, it doesn't suffer from plugin bloat.

## Docker Compose Setup

\`\`\`yaml
version: '3.8'

services:
  ghost:
    image: ghost:5-alpine
    container_name: ghost
    restart: unless-stopped
    ports:
      - "2368:2368"
    environment:
      database__client: mysql
      database__connection__host: ghost-db
      database__connection__user: ghost
      database__connection__password: \${DB_PASSWORD}
      database__connection__database: ghost
      url: https://blog.yourdomain.com
      mail__transport: SMTP
      mail__options__host: smtp.mailgun.org
      mail__options__port: 587
      mail__options__auth__user: \${SMTP_USER}
      mail__options__auth__pass: \${SMTP_PASS}
    volumes:
      - ghost-content:/var/lib/ghost/content
    depends_on:
      ghost-db:
        condition: service_healthy

  ghost-db:
    image: mysql:8.0
    container_name: ghost-db
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: \${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ghost
      MYSQL_USER: ghost
      MYSQL_PASSWORD: \${DB_PASSWORD}
    volumes:
      - ghost-db-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  ghost-content:
  ghost-db-data:
\`\`\`

Create a \`.env\` file:

\`\`\`bash
DB_ROOT_PASSWORD=very-strong-root-password
DB_PASSWORD=ghost-db-password
SMTP_USER=postmaster@mg.yourdomain.com
SMTP_PASS=your-mailgun-api-key
\`\`\`

## Start Ghost

\`\`\`bash
docker compose up -d

# Check logs
docker logs ghost -f
\`\`\`

## Nginx Configuration

\`\`\`nginx
server {
    listen 443 ssl;
    server_name blog.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/blog.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/blog.yourdomain.com/privkey.pem;

    client_max_body_size 50m;

    location / {
        proxy_pass http://localhost:2368;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name blog.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
\`\`\`

## Updating Ghost

\`\`\`bash
# Pull latest image
docker compose pull ghost

# Recreate container
docker compose up -d ghost

# Ghost auto-runs migrations on startup
docker logs ghost -f
\`\`\`

## Backup Ghost Data

\`\`\`bash
#!/bin/bash
# Backup Ghost content and database

# Content files
tar -czf ghost-content-$(date +%Y%m%d).tar.gz \
  $(docker volume inspect ghost-content --format '{{ .Mountpoint }}')

# Database dump
docker exec ghost-db mysqldump -u ghost -p\${DB_PASSWORD} ghost | \
  gzip > ghost-db-$(date +%Y%m%d).sql.gz
\`\`\`

Ghost gives you a professional publishing platform that you fully own and control.`,
  },
  {
    title: 'Redis for Self-Hosters: Caching, Sessions, and Queues',
    slug: 'redis-for-self-hosters-caching-sessions-queues',
    excerpt: 'Redis is the Swiss Army knife of self-hosted infrastructure. Learn how to deploy Redis with Docker, use it for caching, session storage, and job queues, and secure it properly.',
    category: 'Databases',
    tags: ['redis', 'caching', 'docker', 'databases', 'performance'],
    published: true,
    featured: false,
    readingTime: 8,
    publishedAt: new Date('2024-04-10'),
    content: `## What Redis Does

Redis is an in-memory data store used for:
- **Caching** — store database query results or API responses
- **Sessions** — fast user session storage for web apps
- **Queues** — background job processing with BullMQ or Sidekiq
- **Rate limiting** — track request counts by IP
- **Pub/Sub** — real-time messaging between services

## Deploy Redis with Docker

\`\`\`yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    container_name: redis
    restart: unless-stopped
    command: redis-server --requirepass \${REDIS_PASSWORD} --appendonly yes
    volumes:
      - redis-data:/data
    ports:
      - "127.0.0.1:6379:6379"   # Only bind to localhost!
    healthcheck:
      test: ["CMD", "redis-cli", "--pass", "\${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  redis-data:
\`\`\`

**Important**: Only bind to \`127.0.0.1\` — never expose Redis to the internet without authentication and a firewall.

## Redis Configuration

\`\`\`bash
# redis.conf (mount as volume for production)
requirepass your-strong-redis-password
maxmemory 512mb
maxmemory-policy allkeys-lru    # Evict least recently used keys when full
appendonly yes                   # Persist data to disk
appendfsync everysec             # Sync to disk every second
\`\`\`

## Connect from Node.js

\`\`\`javascript
import { createClient } from 'redis';

const redis = createClient({
  url: 'redis://:your-password@localhost:6379'
});

await redis.connect();

// Cache a database query result
async function getCachedUser(userId) {
  const cached = await redis.get(\`user:\${userId}\`);
  if (cached) return JSON.parse(cached);

  const user = await db.user.findUnique({ where: { id: userId } });
  await redis.setEx(\`user:\${userId}\`, 3600, JSON.stringify(user)); // 1 hour TTL
  return user;
}
\`\`\`

## Session Storage with Express

\`\`\`javascript
import session from 'express-session';
import RedisStore from 'connect-redis';

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7  // 7 days
  }
}));
\`\`\`

## Rate Limiting

\`\`\`javascript
async function rateLimit(ip, limit = 100, windowSeconds = 60) {
  const key = \`ratelimit:\${ip}\`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }

  return current <= limit;
}
\`\`\`

## Monitor Redis

\`\`\`bash
# Connect to Redis CLI
docker exec -it redis redis-cli -a your-password

# Check memory usage
INFO memory

# See all keys (use SCAN in production, not KEYS)
SCAN 0 COUNT 100

# Monitor real-time commands
MONITOR

# Check hit/miss ratio
INFO stats | grep keyspace
\`\`\`

Redis is one of those tools that, once you add it to your stack, you wonder how you lived without it.`,
  },
  {
    title: 'Automated Backups with Restic and Backblaze B2',
    slug: 'automated-backups-restic-backblaze-b2',
    excerpt: 'Never lose your self-hosted data again. Restic is a fast, encrypted backup tool. Paired with Backblaze B2 cheap cloud storage, you get bulletproof automated backups for pennies a month.',
    category: 'Security',
    tags: ['backups', 'restic', 'backblaze', 'security', 'automation'],
    published: true,
    featured: false,
    readingTime: 10,
    publishedAt: new Date('2024-04-18'),
    content: `## Why Backups Are Non-Negotiable

Self-hosters lose data for many reasons: disk failure, accidental deletion, ransomware, provider outages. The 3-2-1 backup rule:
- **3** copies of data
- **2** different storage media
- **1** off-site location

Restic + Backblaze B2 gives you encrypted, off-site backups for ~$0.006/GB/month.

## Install Restic

\`\`\`bash
# Ubuntu
sudo apt-get install -y restic

# Verify
restic version
\`\`\`

## Set Up Backblaze B2

1. Create account at backblaze.com
2. Create a bucket: \`my-server-backups\` (private)
3. Create an Application Key with read/write access to that bucket
4. Note: Bucket name, Account ID, Application Key

## Initialize Restic Repository

\`\`\`bash
export B2_ACCOUNT_ID="your-account-id"
export B2_ACCOUNT_KEY="your-application-key"
export RESTIC_REPOSITORY="b2:my-server-backups"
export RESTIC_PASSWORD="your-very-strong-encryption-password"

# Initialize repository (one time)
restic init
\`\`\`

## Create Backup Script

\`\`\`bash
#!/bin/bash
# /usr/local/bin/backup.sh

set -euo pipefail

export B2_ACCOUNT_ID="your-account-id"
export B2_ACCOUNT_KEY="your-application-key"
export RESTIC_REPOSITORY="b2:my-server-backups"
export RESTIC_PASSWORD_FILE="/root/.restic-password"

LOG="/var/log/restic-backup.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting backup..." >> "$LOG"

# Backup critical directories
restic backup \\
  /etc \\
  /home \\
  /opt \\
  /var/www \\
  --exclude '/home/*/.cache' \\
  --exclude '/home/*/.npm' \\
  --tag "automated" \\
  >> "$LOG" 2>&1

# Backup Docker volumes
for volume in $(docker volume ls -q); do
  mount_point=$(docker volume inspect "$volume" --format '{{ .Mountpoint }}')
  restic backup "$mount_point" --tag "docker-volume:$volume" >> "$LOG" 2>&1
done

# Database backups
docker exec postgres pg_dumpall -U postgres | \\
  gzip | \\
  restic backup --stdin --stdin-filename "postgres-all-$(date +%Y%m%d).sql.gz" \\
  >> "$LOG" 2>&1

# Remove old snapshots (keep 7 daily, 4 weekly, 6 monthly)
restic forget \\
  --keep-daily 7 \\
  --keep-weekly 4 \\
  --keep-monthly 6 \\
  --prune \\
  >> "$LOG" 2>&1

echo "[$DATE] Backup complete!" >> "$LOG"
\`\`\`

\`\`\`bash
chmod +x /usr/local/bin/backup.sh

# Store password securely
echo "your-encryption-password" > /root/.restic-password
chmod 600 /root/.restic-password
\`\`\`

## Schedule with Cron

\`\`\`bash
# Run backup every day at 2 AM
echo "0 2 * * * root /usr/local/bin/backup.sh" | sudo tee -a /etc/crontab
\`\`\`

## Verify Backups Work

\`\`\`bash
# List all snapshots
restic snapshots

# Restore a specific file
restic restore latest --target /tmp/restore --include /etc/nginx

# Check repository integrity
restic check

# Test restore (most important step!)
restic restore latest --target /tmp/test-restore
ls /tmp/test-restore
\`\`\`

## Backup Alerts

\`\`\`bash
# Add to backup script - notify on failure
backup_result=$?
if [ $backup_result -ne 0 ]; then
  curl -s -X POST "https://api.telegram.org/bot\${TELEGRAM_TOKEN}/sendMessage" \\
    -d "chat_id=\${CHAT_ID}" \\
    -d "text=❌ Backup FAILED on $(hostname) at $(date)"
else
  curl -s -X POST "https://api.telegram.org/bot\${TELEGRAM_TOKEN}/sendMessage" \\
    -d "chat_id=\${CHAT_ID}" \\
    -d "text=✅ Backup successful on $(hostname)"
fi
\`\`\`

An untested backup is not a backup. Run regular restore tests!`,
  },
  {
    title: 'Proxmox VE: Turn Any PC into a Powerful Home Lab',
    slug: 'proxmox-ve-home-lab-setup',
    excerpt: 'Proxmox VE is a free, enterprise-grade hypervisor that turns any PC into a powerful home lab. Run multiple VMs and containers, manage storage, set up clustering — all from a web UI.',
    category: 'VPS',
    tags: ['proxmox', 'homelab', 'virtualization', 'vps', 'linux'],
    published: true,
    featured: true,
    readingTime: 11,
    publishedAt: new Date('2024-04-25'),
    content: `## What is Proxmox?

Proxmox VE (Virtual Environment) is a complete open-source virtualization platform. It combines KVM virtual machines and LXC containers under one sleek web interface. It's what data centers use — and it's completely free.

## Why Proxmox for Self-Hosting?

- Run multiple isolated services on one machine
- Snapshots — save VM state before risky changes
- Live migration between physical hosts
- Built-in backup scheduler
- ZFS storage support
- Free and open source (paid support optional)

## Installation

Download the Proxmox VE ISO from proxmox.com and write it to a USB drive:

\`\`\`bash
# On Linux/Mac
sudo dd if=proxmox-ve_8.0-2.iso of=/dev/sdX bs=1M status=progress

# Or use Rufus / Balena Etcher on Windows
\`\`\`

Boot from USB and follow the installer. After reboot, access the web UI at:
\`https://your-server-ip:8006\`

## Removing the Subscription Nag

\`\`\`bash
# SSH into Proxmox
sed -i.bak "s/data.status !== 'Active'/false/" \\
  /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js

# Also disable enterprise repo and add community repo
cat > /etc/apt/sources.list.d/pve-enterprise.list << 'EOF'
# deb https://enterprise.proxmox.com/debian/pve bookworm pve-enterprise
EOF

cat > /etc/apt/sources.list.d/pve-no-subscription.list << 'EOF'
deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription
EOF

apt-get update
\`\`\`

## Create Your First VM

1. Click **Create VM** in the top right
2. General: Set name (e.g., \`ubuntu-server\`)
3. OS: Upload an ISO to local storage first, then select it
4. System: Keep defaults (SeaBIOS, i440fx)
5. Disks: 32GB minimum, enable SSD emulation if on SSD
6. CPU: 2 cores minimum
7. Memory: 2048MB minimum
8. Network: Default bridge (vmbr0)
9. Finish and Start

## Create an LXC Container (Lighter than VMs)

For services that don't need a full kernel, LXC containers are faster and use less RAM:

\`\`\`bash
# Download Ubuntu 22.04 LXC template
pveam update
pveam available | grep ubuntu-22
pveam download local ubuntu-22.04-standard_22.04-1_amd64.tar.zst
\`\`\`

Then: **Create CT** → select the template → configure resources.

## Storage: ZFS Setup

ZFS gives you snapshots, compression, and checksumming:

\`\`\`bash
# Create ZFS pool with two drives (mirror)
zpool create tank mirror /dev/sdb /dev/sdc

# Add to Proxmox as storage
pvesm add zfspool tank-storage --pool tank --content rootdir,images
\`\`\`

## Automated Backups

In Proxmox UI: Datacenter → Backup → Add:

\`\`\`
Schedule: Every day at 2:00 AM
Storage: local (or NFS/NAS)
Mode: Snapshot (no downtime)
Compression: zstd
\`\`\`

## Network Configuration

\`\`\`bash
# /etc/network/interfaces
# Create a bridge for VMs to share the physical NIC

auto lo
iface lo inet loopback

auto enp3s0
iface enp3s0 inet manual

auto vmbr0
iface vmbr0 inet static
    address 192.168.1.100/24
    gateway 192.168.1.1
    bridge-ports enp3s0
    bridge-stp off
    bridge-fd 0
\`\`\`

Proxmox is the foundation of any serious home lab. Once you start using it, you'll never go back to running services directly on bare metal.`,
  },
];

async function main() {
  console.log('Seeding database...');

  // Seed categories
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    console.log(`Created category: ${category.name}`);
  }

  // Dynamically generate posts for categories without any
  const existingPostCategories = new Set(posts.map(p => p.category));
  for (const category of categories) {
    if (!existingPostCategories.has(category.name)) {
      posts.push({
        title: `Getting Started with ${category.name}: A Quick Guide`,
        slug: `getting-started-with-${category.slug}`,
        excerpt: `A comprehensive starter guide to understanding, deploying, and self-hosting ${category.name} in your infrastructure.`,
        category: category.name,
        tags: [category.slug, 'guide', 'self-hosting', 'starter'],
        published: true,
        featured: false,
        readingTime: 5,
        publishedAt: new Date(),
        content: `## Exploring ${category.name}\n\nWelcome to our complete guide on **${category.name}**. In this tutorial, we will explore the core concepts, implementation details, and the best ways to self-host it effectively.\n\n### Why ${category.name}?\n\nSelf-hosting ${category.name} allows you to maintain full ownership of your data without relying on third-party cloud architectures. By following the architecture outlined here, you reduce long-term costs while deeply understanding the underlying mechanics.\n\n### Next Steps\n\n1. Ensure your server meets the minimum specs.\n2. Spin up a Docker Compose stack configured correctly for it.\n3. Implement a reverse proxy (like Nginx) and SSL certificates to safely expose it online.\n\n> The most crucial step of self-hosting is taking that first leap! Good luck building your ${category.name} stack.`,
      });
    }
  }

  // Seed posts
  for (const post of posts) {
    const postData = { ...post, tags: JSON.stringify(post.tags) };
    await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: postData,
    });
    console.log(`Created post: ${post.title}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
