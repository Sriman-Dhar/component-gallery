# Scroll-driven 3D — GSAP ScrollTrigger ↔ R3F bridge

## The one rule

**One scroll source of truth.** GSAP ScrollTrigger owns scroll measurement and
DOM animation; the 3D scene *reads* scroll progress from it. Never run drei's
`ScrollControls` and ScrollTrigger on the same page — two scroll systems fight
and one always stutters. (Use `ScrollControls` only in canvas-only pages with no
DOM choreography.)

## The bridge pattern

ScrollTrigger writes progress into a plain mutable object; `useFrame` reads and
eases it. No React state, no re-renders, no coupling.

```tsx
// scrollState.ts — module singleton
export const scrollState = { progress: 0, velocity: 0 }
```

```tsx
// DOM side (any component, or a top-level effect)
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

useEffect(() => {
  const st = ScrollTrigger.create({
    trigger: '#story',            // the DOM section driving the scene
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      scrollState.progress = self.progress          // 0 → 1
      scrollState.velocity = self.getVelocity() / 1000
    },
  })
  return () => st.kill()
}, [])
```

```tsx
// 3D side — consume with damping so motion feels expensive, not robotic
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from './scrollState'

function Rig() {
  const group = useRef<THREE.Group>(null)
  const eased = useRef(0)
  useFrame((state, delta) => {
    if (!group.current) return
    eased.current = THREE.MathUtils.damp(eased.current, scrollState.progress, 4, delta)
    const p = eased.current
    group.current.rotation.y = p * Math.PI * 2
    state.camera.position.z = 5 - p * 2
    state.camera.lookAt(0, 0, 0)
  })
  return <group ref={group}>…</group>
}
```

Why damp (not raw progress): scroll input is stepped and jittery; `damp` is
frame-rate-independent easing that turns steps into glide. Factor 3–6 = heavy
and cinematic, 8–12 = tight and responsive.

## Choreographing multi-beat scenes

For a scene with distinct beats (hero → explode → reassemble → CTA), map
sub-ranges of progress instead of one linear tween:

```tsx
// utils
const range = (p: number, a: number, b: number) =>
  THREE.MathUtils.clamp((p - a) / (b - a), 0, 1)

useFrame(() => {
  const p = eased.current
  const explode  = range(p, 0.15, 0.45)   // beat 2
  const reform   = range(p, 0.55, 0.8)    // beat 3
  parts.forEach((part, i) => {
    const spread = explode * (1 - reform)
    part.position.lerpVectors(home[i], exploded[i], easeInOut(spread))
  })
})
```

Alternative: build a paused GSAP timeline that tweens a proxy object, and scrub
it — you get GSAP's easing/stagger vocabulary for 3D values:

```tsx
const proxy = useRef({ spread: 0, camZ: 5 })
useEffect(() => {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#story', start: 'top top', end: 'bottom bottom', scrub: 1 },
  })
  tl.to(proxy.current, { spread: 1, ease: 'power2.inOut' })
    .to(proxy.current, { camZ: 3, ease: 'power1.out' }, '<')
    .to(proxy.current, { spread: 0, ease: 'power3.inOut' })
  return () => { tl.scrollTrigger?.kill(); tl.kill() }
}, [])
// useFrame reads proxy.current.* and applies to objects (still no setState)
```

`scrub: 1` (a number, not `true`) gives built-in smoothing — if you use it,
don't damp again in `useFrame`; pick one smoothing layer.

## Pinned scene + swapping DOM copy

The classic structure — canvas fixed behind, a tall scroll container defining
the duration, copy blocks fading in per beat:

```html
<div class="fixed inset-0 -z-10"><!-- Canvas --></div>
<section id="story" class="relative h-[400vh]">
  <div class="sticky top-0 h-screen">
    <div data-beat="0">Copy for beat 1</div>
    <div data-beat="1">Copy for beat 2</div>
    …
  </div>
</section>
```

Drive the copy with the same ScrollTrigger (or matching sub-triggers) so text
beats land exactly on scene beats — that synchronization is what makes it feel
authored rather than decorated.

## Mouse parallax layered on scroll

```tsx
useFrame((state, delta) => {
  // state.pointer is normalized -1..1
  easing.damp3(camOffset.current,
    [state.pointer.x * 0.3, state.pointer.y * 0.2, 0], 0.25, delta)
  state.camera.position.x = basePos.x + camOffset.current[0]
  state.camera.position.y = basePos.y + camOffset.current[1]
})
```

Keep amplitude small (0.2–0.5 units) — parallax is a seasoning, not a mechanic.
Skip pointer motion entirely under `prefers-reduced-motion`.

## Cleanup + resize

- Kill every ScrollTrigger on unmount (`st.kill()` / `tl.scrollTrigger?.kill()`).
- After images/fonts load or layout shifts: `ScrollTrigger.refresh()`.
- If the site uses Lenis smooth scroll: register it once —
  `lenis.on('scroll', ScrollTrigger.update)` and drive Lenis from `gsap.ticker`.
  The bridge above needs no changes; ScrollTrigger still owns measurement.
