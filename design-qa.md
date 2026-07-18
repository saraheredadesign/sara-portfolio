# Truffle Case Study — “Ideas for the future” roadmap

**Source visual truth**

- Existing-section/title reference: `/Users/saraheredahernando/Desktop/Captura de pantalla 2026-07-18 a las 15.27.19.png`.
- Roadmap-layout reference: `/var/folders/f9/krd70wq50bx9k_vl25pv6nlm0000gn/T/TemporaryItems/NSIRD_screencaptureui_LaxYTG/Captura de pantalla 2026-07-18 a las 15.35.19.png`.
- Written constraints: `/Users/saraheredahernando/.codex/attachments/bb650d2a-a34d-4af5-a4f5-2e5d6de80ab5/pasted-text.txt`.
- User clarification: the “Ideas for the future” title must remain unchanged.

**Rendered implementation**

- Route: `http://127.0.0.1:5174/projects/truffle/#tf-future-title`.
- Desktop capture: `/private/tmp/truffle-future-roadmap-desktop.jpg`.
- Tablet capture: `/private/tmp/truffle-future-roadmap-tablet.jpg`.
- Mobile capture: `/private/tmp/truffle-future-roadmap-mobile-final.jpg`.

**Viewport and state**

- Desktop: `2024 × 926`, 100% browser zoom, static default state.
- Tablet: `1024 × 900`, static default state.
- Mobile: `390 × 844`, static default state.

**Comparison evidence**

- The roadmap reference and a focused crop of the desktop implementation were opened together in `/private/tmp/truffle-future-roadmap-comparison.png`.
- Focused comparison was required because the user supplied a cropped section reference rather than a full-page viewport.
- The existing-title screenshot and implementation measurements were also checked: title size, weight, line height, position, and copy are unchanged.

**Findings and iteration history**

- [P1] The original implementation used four independent white cards instead of the single roadmap surface shown in the target.
  - Fix: replaced the cards with one warm-white shared band containing four equal columns.
  - Post-fix evidence: `/private/tmp/truffle-future-roadmap-desktop.jpg` and the combined comparison image.
- [P1] The target’s colored circles, four-part key, and dashed connection line were missing.
  - Fix: reused all four existing PNG icons, added four equal solid-color circles, added the four-color key, and placed one dashed brown line behind the circles.
  - Post-fix evidence: desktop and tablet captures.
- [P2] The initial mobile pass allowed the vertical dashed line to remain visible behind the labels.
  - Fix: masked the line immediately behind each label with the same warm-white band color while preserving the continuous vertical roadmap.
  - Post-fix evidence: `/private/tmp/truffle-future-roadmap-mobile-final.jpg`.
- No actionable P0, P1, or P2 findings remain within the requested section.

**Required fidelity surfaces**

- Fonts and typography: the desktop title remains exactly `35px / 700 / 40.25px`; its original `48px` top and `72px` left position inside the frame is unchanged. Mobile retains the existing `28px / 700` title rule. All four labels use Montserrat with identical sizing and weight.
- Spacing and layout rhythm: the green frame remains `936 × 370px` on desktop with its original `48px 72px` padding and `42px` radius. The shared band uses four equal columns, equal icon circles, and a single centered line.
- Colors and visual tokens: the existing `#69D3B3` frame is unchanged; the band and roadmap details use only the supplied permitted palette.
- Image quality and asset fidelity: all four original icons load at their native dimensions and remain sharp; no substitute icons, SVGs, emoji, or generated assets were introduced.
- Copy and content: title and labels exactly match the supplied text; no copy was added or rewritten.

**Regression checks**

- Green frame width, height, color, radius, padding, position, upper connections, lower connection, and surrounding section spacing were not modified.
- Desktop and tablet keep one horizontal band and one horizontal dashed line.
- Mobile uses one vertical capsule and one vertical dashed line in the original item order.
- No horizontal overflow at `2024px`, `1024px`, or `390px`; mobile document width equals viewport width (`390px`).
- All four icon assets report complete loading with valid natural dimensions.
- Browser console errors: none.
- Browser console warnings: none.
- No interaction was required because this roadmap is intentionally static.

final result: passed

# Truffle Case Study — care-loop vertical rhythm and centering

**Source visual truth**

- User-supplied capture: `/var/folders/f9/krd70wq50bx9k_vl25pv6nlm0000gn/T/TemporaryItems/NSIRD_screencaptureui_y3pbOh/Captura de pantalla 2026-07-18 a las 21.06.50.png`.
- User direction: add a little more air between lines and make the care-loop content feel more centered.

**Rendered implementation**

- Route: `http://127.0.0.1:5173/projects/truffle/#tf-care-loop-title`.
- Desktop capture: `/private/tmp/truffle-care-loop-centered-framed.png`.
- Focused implementation crop: `/private/tmp/truffle-care-loop-centered-section.png`.
- Focused before/after comparison: `/private/tmp/truffle-care-loop-centered-comparison.png` (source left, implementation right).

**Viewport and state**

- Desktop: `1280 × 720`, static care-loop state.
- The existing tablet and mobile breakpoint overrides remain unchanged.

**Full-view comparison evidence**

- The framed browser capture shows the full care-loop panel in page context, including the connector shapes above and below.

**Focused region comparison evidence**

- The focused comparison shows the original tighter/high-set content beside the revised, evenly distributed content group.
- Final visual edge spacing is effectively centered: `58px` above the heading and `57.48px` below the footer.

**Findings and comparison history**

- [P2] The heading, introduction, loop card, and footer were grouped too tightly and sat visibly high inside the fixed-height mint panel.
  - Fix: increased desktop heading-to-intro spacing from `8px` to `12px`, intro-to-card spacing from `10px` to `16px`, and card-to-footer spacing from `14px` to `20px`.
  - Fix: increased desktop panel top padding from `38px` to `58px`, balancing the complete content group within the `405px` panel.
  - Post-fix evidence: browser geometry reports `12px`, `16px`, and `20px` internal gaps, with a top/bottom difference below `1px`.
- No actionable P0, P1, or P2 findings remain.

**Required fidelity surfaces**

- Fonts and typography: Montserrat family, sizes, weights, and copy remain unchanged.
- Spacing and layout rhythm: only desktop vertical rhythm and panel centering changed; card dimensions and horizontal alignment remain unchanged.
- Colors and visual tokens: mint, white, charcoal, brown, and icon colors remain unchanged.
- Image quality and asset fidelity: all care-loop icons and connector artwork remain unchanged and sharp.
- Copy and content: the footer remains on one line at desktop width and aligned to its brown rule.

**Regression checks**

- Footer width is `922px`; `clientWidth` equals `scrollWidth`, with `white-space: nowrap` and a `34px` line-height.
- Document width equals the `1280px` viewport; no horizontal overflow is present.
- Browser console errors and warnings: none.
- Production build: passed.

final result: passed

# Truffle Case Study — component image composition

**Source visual truth**

- User-supplied target: `/var/folders/f9/krd70wq50bx9k_vl25pv6nlm0000gn/T/TemporaryItems/NSIRD_screencaptureui_m3EKXO/Captura de pantalla 2026-07-18 a las 20.00.27.png`.
- User-supplied before-state capture: `/var/folders/f9/krd70wq50bx9k_vl25pv6nlm0000gn/T/TemporaryItems/NSIRD_screencaptureui_Tj9ALw/Captura de pantalla 2026-07-18 a las 20.00.10.png`.
- Scope: reproduce the target placement, sizing, crop, and spacing of the eight existing component PNGs inside the Truffle portfolio section.

**Rendered implementation**

- Route: `http://127.0.0.1:5175/projects/truffle/#tf-components-title`.
- Browser-rendered focused component capture: `/tmp/truffle-components-qa-after.png`.
- Normalized source/implementation comparison: `/tmp/truffle-components-comparison.png`.

**Viewport and state**

- Main route measurement: `1720 × 1100`, static component section, desktop rules active.
- Focused browser capture: `1280 × 797` full component board using the production markup, CSS, and eight production image assets.
- All eight images reported `complete: true` with valid natural dimensions.

**Full-view comparison evidence**

- `/tmp/truffle-components-comparison.png` places the normalized target board on the left and the browser-rendered implementation on the right.
- The comparison covers the complete board: navigation, cards selector, buttons, cards, icons, chips, pet selector, and dropdown.

**Focused region comparison evidence**

- No additional crop was needed because the supplied target is already a focused component-board view and all eight assets, their edges, and the mint gutters are readable in the normalized full-board comparison.

**Findings and comparison history**

- [P1] The previous shared four-row grid forced unrelated assets into the same row heights and used columns totaling 100% before adding gaps, which changed image proportions and pushed the last column beyond the intended composition.
  - Fix: replaced the desktop grid sizing with a proportional `1643 / 1026` board and positioned each original PNG using measurements taken from the target screenshot.
  - Post-fix evidence: the measured `1106 × 690.656px` production grid reproduces the target proportions; `/tmp/truffle-components-comparison.png` confirms the same three-column composition and eight image bounds.
- [P2] The pet selector used an additional vertical transform and the first, middle, and final columns did not preserve the target's independent vertical gaps.
  - Fix: removed the desktop transform and assigned the exact target top, left, width, and height ratios for every asset while retaining the existing tablet/mobile grid below `901px`.
  - Post-fix evidence: left, center, and right columns now align at their target top and bottom edges in the normalized comparison.
- No actionable P0, P1, or P2 findings remain.

**Required fidelity surfaces**

- Fonts and typography: all typography is part of the supplied PNG assets and remains unchanged; the surrounding section typography was not modified.
- Spacing and layout rhythm: the board now uses the target aspect ratio, column widths, independent vertical gutters, and aligned top/bottom edges; the containing section height follows the corrected board content.
- Colors and visual tokens: the original mint, white, brown, charcoal, pastel fills, shadows, and dashed borders come directly from the unchanged assets; no palette values were replaced.
- Image quality and asset fidelity: the eight original PNGs are reused directly with no generated substitutes, placeholders, SVG approximations, or cropping from a composite screenshot.
- Copy and content: every component label and piece of UI copy remains exactly as supplied in the original assets.

**Interaction and regression checks**

- The component board is intentionally static; no interaction behavior changed.
- The production route and the focused capture reported no browser console errors or warnings.
- The existing two-column tablet and one-column mobile layouts remain scoped below `901px` and were not replaced by the desktop positioning rules.
- `npm run build` completed successfully.

final result: passed

# Truffle Case Study — centered “Ideas for the future” title

**Source visual truth**

- User-supplied section capture: `/var/folders/f9/krd70wq50bx9k_vl25pv6nlm0000gn/T/TemporaryItems/NSIRD_screencaptureui_QJQfbp/Captura de pantalla 2026-07-18 a las 19.59.16.png`.
- Written target: center the title, remove the four-color line directly beneath it, and add an illuminated lightbulb icon beside the title.

**Rendered implementation**

- Route: `http://127.0.0.1:4173/projects/truffle/#tf-future-title`.
- Desktop capture: `/private/tmp/truffle-future-title-desktop-final.jpg`.
- Mobile capture: `/private/tmp/truffle-future-title-mobile-final.jpg`.
- Normalized source/implementation comparison: `/private/tmp/truffle-future-title-comparison.png`.

**Viewport and state**

- Desktop: `1440 × 900`, static section state.
- Mobile: `390 × 844`, responsive stacked roadmap state.
- The section is intentionally static, so no interaction state is required.

**Full-view comparison evidence**

- The desktop capture shows the complete relationship between the centered title group, the white roadmap band, and the surrounding green connectors.
- The mobile capture shows the title centered above the vertically stacked roadmap without horizontal overflow.

**Focused region comparison evidence**

- `/private/tmp/truffle-future-title-comparison.png` places the supplied source state above the implementation at the same `936px` width.
- The comparison clearly shows the three requested deltas: the title group is centered, the four-color line is absent, and a warm illuminated lightbulb sits beside the title.

**Findings and comparison history**

- The first post-implementation visual comparison found no actionable P0, P1, or P2 mismatch against the supplied change request.
- No QA-driven source adjustment was required after the comparison.

**Required fidelity surfaces**

- Fonts and typography: the existing Montserrat title size, weight, and line-height are preserved; the title group is centered with flex alignment and remains centered when it wraps on mobile.
- Spacing and layout rhythm: the desktop and mobile roadmap positions, white band, icon circles, connectors, radii, and shadows are unchanged; only the title group alignment and title-side icon were added.
- Colors and visual tokens: the mint surface and existing roadmap palette remain unchanged; the bulb uses the section's warm cream/orange tones with a restrained glow.
- Image quality and asset fidelity: the four existing roadmap PNG icons are unchanged. The lightbulb comes from the Material Symbols Rounded icon library and rendered successfully at both breakpoints.
- Copy and content: “Ideas for the future” and all four roadmap labels remain unchanged. The decorative bulb is hidden from the accessibility tree, so the heading retains the correct accessible name.

**Regression checks**

- The removed `.tf-future-key` element has zero rendered instances.
- Title and section centers both measure `720px` on desktop and `195px` on mobile.
- Document width equals viewport width at `1440px` and `390px`; no horizontal overflow is present.
- The Material Symbols font reports loaded in both browser checks.
- Browser console errors and warnings: none.
- Production build: passed.

final result: passed

# Truffle Case Study — mobile hero phone overlap

**Source visual truth**

- User-supplied issue capture: `/Users/saraheredahernando/Downloads/Truffle Case Study  Sara Hereda 2.png`.
- Written target: keep the two-phone composition fully inside the mobile hero, centered and uncropped, with a controlled gap before the mint research section; preserve the scroll cue, decorations, hero height, tablet, and desktop.

**Rendered implementation**

- Route: `http://127.0.0.1:5176/projects/truffle/`.
- Mobile captures: `/tmp/truffle-375-after.png`, `/tmp/truffle-390-after.png`, and `/tmp/truffle-430-after.png`.
- Regression captures: `/tmp/truffle-768-after.png` and `/tmp/truffle-1440-after.png`.

**Viewport and state**

- Mobile: `375 × 852`, `390 × 852`, and `430 × 852`; static hero/research boundary.
- Tablet: `768 × 900`; static default hero.
- Desktop: `1440 × 900`; static default hero.
- Interaction: the “Scroll to explore ↓” link was activated at `390px`; it retained the `#tf-research` destination and landed the research section at `140px` below the viewport top.

**Full-view comparison evidence**

- The issue capture and `/tmp/truffle-390-after.png` were opened together in the same comparison input.
- The source shows the lower phone covering the research eyebrow and content. The final capture shows both phones ending inside the cream hero with a clear gap before the mint panel.

**Focused region comparison evidence**

- No additional crop was needed because both artifacts clearly expose the complete phone composition, the hero/research boundary, the eyebrow, and the start of the research heading at readable scale.

**Findings and comparison history**

- [P1] The mobile mockup was `390px` wide and `636.16px` tall from a fixed `720px` top offset, so it extended `126.16px` beyond the `1230px` hero and covered the next section.
  - Fix: inside the existing `max-width: 680px` breakpoint only, changed the mockup container to `width: min(80vw, 300px)` and corrected its visual centering from `translateX(58%)` to `translateX(54%)`.
  - Post-fix evidence: at all three requested mobile widths the mockup is `300px` wide, `489.36px` tall, fully inside the viewport and hero, and ends `20.64px` before the research section.
- No actionable P0, P1, or P2 findings remain within the requested scope.

**Required fidelity surfaces**

- Fonts and typography: no text selector changed; family, weight, size, line height, wrapping, and the “Scroll to explore ↓” copy are unchanged.
- Spacing and layout rhythm: the existing hero height and `720px` mockup top offset are unchanged. The smallest cue-to-mockup gap is `10.08px` at `375px`; the mockup-to-research gap is `20.64px` at every requested mobile width.
- Colors and visual tokens: mint, cream, charcoal, shadows, and all decorative path elements are unchanged.
- Image quality and asset fidelity: the original `1269 × 2070` PNG remains complete and loaded; scaling is proportional, `object-fit: contain` remains intact, and no clipping or `overflow: hidden` solution was introduced.
- Copy and content: hero text, project metadata, scroll cue, research eyebrow, and research heading are unchanged.

**Regression checks**

- `375px`, `390px`, and `430px`: mockup is fully inside the hero and viewport, with no document-level horizontal overflow.
- `768px`: existing tablet mockup remains `600px` with `transform: none`.
- `1440px`: existing desktop mockup remains `615px` with `transform: none`.
- Only one declaration in the existing mobile breakpoint changed; no markup, JavaScript, hero height, research-section style, tablet rule, or desktop rule was modified.
- Browser console errors: none.
- Browser console warnings: none.
- Production build: passed.

final result: passed

# Truffle Case Study — “What I learned”

**Source visual truth**

- Selected reference: `/var/folders/f9/krd70wq50bx9k_vl25pv6nlm0000gn/T/TemporaryItems/NSIRD_screencaptureui_PN2kOQ/Captura de pantalla 2026-07-18 a las 17.55.25.png`.
- Written constraints: `/Users/saraheredahernando/.codex/attachments/0297e71e-070b-4064-a19a-3c6fccdab347/pasted-text.txt`.
- Scope: redesign only the contents and section-specific styles of “What I learned”; retain the surrounding green path/frame and adjacent sections.

**Rendered implementation**

- Route: `http://127.0.0.1:4173/projects/truffle/`.
- Desktop section capture: `/tmp/truffle-learned-desktop-final.jpg`.
- Desktop focused panel: `/tmp/truffle-learned-desktop-card-final.png`.
- Mobile capture: `/tmp/truffle-learned-mobile-final.jpg`.

**Viewport and state**

- Desktop: `1440 × 1100`, 100% zoom, static default state.
- Tablet: `768 × 1000`, static default state.
- Mobile: `390 × 844`, static default state.
- The section is intentionally static, so no interaction state was required.

**Full-view comparison evidence**

- The complete desktop composition was checked in `/tmp/truffle-learned-desktop-final.jpg`, including the centered title, green frame, white panel overlap, and surrounding spacing.
- Because the supplied source is a focused crop of the white panel rather than a full-page viewport, the direct fidelity comparison used the focused panel evidence below.

**Focused region comparison evidence**

- Reference and implementation were normalized to the same `935px` panel width and opened together in `/tmp/truffle-learned-comparison-final.png`.
- The implementation matches the target's single-column editorial structure, quote placement, continuous brown rule, bold spans, paragraph sequence, white surface, and subtle pink closing emphasis.

**Findings and comparison history**

- [P1] The original panel was a tall, largely empty white container with no quote, editorial rule, or closing emphasis.
  - Fix: removed the fixed minimum height and rebuilt the internal layout as one continuous reflection with a decorative quote, one continuous brown line, and one subtle pink closing highlight.
  - Post-fix evidence: desktop full-section capture and focused side-by-side comparison.
- [P2] The first implementation's Montserrat quote glyph appeared too small and block-like compared with the rounded reference mark.
  - Fix: kept the requested `64px` decorative character but used Georgia for its more faithful curved form; it remains `aria-hidden="true"`.
  - Post-fix evidence: `/tmp/truffle-learned-comparison-final.png`.
- [P3] The initial pink highlight was slightly stronger than the source.
  - Fix: reduced the `#F3D9DF` overlay to `0.26` opacity.
- No actionable P0, P1, or P2 findings remain within the requested section.

**Required fidelity surfaces**

- Fonts and typography: title rules remain outside the edited selectors; reflection copy uses Montserrat at `17px / 1.58` desktop and `15px / 1.62` mobile. The four strong spans exactly match the supplied emphasis requirements.
- Spacing and layout rhythm: the desktop panel remains `935px` wide and is now content-driven at approximately `413px` high instead of the original `510px` minimum. Paragraph spacing is `32px` desktop and `28px` mobile.
- Colors and visual tokens: changes use only `#69D3B3`, `#2E2E2E`, `#401A02`, `#F3D9DF`, white, and a low-opacity charcoal shadow.
- Image quality and asset fidelity: the source contains no raster imagery or icons to reproduce; no image asset, SVG, CSS drawing, gradient, or placeholder was added.
- Copy and content: all supplied sentences, punctuation, capitalization, ordering, and bold spans were checked in the rendered DOM and remain exact.

**Regression checks**

- The implementation does not edit the green frame/path selectors, its upper connector selectors, the title selector, shared cards, global tokens, global breakpoints, adjacent sections, navigation, footer, cursor, or animation rules.
- Exactly one white panel contains exactly three paragraphs in one continuous editorial column.
- The opening quote is decorative and absent from the accessibility tree.
- Desktop, tablet, and mobile layouts have no section-level horizontal overflow; document width equals viewport width at `1440px`, `768px`, and `390px`.
- Browser console errors: none.
- Browser console warnings: none.

final result: passed

# Truffle Case Study — contact button

**Source visual truth**

- User reference: `/var/folders/f9/krd70wq50bx9k_vl25pv6nlm0000gn/T/TemporaryItems/NSIRD_screencaptureui_mlMd7X/Captura de pantalla 2026-07-18 a las 17.53.08.png`.
- Existing portfolio button reference: `/private/tmp/portfolio-button-reference.jpg`.
- Scope: make the “Get in touch” control match the portfolio button pattern in size and interaction.

**Rendered implementation**

- Route: `http://127.0.0.1:4173/projects/truffle/`.
- Default-state capture: `/private/tmp/truffle-contact-button-final.jpg`.
- Interactive-state capture: `/private/tmp/truffle-contact-button-final-focus.jpg`.

**Viewport and state**

- Desktop: `1440 × 900`, default and keyboard-focus states.
- Mobile: `390 × 844`, default state.
- Final button dimensions at both viewports: approximately `126 × 45px`, with `12px 22px` padding and `14px` medium-weight text.

**Comparison evidence**

- The existing portfolio button reference and the browser-rendered Truffle implementation were opened together in one comparison input.
- The final control matches the shared portfolio pill proportions, border weight, text scale, and white default state.

**Findings and iteration history**

- [P1] The original contact button was substantially larger than the portfolio pattern (`248 × 62px` on desktop and a forced `180 × 54px` minimum on mobile).
  - Fix: reused the portfolio `.btn.btn-light` pattern and removed the mobile size override.
- [P1] The original control did not use the portfolio’s black interactive state.
  - Fix: hover and keyboard focus now switch to the shared ink background with white text.
- No actionable P0, P1, or P2 findings remain within the requested scope.

**Required fidelity surfaces**

- Fonts and typography: matches the portfolio button at `14px` and `500` weight.
- Spacing and layout rhythm: compact `45px` height preserves the CTA composition without changing surrounding copy or artwork.
- Colors and visual tokens: white default, shared ink border/text, shared ink interactive background, and white interactive text.
- Image quality and asset fidelity: no image assets were added or changed.
- Copy and content: “Get in touch” and its email destination remain unchanged.

**Regression checks**

- No horizontal overflow at `1440px` or `390px`.
- Keyboard focus uses the same high-contrast state as hover.
- Browser console errors: none.
- Browser console warnings: none.
- No unrelated section styles were modified.

final result: passed

# Truffle Case Study — “Scroll to explore” CTA

**Source visual truth**

- CTA reference: `/var/folders/f9/krd70wq50bx9k_vl25pv6nlm0000gn/T/TemporaryItems/NSIRD_screencaptureui_BWOrnW/Captura de pantalla 2026-07-18 a las 17.51.00.png`.
- Clicked-state reference: `/var/folders/f9/krd70wq50bx9k_vl25pv6nlm0000gn/T/TemporaryItems/NSIRD_screencaptureui_PeHA1g/Captura de pantalla 2026-07-18 a las 17.51.55.png`.
- Normalized clicked-state crop: `/tmp/truffle-reference-content.png`.

**Rendered implementation**

- Route: `http://127.0.0.1:5173/projects/truffle/#tf-research`.
- Browser-rendered capture: `/tmp/truffle-scroll-to-explore-result-1680.png`.
- Side-by-side comparison (reference left, implementation right): `/tmp/truffle-scroll-comparison.png`.

**Viewport and state**

- Viewport: `1680 × 919`, matching the reference page layout after normalizing its browser zoom and device scale.
- State: the user has clicked the “Scroll to explore ↓” CTA and the smooth scroll has completed.
- Final measurements: sticky header `83px`; research panel top `140px` from the viewport top; scroll position `748px`; URL hash `#tf-research`.

**Full-view comparison evidence**

- The source clicked state and the browser-rendered implementation were normalized to the same viewport and opened together in `/tmp/truffle-scroll-comparison.png`.
- The research panel, sticky header, phone crop, two white cards, insight notes, challenge copy, refrigerator image, mascot, and cursor state align with the supplied reference.

**Focused region comparison evidence**

- No additional focused crop was needed: at `1680 × 919`, the target section heading, cards, copy, imagery, and final offset are all clearly readable in the full-view side-by-side comparison.

**Findings and comparison history**

- The single post-implementation comparison found no actionable P0, P1, or P2 mismatch.
- The CTA is now a semantic link to the research section, and the target uses a `140px` scroll margin to reproduce the supplied final position below the sticky header.
- No visual fixes were required after the first side-by-side comparison.

**Required fidelity surfaces**

- Fonts and typography: unchanged; the CTA and destination section continue to use the existing Manrope and Montserrat rules, weights, sizes, line heights, wrapping, and antialiasing.
- Spacing and layout rhythm: unchanged except for the destination's non-visual scroll margin; the clicked state reproduces the reference's panel offset and card alignment.
- Colors and visual tokens: unchanged; the mint, cream, white, charcoal, shadows, and radii remain mapped to the existing Truffle tokens.
- Image quality and asset fidelity: all existing supplied PNG assets remain unchanged and retain the same crop, scale, and sharpness.
- Copy and content: “Scroll to explore ↓” and every destination-section label remain unchanged.

**Interaction and regression checks**

- The CTA is keyboard-focusable and exposes a visible focus state.
- Clicking updates the URL to `#tf-research` and scrolls with computed `scroll-behavior: smooth`.
- The destination lands at `140px` from the viewport top, leaving the reference spacing below the `83px` sticky header.
- Page content renders normally, no framework error overlay appears, and browser console errors are empty.
- No layout, copy, imagery, or other section behavior was modified.

final result: passed

# Truffle Case Study — portfolio footer

**Source visual truth**

- Existing portfolio footer: `http://127.0.0.1:4173/projects/truffle/`.
- Focused mobile reference capture: `/private/tmp/portfolio-footer-reference-mobile.jpg`.
- Scope: reuse the portfolio copyright and Email, LinkedIn, and Resume links below the final Truffle CTA.

**Rendered implementation**

- Route: `http://127.0.0.1:4173/projects/truffle/`.
- Desktop capture: `/private/tmp/truffle-footer-final-desktop.jpg`.
- Mobile capture: `/private/tmp/truffle-footer-final-mobile.jpg`.

**Viewport and state**

- Desktop: `1440 × 900`, static page end.
- Mobile comparison: `390 × 844`, static page end.

**Comparison evidence**

- The existing portfolio footer and the new Truffle footer were opened together in one focused mobile comparison input.
- A focused comparison was used because the footer text, alignment, link rhythm, and CTA-to-footer spacing are all clearly readable at this crop.

**Findings and iteration history**

- [P1] The case study ended after the contact CTA and omitted the portfolio-wide footer.
  - Fix: reused the exact semantic footer markup, copyright copy, and three existing link destinations from the rest of the portfolio.
- [P2] Reusing the previous page-end spacing left a `353px` desktop gap and an oversized mobile gap above the newly added footer.
  - Fix: adjusted only the final CTA bottom margin so the resulting gap matches the existing portfolio: approximately `77px` desktop and `48px` mobile.
  - Post-fix evidence: `/private/tmp/truffle-footer-final-desktop.jpg` and `/private/tmp/truffle-footer-final-mobile.jpg`.
- No actionable P0, P1, or P2 findings remain within the requested scope.

**Required fidelity surfaces**

- Fonts and typography: inherited unchanged from the shared `.site-footer` rules in `styles.css`.
- Spacing and layout rhythm: matches the portfolio footer gap and switches from a desktop row to the existing centered mobile column.
- Colors and visual tokens: inherited unchanged from the shared footer styles.
- Image quality and asset fidelity: no new image assets were needed; the existing final CTA artwork is unchanged.
- Copy and content: copyright, Email, LinkedIn, and Resume exactly match the rest of the portfolio.
- Interaction coverage: Email uses the portfolio mailto, LinkedIn opens safely in a new tab, and Resume retains its download behavior.

**Regression checks**

- No horizontal overflow at `1440px` or `390px`.
- Footer links expose the expected href, target, rel, and download attributes.
- Browser console errors: none.
- Browser console warnings: none.
- No section above the final CTA was modified.

final result: passed

# Truffle Case Study — compact “Ideas for the future” container

**Source visual truth**

- User-supplied issue capture: `/Users/saraheredahernando/Desktop/Captura de pantalla 2026-07-18 a las 18.04.38.png`.
- Equivalent browser-rendered before state: `/private/tmp/truffle-future-roadmap-desktop.jpg`.
- User direction: remove the mint-green area extending below the white roadmap card while preserving the central green connection.

**Rendered implementation**

- Route: `http://127.0.0.1:5173/projects/truffle/#tf-future-title`.
- Desktop capture: `/tmp/truffle-future-compact-desktop.jpg`.
- Focused after-state crop: `/tmp/truffle-future-compact-focused.jpg`.
- Focused before/after comparison (before left, implementation right): `/tmp/truffle-future-height-comparison.png`.

**Viewport and state**

- Desktop: `1680 × 919`, static default state around “Ideas for the future”.
- Mobile verification: `390 × 844`, responsive stacked roadmap state.

**Full-view comparison evidence**

- The full desktop implementation capture confirms the shorter roadmap container still aligns with the surrounding outcome and “What I learned” sections.
- The next-section connector remains continuous and centered after the height reduction.

**Focused region comparison evidence**

- `/tmp/truffle-future-height-comparison.png` places the earlier implementation and the new implementation together at the same focused crop size.
- The comparison clearly shows the previous mint strip on the left and its removal on the right, with the central mint connector preserved.

**Findings and comparison history**

- [P2] The mint container extended `30px` below the white roadmap on desktop and `32px` on mobile, creating an unintended visible strip.
  - Fix: reduced the desktop container height from `370px` to `340px` and the mobile minimum height from `560px` to `528px`.
  - Post-fix evidence: measured container bottom and white-card bottom are identical at both breakpoints (`greenBelowGrid: 0`).
- No actionable P0, P1, or P2 findings remain.

**Required fidelity surfaces**

- Fonts and typography: unchanged; title, labels, weights, sizes, line heights, wrapping, and antialiasing retain their existing rules.
- Spacing and layout rhythm: only the excess bottom height was removed; card dimensions, internal padding, icon spacing, radii, shadow, and the next-section gap remain intact.
- Colors and visual tokens: unchanged; the existing mint, warm-white, brown, and four roadmap accent colors are preserved.
- Image quality and asset fidelity: all four original PNG icon assets are unchanged in size, crop, and sharpness.
- Copy and content: “Ideas for the future” and all four roadmap labels remain unchanged.

**Interaction and regression checks**

- This roadmap remains intentionally static; no interaction behavior changed.
- Desktop and mobile both report zero horizontal overflow.
- The browser shows no framework error overlay and no console errors.
- No markup, surrounding section, or shared connection style was modified.

final result: passed

# Truffle Case Study — care-loop footer alignment

**Source visual truth**

- User-supplied before-state capture: `/var/folders/f9/krd70wq50bx9k_vl25pv6nlm0000gn/T/TemporaryItems/NSIRD_screencaptureui_3wWqIo/Captura de pantalla 2026-07-18 a las 20.28.11.png`.
- Written target: keep the complete footer sentence on one desktop line and center it vertically against the brown line on its left.

**Rendered implementation**

- Route: `http://127.0.0.1:5173/projects/truffle/#tf-care-loop-title`.
- Browser-rendered implementation screenshot: `/tmp/truffle-care-footer-after.png`.
- Normalized before/after comparison: `/tmp/truffle-care-footer-comparison.png`.

**Viewport and state**

- Desktop: `1280 × 720`, static default state around the care-loop footer.
- The desktop footer measures `922 × 34px`; its text uses a single `34px` line box and the brown rule spans the same vertical center.

**Full-view comparison evidence**

- `/tmp/truffle-care-footer-comparison.png` places the supplied wrapped before state on the left and the browser-rendered one-line implementation on the right.
- The complete sentence and brown rule are visible at readable scale in both states.

**Focused region comparison evidence**

- The source itself is a focused crop of the footer, so the normalized comparison is also the required focused-region evidence; no additional crop was needed.

**Findings and comparison history**

- [P2] The footer was constrained to `630px`, causing the sentence to wrap across two lines and making the text block feel offset from the brown rule.
  - Fix: above `1100px`, let the footer use the full available width, keep the sentence on one line, and use a shared `34px` line box for the text and rule.
  - Post-fix evidence: the footer reports `white-space: nowrap`, `clientWidth: 922px`, `scrollWidth: 922px`, `height: 34px`, and no horizontal page overflow; the focused comparison confirms the visual alignment.
- No actionable P0, P1, or P2 findings remain.

**Required fidelity surfaces**

- Fonts and typography: Manrope, `16px` size, weight, letter spacing, copy emphasis, and antialiasing remain unchanged; only wrapping and desktop line-box alignment changed.
- Spacing and layout rhythm: the original `25px` text inset and `5px` brown rule remain; both now share the same vertical center on desktop.
- Colors and visual tokens: mint background, charcoal text, and the existing brown token are unchanged.
- Image quality and asset fidelity: no image or icon assets were added, removed, or modified.
- Copy and content: the complete sentence and bold “the foundation” emphasis remain exactly unchanged.

**Interaction and regression checks**

- This footer is intentionally static; no interaction behavior changed.
- The single-line rule is scoped to desktop widths of `1100px` and above; existing tablet and mobile wrapping rules remain unchanged.
- Browser console errors and warnings: none.
- `npm run build` completed successfully.

final result: passed

# Truffle Case Study — dark lightbulb contrast correction

**Source visual truth**

- User-supplied low-contrast capture: `/var/folders/f9/krd70wq50bx9k_vl25pv6nlm0000gn/T/TemporaryItems/NSIRD_screencaptureui_49Bqms/Captura de pantalla 2026-07-18 a las 20.14.09.png`.
- User direction: make the lightbulb icon dark so it has sufficient contrast against the mint background.

**Rendered implementation**

- Route: `http://127.0.0.1:4173/projects/truffle/#tf-future-title`.
- Browser-rendered capture: `/private/tmp/truffle-future-dark-bulb-final.jpg`.
- Focused before/after comparison: `/private/tmp/truffle-future-bulb-contrast-comparison.png`.

**Viewport and state**

- Desktop: `1280 × 720`, static default state around “Ideas for the future”.
- The section is intentionally static, so no interaction state is required.

**Full-view comparison evidence**

- The full browser capture shows the dark bulb in context with the centered title, roadmap card, existing dark-brown iconography, and mint connectors.

**Focused region comparison evidence**

- `/private/tmp/truffle-future-bulb-contrast-comparison.png` places the user-reported pale icon above the corrected dark icon at the same `334 × 198px` crop size.
- The corrected bulb is immediately legible against the mint panel while retaining a restrained warm halo.

**Findings and comparison history**

- [P2] The pale cream bulb merged visually with the mint background and lost its internal silhouette.
  - Fix: changed the Material Symbols icon color to Truffle's dark brown `#401A02` and reduced the glow from `7px / 0.9` to `5px / 0.65`.
  - Post-fix evidence: the browser reports an `8.47:1` foreground/background contrast ratio, and the focused comparison shows the improved silhouette.
- No actionable P0, P1, or P2 findings remain.

**Required fidelity surfaces**

- Fonts and typography: title family, size, weight, line-height, wrapping, and alignment are unchanged.
- Spacing and layout rhythm: icon size, title gap, centering, roadmap position, radii, shadows, and connectors are unchanged.
- Colors and visual tokens: the bulb now uses the same dark brown already present in Truffle's roadmap icons; the mint panel is unchanged.
- Image quality and asset fidelity: the existing Material Symbols bulb remains sharp and loaded; no substitute asset or custom drawing was introduced.
- Copy and content: title and roadmap labels are unchanged; the decorative icon remains hidden from the accessibility tree.

**Regression checks**

- Title and section center remain aligned.
- Document width equals viewport width; no horizontal overflow is present.
- Browser console errors and warnings: none.
- Production build: passed.

final result: passed

# Truffle Case Study — lighter challenge statement with arrow

**Source visual truth**

- User-supplied capture: `/var/folders/f9/krd70wq50bx9k_vl25pv6nlm0000gn/T/TemporaryItems/NSIRD_screencaptureui_PI8nyj/Captura de pantalla 2026-07-18 a las 20.29.02.png`.
- User direction: remove the bold weight from “It was making the right information easier to remember, access and share.” and add a pointing arrow before it.

**Rendered implementation**

- Route: `http://127.0.0.1:4173/projects/truffle/#tf-research`.
- Desktop capture: `/private/tmp/truffle-challenge-arrow-desktop-final.jpg`.
- Focused before/after comparison: `/private/tmp/truffle-challenge-arrow-comparison.png`.

**Viewport and state**

- Desktop: `1280 × 720`, static research/challenge state.
- Mobile regression: `390 × 844`, responsive research state.
- The content is intentionally static, so no interaction state is required.

**Full-view comparison evidence**

- The desktop capture shows the updated statement in context with the challenge heading, refrigerator artwork, connector, and following cards.

**Focused region comparison evidence**

- `/private/tmp/truffle-challenge-arrow-comparison.png` places the supplied bold source above the browser-rendered regular-weight statement at the same `700px` width.
- The comparison clearly shows the reduced typographic emphasis and the dark right-pointing arrow aligned to the first line.

**Findings and comparison history**

- [P2] The statement used `700` weight, competing with the challenge heading and reading as a second headline.
  - Fix: reduced the statement to Montserrat `400` while preserving its `22px / 1.75` desktop typography.
- [P2] The statement lacked the requested visual pointer.
  - Fix: added the `arrow_right_alt` icon from the existing Material Symbols Rounded library in Truffle dark brown, aligned at the start of the first line.
  - Post-fix evidence: the focused comparison and browser metrics confirm `font-weight: 400`, a loaded `30px` arrow, and the intended two-line copy.
- No actionable P0, P1, or P2 findings remain.

**Required fidelity surfaces**

- Fonts and typography: Montserrat, size, line-height, wrapping, and copy remain unchanged; only weight changes from `700` to `400`.
- Spacing and layout rhythm: the paragraph uses a two-column grid with a `12px` desktop gap and `10px` mobile gap; the surrounding section and following cards remain unchanged.
- Colors and visual tokens: mint panel and charcoal copy remain unchanged; the arrow uses Truffle's existing `#401A02` dark brown.
- Image quality and asset fidelity: refrigerator and surrounding imagery are unchanged; the arrow comes from the existing icon library and renders sharply.
- Copy and content: the sentence remains exact; the decorative arrow is marked `aria-hidden`.

**Regression checks**

- Desktop paragraph reports `font-weight: 400`; mobile retains `font-weight: 400` at `18px`.
- Mobile paragraph remains within its `322px` content width; document width equals the `390px` viewport.
- Material Symbols reports loaded for the arrow.
- Browser console errors and warnings: none.
- Production build: passed.

final result: passed

# Truffle Case Study — expanded visual-foundations palette card

**Source visual truth**

- User-supplied before-state capture: `/var/folders/f9/krd70wq50bx9k_vl25pv6nlm0000gn/T/TemporaryItems/NSIRD_screencaptureui_tPR2Tb/Captura de pantalla 2026-07-18 a las 21.30.21.png`.
- User direction: make the white palette container, photograph, color bands, and their text moderately larger so the section carries more importance without becoming oversized.

**Rendered implementation**

- Route: `http://127.0.0.1:5173/projects/truffle/#tf-foundations-title`.
- Browser capture: `/private/tmp/truffle-palette-expanded-after.jpg`.
- Focused implementation region: `/private/tmp/truffle-palette-expanded-region.png`.
- Before/after comparison: `/private/tmp/truffle-palette-expanded-comparison.png` (source left, revised implementation right).

**Viewport and state**

- Desktop: `1280 × 720`, static visual-foundations state.
- Existing single-column mobile composition is preserved; tablet sizing receives a smaller proportional increase.

**Full-view comparison evidence**

- The browser capture shows the expanded white card within its mint parent and connector system, with the complete image and all four swatches visible together.

**Focused region comparison evidence**

- The normalized comparison shows the revised card carrying more visual weight while retaining the original photo/swatches overlap and overall reading order.
- The white card increases from `1136 × 510px` to `1152 × 570px`; the photograph increases from `500 × 340px` to `540 × 390px`.

**Findings and comparison history**

- [P2] The palette card and its contents read too small for an important visual-foundations section.
  - Fix: increased desktop card height by `60px` and width by `16px`, with a centered `-8px` offset.
  - Fix: increased the photograph height by `50px`, swatch height from `72px` to `82px`, and inter-swatch gap from `8px` to `10px`.
  - Fix: increased introductory text from `16px` to `18px`, swatch titles from `17px` to `19px`, color values from `12px` to `13px`, and descriptions to `14px`.
  - Post-fix evidence: the normalized before/after comparison shows a clear but restrained scale increase with no clipping or disrupted overlap.
- No actionable P0, P1, or P2 findings remain.

**Required fidelity surfaces**

- Fonts and typography: Montserrat family, weights, wording, and hierarchy remain unchanged; sizes scale proportionally with the card.
- Spacing and layout rhythm: card, photograph, swatches, gaps, padding, and radii increase together; the overlapping composition remains balanced.
- Colors and visual tokens: the four existing palette colors, white card, mint frame, and charcoal copy are unchanged.
- Image quality and asset fidelity: the original `1145 × 1196px` Weimaraner/Truffi image is reused with `object-fit: cover`; the larger slot remains sharp.
- Copy and content: all labels, hexadecimal values, and explanatory text remain exact and fully visible.

**Regression checks**

- Desktop document width equals the `1280px` viewport; no horizontal overflow is present.
- Desktop swatches measure `600 × 82px`; the four-item stack remains within the white card.
- Browser console errors and warnings: none.
- Production build: passed.

final result: passed
