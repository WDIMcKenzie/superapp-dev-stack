# Streaming / 24-7 network playbook

How we build live and always-on (FAST) channels. Pairs with `../stack/README.md` (app + API) and `../hosting/bluehost/README.md` (WordPress marketing).

## When to choose

Any product with live shows, a 24/7 linear channel, or multi-platform go-live — including your own streaming platform and any reseller network running on it.

## Two engines (you need both)

- Live production: an OBS-based encoder → cloud relay → fan-out to platforms + record.
- 24/7 linear playout: a scheduler that loops VOD + live segments into a continuous channel. This is what makes it a network and what FAST platforms ingest.

## Ingest / relay

- From OBS: SRT or WHIP (low latency).
- Managed: Cloudflare Stream Live — SRT/RTMPS in, low-latency HLS out, auto-record, simulcast outputs.
- Self-host at scale: MediaMTX or SRS.
- Social multistream today: Restream.

## 24/7 playout

- Open source (cheap, self-run): ffplayout or CasparCG on a VPS.
- Managed + FAST-ready: Amagi / Wurl / Frequency — also onboards you to Roku/Tubi/Pluto with ad monetization.

## Distribution

- Live social: YouTube, Twitch, Kick, Facebook.
- FAST: Roku, Tubi, Pluto (via a distributor early; direct deals later).
- Owned: our own site player (LL-HLS or WebRTC).

## Latency

SRT/WHIP ingest; WebRTC ≈ sub-second / LL-HLS ≈ 2–4s to our own site. YouTube/Twitch/FAST add their own pipeline latency.

## Multi-tenant

Every tenant (network) gets its own channel(s), shows, schedule, talent, and branding, isolated by `tenant_id` with row-level security. Resellers can own child tenants. See the platform `schema.sql`.

## Split-stack

Marketing site = WordPress on Bluehost. App + streaming = this cloud stack.
