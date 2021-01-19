import {OverlayElement} from '@vaadin/vaadin-overlay';

import {DialogOverlayBounds, DialogOverlayBoundsParam} from '../@types/interfaces';

/**
 * Checks if the argument is a touch event and if so, returns a first touch.
 * Otherwise, if the mouse event was passed, returns it as is.
 */
declare function getMouseOrFirstTouchEvent(e: MouseEvent|TouchEvent): MouseEvent|Touch;

export {getMouseOrFirstTouchEvent};

/**
 * Retrieves the coordinates of the given `vaadin-overlay` element.
 */
declare function getOverlayBounds(element: OverlayElement): DialogOverlayBounds;

export {getOverlayBounds};

/**
 * Checks whether a mouse or touch event is in window.
 */
declare function eventInWindow(e: MouseEvent | TouchEvent): boolean;

export {eventInWindow};

/**
 * Retrieves the coordinates of the given `vaadin-overlay` element.
 */
declare function setOverlayBounds(element: OverlayElement, bounds: DialogOverlayBoundsParam): void;

export {setOverlayBounds};
