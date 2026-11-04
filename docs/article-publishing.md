# Article publishing

This document is the publishing contract for adding an article to Zephyr. It also contains a reusable prompt for handing an article to another AI.

## File location

Publish English Markdown files under:

```text
src/content/entries/{section}/{slug}.md
```

The supported section values are:

- `weekly`
- `work`
- `elsewhere`

The filename supplies the final URL slug. Use lowercase words, numbers, and hyphens.

## Frontmatter

Use this structure:

```md
---
section: weekly
title: "Article title"
description: "A concise inventory of the article's central subjects."
publishedAt: "2026-11-04"
topic: "Design & engineering"
featured: false
draft: false
---
```

Optional fields:

- `updatedAt` for a meaningful revision date.
- `topic` for grouping entries in Elsewhere.
- `cover` for Work images, with `src`, `alt`, `width`, and `height`.

The schema accepts descriptions from 40 to 180 characters.

## Images and captions

Publish article images with standard Markdown syntax:

```md
![Descriptive alt text](/images/example.jpg "Optional visible caption")
```

Local images under `public/images/` receive these features automatically:

- A frame whose tint comes from the image's dominant color.
- Intrinsic width and height attributes.
- Lazy loading and asynchronous decoding.
- A keyboard-accessible Expand control.
- A native dialog that shows the original image at a larger size.

Use the Markdown title only when the image needs a visible caption. Use the alt text to describe the image for assistive technology.

## Description contract

The description appears in section lists, homepage lists, RSS, and search metadata. The current descriptions were written manually. Their editorial pattern is:

- Use one compact sentence or noun-phrase inventory.
- Aim for 10 to 18 words and 80 to 140 characters.
- Name the central product or organization when it is essential context.
- Summarize 2 to 4 recurring subjects from the article.
- Order subjects by prominence in the article.
- Prefer concrete topic phrases over generic claims.
- End with one period.
- Keep the description on one line.
- Preserve the article's language.
- Introduce no facts that the article does not support.

Use a topic inventory:

```text
Notes on technical architecture, deliberate design, AI evaluation, and natural conversation.
```

When a named product organizes the article, lead with it:

```text
Manus product experiments, model collaboration, and engineering skills for thinking, design, research, and review.
```

Avoid these patterns:

```text
This article explores several important ideas.
In this post, I discuss design and technology.
A comprehensive summary of recent work.
```

## Description generation procedure

1. Read the title, all H2 headings, the introduction, and the conclusion.
2. List the named products, tools, people, and recurring concepts.
3. Select the 2 to 4 subjects that organize most of the article.
4. Convert those subjects into compact noun phrases.
5. Lead with a named product when it is the article's primary frame.
6. Join the phrases with commas and one final `and`.
7. Check the result against the article and remove any unsupported claim.
8. Confirm the description stays within 40 to 180 characters.

## Copy-ready AI prompt

Give this prompt to another AI together with the article:

```text
Publish this article for the Zephyr Markdown collection.

Return valid frontmatter followed by the original Markdown body.

Requirements:
- section must be one of: weekly, work, elsewhere.
- title is the article title.
- publishedAt uses YYYY-MM-DD.
- topic is optional and is used for Elsewhere grouping.
- drafts use draft: true.
- Write description as one compact noun-phrase inventory.
- description must be 10 to 18 words, 80 to 140 characters when practical, and never outside 40 to 180 characters.
- Name the central product or organization when it is essential context.
- Summarize 2 to 4 recurring subjects in article order.
- Use concrete phrases from the article.
- End description with one period.
- Do not use phrases such as "This article explores" or "In this post".
- Introduce no facts that the article does not support.
- Keep the body unchanged unless I explicitly request editing.

Current description examples:
1. Notes on technical architecture, deliberate design, AI evaluation, and natural conversation.
2. Manus product experiments, model collaboration, and engineering skills for thinking, design, research, and review.
```
