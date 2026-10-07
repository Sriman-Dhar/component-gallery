import type { ComponentMeta } from '../../lib/types';

export const meta: ComponentMeta = {
  slug: 'tilt-product-card',
  name: 'Tilt Product Card',
  type: 'card',
  week: 2,
  date: '2026-10-08',
  summary:
    'A product card built as a glass display case: it tilts toward the pointer in real perspective while a CSS 3D desk armillary inside shows its depth, with finish, Save and Add to bag fully usable and a composed still on touch and reduced motion.',
  prompt: `Build a tilt product card that is a glass display case holding a real 3D object, so tilting it lets you look around the product instead of watching a flat panel wobble. The demo product is invented: the Armilla No. 3, a desk armillary by the maker Vorrel Works, priced $148.00, in three finishes (Brass, Graphite, Frost), with the stock line "Ships in 3 days". No ratings, no reviews, no photos, no people.

The case takes about the top 62 percent of the card. Inside it, build the armillary from true CSS 3D planes, not a drawing: three nested rings (bordered circles), each in its own gimbal plane (one turned 64 degrees on Y, one 72 degrees on X, one rotated 28 degrees and tipped 56 degrees on X), a glowing core disc that always faces the viewer, a short stem and a small plinth with a real top face and front face. Lean the whole object back a few degrees so the plinth top shows. Put perspective on the card root with its origin at the case centre, transform-style preserve-3d down the tree, and set every layer at its own translateZ so the parallax is real. The front glass sits at the highest Z, in front of every ring, and is drawn smaller by exactly the perspective factor so it lands on the case opening.

Pointer behaviour, fine pointer only: the case turns its face toward the pointer, at most 10 degrees on each axis (prop maxTilt, clamped 0 to 14), through GSAP quickTo on rotateX and rotateY (0.45s, power3.out). As the tilt grows the rings breathe apart along Z, the outer one forward and the inner one back, up to 18px of extra spread (0.6s). An amber glare hotspot follows the pointer across the glass (0.3s) and a cool rim light brightens on the edge opposite the pointer. Both lights are pre-painted gradients moved by transform only, the glare fading out before the case edge so there is never a hard cut. While the pointer is over a control the tilt halves, so targets never drift away under the cursor. On pointer leave everything springs home with one soft overshoot (elastic.out(1, 0.5), 0.9s). Keyboard focus never tilts the card.

Touch and reduced motion get the same composed still: case facing front, rings at their assembled angles, glare parked upper left where the site's key light sits, rim on the lower right edge. Gate the listeners with gsap.matchMedia on prefers-reduced-motion: no-preference and pointer: fine, ignore any pointer event whose pointerType is touch, and attach nothing at all when the still prop is set (the gallery tile uses it).

Under the case, flat on the front plane: a Geist Mono maker line ("VORREL WORKS · No 3"), the product name in Archivo expanded (600, 26px desktop, 22px phone) as the only link on the card, a finish picker, the price in Archivo with tabular figures beside the stock note, then a row with a Save icon button and the primary Add to bag button. The card is fluid from 280px to 380px wide.

The finish picker is a radio group with a visible "Finish" label and the chosen finish written next to it. Each swatch is a real radio input with a text label: a 28px metal disc inside a 44px hit area, the selected one marked with a ring and a check glyph, never colour alone. Arrow keys move the selection. A finish change crossfades the ring colours in 240ms (instant under reduced motion) and updates a visually hidden description of the case: "Desk armillary in brass finish: three nested rings around a glowing core."

Save is a button with aria-pressed labelled "Save Armilla No. 3"; its bookmark fills when saved. Add to bag is a real button whose label, spinner, check and retry faces share one grid cell so its width never changes. If onAddToBag returns a promise, the button shows Adding with aria-busy, then Added, and a polite live region says "Adding to bag" and then "Added. 2 in your bag." A rejected promise shows Try again. Sold out sets aria-disabled, shows "Sold out" and keeps the finish picker usable. On success the core flares once (scale 1 to 1.12 and back over 400ms) as the only celebration.

The root is an article labelled by the product name heading. The object and both lights are aria-hidden. Every control is at least 44 by 44, focus rings are 2px with a 2px offset (amber 700 on the light stage, amber 500 on the dark one), and all text passes AA on both stages.

Theme it with the card's own custom properties with literal fallbacks to the page primitives, light by default and flipped under a dark stage. Dark stage: ink case, amber glare at about 0.22 alpha, cool rim 300 edge, brass rings glowing warm. Light stage: white case with a faint ink inner shadow, the glare a white highlight with an amber 700 tint at its falloff, rim 600 edge, graphite rings near black.

Performance: zero WebGL, transform and opacity only, will-change on every moving layer, no filters, no backdrop blur and no blend modes anywhere, GSAP's ticker only, every tween inside useGSAP and reverted on unmount. Keep the pure tilt, glare, rim and spread math in its own file with unit tests, and every file under 300 lines.`,
};
