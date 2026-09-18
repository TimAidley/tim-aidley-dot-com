---
id: de37c7b1-17c1-4495-b16c-598d8a257ab5
title: :timber-logo - a new static site generator
created: 2026-08-03T15:01:30.596Z
---

:timber-logo is a new static site generator I have been working on, and, it is now responsible for generating this site; up until recently it had been using [Hugo](https://gohugo.io).

## Why another static site generator?

Static site generators are great for fairly small sites that have content that doesn't change very much. If your site doesn't have to present data from a database, there's no need to generate the pages every time someone asks for them; just generate them all ahead of time, and just pass them over to the browser when asked.

Because serving these pages is so simple, there are a bunch of places like Github and Cloudflare that will serve up static sites for free, as it costs them so little.

A static site generator takes a set of content files written in markdown and generates the html for a site from them. If you store those markdown files in a github repo, you can set it up so that it will run the site generation code every time a file is changed, and automatically update the pages on the website.

## Missing the ease of Wordpress

I liked using Hugo as a static site generator for my site, but I kinda missed being able to just edit my pages in a web browser, like you can with [Wordpress](https://wordpress.org/). It's nice to be able to add a post from anywhere without having to install the site generator on the computer, clone the repo, and make changes. In theory you can just go and edit the markdown directly on github, but then you don't get a preview of what it would look like.

Any why not use Wordpress? It's a dynamic site, which means you need to find a hosting solution to run it. Also, it annoys me that in Wordpress you get two kinds of item (Pages and Posts), and nothing else, and if you want to define a new kind of item, you need to download or write a plugin for it.

Now, Wordpress is tremendously powerful and runs some vast proportion of the world's websites, but I wanted something a little different.

## The core idea - run the site generator in a browser

As I thought about my desire to have a static site generator with the ease of use of Wordpress, I realized it might be possible to run a static site generator _within_ the browser. The repository could be cloned in to a RAM filing system, and the site generator run on that, generating the preview pages as needed.

I got an LLM to try prototyping the system. First we tried to get some site generators written in typescript or javascript to run in the browser, but it never quite worked, mainly because they would normally rely on some node library that couldn't run in browser. We also tried running a generator in a webassembly-based virtual machine, but again, no luck. I realized that if I wanted something like that I would probably have to ~~write it myself~~ get an LLM to write something for me.

# :timber-logo : The browser-based static site generator.

:timber-logo is split in to two main parts - the generator and the editor.

**For the generator:**

- It is a static site generator designed to be runnable in the browser and standalone using node.
- Pages are written in Markdown along with some front matter at the start, much like most of the other static site generators.
- Templates are written in LiquidJS, much like Jekyll and Eleventy.
- Has some computed collection aliases to provide compatibility with Jekyll and LiquidJS-based Eleventy themes.
- Supports collections of any kind of object the user wants - they are not limited to pages and posts.
- Supports multi-language sites, so you can have multiple translations of a single page.
- Pages can be marked draft, which will prevent them being built in to the site until they are ready.

The generator itself is nothing particularly special - it's main special sauce is that everything it needs can be run in a browser; the real magic behind :timber-logo is the editor.

**The editor:**

- Clones the repository in to memory
- Presents an interface that allows creation and editing of any content on the site, as well as the templates, settings, themes files etc.
- Constantly rebuilds the page you are working after every change to provide a live preview window.
- The editor uses the [Milkdown](https://milkdown.dev/) markdown rich text editor for a WYSIWYG editing experience.
- Supports image embedding and placing
- Saves all changes to local storage immediately, so the browser crashing, you closing the tab, or refreshing the page will not lose your work.&#x20;
- After a few seconds it will also commit those changes to a git branch `<user>_WIP` on the git repository, so they are safe from something happening on your computer, or if you want to continue working on your document from somewhere else.
- The 'Publish' button rebases the `<user>_WIP` branch on to `main`, and triggers the publish action on the host (GitHub, Collabra, GitLab, Gitea).
- Authentication is handled by the hosting provider itself, and there are several ways of setting that up (OAuth, device flow, PAT token)
