# tim.aidley.com

A [Timber](https://github.com/TimAidley/Timber) site: a git-backed static website with an
in-browser editor at `/<repo>/edit/`. Ported from the Hugo site that previously lived at
[`TimAidley/timaidley.github.io`](https://github.com/TimAidley/timaidley.github.io).

## Layout

- **`content/`** — every object is a folder with an `index.md` (front matter + Markdown
  body) and its own colocated images.
  - `content/pages/` — home, posts index, portfolio, about
  - `content/posts/` — the blog
  - `content/projects/` — the 29 portfolio entries
  - `content/settings/` — site-wide settings (title, bio, social links, copyright)
- **`config/schemas/`** — the content types. **`config/navigation.yml`** — the top nav.
- **`themes/anatole/`** — the theme: Liquid templates + SCSS, ported from the
  [modified anatole theme](https://github.com/TimAidley/anatole) the Hugo site used.
- **`assets/`** — site-wide uploads (profile picture).
- **`.github/workflows/`** — build/deploy to GitHub Pages, plus one-time broker setup.

## How the Hugo site maps onto this one

| Hugo | Here |
| --- | --- |
| `hugo.toml` `[params]` | `content/settings/index.md` |
| `[menu.main]` | `config/navigation.yml` |
| `content/posts/*.md` (TOML front matter) | `content/posts/<slug>/index.md` (YAML) |
| `data/portfolio.yml` (29 records) | `content/projects/<slug>/index.md` × 29 |
| `layouts/**/*.html` (Go templates) | `themes/anatole/templates/*.liquid` |
| `assets/scss/**` | `themes/anatole/assets/_sass/**` (compiled by Timber) |
| `{{< figure >}}` shortcode | `:::figure{layout="…" size="…"}` directive |
| `draft = true` | absence of `public: true` |

Post URLs are unchanged (`/posts/<slug>/`), as are `/portfolio/` and `/about/`.

Hugo picked a template per section; Timber resolves templates by content *type*, so
`content/pages/*` carries a `layout` field (`home`, `archive`, `portfolio`, `plain`) that
selects which body `templates/pages.liquid` renders.

## Local build

```sh
git clone https://github.com/TimAidley/Timber .timber
cd .timber && pnpm install && pnpm --filter "@timber/cli..." build && cd ..
node .timber/packages/cli/dist/index.js build . _site
```

`validate` instead of `build` checks the content without writing anything.

## Setup

All setup instructions — register a GitHub App, deploy the OAuth broker, enable the
editor — live in one place: **Timber's
[`INSTALL.md`](https://github.com/TimAidley/Timber/blob/main/INSTALL.md)**.
