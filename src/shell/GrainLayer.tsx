/** Fixed grain over the frame at 5%. Never intercepts input; never scrolls. */
export default function GrainLayer() {
  return <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[1]" />;
}
