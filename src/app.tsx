type SwipeCallbacks = {
  left?: () => void;
  right?: () => void;
};

async function waitFor(predicate: () => boolean, intervalMs = 100): Promise<void> {
  while (!predicate()) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

/** Resolves once the given selector is in the DOM, returning the element. */
async function waitForElement<T extends HTMLElement>(
  selector: string,
  intervalMs = 100,
): Promise<T> {
  await waitFor(() => document.querySelector(selector) !== null, intervalMs);
  return document.querySelector<T>(selector)!;
}

function handleHorizontalSwipe(
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

async function main(): Promise<void> {
  await waitFor(() => Boolean(Spicetify?.Platform && Spicetify?.Player));

  const mainView = await waitForElement(".Root__main-view");
  const nowPlayingBar = await waitForElement(".Root__now-playing-bar");

  handleHorizontalSwipe(mainView, {
    left: () => Spicetify.Platform.History.goBack(),
    right: () => Spicetify.Platform.History.goForward(),
  });

  handleHorizontalSwipe(nowPlayingBar, {
    left: () => {
      Spicetify.Player.seek(0);
      Spicetify.Player.back();
    },
    right: () => Spicetify.Player.next(),
  }, 20);
}

export default main;
