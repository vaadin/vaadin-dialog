/**
 * Checks if the argument is a touch event and if so, returns a first touch.
 * Otherwise, if the mouse event was passed, returns it as is.
 * @param {!MouseEvent | !TouchEvent} e
 * @return {!MouseEvent | !Touch}
 */
export function getMouseOrFirstTouchEvent(e) {
  return e.touches ? e.touches[0] : e;
}

/**
 * Retrieves the coordinates of the given `vaadin-overlay` element.
 * @param {!OverlayElement} element
 * @return {!DialogOverlayBounds}
 */
export function getOverlayBounds(element) {
  const overlay = element.$.overlay;
  const overlayBounds = overlay.getBoundingClientRect();
  const containerBounds = element.getBoundingClientRect();
  const top = overlayBounds.top - containerBounds.top;
  const left = overlayBounds.left - containerBounds.left;
  const width = overlayBounds.width;
  const height = overlayBounds.height;
  return {top, left, width, height};
}

/**
 * Checks whether a mouse or touch event is in window.
 * @param {!MouseEvent | !TouchEvent} e
 * @return {boolean}
 */
export function eventInWindow(e) {
  return e.clientX >= 0 && e.clientX <= window.innerWidth && e.clientY >= 0 && e.clientY <= window.innerHeight;
}

/**
 * Safari 13 renders overflowing elements incorrectly.
 * This forces it to recalculate height.
 * @param {!OverlayElement} element
 * @private
 */
function forceSafariReflow(element) {
  const scrollPosition = element.$.resizerContainer.scrollTop;
  const overlay = element.$.overlay;
  overlay.style.display = 'block';
  window.requestAnimationFrame(() => {
    overlay.style.display = '';
    element.$.resizerContainer.scrollTop = scrollPosition;
  });
}

/**
 * Updates the coordinates of the given `vaadin-overlay` element.
 * @param {!OverlayElement} element
 * @param {!DialogOverlayBoundsParam} bounds
 * @protected
 */
export function setOverlayBounds(element, bounds) {
  const overlay = element.$.overlay;
  const parsedBounds = Object.assign({}, bounds);

  if (overlay.style.position !== 'absolute') {
    overlay.style.position = 'absolute';
    element.setAttribute('has-bounds-set', '');
    forceSafariReflow(element);
  }

  for (const arg in parsedBounds) {
    if (typeof parsedBounds[arg] === 'number') {
      parsedBounds[arg] = `${parsedBounds[arg]}px`;
    }
  }

  Object.assign(overlay.style, parsedBounds);
}
