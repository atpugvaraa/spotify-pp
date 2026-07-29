export async function waitFor(predicate: () => boolean, intervalMs = 100): Promise<void> {
  while (!predicate()) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

/** Resolves once the given selector is in the DOM, returning the element. */
export async function waitForElement<T extends HTMLElement>(
  selector: string,
  intervalMs = 100,
): Promise<T> {
  await waitFor(() => document.querySelector(selector) !== null, intervalMs);
  return document.querySelector<T>(selector)!;
}
