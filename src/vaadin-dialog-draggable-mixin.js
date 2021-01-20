const TOUCH_DEVICE = (() => {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
})();

/**
 * @polymerMixin
 */
export const DialogDraggableMixin = (superClass) =>
  class VaadinDialogDraggableMixin extends superClass {
    static get properties() {
      return {
        /** @private */
        _touchDevice: {
          type: Boolean,
          value: TOUCH_DEVICE
        },

        /* TODO: Expose as a public property (check naming) */
        __dragHandleClassName: {
          type: String
        }
      };
    }

    /** @protected */
    ready() {
      super.ready();
      this._originalBounds = {};
      this._originalMouseCoords = {};
      this._startDrag = this._startDrag.bind(this);
      this._drag = this._drag.bind(this);
      this._stopDrag = this._stopDrag.bind(this);
      this.$.overlay.$.overlay.addEventListener('mousedown', this._startDrag);
      this.$.overlay.$.overlay.addEventListener('touchstart', this._startDrag);
    }

    /** @private */
    _startDrag(e) {
      // Don't initiate when there's more than 1 touch (pinch zoom)
      if (e.type === 'touchstart' && e.touches.length > 1) {
        return;
      }

      if (this.draggable && (e.button === 0 || e.touches)) {
        const resizerContainer = this.$.overlay.$.resizerContainer;
        const isResizerContainer = e.target === resizerContainer;
        const isResizerContainerScrollbar = e.offsetX > resizerContainer.clientWidth || e.offsetY > resizerContainer.clientHeight;
        const isContentPart = e.target === this.$.overlay.$.content;

        const isDraggable = e.composedPath().some((node, index) => {
          if (node.classList) {
            const isDraggableNode = node.classList.contains(this.__dragHandleClassName || 'draggable');
            const isDraggableLeafOnly = node.classList.contains('draggable-leaf-only');
            const isLeafNode = index === 0;
            return (isDraggableLeafOnly && isLeafNode) || (isDraggableNode && (!isDraggableLeafOnly || isLeafNode));
          }
        });

        if ((isResizerContainer && !isResizerContainerScrollbar) || isContentPart || isDraggable) {
          !isDraggable && e.preventDefault();
          this._originalBounds = this._getOverlayBounds();
          const event = this.__getMouseOrFirstTouchEvent(e);
          this._originalMouseCoords = {top: event.pageY, left: event.pageX};
          window.addEventListener('mouseup', this._stopDrag);
          window.addEventListener('touchend', this._stopDrag);
          window.addEventListener('mousemove', this._drag);
          window.addEventListener('touchmove', this._drag);
          if (this.$.overlay.$.overlay.style.position !== 'absolute') {
            this._setBounds(this._originalBounds);
          }
        }
      }
    }

    /** @private */
    _drag(e) {
      const event = this.__getMouseOrFirstTouchEvent(e);
      if (this._eventInWindow(event)) {
        const top = this._originalBounds.top + (event.pageY - this._originalMouseCoords.top);
        const left = this._originalBounds.left + (event.pageX - this._originalMouseCoords.left);
        this._setBounds({top, left});
      }
    }

    /** @private */
    _stopDrag() {
      window.removeEventListener('mouseup', this._stopDrag);
      window.removeEventListener('touchend', this._stopDrag);
      window.removeEventListener('mousemove', this._drag);
      window.removeEventListener('touchmove', this._drag);
    }
  };
