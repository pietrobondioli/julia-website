# Cases Content Guide

## How to create a new case
1. Copy `_template.pt.md` and `_template.en.md`
2. Use same `slug` in both files
3. Set `tier`:
   - `A` for hero case (full narrative)
   - `B` for medium depth
4. Set `featured: true` for highlighted projects
5. Set `order` (lower appears first)

## Naming convention
- PT file: `<slug>.pt.md`
- EN file: `<slug>.en.md`

Example:
- `sanchez-rebranding.pt.md`
- `sanchez-rebranding.en.md`

## Categories used
- `branding`
- `social-media`
- `campaign`
- `audiovisual`
- `photography`
- `event`
- `research`

## All projects (15 total)

| # | Slug | Featured | PT File | EN File |
|---|------|----------|---------|---------|
| 1 | `sanchez-rebranding` | ✅ | `sanchez-rebranding.pt.md` | `sanchez-rebranding.en.md` |
| 2 | `cinemark` | ✅ | `cinemark.pt.md` | `cinemark.en.md` |
| 3 | `the-body-shop` | ✅ | `the-body-shop.pt.md` | `the-body-shop.en.md` |
| 4 | `vital-fresh` | ✅ | `vital-fresh.pt.md` | `vital-fresh.en.md` |
| 5 | `paraisopolis-site` | ✅ | `paraisopolis-site.pt.md` | `paraisopolis-site.en.md` |
| 6 | `aura` | | `aura.pt.md` | `aura.en.md` |
| 7 | `analise-semiotica-takis` | | `analise-semiotica-takis.pt.md` | `analise-semiotica-takis.en.md` |
| 8 | `here-i-go-again` | | `here-i-go-again.pt.md` | `here-i-go-again.en.md` |
| 9 | `natural-flow` | | `natural-flow.pt.md` | `natural-flow.en.md` |
| 10 | `oba-hortifruti` | | `oba-hortifruti.pt.md` | `oba-hortifruti.en.md` |
| 11 | `app-brasil` | | `app-brasil.pt.md` | `app-brasil.en.md` |
| 12 | `jogos-universitarios-comunicacao-2024` | | `jogos-universitarios-comunicacao-2024.pt.md` | `jogos-universitarios-comunicacao-2024.en.md` |
| 13 | `semana-publicidade-2024` | | `semana-publicidade-2024.pt.md` | `semana-publicidade-2024.en.md` |
| 14 | `freelancer` | | `freelancer.pt.md` | `freelancer.en.md` |
| 15 | `fotografia-mulheres-puc` | | `fotografia-mulheres-puc.pt.md` | `fotografia-mulheres-puc.en.md` |

## Gallery paths
Gallery entries reference raw asset filenames under `/media/<slug>/...`. These are
source-relative references — media files have NOT been copied into `web/public/` yet.

## Filling narrative text
Every case file has placeholder sections (`[Describe...]`). Replace these with
actual content. The sanchez files have example narrative written. See
`_template.pt.md` and `_template.en.md` for the section guide.

## Regenerating cases
Run `node scripts/generate-cases.mjs` from the repo root to regenerate.
The script preserves any existing narrative body text (only updates frontmatter).
