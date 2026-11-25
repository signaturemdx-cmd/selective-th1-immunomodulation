# Publication review checklist

Last reviewed: 2026-11-25 (EN/KO edition, News & Notice, inquiry form, public disclaimer)

## Company and contact
[x] Company name `Nextab, Inc.` shown in header, partnership block and footer
[x] No named representative or contact person on the page
[x] Public contact route: `signaturemdx@gmail.com` (FormSubmit form, `mailto:` and copy fallback)
[ ] FormSubmit address activated once and a test inquiry confirmed as delivered

## Scientific and translational positioning
[x] AIH is described as the initial experimental model, not the platform's sole indication
[x] Strict Th1-driven rationale is distinguished from mixed Th1/Th17 or antibody-dominant disease
[x] NT1-1 / KLRC1 target mechanism is described as a research question, not an established ITIM / SHP-1/2 mechanism
[x] Mouse ex vivo observations are not presented as human or in vivo efficacy
[x] Humanized antibody development and human PBMC-derived activated Th1 studies are clearly future work
[x] No steroid-replacement or clinical efficacy claim is made
[x] Author-facing review instructions in the markup replaced by declarative public boundary statements

## Experimental charts
[x] 4,300 / 150 / 80 / 60 / 40 / 30 values are identified as relative mouse immune-cell gene-expression patent-figure approximations
[x] 130 / 4 / 3 / 4 / 3 values are identified as patent-figure approximations and PCR / FACS summary
[x] 218.4 → 141.9 is distinguished from the simplified 115 / 250 / 115 chart
[x] AIH ex vivo values 250 / 245 / 160 / 120 are shown as relative signal, not animal efficacy
[x] Th1 5.7 / Th17 0.7 is labelled mouse-cell patent-figure approximation

## Market and treatment landscape
[x] Market estimates are attributed to publishers and base year
[x] Geographic scope disclosed (AIH 7MM; PBC publisher variation)
[x] Existing treatment markets are not represented as platform TAM
[x] Current standard treatments and limitations are described
[x] No suggestion that the investigational antibody replaces insulin, levothyroxine or gluten-free diet

## Bilingual release
[x] EN mode contains no Korean characters; KO mode contains no untranslated English sentences
[x] `EN | KO` toggle, `?lang=` parameter and `localStorage` persistence verified
[x] Desktop 1440 px and mobile 390 px: no horizontal overflow, no console errors

## IP and security
[ ] Patent titles, numbers, claims, owners and jurisdictions verified
[ ] Freedom-to-operate review completed
[x] No API keys, passwords, database credentials, tokens or confidential unpublished data in source
[x] Deployed source and network requests inspected (only the FormSubmit POST leaves the page)
[x] HTTPS, mobile layout and accessibility checked

## Access gate (2026-11-25)
[x] Entry screen `#access-gate`: image-free deep slate emerald solid, sage / ivory type, 100dvh
[x] Code checked as a SHA-256 digest (`crypto.subtle` with a pure-JS fallback); the plain code is not in the source
[x] `<header>` / `<main>` / `<footer>` hidden until unlock; hero video starts only after unlock
[x] Session key `nextab_th1_unlocked_v1` (separate from the ALVORA LAB site)
[ ] Note: this is a client-side preview gate. The page source still contains the full text for anyone
    who downloads it, and a 4-digit code has only 10,000 SHA-256 preimages, so the gate controls
    casual viewing, not access to confidential data. Do not place unpublished confidential material
    behind it and treat the content as non-public only by agreement.
