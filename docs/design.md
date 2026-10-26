Visual design

- Identity: The Zephyr wordmark links to the homepage.
- Appearance: A single light palette uses shared color and spacing tokens.
- Scroll chrome: The reading viewport and local navigation hide native scrollbars while preserving wheel, trackpad, keyboard, and touch scrolling.
- Layout: Desktop articles place an entry list beside the reading column and an H2 outline on the right.
- Alignment: Header and reading layout share a 1440px container with 40px desktop gutters; entry text aligns with the wordmark, capsule backgrounds extend into a reserved 12px gutter, and the middle track absorbs extra width.
- Article start: The visible article begins with its content; the title remains available as a hidden semantic heading.
- Header: The border remains hidden at the top and appears after the reading surface starts scrolling.
- Contact: A Contact entry follows GitHub and shares the same text treatment and lighter hover color; it opens an email draft through the visitor's configured mail handler, addressed to the email in site configuration.
- Hierarchy: Type, gray values, alignment, and space distinguish content from navigation.
- Typography: Self-hosted JetBrains Mono and comfortable line spacing establish a consistent reading rhythm.
- Images: Project covers provide descriptive alt text and explicit dimensions.

Navigation and reading

- Sections: Selecting Weekly, Life, or Project scopes the sidebar to that section; section indexes do not repeat the navigation label as a page heading.
- Homepage: The left sidebar stays empty while the main column introduces recent notes and projects.
- Grouping: Weekly entries use year groups, Life entries use topics, and Project entries form one list.
- Sidebar selection: Year toggles use full capsule backgrounds; the current article uses stronger text without a hover background or Dock motion.
- Routes: Native article links support sharing, reloads, and browser history.
- Outline: Second-level article headings generate matching anchors and outline links; H3 headings remain body structure without outline entries.
- Outline placement: The right-aligned outline stays at the vertical center of the viewport below the header, in a fixed layer outside the elastic scrolling content.
- Reading focus: Long articles follow the header reading line; short articles map otherwise unreachable headings continuously across the available scroll range. Anchor clicks select their exact heading.
- Outline motion: Desktop outline chips follow two-dimensional pointer proximity with a 12 percent Dock-style scale and a 3px lift.
- Outline selection: The active heading changes to the stronger foreground color without a hover background.
- Scrolling: The reading viewport owns native scrolling and anchor padding; heading coordinates are relative to the elastic content layer, so rebound motion preserves the reading position.
- Mobile: The article list moves into a menu. The desktop outline is omitted below its responsive breakpoint.
- Accessibility: Semantic controls, visible focus, a content skip link, and sheet focus management support keyboard use.

Content and publishing

- Format: Weekly, Life, and Project use Markdown articles, including the Architecture and Design topics.
- Validation: A shared schema checks sections, calendar dates, update order, and cover metadata.
- Publication: Pages, lists, and feeds use one published-content query with Shanghai calendar dates.
- Paths: Filenames provide stable article slugs, and one helper generates article links.
- Deployment paths: `SITE_URL` supplies the production origin and base path; the shared URL helper and Markdown renderer apply that base to root-relative links and assets, canonical links, RSS, and the sitemap.
- Build: Astro generates static HTML; React loads for interactive controls.
