export {DialogDraggableMixin};

declare function DialogDraggableMixin<T extends new (...args: any[]) => {}>(base: T): T & DialogDraggableMixinConstructor;

interface DialogDraggableMixinConstructor {
  new(...args: any[]): DialogDraggableMixin;
}

export {DialogDraggableMixinConstructor};

interface DialogDraggableMixin {
}
