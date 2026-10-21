# Maintenance & Recovery Notes — asafetysolutions.com

**Audit date:** 2026-10-21 · **Prepared for:** owner review

This documents what protects the site today, what does not, and what needs a decision. Nothing here was changed without your authorization being required first.

---

## 1. Backups & restoration — mostly covered, with one gap

| Layer | Status | Notes |
|---|---|---|
| Source of truth | **Git repository** (`trendyspenders-hub/KarenSite` on GitHub) | Every change lands as a commit; full history recoverable. Local working copy at `/mnt/agents/output/app` is also commit-clean. |
| Deployment history | **Vercel** keeps every production deployment with instant rollback | Recovery from a bad deploy = one click in the Vercel dashboard, no rebuild needed. |
| **Gap** | **Backups live only in GitHub + this working copy** | If the GitHub account were lost or repo deleted, there is no independent off-platform copy. **Recommended:** export a zip of the repo to Google Drive or similar once per quarter (2 minutes). |

## 2. Security posture

- **Static site** — no server code, no database, no CMS, no plugins. The attack surface is essentially: the GitHub account, the Vercel account, and domain DNS. Keep those credentials unique, and rotate the tokens used in this project (a standing to-do from earlier — the GitHub and Vercel tokens shared during this engagement should be rotated now that work is pausing).
- **Security headers** already configured (`vercel.json`): nosniff, frame protection, referrer policy, permissions policy.
- No dependencies to keep patched (no npm packages ship to production).

## 3. Uptime & monitoring

- **Vercel monitors its own infrastructure** and shows deployment status; there is no separate uptime alerting configured. For a brochure site this is generally acceptable — but if you want proactive alerts, a free uptime monitor (e.g., UptimeRobot pinging the homepage every 5 minutes with email alerts) takes 10 minutes to set up. Owner decision.
- **Form delivery cannot be monitored server-side** — the contact form opens the visitor's own email client (mailto). There is no server, so there is nothing to alert on. The real fix is the already-flagged hosted form endpoint, which would also give you delivery confirmation and failure alerts. Until then, "form monitoring" means: check the inbox daily.

## 4. Update routine (what "maintenance" means for this site)

1. **Content changes** → edit HTML → commit → push → Vercel auto-deploys.
2. **Prices/hours/service areas change** → update the affected pages AND the FAQ/schema if numbers appear there (the comparison table on services.html and the quick-answer boxes must stay in sync).
3. **Quarterly** → off-platform backup zip (see gap above); skim Search Console if set up (per the measurement plan).

## 5. Items this audit deliberately did NOT set up

- **Website search** — deferred by your own guidance: the resource collection is one PDF plus FAQ/glossary links. A search box over five items adds complexity, not value. Revisit when the library has a dozen or more articles.
- **Secure client portal / document upload** — deferred per the brief ("build only when needed"). There is no client document flow today; the confidentiality section on the contact page currently routes sensitive sharing through direct email. If clients start exchanging workplace records regularly, this becomes a real requirement — the right build is a password-protected upload (e.g., a forms provider with file upload over TLS, or a client portal) never plain email attachments.
- **Real project photography** — requires your assets: approved photos of site visits, document reviews, training sessions (no client-identifiable details without written permission). Hand them over whenever ready and they slot into existing image slots.

## 6. Verification status

Verified this session: git remote/history intact, last three commits present, working tree clean, security headers present in `vercel.json`. Not verified (needs your logins): Vercel deployment health for the live site, GitHub branch protection, DNS settings.
