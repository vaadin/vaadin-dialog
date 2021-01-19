import {PolymerElement} from '@polymer/polymer/polymer-element.js';

import {OverlayElement} from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';

import {ElementMixin} from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

import {FlattenedNodesObserver} from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';

import {ThemePropertyMixin} from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

import {DialogDraggableMixin} from './vaadin-dialog-draggable-mixin.js';

import {DialogResizableMixin} from './vaadin-dialog-resizable-mixin.js';

import {IronResizableBehavior} from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';

import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';

import {html} from '@polymer/polymer/lib/utils/html-tag.js';

/**
 * `<vaadin-dialog>` is a Web Component for creating customized modal dialogs. The content of the
 * dialog can be populated in two ways: imperatively by using renderer callback function and
 * declaratively by using Polymer's Templates.
 *
 * ### Rendering
 *
 * By default, the dialog uses the content provided by using the renderer callback function.
 *
 * The renderer function provides `root`, `dialog` arguments.
 * Generate DOM content, append it to the `root` element and control the state
 * of the host element by accessing `dialog`. Before generating new content,
 * users are able to check if there is already content in `root` for reusing it.
 *
 * ```html
 * <vaadin-dialog id="dialog"></vaadin-dialog>
 * ```
 * ```js
 * const dialog = document.querySelector('#dialog');
 * dialog.renderer = function(root, dialog) {
 *   root.textContent = "Sample dialog";
 * };
 * ```
 *
 * Renderer is called on the opening of the dialog.
 * DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * ### Polymer Templates
 *
 * Alternatively, the content can be provided with Polymer's Template.
 * Dialog finds the first child template and uses that in case renderer callback function
 * is not provided. You can also set a custom template using the `template` property.
 *
 * ```html
 * <vaadin-dialog opened>
 *   <template>
 *     Sample dialog
 *   </template>
 * </vaadin-dialog>
 * ```
 *
 * ### Styling
 *
 * See [`<vaadin-overlay>` documentation](https://github.com/vaadin/vaadin-overlay/blob/master/src/vaadin-overlay.html)
 * for `<vaadin-dialog-overlay>` parts.
 *
 * Note: the `theme` attribute value set on `<vaadin-dialog>` is
 * propagated to the internal `<vaadin-dialog-overlay>` component.
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 */
declare class DialogElement extends
  ThemePropertyMixin(
  ElementMixin(
  DialogDraggableMixin(
  DialogResizableMixin(
  PolymerElement)))) {

  /**
   * True if the overlay is currently displayed.
   */
  opened: boolean;

  /**
   * Set to true to disable closing dialog on outside click
   * @attr {boolean} no-close-on-outside-click
   */
  noCloseOnOutsideClick: boolean;

  /**
   * Set to true to disable closing dialog on Escape press
   * @attr {boolean} no-close-on-esc
   */
  noCloseOnEsc: boolean;

  /**
   * Set the `aria-label` attribute for assistive technologies like
   * screen readers. An `undefined` value for this property (the
   * default) means that the `aria-label` attribute is not present at
   * all.
   */
  ariaLabel: string|null|undefined;
  _contentTemplate: HTMLTemplateElement|null|undefined;

  /**
   * Custom function for rendering the content of the dialog.
   * Receives two arguments:
   *
   * - `root` The root container DOM element. Append your content to it.
   * - `dialog` The reference to the `<vaadin-dialog>` element.
   */
  renderer: DialogRenderer|null|undefined;

  /**
   * Set to true to remove backdrop and allow click events on background elements.
   */
  modeless: boolean;

  /**
   * Set to true to enable repositioning the dialog by clicking and dragging.
   *
   * By default, only the overlay area can be used to drag the element. But,
   * a child element can be marked as a draggable area by adding a
   * "`draggable`" class to it, this will by default make all of its children draggable also.
   * If you want a child element to be draggable
   * but still have its children non-draggable (by default), mark it with
   * "`draggable-leaf-only`" class name.
   */
  draggable: boolean;

  /**
   * Set to true to enable resizing the dialog by dragging the corners and edges.
   */
  resizable: boolean;
  ready(): void;
  disconnectedCallback(): void;
  _setTemplateFromNodes(nodes: Node[]): void;

  /**
   * Manually invoke existing renderer.
   */
  render(): void;
  _setBounds(bounds: DialogOverlayBoundsParam): void;
  _getOverlayBounds(): DialogOverlayBounds;
  _eventInWindow(e: MouseEvent|TouchEvent): boolean;
  __getMouseOrFirstTouchEvent(e: MouseEvent|TouchEvent): MouseEvent|Touch;
}

declare global {

  interface HTMLElementTagNameMap {
    "vaadin-dialog": DialogElement;
  }
}

export {DialogElement};

import {DialogRenderer} from '../@types/interfaces';

import {DialogOverlayBoundsParam} from '../@types/interfaces';

import {DialogOverlayBounds} from '../@types/interfaces';
