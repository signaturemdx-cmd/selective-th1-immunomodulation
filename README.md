# Selective Th1 Immunomodulation — Nextab, Inc. Antibody Research Website

Static GitHub Pages site (single `index.html`, no build step, no external JavaScript libraries, fonts, tracking scripts or client-side secrets).

Live: https://signaturemdx-cmd.github.io/selective-th1-immunomodulation/ (English default)
Korean: https://signaturemdx-cmd.github.io/selective-th1-immunomodulation/?lang=ko

## Structure
1. Hero — platform hypothesis, with the 3D antibody / Th1-cell visualization (`assets/hero-th1.mp4`)
2. 01 Unmet need in current autoimmune treatment
3. 02 Activated Th1 platform thesis (IL-12 → T-bet → IFN-γ → macrophage / cytotoxic tissue injury)
4. 03 Preclinical evidence — five interactive charts (patent-backed mouse-cell / ex vivo summaries)
5. 04 AIH proof-of-concept model and indication-expansion hypotheses (7 indications)
6. 05 Current standard treatments, treatment burdens and selected 2025 market estimates (7 diseases, sources)
7. 06 Antibody technology — NT1-1 / KLRC1, NT1-29 / EOMES, KLRA5 tabs
8. 07 Post-investment development plan
9. 08 Intellectual property — KR 10-2542075 and diligence items
10. 09 News & Notice — card grid fed by the `NEWS_ITEMS` array in the page script
11. Partnership — B2B / investment / research inquiry form (`#partnership`)
12. Disclaimer — official public legal notice (`#disclaimer`) and footer

## Assets
- `assets/hero-th1.mp4` — hero visualization loop, 1024×586 H.264 (yuv420p, `+faststart`, no audio, ~1 MB), muted autoplay with `loop` and `playsinline`.
- `assets/hero-th1.jpg` — poster frame (1024×586) shown before the video loads or when autoplay is blocked; the clip is paused entirely under `prefers-reduced-motion`.

## Language
- `EN | KO` buttons in the header, `?lang=ko` / `?lang=en` URL parameter, and `localStorage` key `nextab.th1.lang` (default `en`).
- English text lives in the markup; Korean text sits in `data-ko` attributes (plus `data-ko-aria-label` / `data-ko-placeholder`). The script swaps `innerHTML` on every `[data-ko]` element, so one element carries one translation. Do not nest `data-ko` elements: a parent's translation replaces its children's.
- Text added inside `#target-detail` or `#news-grid` comes from the `TARGETS` / `NEWS_ITEMS` objects in the script; both languages must be supplied there.
- Verification standard: English mode 0 Hangul characters; Korean mode no untranslated English sentences (proper nouns and publisher names stay in Latin script).

## Inquiry form
- `#partnership` posts to FormSubmit (`https://formsubmit.co/signaturemdx@gmail.com`), with an email-app (`mailto:`) and copy-to-clipboard fallback and a `?sent=1` confirmation banner.
- FormSubmit sends a one-time activation email to the recipient address the first time a form is used. Until that link is clicked, submissions are not delivered.
- Company identity on the page is `Nextab, Inc.` only — no named representative or contact person.

## Market data caveat
Third-party market figures are estimates with differing definitions and geographic coverage. They are shown as market context, not a summed TAM or a forecast for this platform. The AIH figure is for seven major markets; the T1D figure is the overall insulin market (the source reports T1D as 78.4% of application revenue); Hashimoto and celiac figures include treatment categories that are not disease-modifying biologics.

## Open items before investor or scientific distribution
- Confirm patent numbers, ownership and claim scope with IP counsel; complete freedom-to-operate review.
- Confirm target and mechanism wording with the inventors (ITIM / SHP-1/2 remains a research question).
- Activate the FormSubmit address once, then send a test inquiry and confirm delivery.
- Keep mouse-cell / ex vivo data clearly distinguished from human and in vivo efficacy.

## Security
Static front-end only. No backend, database, authentication or secret credentials are included; the only outbound request is the FormSubmit POST when a visitor submits the inquiry form.
