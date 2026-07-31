# Notes for AI assistants working in this repo

This is **tim.aidley.com**, a [Timber](https://github.com/TimAidley/Timber) site: a
git-backed static site whose content is normally edited in a browser CMS at
`/<repo>/edit/`. `main` holds source only — never built HTML. A GitHub Action builds and
deploys it. It was ported from a Hugo site, so some of the shapes below exist to preserve
the old URLs.

**Read [`AUTHORING.md`](AUTHORING.md) before writing or editing anything under
`content/`.** The rest of this file is the short version.

## The thing that will catch you out

Content files are normally written by the editor, which serialises them in one exact form:

```
---
<yaml front matter>
---

<markdown body>
```

— including the **blank line after the closing `---`, even when there is no body**.

If you hand-write an `index.md` whose bytes differ from that (different YAML quoting, a
hand-wrapped long value, a missing blank line), the file is still valid and the site builds
fine, but **the editor will show the object as modified the moment it loads it**, and
reverting won't clear it. This is the single most common way to break a Timber site's
editing experience without breaking the site.

So: **after any change under `content/`, run `timber fmt .`** — or generate the file with
`serializeDocument` from `@timber/generator` in the first place, which is correct by
construction.

## Checks to run before you commit

```sh
timber validate .     # schemas, required fields, references, duplicate ids
timber fmt --check .  # every object matches what the editor writes
```

Both must pass. CI runs them on pull requests and on pushes to branches other than `main`
and `*_wip`.

## Conventions worth knowing

- **One folder per object**, containing `index.md` and its own images. The folder name is
  the slug and drives the URL.
- **Draft by default.** An object without `public: true` will not appear on the site. Don't
  add `public: true` to something the user didn't ask to publish.
- **`id` is identity.** Reference fields and `config/navigation.yml` point at ids, so
  changing one breaks links. Renaming a folder is fine (it changes the URL); changing an
  `id` is not.
- **Fields are schema-defined.** Check `config/schemas/<type>.yml` before inventing a
  front-matter key. Undeclared keys pass through rather than erroring, so a typo fails
  silently — it just never renders.
- **Don't commit built HTML.** There is no `_site/` in git; the Action builds it.
- **Don't edit `themes/<name>/` to change content**, or `content/` to change layout. The
  theme is Liquid templates + CSS; the content is data.

## This site's content types

Four types, defined in `config/schemas/`:

| Type | URL | Notes |
| --- | --- | --- |
| `posts` | `/posts/<slug>/` | The blog. `title` + `date` required. `description` is the summary shown on the home page **and** the meta description — it is a field, not a `<!--more-->` divider. |
| `pages` | `/<slug>/` | Standalone pages. **`layout` is required** — see below. |
| `projects` | `/projects/<slug>/` | The 29 portfolio entries. `hasBody: false`, so the text lives in the `description` field, not a Markdown body. |
| `settings` | — | Singleton, `page: false`. Site title, bio, social links, copyright. |

**`pages.layout` is the thing to get right.** Timber picks a template by content *type*, so
all four pages render through `themes/anatole/templates/pages.liquid`, and the `layout`
field selects which body it renders:

- `home` — the recent-posts listing (this page has no body of its own)
- `archive` — every post grouped by year, at `/posts/`
- `portfolio` — the projects listing with its sort control, at `/portfolio/`
- `plain` — body only

A new page almost always wants `plain`. Adding a second `home` or `archive` page will
render two of them, not replace the first.

Other things specific to this site:

- **Post slugs are load-bearing.** `/posts/introducing-the-picomachine/`,
  `/posts/new-portfolio/` and `/posts/trying-out-hugo/` carry over from the Hugo site.
  Renaming a folder changes a live URL.
- **Nav is by id.** `config/navigation.yml` points at `PAGE-HOME`, `PAGE-POSTS`,
  `PAGE-PORTFOLIO`. Changing one of those ids empties a nav entry.
- **The About page is deliberately a draft** (no `public: true`), as it was under Hugo.
  Don't publish it without being asked.
- **Images are colocated.** A post's images sit in its own bundle folder and are referenced
  by bare filename (`![Alt](keyboard.jpg)`), not by an `/assets/...` path. Only site-wide
  files (the profile picture) live in `assets/`.
- **The theme is a port of anatole.** Its SCSS lives in `themes/anatole/assets/_sass/` and
  is compiled by Timber; `themes/anatole/assets/anatole.scss` is the entry point. Icons are
  inline SVG in `templates/icons.liquid` — there is no icon font, so don't add
  `<i class="fa ...">` markup.

## Branches

- `main` — the live site.
- `<login>_wip` — the browser editor's working branch. **Leave it alone**; the editor owns
  it and rewrites it. Pushing to someone's WIP branch will conflict with their session.
