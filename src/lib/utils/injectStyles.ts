const STYLE_ID = "react-visual-query-builder-style";

const STYLES = `
[data-drag-state = "idle"]{
  cursor: grab;
}
[data-drag-state = "dragging"]{
  cursor: grabbing;
}
`;

export function injectStyles(): void {
  let injected = false;

  function injectStylesHelper() {
    if (injected || typeof document === "undefined") return;

    if (document.getElementById(STYLE_ID)) {
      injected = true;
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = STYLES;
    document.head.appendChild(style);
    injected = true;
  }
  injectStylesHelper();
}
