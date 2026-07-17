# Raspberry Pi CM5 deployment

Yes—this app can run on a Raspberry Pi Compute Module 5 and be reachable only by devices on your Tailscale network.

The privacy boundary is deliberately simple:

1. Docker publishes the app only on the Pi's loopback interface (`127.0.0.1:3000`). It is not directly reachable from the LAN.
2. Tailscale Serve accepts HTTPS connections from your tailnet and proxies them to that loopback address.
3. Tailscale Funnel is never enabled, so the service is not published to the internet.

## Prerequisites

- 64-bit Raspberry Pi OS or another ARM64 Debian-based distribution.
- Docker Engine with the Compose plugin.
- Tailscale installed, connected, and visible in your tailnet.
- HTTPS enabled for the tailnet when Tailscale prompts for it.

## Build and start

From the project directory on the Pi:

```bash
docker compose up -d --build
docker compose ps
```

The Docker image is architecture-neutral at the source level. Building it on the CM5 automatically uses the native Linux ARM64 Node image.

Verify the app from the Pi itself:

```bash
curl --fail http://127.0.0.1:3000
```

## Publish to the tailnet only

Run this once on the Pi:

```bash
sudo tailscale serve --bg --https=443 http://127.0.0.1:3000
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

After pulling or copying a new version to the Pi:

```bash
docker compose up -d --build
docker image prune -f
```

Tailscale Serve continues pointing at `127.0.0.1:3000`, so the private URL stays the same.

## Operational notes

- No database is required in this first release; the content is versioned with the app.
- Back up the Git repository or project directory. The running container contains no unique data.
- The container runs as a non-root user, drops Linux capabilities, uses a read-only filesystem, and exposes only one loopback-bound port.
