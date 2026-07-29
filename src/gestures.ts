type SwipeCallbacks = {
  left?: () => void;
  right?: () => void;
};

export default function handleHorizontalSwipe(
  element: HTMLElement,
  callbacks: SwipeCallbacks,
  threshold = 80,
  idleMs = 150,
): void {
  let accumulated = 0;
  let locked = false;
  let idleTimer: number | undefined;

  element.addEventListener(
    "wheel",
    (e: WheelEvent) => {
      // Ignore vertical scrolls and the post-swipe momentum tail.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;

      // Reset once the burst goes quiet, so the next swipe starts fresh.
      clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        accumulated = 0;
        locked = false;
      }, idleMs);

      if (locked) return;
      accumulated += e.deltaX;

      if (accumulated > threshold) {
        callbacks.right?.();
        locked = true;
      } else if (accumulated < -threshold) {
        callbacks.left?.();
        locked = true;
      }
    },
    { passive: true },
  );
}
