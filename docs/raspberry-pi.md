# Raspberry Pi CM5 deployment

Yes—this app can run on a Raspberry Pi Compute Module 5 and be reachable only by devices on your Tailscale network.

The privacy boundary is deliberately simple:

1. Docker publishes the app only on the Pi's loopback interface (`127.0.0.1:3001` by default). It is not directly reachable from the LAN.
2. Tailscale Serve accepts HTTPS connections from your tailnet and proxies them to that loopback address.
3. Tailscale Funnel is never enabled, so the service is not published to the internet.

## Prerequisites

- 64-bit Raspberry Pi OS or another ARM64 Debian-based distribution.
- Docker Engine with the Compose plugin.
- Tailscale installed, connected, and visible in your tailnet.
- HTTPS enabled for the tailnet when Tailscale prompts for it.

## If `docker: command not found`

Docker is not installed yet. On 64-bit Raspberry Pi OS, use Docker's Debian repository:

```bash
sudo apt update
sudo apt install -y ca-certificates curl

sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources > /dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Start Docker and verify it:

```bash
sudo systemctl enable --now docker
sudo docker run hello-world
docker compose version
```

Optional: allow your user to run Docker without typing `sudo`:

```bash
sudo groupadd docker 2>/dev/null || true
sudo usermod -aG docker "$USER"
newgrp docker
docker run hello-world
```

The `docker` group has root-equivalent access to the host, so only add trusted users.

If the Pi is running Ubuntu Server instead of Raspberry Pi OS, use Docker's Ubuntu repository instructions rather than the Debian repository URL above.

## Build and start

From the project directory on the Pi:

```bash
docker compose up -d --build
docker compose ps
```

The Docker image is architecture-neutral at the source level. Building it on the CM5 automatically uses the native Linux ARM64 Node image.

Verify the app from the Pi itself:

```bash
curl --fail http://127.0.0.1:3001
```

## Port behavior

This app defaults to host port 3001 because port 3000 is reserved for another local service on this CM5. The container still listens on port 3000 internally; Docker Compose maps the Pi's loopback port 3001 to the container's internal port 3000.

The `compose.yaml` file should contain:

```yaml
- "127.0.0.1:${HOST_PORT:-3001}:3000"
```

If you ever need to run this app on a different loopback port, set `HOST_PORT`:

```bash
HOST_PORT=3010 docker compose up -d --build
curl --fail http://127.0.0.1:3010
```

For a permanent Pi-local override, create a project-local `.env` file:

```bash
echo 'HOST_PORT=3010' > .env
docker compose up -d --build
```

You do not need to change the `Dockerfile` for host port changes.

If Compose still tries to bind `127.0.0.1:3000`, the Pi likely does not have the latest `compose.yaml`. Run:

```bash
git pull
grep HOST_PORT compose.yaml
```

If a port conflict happens on the new default port, check what owns it:

```bash
sudo ss -ltnp | grep ':3001'
```

If you still need `sudo` for Docker commands, prefer the `.env` file approach so Compose sees `HOST_PORT` reliably.

## Publish to the tailnet only

Run this once on the Pi:

```bash
sudo tailscale serve --bg --https=443 http://127.0.0.1:3001
```

Tailscale prints the private `https://<machine-name>.<tailnet>.ts.net` address. Open that URL from any authenticated device on the same tailnet.

Check or remove the proxy configuration with:

```bash
tailscale serve status
sudo tailscale serve reset
```

Do not run `tailscale funnel` for this app. Funnel is the separate feature that makes a service public.

## Restrict it further with Tailscale ACLs

Tailscale Serve limits access to the tailnet. If the tailnet contains other people or tagged devices that should not see the app, add a Tailscale access rule that permits TCP 443 on this CM5 only from your user or a dedicated group. Keep the rule in the tailnet policy file so the access decision is reviewable.

## Updating the app

After making changes on another machine and pushing them, update the running Pi copy from the project directory:

```bash
git pull
docker compose up -d --build
docker compose ps
curl --fail http://127.0.0.1:3001
```

If you intentionally overrode the host port with `.env`, use that same port in the curl and Tailscale Serve commands.

Refresh Tailscale Serve only when the local port changed, or when you want to reset the proxy explicitly:

```bash
sudo tailscale serve reset
sudo tailscale serve --bg --https=443 http://127.0.0.1:3001
tailscale serve status
```

If the local port did not change, Tailscale Serve continues pointing at the same loopback address and the private URL stays the same. After successful updates, you can remove unused old images:

```bash
docker image prune -f
```

## Operational notes

- No database is required in this first release; the content is versioned with the app.
- Back up the Git repository or project directory. The running container contains no unique data.
- The container runs as a non-root user, drops Linux capabilities, uses a read-only filesystem, and exposes only one loopback-bound port.
