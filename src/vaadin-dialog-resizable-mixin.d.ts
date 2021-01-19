/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   src/vaadin-dialog-resizable-mixin.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

export {DialogResizableMixin};

declare function DialogResizableMixin<T extends new (...args: any[]) => {}>(base: T): T & DialogResizableMixinConstructor;

interface DialogResizableMixinConstructor {
  new(...args: any[]): DialogResizableMixin;
}

export {DialogResizableMixinConstructor};

interface DialogResizableMixin {
  ready(): void;
  _startResize(e: MouseEvent|TouchEvent, direction: DialogResizableDirection): void;
  _resize(e: MouseEvent|TouchEvent, resizer: DialogResizableDirection): void;
  _stopResize(direction: DialogResizableDirection): void;
  _getResizeDimensions(): DialogResizeDimensions;
}

import {DialogResizableDirection} from '../@types/interfaces';

import {DialogResizeDimensions} from '../@types/interfaces';
