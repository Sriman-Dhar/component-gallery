# Experience Completeness — the product is not the screenshot

Read this in Phase 5, and again whenever you are about to call a component "done".

A beautiful dashboard with a broken empty state is still a broken product wearing expensive
shoes. The happy path is the easiest 30% of the work and the only part that shows up in a
portfolio, which is exactly why it is the part that gets finished.

---

## 1. The state matrix

Every surface that loads, submits, or changes needs each of these considered. "Considered"
can mean "deliberately out of scope" — but that must be a decision, not an oversight.

| State | The question it answers | Common failure |
|---|---|---|
| **First run** | What does a brand-new user see before any data exists? | Designed as if the account is already full |
| **Empty** | Nothing here yet — is that a dead end or an invitation? | A grey box saying "No data" |
| **Loading** | Something is happening — for how long, and can I still act? | Centred spinner that hides the layout |
| **Partial** | Some data arrived, some didn't | Whole page blocks on the slowest request |
| **Success** | It worked — what changed, and what now? | Silent success; the user re-submits |
| **Error** | It failed — why, and what can I do? | "Something went wrong" with no recovery |
| **Validation** | This input is wrong — which one, and what's valid? | Error on submit only, generic message |
| **Disabled** | Why can't I do this, and what would unlock it? | Greyed out with no explanation |
| **Offline** | Connection lost — is my work safe? | Silent data loss |
| **Permission denied** | I can't see this — is that expected? | 403 as a raw error page |
| **Overflow** | 10,000 rows, a 200-character name, 30 tags | Layout breaks, text clips |
| **Stale** | This data is old — do I know that? | Confidently displayed wrong numbers |

### Getting these right

- **Empty states carry the most product value per pixel.** A first-run empty state is the
  best onboarding surface you will ever have: say what goes here, why it matters, and give
  the single action that fills it. Sample or illustrative content beats an empty rectangle.
- **Loading should preserve layout.** Skeletons shaped like the real content prevent the
  jump when data lands and communicate what is coming. A centred spinner tells the user
  nothing and makes the wait feel longer than it is.
- **Errors need a cause and a next step.** "Couldn't save — you're offline. We kept your
  changes and will retry" is a product. "Error" is an apology with no plan.
- **Validation should be inline, on blur, and specific.** Never placeholder-as-label —
  the requirement disappears exactly when the user needs it.
- **Disabled controls should explain themselves** on hover or focus. A disabled button with
  no reason is a dead end the user cannot debug.
- **Destructive actions need weight, confirmation, and undo.** Undo beats confirmation where
  it is technically possible: it is faster for the 99% and safer for the 1%.

---

## 2. Component state systems

A component is a state system, not a rectangle. Enumerate the states before styling any of
them — that ordering is what stops the hover state from being invented ad hoc at the end.

**Button:** default · hover · active · focus-visible · disabled · loading · success ·
destructive-variant. Loading must preserve width so the layout doesn't jump.

**Input:** empty · placeholder · focused · filled · valid · invalid · disabled · read-only ·
loading · with-help-text · with-error. Label above, help text present in markup, error
below.

**Card:** default · hover · selected · dragging · loading skeleton · empty variant ·
error variant. Ask whether it needs to be a card at all — a border-top or a divider often
groups better and adds less noise.

**Table:** populated · empty · loading · error · sorted · filtered-to-nothing · paginated ·
row-selected · row-hover · overflowing cell · single row · 10,000 rows.

**Navigation:** default · active item · hover · focus · collapsed · mobile · scrolled ·
overflow when labels don't fit.

**Modal:** entering · open · exiting · loading content · error content · scrolled content
too tall for the viewport · focus trapped · escape and backdrop dismissal.

**Form:** pristine · dirty · submitting · succeeded · failed · field-level errors ·
form-level error · unsaved-changes warning on navigate away.

**Chart:** normal · no data · one data point · loading · error · too many series ·
hover tooltip · keyboard-accessible alternative (a table, at minimum).

**Upload:** idle · drag-over · uploading with progress · succeeded · failed with retry ·
wrong file type · file too large.

---

## 3. Flow-level completeness

Zoom out from the screen to the journey. Most gaps live between screens, which is why
screen-by-screen design misses them.

- **Entry** — where do people arrive from, and does the page make sense from each entry?
- **Onboarding** — the first meaningful action, and how fast it can happen.
- **Interruption** — they close the tab mid-flow. Is progress kept?
- **Return** — a week later, do they know where they left off?
- **Search and filter** — including a search that finds nothing, which is a distinct state
  from empty and deserves different copy.
- **Settings** — where defaults are explained and destructive options live.
- **Notifications** — what interrupts, what waits, and how it's dismissed.
- **Exit** — cancelling, deleting, exporting, leaving. Products that make leaving hostile
  lose the readmission.

---

## 4. The completeness gate

Before "done", answer plainly:

1. Which states in the matrix did I actually build?
2. Which did I deliberately skip, and is that decision recorded?
3. What happens on the slowest connection and the oldest device in the audience?
4. What happens at content extremes — nothing, one, and far too many?
5. Can the whole flow be completed by keyboard alone?

Report what you verified and what you did not. An honest gap is a manageable risk; an
unstated gap is a defect waiting for a user to find.
