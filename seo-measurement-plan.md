# SEO Measurement Plan — asafetysolutions.com

**Prepared:** 2026-10-21 · **Owner:** Karen Alcantara · **Status:** pending owner setup — nothing has been installed or claimed

---

## 1. What to measure

| Metric | Tool | Why it matters |
|---|---|---|
| Organic search queries | Google Search Console | Shows the real searches your pages appear for, and click-through |
| Indexed pages / indexing problems | Search Console (Pages report) | Confirms Google can crawl and index all 33 public pages |
| Organic landing pages | Search Console + GA4 | Which pages actually attract visitors from search |
| Qualified enquiries | GA4 event `generate_lead` | The one metric that pays for the rest |
| Telephone-link clicks | GA4 event | Secondary lead signal |
| Email-link clicks | GA4 event | Secondary lead signal |

**Not measured:** contact-form submit-button clicks are *not* treated as successful enquiries — the form opens the visitor's own email client, so a click can occur without any email being sent. Only a reply in your inbox (or an eventual hosted-form confirmation) counts as a lead. No booking system exists, so nothing is measured there.

## 2. Setup steps for the owner (approx. 1 hour)

Everything below is free and uses the existing Google account.

### A. Google Search Console
1. Go to [search.google.com/search-console](https://search.google.com/search-console).
2. Add a **Domain property** for `asafetysolutions.com` (covers www/non-www and http/https in one). Verify via a DNS TXT record — Vercel's DNS panel (where the domain is managed) has a place to add it.
3. Once verified, open **Sitemaps** → submit `sitemap.xml` (the site already declares it in robots.txt, but submitting accelerates discovery).
4. Check **Pages** after ~1 week for indexing errors.

### B. GA4 (Google Analytics 4)
1. Go to [analytics.google.com](https://analytics.google.com) → create an account/property for the business.
2. Create a **Web data stream** for `https://asafetysolutions.com`.
3. Copy the measurement ID (`G-XXXXXXXXXX`).
4. **Stop here and hand the ID to whoever deploys the site.** Installation requires editing the HTML of every page (or adding one snippet to a shared script file). The site currently has **no analytics installed**, so there is no risk of duplicate tracking.
5. Consent: the site's cookie-consent banner exists today. Analytics tags should fire only after the visitor accepts analytics cookies — the banner's "Accept" handler is the right hook. Declining must leave the site fully functional with zero tracking.

### C. The four events to configure once GA4 is installed

| Event name | Trigger | Notes |
|---|---|---|
| `generate_lead` | Successful enquiry only | Until a hosted form with a real confirmation exists, this can only fire from the thank-you flow — do not wire it to the submit button |
| `click_tel` | Click any `tel:` link | Top bar and contact page |
| `click_email` | Click any `mailto:` link | Top bar, contact page, form |

Until a hosted form endpoint exists (see section 4), the honest set is: **phone clicks, email clicks, and enquiry volume read manually from the inbox.** That is enough to judge whether SEO work is producing leads.

## 3. Reading the data

- **Months 1–2:** indexing coverage and query impressions only. A new or freshly-relaunched site rarely clicks much before it is fully indexed.
- **Month 3+:** watch impressions → clicks → landing pages, in that order. Rising impressions on city pages (e.g. "safety plan Burnaby") is the earliest signal the structure is working.
- **Quarterly:** note which service pages get impressions but few clicks — those titles/descriptions are the first candidates to rewrite.

## 4. Known measurement gap (needs a decision, not authorization)

The contact form currently opens the visitor's email client. That means:
- no reliable conversion event exists,
- enquiries depend on the visitor actually sending the prefilled email,
- there is no confirmation page the visitor sees.

Fixing this properly means a hosted form endpoint (e.g. Formspree, a Vercel serverless function sending email, or a CRM form) that shows a real success state — which also satisfies the outstanding "submission confirmation" item. That is a deliberate change to the protected form and needs your explicit go-ahead before any work happens.

---

*No credentials are stored in this document. If any step asks for a token or key, it belongs in a password manager, not in the site or this file.*
