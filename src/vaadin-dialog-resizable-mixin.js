const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="vaadin-dialog-resizable-overlay-styles" theme-for="vaadin-dialog-overlay">
  <template>
    <style>
      [part='overlay'] {
        position: relative;
        overflow: visible;
        max-height: 100%;
        display: flex;
      }

      [part='content'] {
        box-sizing: border-box;
        height: 100%;
      }

      .resizer-container {
        overflow: auto;
        flex-grow: 1;
      }

      [part='overlay'][style] .resizer-container {
        min-height: 100%;
        width: 100%;
      }

      :host(:not([resizable])) .resizer {
        display: none;
      }

      .resizer {
        position: absolute;
        height: 16px;
        width: 16px;
      }

      .resizer.edge {
        height: 8px;
        width: 8px;
        top: -4px;
        right: -4px;
        bottom: -4px;
        left: -4px;
      }

      .resizer.edge.n {
        width: auto;
        bottom: auto;
        cursor: ns-resize;
      }

      .resizer.ne {
        top: -4px;
        right: -4px;
        cursor: nesw-resize;
      }

      .resizer.edge.e {
        height: auto;
        left: auto;
        cursor: ew-resize;
      }

      .resizer.se {
        bottom: -4px;
        right: -4px;
        cursor: nwse-resize;
      }

      .resizer.edge.s {
        width: auto;
        top: auto;
        cursor: ns-resize;
      }

      .resizer.sw {
        bottom: -4px;
        left: -4px;
        cursor: nesw-resize;
      }

      .resizer.edge.w {
        height: auto;
        right: auto;
        cursor: ew-resize;
      }

      .resizer.nw {
        top: -4px;
        left: -4px;
        cursor: nwse-resize;
      }

      /* IE11 -only CSS */
      _:-ms-fullscreen,
      [part='overlay'] {
        max-height: none;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);

/**
 * @polymerMixin
 */
export const DialogResizableMixin = (superClass) =>
  class VaadinDialogResizableMixin extends superClass {
    /** @protected */
    ready() {
      super.ready();
      this._originalBounds = {};
      this._originalMouseCoords = {};
      this._resizeListeners = {start: {}, resize: {}, stop: {}};
      this._addResizeListeners();
    }

    /** @private */
    _addResizeListeners() {
      // Note: edge controls added before corners
      ['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'].forEach((direction) => {
        const resizer = document.createElement('div');
        this._resizeListeners.start[direction] = (e) => this._startResize(e, direction);
        this._resizeListeners.resize[direction] = (e) => this._resize(e, direction);
        this._resizeListeners.stop[direction] = () => this._stopResize(direction);
        if (direction.length === 1) {
          resizer.classList.add('edge');
        }
        resizer.classList.add('resizer');
        resizer.classList.add(direction);
        resizer.addEventListener('mousedown', this._resizeListeners.start[direction]);
        resizer.addEventListener('touchstart', this._resizeListeners.start[direction]);
        this.$.overlay.$.resizerContainer.appendChild(resizer);
      });
    }

    /**
     * @param {!MouseEvent | !TouchEvent} e
     * @param {!DialogResizableDirection} direction
     * @protected
     */
    _startResize(e, direction) {
      // Don't initiate when there's more than 1 touch (pinch zoom)
      if (e.type === 'touchstart' && e.touches.length > 1) {
        return;
      }

      if (e.button === 0 || e.touches) {
        e.preventDefault();

        this._originalBounds = this._getOverlayBounds();
        const event = this.__getMouseOrFirstTouchEvent(e);
        this._originalMouseCoords = {top: event.pageY, left: event.pageX};
        window.addEventListener('mousemove', this._resizeListeners.resize[direction]);
        window.addEventListener('touchmove', this._resizeListeners.resize[direction]);
        window.addEventListener('mouseup', this._resizeListeners.stop[direction]);
        window.addEventListener('touchend', this._resizeListeners.stop[direction]);
        if (this.$.overlay.$.overlay.style.position !== 'absolute') {
          this._setBounds(this._originalBounds);
        }
      }
    }

    /**
     * @param {!MouseEvent | !TouchEvent} e
     * @param {!DialogResizableDirection} resizer
     * @protected
     */
    _resize(e, resizer) {
      const event = this.__getMouseOrFirstTouchEvent(e);
      if (this._eventInWindow(event)) {
        const minimumSize = 40;
        resizer.split('').forEach((direction) => {
          switch (direction) {
            case 'n': {
              const height = this._originalBounds.height - (event.pageY - this._originalMouseCoords.top);
              const top = this._originalBounds.top + (event.pageY - this._originalMouseCoords.top);
              if (height > minimumSize) {
                this._setBounds({top, height});
              }
              break;
            }
            case 'e': {
              const width = this._originalBounds.width + (event.pageX - this._originalMouseCoords.left);
              if (width > minimumSize) {
                this._setBounds({width});
              }
              break;
            }
            case 's': {
              const height = this._originalBounds.height + (event.pageY - this._originalMouseCoords.top);
              if (height > minimumSize) {
                this._setBounds({height});
              }
              break;
            }
            case 'w': {
              const width = this._originalBounds.width - (event.pageX - this._originalMouseCoords.left);
              const left = this._originalBounds.left + (event.pageX - this._originalMouseCoords.left);
              if (width > minimumSize) {
                this._setBounds({left, width});
              }
              break;
            }
          }
        });

        this.$.overlay.notifyResize();
      }
    }

    /**
     * @param {!DialogResizableDirection} direction
     * @protected
     */
    _stopResize(direction) {
      window.removeEventListener('mousemove', this._resizeListeners.resize[direction]);
      window.removeEventListener('touchmove', this._resizeListeners.resize[direction]);
      window.removeEventListener('mouseup', this._resizeListeners.stop[direction]);
      window.removeEventListener('touchend', this._resizeListeners.stop[direction]);
      this.dispatchEvent(new CustomEvent('resize', {detail: this._getResizeDimensions()}));
    }

    /**
     * @return {!DialogResizeDimensions}
     * @protected
     */
    _getResizeDimensions() {
      const scrollPosition = this.$.overlay.$.resizerContainer.scrollTop;
      const {width, height} = getComputedStyle(this.$.overlay.$.overlay);
      const content = this.$.overlay.$.content;
      content.setAttribute('style', 'position: absolute; top: 0; right: 0; bottom: 0; left: 0; box-sizing: content-box; height: auto;');
      const {width: contentWidth, height: contentHeight} = getComputedStyle(content);
      content.removeAttribute('style');
      this.$.overlay.$.resizerContainer.scrollTop = scrollPosition;
      return {width, height, contentWidth, contentHeight};
    }
  };
