export function hide(selector: string) {
    document.querySelector<HTMLElement>(selector)?.style.setProperty(
        "display",
        "none"
    );
}

export function setHeight(element: HTMLElement, px: number) {
    element.style.setProperty(
        "height",
        `${px}px`
    );
}

export function setSize(element: HTMLElement, px: number) {
    element.style.setProperty(
        "height",
        `${px}px`
    );
    element.style.setProperty(
        "width",
        `${px}px`
    );
}
