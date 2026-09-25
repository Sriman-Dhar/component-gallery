# Decision Engine — deciding what the product needs before deciding how it looks

Read this when Phase 1 is non-obvious: a new product category, a vague brief, a redesign
where the existing thing is bad but you can't yet say *why*, or a stakeholder asking for a
look ("make it premium") rather than an outcome.

---

## 1. The interrogation

Answer every line. Where the brief is silent, infer and mark it `(inferred)` so a wrong
assumption is visible and cheap to correct later, rather than buried in the design.

### The user

- Who are they, concretely? Not "users" — "an ops manager reconciling invoices on the last
  day of the month".
- What state of mind are they in when they arrive? Bored, anxious, skeptical, rushed,
  curious, obligated. This drives register more than any brand adjective does.
- How much do they already know? A first-time visitor and a daily operator need opposite
  interfaces, and most bad products try to serve both with one.
- How often do they come back? Once-ever surfaces optimize for comprehension; daily
  surfaces optimize for speed and stop explaining themselves.
- What is the cost of a mistake to them? High cost buys you confirmations, undo, and
  visual calm. Low cost buys you speed and playfulness.

### The job

- The single job, in the user's words, with a verb and an outcome.
- What are they doing immediately before and after? The screen is a step in a path, and
  designing it as an island is why so many flows feel disjointed.
- What is the shortest honest path to done? Count the decisions, not the clicks — a
  decision costs far more than a click.
- What blocks them today? Missing information, unclear language, too many equal options,
  no feedback, fear of an irreversible action.

### The content

- What information must be visible at all times? That is the spine of the layout.
- What can be revealed on demand? Progressive disclosure is a hierarchy tool, not a
  tidiness trick.
- What is currently loud but unimportant? Almost every redesign is mostly subtraction.
- Real data shape: how long do the strings actually get, how many rows in the worst case,
  what happens with one item, zero items, 10,000 items? Design against real extremes, not
  the demo data.

### The action

- The one primary action per screen. If you can name two, you have two screens or a
  hierarchy problem.
- What is destructive or irreversible? It needs friction, a different visual weight, and
  an escape route.
- What should be effortless to the point of invisible?
- What deserves to feel deliberate? Slowness is a feature when the stakes are real.

### The register and the constraints

- Emotional register, in adjectives you can act on: *calm, precise, warm, austere, urgent,
  confident, playful*. "Modern" and "clean" are not directions — everyone says them and
  they constrain nothing.
- Honest complexity level: art gallery (1–3), product (4–6), cockpit (7–10). Forcing a
  dense product into a minimal aesthetic hides the information the user came for.
- Platform and breakpoints, including whether mobile is the primary surface or an
  afterthought the brief hasn't admitted to yet.
- **Overriding constraints** — regulated industry, public sector, medical, financial,
  accessibility-critical audience, low-bandwidth market, kids. When present, these beat
  every aesthetic preference. Say so explicitly in the brief; a stakeholder who wants a
  cinematic hero on a benefits-claim service needs to hear the trade-off in one sentence,
  not discover it at audit.

---

## 2. The Design Read

Compress the interrogation into one sentence you can hold in your head for the rest of the
project:

> Reading this as: **[product kind]** for **[audience in their real state of mind]**, whose
> single job is **[job]**, in a **[register]** register, at **[complexity level]**.

Worked examples:

- *B2B SaaS landing for skeptical technical buyers who have already seen four competitors
  today, whose single job is deciding whether this is worth a trial, in a precise and
  unhurried register, at complexity 4.*
- *Internal reconciliation dashboard for an ops lead on deadline, whose single job is
  finding the three rows that don't balance, in a calm and instrument-like register, at
  complexity 8.*
- *Solo designer portfolio for hiring managers scanning in under a minute, whose single job
  is judging craft fast, in a confident editorial register, at complexity 3.*
- *Public benefits application for anxious first-time claimants on old Android phones,
  whose single job is finishing without abandoning, in a plain reassuring register, at
  complexity 2, accessibility overriding everything.*

Notice what each read already rules out. The reconciliation dashboard cannot have a
cinematic hero. The benefits application cannot have scroll-jacking. Half the design
decisions are made by an honest read.

---

## 3. When to ask, when to decide

**Decide yourself** when the answer follows from context, when either option is
recoverable, or when it is a matter of craft rather than intent. Stating the assumption in
the brief is enough — that is what the brief is for.

**Ask exactly one question** when two readings would produce genuinely different products
and you have no basis to choose. Make it binary and concrete:

- *"Is this closer to Linear-clean or Awwwards-experimental?"*
- *"Is the primary user a first-time visitor, or someone who logs in daily?"*
- *"Is mobile the main surface here, or desktop-first?"*

**Never** send a multi-question dump. It reads as an unwillingness to think, it stalls the
work, and the answers you get back are usually worse than the inference you would have
made yourself.

---

## 4. Redesigns: audit before you touch anything

A redesign that starts with a new aesthetic is a re-skin, and re-skins recreate the
original problems in nicer clothes.

1. **What works today?** Name it explicitly and protect it. Users have muscle memory, and
   throwing away a working pattern costs real trust.
2. **What is actually broken?** Separate the three failure kinds — they have different
   fixes and confusing them is why redesigns miss:
   - *Structural* — wrong information architecture, wrong hierarchy. No amount of visual
     work fixes this.
   - *Visual* — right structure, dated or incoherent surface.
   - *Behavioural* — right structure and surface, bad feedback, states, or motion.
3. **What is load-bearing?** Brand assets, existing user habits, integrations, content that
   cannot change, SEO-critical structure.
4. **Preserve or overhaul?** Decide once, out loud, and hold it. Half-overhauls produce
   interfaces that feel like two products stapled together.
5. **What is the one thing** that will make people say it's better? Redesigns are judged on
   a single felt improvement, not on a list of changes.

Record the audit in the brief. When someone later asks why a familiar element survived, the
answer should already be written down.
