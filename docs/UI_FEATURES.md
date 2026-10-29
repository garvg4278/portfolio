# UI features: what exists and where

Each item was checked for presence first. "Added" means it was missing before this round. The browser test that proves it is `scripts/qa-interactions.py` unless noted.

| Feature | Status | Where and how |
| --- | --- | --- |
| Dark mode toggle | Added | Sun/moon button in the header (`Nav.astro`, `features/theme.js`, logic in `lib/theme.js`). Dark is the default brand look; light uses the same palette (porcelain surfaces, aubergine accents). The choice is saved in `localStorage`, applied before first paint (no flash), and the browser colour follows. The 3D hero and diagram panels stay dark in both themes. Contrast was audited with axe-core in both themes: 0 violations |
| Simple cookie banner, only if necessary | Not added, on purpose | The site sets no cookies and has no analytics, ads or third-party scripts (tested: 0 cookies). The only stored value is the theme choice, which is functional and stays in the browser. The footer says so. If you later add analytics or an embedded third-party service, add a banner then |
| Back to top button | Added | Floating button after 900 px of scrolling; moves focus to the main content; respects reduced motion (`features/chrome.js`). The footer link remains |
| Mobile menu | Existed, kept | Hamburger with `aria-expanded`, Esc to close, closes on link click; the theme toggle stays visible next to it |
| Hover states | Existed, kept | Nav underline, button lift and offset shadow, card tilt and border light, skill rows, certificate shine, copy buttons, theme toggle, back-to-top. Touch devices skip hover-only motion |
| Skip to content | Existed, kept | First Tab stop on every page; jumps to `main`. Tested |
| Form success state | Existed, kept | Shown only after the form service answers OK |
| Form error state | Existed, kept | Inline field errors and a summary; separate messages for a rejected, offline or timed-out send |
| Loading animations, kept subtle | Added | Spinner and `aria-busy` on the send button; a pulse while a certificate image loads; the 3D canvas fades in over a static poster. All stop under reduced motion |
| Scroll progress bar | Added | 2 px accent line along the bottom of the sticky header |
| Copy button, for email or code snippets | Added | Email (contact page and footer) and code snippets on project pages (`CopyButton.astro`, `CodeSnippet.astro`, `lib/clipboard.js` with a fallback). Shows "Copied" and announces it to screen readers |
| Sticky headers | Existed, kept | Fixed header on every page; the skills filter bar is sticky too |
| Confirmation modals, for actions that need confirmation | Added | One shared dialog (`ConfirmDialog.astro`, `features/confirm.js`). Used by "Clear form" when text would be lost. Cancel is the default focus. Other actions on the site are not destructive, so they do not get one |
| Last updated date | Added | Footer line, generated at build time, so it changes on every deploy; also written into the sitemap as `lastmod` |
