"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  a: () => a,
  abbr: () => abbr,
  addModifier: () => addModifier,
  addRawStyle: () => addRawStyle,
  addStyles: () => addStyles,
  addTagModifier: () => addTagModifier,
  address: () => address,
  applyModification: () => applyModification,
  area: () => area,
  article: () => article,
  aside: () => aside,
  audio: () => audio,
  b: () => b,
  base: () => base,
  bdi: () => bdi,
  bdo: () => bdo,
  blockquote: () => blockquote,
  body: () => body,
  br: () => br,
  button: () => button,
  canvas: () => canvas,
  caption: () => caption,
  cite: () => cite,
  code: () => code,
  col: () => col,
  colgroup: () => colgroup,
  createController: () => createController,
  data: () => data,
  datalist: () => datalist,
  dd: () => dd,
  del: () => del,
  details: () => details,
  dfn: () => dfn,
  dialog: () => dialog,
  div: () => div,
  dl: () => dl,
  dt: () => dt,
  element: () => element,
  em: () => em,
  embed: () => embed,
  fieldset: () => fieldset,
  figcaption: () => figcaption,
  figure: () => figure,
  footer: () => footer,
  form: () => form,
  h1: () => h1,
  h2: () => h2,
  h3: () => h3,
  h4: () => h4,
  h5: () => h5,
  h6: () => h6,
  head: () => head,
  header: () => header,
  hgroup: () => hgroup,
  hr: () => hr,
  html: () => html,
  i: () => i,
  iframe: () => iframe,
  img: () => img,
  input: () => input,
  ins: () => ins,
  jsx: () => jsx,
  jsxDEV: () => jsxDEV,
  jsxs: () => jsxs,
  kbd: () => kbd,
  label: () => label,
  legend: () => legend,
  li: () => li,
  link: () => link,
  main: () => main,
  makeClassStyles: () => makeClassStyles,
  map: () => map,
  mark: () => mark,
  menu: () => menu,
  meta: () => meta,
  meter: () => meter,
  nav: () => nav,
  noscript: () => noscript,
  object: () => object,
  ol: () => ol,
  optgroup: () => optgroup,
  option: () => option,
  output: () => output,
  p: () => p,
  picture: () => picture,
  pre: () => pre,
  progress: () => progress,
  q: () => q,
  removeAllGeneratedStyles: () => removeAllGeneratedStyles,
  render: () => render,
  renderJsx: () => renderJsx,
  rp: () => rp,
  rt: () => rt,
  ruby: () => ruby,
  s: () => s,
  samp: () => samp,
  script: () => script,
  search: () => search,
  section: () => section,
  select: () => select,
  slot: () => slot,
  small: () => small,
  source: () => source,
  span: () => span,
  strong: () => strong,
  style: () => style,
  sub: () => sub,
  summary: () => summary,
  sup: () => sup,
  table: () => table,
  tbody: () => tbody,
  td: () => td,
  template: () => template,
  text: () => text,
  textarea: () => textarea,
  tfoot: () => tfoot,
  th: () => th,
  thead: () => thead,
  time: () => time,
  title: () => title,
  tr: () => tr,
  track: () => track,
  u: () => u,
  ul: () => ul,
  useController: () => useController,
  useFunctionController: () => useFunctionController,
  var_: () => var_,
  video: () => video,
  wbr: () => wbr
});
module.exports = __toCommonJS(src_exports);

// src/lifecycle/index.ts
var domListenKey = "elemiqDomListen";
var AttachedToDOMEvent = class extends Event {
  constructor() {
    super("attachedToDom", {
      bubbles: false,
      cancelable: false,
      composed: false
    });
  }
};
var DetachedFromDOMEvent = class extends Event {
  constructor() {
    super("detachedFromDom", {
      bubbles: false,
      cancelable: false,
      composed: false
    });
  }
};
function runMutationObserver() {
  const mutationObserver = new MutationObserver((mutations, observer) => {
    for (let mutation of mutations) {
      if (mutation.type === "childList") {
        if (mutation.addedNodes.length > 0) {
          for (let i2 = 0; i2 < mutation.addedNodes.length; ++i2) {
            const node = mutation.addedNodes[i2];
            if (node instanceof HTMLElement) {
              checkAndDispatchAttachedToDOMEvent(node);
            }
          }
        }
        if (mutation.removedNodes.length > 0) {
          for (let i2 = 0; i2 < mutation.removedNodes.length; ++i2) {
            const node = mutation.removedNodes[i2];
            if (node instanceof HTMLElement) {
              checkAndDispatchDetachedFromDOMEvent(node);
            }
          }
        }
      }
    }
  });
  mutationObserver.observe(document, {
    childList: true,
    subtree: true
  });
}
function checkAndDispatchAttachedToDOMEvent(node) {
  if (node.dataset[domListenKey] === "t") {
    node.dispatchEvent(new AttachedToDOMEvent());
  }
  if (node.children.length > 0) {
    for (let i2 = 0; i2 < node.children.length; ++i2) {
      const child = node.children[i2];
      if (child instanceof HTMLElement) {
        checkAndDispatchAttachedToDOMEvent(child);
      }
    }
  }
}
function checkAndDispatchDetachedFromDOMEvent(node) {
  if (node.dataset[domListenKey] === "t") {
    node.dispatchEvent(new DetachedFromDOMEvent());
  }
  if (node.children.length > 0) {
    for (let i2 = 0; i2 < node.children.length; ++i2) {
      const child = node.children[i2];
      if (child instanceof HTMLElement) {
        checkAndDispatchDetachedFromDOMEvent(child);
      }
    }
  }
}

// src/diff/object.ts
var import_eventiq = require("@tioniq/eventiq");
function getObjectValuesChanges(oldRecord, newRecord, equalityComparer) {
  if (!oldRecord) {
    return [null, newRecord];
  }
  if (!newRecord) {
    return [Object.keys(oldRecord), null];
  }
  let keysToDelete = null;
  let toAddOrChange = null;
  for (let key in oldRecord) {
    if (!(key in newRecord)) {
      if (keysToDelete === null) {
        keysToDelete = [key];
      } else {
        keysToDelete.push(key);
      }
    }
  }
  equalityComparer = equalityComparer || import_eventiq.defaultEqualityComparer;
  for (let key in newRecord) {
    const oldValue = oldRecord[key];
    if (oldValue === void 0) {
      if (toAddOrChange === null) {
        toAddOrChange = { [key]: newRecord[key] };
      } else {
        toAddOrChange[key] = newRecord[key];
      }
      continue;
    }
    if (!equalityComparer(oldValue, newRecord[key], key)) {
      if (toAddOrChange === null) {
        toAddOrChange = { [key]: newRecord[key] };
      } else {
        toAddOrChange[key] = newRecord[key];
      }
    }
  }
  return [keysToDelete, toAddOrChange];
}

// src/diff/array.ts
function getArrayChanges(oldArray, newArray) {
  const oldArrayLength = oldArray.length;
  const newArrayLength = newArray.length;
  const resultAdd = [];
  const resultRemove = [];
  const resultSwap = [];
  const result = {
    add: resultAdd,
    remove: resultRemove,
    swap: resultSwap
  };
  const newArrayData = newArray.map((item) => ({
    item,
    oldIndex: -1,
    moveIndex: -1
  }));
  for (let i2 = 0; i2 < oldArrayLength; i2++) {
    const oldItem = oldArray[i2];
    const newItemDataIndex = newArrayData.findIndex((data2) => data2.oldIndex === -1 && data2.item === oldItem);
    if (newItemDataIndex === -1) {
      resultRemove.push({
        item: oldItem,
        index: i2
      });
      continue;
    }
    const newData = newArrayData[newItemDataIndex];
    newData.oldIndex = i2;
    newData.moveIndex = i2;
  }
  const removedCount = resultRemove.length;
  if (removedCount > 0) {
    for (let i2 = 0; i2 < newArrayLength; ++i2) {
      const newItemData = newArrayData[i2];
      if (newItemData.oldIndex === -1) {
        continue;
      }
      let removesCount = 0;
      for (let j = 0; j < removedCount; ++j) {
        if (resultRemove[j].index < newItemData.oldIndex) {
          removesCount++;
        } else {
          break;
        }
      }
      newItemData.moveIndex -= removesCount;
    }
  }
  let addCounter = 0;
  for (let i2 = 0; i2 < newArrayLength; i2++) {
    const newItemData = newArrayData[i2];
    if (newItemData.oldIndex === -1) {
      resultAdd.push({
        item: newItemData.item,
        index: i2
      });
      addCounter++;
      continue;
    }
    newArrayData[i2].moveIndex += addCounter;
  }
  for (let i2 = 0; i2 < newArrayLength; i2++) {
    const newItemData = newArrayData[i2];
    if (newItemData.oldIndex === -1) {
      continue;
    }
    if (i2 === newItemData.moveIndex) {
      continue;
    }
    const swapWith = newArrayData[newItemData.moveIndex];
    resultSwap.push({
      item: newItemData.item,
      index: newItemData.moveIndex,
      newIndex: i2
    });
    swapWith.moveIndex = newItemData.moveIndex;
    newItemData.moveIndex = i2;
  }
  return result;
}

// node_modules/@tioniq/disposiq/dist/index.js
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
if (!("dispose" in Symbol)) {
  const disposeSymbol = Symbol("Symbol.dispose");
  Symbol.dispose = disposeSymbol;
}
if (!("asyncDispose" in Symbol)) {
  const asyncDisposeSymbol = Symbol("Symbol.asyncDispose");
  Symbol.asyncDispose = asyncDisposeSymbol;
}
var Disposiq = class {
  /**
   * Support for the internal Disposable API
   */
  [Symbol.dispose]() {
    this.dispose();
  }
};
var AsyncDisposiq = class extends Disposiq {
  /**
   * Support for the internal Disposable API
   */
  [Symbol.asyncDispose]() {
    return this.dispose();
  }
};
var AbortDisposable = class extends Disposiq {
  constructor(controller) {
    super();
    this._controller = controller;
  }
  /**
   * Returns true if the signal is aborted
   */
  get disposed() {
    return this._controller.signal.aborted;
  }
  /**
   * Returns the signal of the AbortController
   */
  get signal() {
    return this._controller.signal;
  }
  /**
   * Abort the signal
   */
  dispose() {
    this._controller.abort();
  }
};
var noop = Object.freeze(() => {
});
var noopAsync = Object.freeze(() => Promise.resolve());
var DisposableAction = class extends Disposiq {
  constructor(action) {
    super();
    this._disposed = false;
    this._action = typeof action === "function" ? action : noop;
  }
  /**
   * Returns true if the action has been disposed.
   */
  get disposed() {
    return this._disposed;
  }
  /**
   * Dispose the action. If the action has already been disposed, this is a
   * no-op.
   * If the action has not been disposed, the action is invoked and the action
   * is marked as disposed.
   */
  dispose() {
    if (this._disposed) {
      return;
    }
    this._disposed = true;
    this._action();
  }
};
var AsyncDisposableAction = class extends AsyncDisposiq {
  constructor(action) {
    super();
    this._disposed = false;
    this._action = typeof action === "function" ? action : noopAsync;
  }
  /**
   * Returns true if the action has been disposed.
   */
  get disposed() {
    return this._disposed;
  }
  /**
   * Dispose the action. If the action has already been disposed, this is a
   * no-op.
   * If the action has not been disposed, the action is invoked and the action
   * is marked as disposed.
   */
  dispose() {
    return __async(this, null, function* () {
      if (this._disposed) {
        return;
      }
      this._disposed = true;
      yield this._action();
    });
  }
};
var Node2 = class {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
};
var Queue = class {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  enqueue(value) {
    const node = new Node2(value);
    if (this.head) {
      this.tail.next = node;
      this.tail = node;
    } else {
      this.head = node;
      this.tail = node;
    }
    this.length++;
  }
  dequeue() {
    const current = this.head;
    if (current === null) {
      return null;
    }
    this.head = current.next;
    this.length--;
    return current.value;
  }
  isEmpty() {
    return this.length === 0;
  }
  getHead() {
    var _a, _b;
    return (_b = (_a = this.head) == null ? void 0 : _a.value) != null ? _b : null;
  }
  getLength() {
    return this.length;
  }
  forEach(consumer) {
    let current = this.head;
    while (current !== null) {
      consumer(current.value);
      current = current.next;
    }
  }
  toArray() {
    const result = [];
    let current = this.head;
    while (current !== null) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }
  clear() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
};
var ObjectPool = class {
  constructor(poolSize) {
    this._scrap = new Queue();
    this._size = poolSize;
  }
  get size() {
    return this._size;
  }
  set size(value) {
    this._size = value;
  }
  get all() {
    return this._scrap.toArray();
  }
  get full() {
    return this._scrap.length === this._size;
  }
  lift() {
    return this._scrap.length > 0 ? this._scrap.dequeue() : null;
  }
  throw(item) {
    if (this._scrap.length < this._size) {
      this._scrap.enqueue(item);
      return null;
    }
    if (this._size === 0) {
      return item;
    }
    const recycled = this._scrap.dequeue();
    this._scrap.enqueue(item);
    return recycled;
  }
  clear() {
    this._scrap.clear();
  }
};
var pool = new ObjectPool(10);
function disposeAll(disposables) {
  let size = disposables.length;
  if (size === 0) {
    return;
  }
  let holder = pool.lift();
  if (holder === null) {
    holder = new Array(size);
  } else {
    if (holder.length < size) {
      holder.length = size;
    }
  }
  for (let i2 = 0; i2 < size; i2++) {
    holder[i2] = disposables[i2];
  }
  disposables.length = 0;
  for (let i2 = 0; i2 < size; ++i2) {
    const disposable = holder[i2];
    if (!disposable) {
      continue;
    }
    if (typeof disposable === "function") {
      disposable();
    } else {
      disposable.dispose();
    }
  }
  holder.fill(void 0, 0, size);
  if (pool.full) {
    pool.size *= 2;
  }
  pool.throw(holder);
}
function disposeAllUnsafe(disposables) {
  for (let i2 = 0; i2 < disposables.length; ++i2) {
    const disposable = disposables[i2];
    if (!disposable) {
      continue;
    }
    if (typeof disposable === "function") {
      disposable();
    } else {
      disposable.dispose();
    }
  }
  disposables.length = 0;
}
var ObjectDisposedException = class extends Error {
  constructor(message) {
    super(message || "Object disposed");
  }
};
var DisposableStore = class _DisposableStore extends Disposiq {
  constructor() {
    super();
    this._disposed = false;
    this._disposables = new Array();
  }
  /**
   * Returns true if the object has been disposed.
   */
  get disposed() {
    return this._disposed;
  }
  /**
   * Add disposables to the store. If the store has already been disposed, the disposables will be disposed.
   * @param disposables disposables to add
   */
  add(...disposables) {
    this.addAll(disposables);
  }
  /**
   * Adds disposables to the container. If the container has already been disposed, the disposables will be disposed.
   * @param disposables Disposables to add.
   */
  addAll(disposables) {
    if (!disposables || disposables.length === 0) {
      return;
    }
    if (this._disposed) {
      for (const disposable of disposables) {
        if (!disposable) {
          continue;
        }
        if (typeof disposable === "function") {
          disposable();
        } else {
          disposable.dispose();
        }
      }
      return;
    }
    for (let i2 = 0; i2 < disposables.length; i2++) {
      const disposable = disposables[i2];
      if (!disposable) {
        continue;
      }
      this._disposables.push(typeof disposable === "function" ? new DisposableAction(disposable) : disposable);
    }
  }
  /**
   * Add a disposable to the store. If the store has already been disposed, the disposable will be disposed.
   * @param disposable a disposable to add
   * @returns the disposable object
   */
  addOne(disposable) {
    if (!disposable) {
      return;
    }
    if (this._disposed) {
      if (typeof disposable === "function") {
        disposable();
      } else {
        disposable.dispose();
      }
      return;
    }
    if (typeof disposable === "function") {
      disposable = new DisposableAction(disposable);
    }
    this._disposables.push(disposable);
  }
  /**
   * Remove a disposable from the store. If the disposable is found and removed, it will be disposed.
   * @param disposable a disposable to remove
   * @returns true if the disposable was found and removed
   */
  remove(disposable) {
    const index = this._disposables.indexOf(disposable);
    if (index === -1) {
      return false;
    }
    this._disposables.splice(index, 1);
    return true;
  }
  /**
   * @internal
   */
  addTimeout(callbackOrTimeout, timeout) {
    if (typeof callbackOrTimeout === "function") {
      const handle = setTimeout(callbackOrTimeout, timeout);
      this.add(() => clearTimeout(handle));
      return;
    }
    this.add(() => clearTimeout(callbackOrTimeout));
  }
  /**
   * @internal
   */
  addInterval(callbackOrInterval, interval) {
    if (typeof callbackOrInterval === "function") {
      const handle = setInterval(callbackOrInterval, interval);
      this.add(() => clearInterval(handle));
      return;
    }
    this.add(() => clearInterval(callbackOrInterval));
  }
  /**
   * Throw an exception if the object has been disposed.
   * @param message the message to include in the exception
   */
  throwIfDisposed(message) {
    if (this._disposed) {
      throw new ObjectDisposedException(message);
    }
  }
  /**
   * Dispose the store. If the store has already been disposed, this is a no-op.
   * If the store has not been disposed, all disposables added to the store will be disposed.
   */
  dispose() {
    if (this._disposed) {
      return;
    }
    this._disposed = true;
    disposeAllUnsafe(this._disposables);
  }
  /**
   * Dispose all disposables in the store. The store does not become disposed. The disposables are removed from the
   * store. The store can continue to be used after this method is called. This method is useful when the store is
   * used as a temporary container. The store can be disposed later by calling the dispose method. Calling add during
   * this method will safely add the disposable to the store without disposing it immediately.
   */
  disposeCurrent() {
    disposeAll(this._disposables);
  }
  static from(disposables, mapper) {
    if (typeof mapper === "function") {
      const store2 = new _DisposableStore();
      store2.addAll(disposables.map(mapper));
      return store2;
    }
    const store = new _DisposableStore();
    store.addAll(disposables);
    return store;
  }
};
var emptyPromise = Promise.resolve();
var EmptyDisposable = class extends AsyncDisposiq {
  dispose() {
    return emptyPromise;
  }
  [Symbol.dispose]() {
  }
  [Symbol.asyncDispose]() {
    return emptyPromise;
  }
};
var emptyDisposableImpl = new EmptyDisposable();
var emptyDisposable = Object.freeze(emptyDisposableImpl);
function createDisposable(disposableLike) {
  if (!disposableLike) {
    return emptyDisposable;
  }
  if (typeof disposableLike === "function") {
    return new DisposableAction(disposableLike);
  }
  if (typeof disposableLike !== "object") {
    return emptyDisposable;
  }
  if ("dispose" in disposableLike) {
    return disposableLike;
  }
  if (Symbol.dispose in disposableLike) {
    return new DisposableAction(() => {
      disposableLike[Symbol.dispose]();
    });
  }
  if (Symbol.asyncDispose in disposableLike) {
    return new AsyncDisposableAction(() => __async(this, null, function* () {
      yield disposableLike[Symbol.asyncDispose]();
    }));
  }
  if ("unref" in disposableLike) {
    return new DisposableAction(() => disposableLike.unref());
  }
  if (disposableLike instanceof AbortController) {
    return new AbortDisposable(disposableLike);
  }
  return emptyDisposable;
}
function createDisposiq(disposableLike) {
  if (!disposableLike) {
    return emptyDisposable;
  }
  if (disposableLike instanceof Disposiq) {
    return disposableLike;
  }
  if (typeof disposableLike === "function") {
    return new DisposableAction(disposableLike);
  }
  if (typeof disposableLike !== "object") {
    return emptyDisposable;
  }
  const hasDispose = "dispose" in disposableLike && typeof disposableLike.dispose === "function";
  const hasSymbolDispose = Symbol.dispose in disposableLike;
  if (hasDispose && hasSymbolDispose) {
    return new class extends Disposiq {
      dispose() {
        disposableLike.dispose();
      }
      [Symbol.dispose]() {
        disposableLike[Symbol.dispose]();
      }
    }();
  }
  if (hasDispose) {
    return new DisposableAction(() => disposableLike.dispose());
  }
  if (hasSymbolDispose) {
    return new DisposableAction(() => disposableLike[Symbol.dispose]());
  }
  if (Symbol.asyncDispose in disposableLike) {
    return new AsyncDisposableAction(() => __async(this, null, function* () {
      yield disposableLike[Symbol.asyncDispose]();
    }));
  }
  if ("unref" in disposableLike) {
    return new DisposableAction(() => disposableLike.unref());
  }
  if (disposableLike instanceof AbortController) {
    return new AbortDisposable(disposableLike);
  }
  return emptyDisposable;
}
Disposiq.prototype.disposeWith = function(container) {
  return container.add(this);
};
var ExceptionHandlerManager = class {
  /**
   * Create a new ExceptionHandlerManager with the default handler
   * @param defaultHandler the default handler. If not provided, the default handler will be a no-op
   */
  constructor(defaultHandler) {
    this._handler = this._defaultHandler = typeof defaultHandler === "function" ? defaultHandler : noop;
  }
  /**
   * Get the handler for the manager
   */
  get handler() {
    return this._handler;
  }
  /**
   * Set the handler for the manager
   */
  set handler(value) {
    this._handler = typeof value === "function" ? value : this._defaultHandler;
  }
  /**
   * Reset the handler to the default handler
   */
  reset() {
    this._handler = this._defaultHandler;
  }
  /**
   * Handle an exception
   * @param error the exception to handle
   */
  handle(error) {
    this._handler(error);
  }
  /**
   * Handle an exception safely
   * @param error the exception to handle
   */
  handleSafe(error) {
    try {
      this.handle(error);
    } catch (e) {
    }
  }
};
var safeDisposableExceptionHandlerManager = new ExceptionHandlerManager();

// src/element/index.ts
var import_eventiq2 = require("@tioniq/eventiq");

// src/element/modifier.ts
var modifiers = [];
var hasModifiers = false;
function addModifier(modifier) {
  modifiers.push(modifier);
  hasModifiers = true;
}
function addTagModifier(tag, modifier) {
  addModifier((element2, elementOptions) => {
    if (element2.tagName === tag) {
      modifier(element2, elementOptions);
    }
  });
}
function applyModification(element2, elementOptions) {
  if (!hasModifiers) {
    return;
  }
  for (const modifier of modifiers) {
    modifier(element2, elementOptions);
  }
}

// src/controller/index.ts
var setHandler = Symbol("setHandler");
function createController() {
  let ref = void 0;
  const obj = {};
  return new Proxy(obj, {
    get(target, p2, receiver) {
      if (p2 === setHandler) {
        return (handler) => {
          if (ref !== void 0) {
            console.error("Controller used multiple times");
          }
          ref = handler;
        };
      }
      if (ref === void 0) {
        throw new Error("Controller is not in use");
      }
      return ref(p2);
    }
  });
}
function useController(controller, handler) {
  if (!controller) {
    return;
  }
  controller[setHandler]((key) => {
    const value = handler[key];
    if (value instanceof Function) {
      return function() {
        return value.apply(handler, arguments);
      };
    }
    return value;
  });
}
function useFunctionController(controller, handler) {
  if (!controller) {
    return;
  }
  controller[setHandler]((key) => {
    return function() {
      return handler(key, arguments);
    };
  });
}

// src/element/index.ts
var propsKey = "_elemiqProps";
var noProps = Object.freeze({});
var emptyStringArray = [];
function element(tag, elementOptions) {
  const element2 = document.createElement(tag);
  if (elementOptions == void 0) {
    element2[propsKey] = noProps;
    applyModification(element2, elementOptions);
    return element2;
  }
  element2[propsKey] = elementOptions;
  const lifecycle = createLifecycle(element2);
  applyOptions(element2, elementOptions, lifecycle);
  applyModification(element2, elementOptions);
  return element2;
}
function applyOptions(element2, elementOptions, lifecycle) {
  let parent = void 0;
  let key;
  for (key in elementOptions) {
    const value = elementOptions[key];
    if (key === "children") {
      applyChildren(element2, lifecycle, value);
      continue;
    }
    if (key === "classes") {
      applyClasses(element2, lifecycle, value);
      continue;
    }
    if (key === "style") {
      applyStyle(element2, lifecycle, value);
      continue;
    }
    if (key === "parent") {
      parent = value;
      continue;
    }
    if (key === "dataset") {
      applyDataset(element2, lifecycle, value);
      continue;
    }
    if (key === "controller") {
      applyController(element2, value);
      continue;
    }
    if (key.startsWith("on")) {
      if (key === "onMount") {
        applyOnMount(element2, lifecycle, value);
        continue;
      }
      if (key === "onAttachedToDom") {
        element2.addEventListener("attachedToDom", value);
        continue;
      }
      if (key === "onDetachedFromDom") {
        element2.addEventListener("detachedFromDom", value);
        continue;
      }
      const eventName = key[2].toLowerCase() + key.slice(3);
      element2.addEventListener(eventName, value);
      continue;
    }
    applyProperty(element2, lifecycle, key, value);
  }
  if (parent !== void 0) {
    applyParent(element2, lifecycle, parent);
  }
}
function createLifecycle(element2) {
  return new import_eventiq2.LazyVariable((vary) => {
    element2.dataset[domListenKey] = "t";
    const attachListener = function() {
      vary.value = true;
    };
    const detachListener = function() {
      vary.value = false;
    };
    element2.addEventListener("attachedToDom", attachListener);
    element2.addEventListener("detachedFromDom", detachListener);
    vary.value = element2.isConnected;
    return createDisposiq(() => {
      element2.removeEventListener("attachedToDom", attachListener);
      element2.removeEventListener("detachedFromDom", detachListener);
    });
  }, () => element2.isConnected);
}
function applyChildren(element2, lifecycle, children) {
  if (!children) {
    return;
  }
  lifecycle.subscribeDisposable((active) => {
    if (!active) {
      return emptyDisposable;
    }
    const disposables = new DisposableStore();
    let previousElementOpts = [];
    let addedNodes = [];
    if ((0, import_eventiq2.isVariableOf)(children)) {
      disposables.add(children.subscribe(updateChildren));
    } else {
      updateChildren(children);
    }
    disposables.add(new DisposableAction(() => detachChildren()));
    return disposables;
    function updateChildren(newChildrenOpts) {
      if (!newChildrenOpts || Array.isArray(newChildrenOpts) && newChildrenOpts.length === 0) {
        previousElementOpts = [];
        if (addedNodes.length === 0) {
          return;
        }
        for (let i2 = 0; i2 < addedNodes.length; i2++) {
          const addedNode = addedNodes[i2];
          addedNode.disposable.dispose();
          element2.removeChild(addedNode.node);
        }
        addedNodes = [];
        return;
      }
      const newElementOpts = Array.isArray(newChildrenOpts) ? [...newChildrenOpts] : [newChildrenOpts];
      if (addedNodes.length === 0) {
        addedNodes = [];
        for (let i2 = 0; i2 < newElementOpts.length; i2++) {
          const child = newElementOpts[i2];
          if ((0, import_eventiq2.isVariableOf)(child)) {
            const [childNode2, disposable] = createVarNode(child);
            element2.appendChild(childNode2);
            addedNodes.push({ node: childNode2, disposable, value: child });
            continue;
          }
          const childNode = createNode(child);
          element2.appendChild(childNode);
          addedNodes.push({ node: childNode, disposable: emptyDisposable, value: child });
        }
        return;
      }
      const changes = getArrayChanges(previousElementOpts, newElementOpts);
      if (changes.remove.length > 0) {
        for (let i2 = changes.remove.length - 1; i2 >= 0; --i2) {
          const remove = changes.remove[i2];
          const addedNodeIndex = remove.index;
          const addedNode = addedNodes[addedNodeIndex];
          addedNodes.splice(addedNodeIndex, 1);
          addedNode.disposable.dispose();
          element2.removeChild(addedNode.node);
        }
      }
      for (let i2 = 0; i2 < changes.add.length; ++i2) {
        const add = changes.add[i2];
        const child = newElementOpts[add.index];
        let addedNode;
        if ((0, import_eventiq2.isVariableOf)(child)) {
          const [childNode, disposable] = createVarNode(child);
          addedNode = {
            node: childNode,
            disposable,
            value: child
          };
        } else {
          const childNode = createNode(child);
          addedNode = {
            node: childNode,
            disposable: emptyDisposable,
            value: child
          };
        }
        if (add.index >= addedNodes.length) {
          element2.appendChild(addedNode.node);
        } else {
          const previousNode = addedNodes[add.index].node;
          element2.insertBefore(addedNode.node, previousNode);
        }
        addedNodes.splice(add.index, 0, addedNode);
      }
      for (let i2 = 0; i2 < changes.swap.length; ++i2) {
        const swap = changes.swap[i2];
        const child = addedNodes[swap.index];
        const nextChild = addedNodes[swap.newIndex];
        swapNodes(child, nextChild);
        addedNodes[swap.index] = nextChild;
        addedNodes[swap.newIndex] = child;
      }
      previousElementOpts = newElementOpts;
    }
    function detachChildren() {
      var _a;
      if (addedNodes.length === 0) {
        return;
      }
      for (let i2 = 0; i2 < addedNodes.length; i2++) {
        let child = addedNodes[i2];
        child.disposable.dispose();
        (_a = child.node.parentNode) == null ? void 0 : _a.removeChild(child.node);
      }
      addedNodes = [];
    }
  });
}
function applyClasses(element2, lifecycle, classes) {
  if (!classes) {
    return;
  }
  if (!(0, import_eventiq2.isVariableOf)(classes)) {
    element2.classList.add(...classes);
    return;
  }
  let previousClasses = emptyStringArray;
  lifecycle.subscribeDisposable((active) => {
    return !active ? emptyDisposable : classes.subscribe((newClasses) => {
      if (!Array.isArray(newClasses) || newClasses.length === 0) {
        if (previousClasses.length === 0) {
          return;
        }
        for (let i2 = 0; i2 < previousClasses.length; ++i2) {
          element2.classList.remove(previousClasses[i2]);
        }
        previousClasses = emptyStringArray;
        return;
      }
      if (previousClasses.length === 0) {
        element2.classList.add(...newClasses);
        previousClasses = newClasses;
        return;
      }
      const changes = getArrayChanges(previousClasses, newClasses);
      for (let i2 = 0; i2 < changes.remove.length; ++i2) {
        element2.classList.remove(changes.remove[i2].item);
      }
      for (let i2 = 0; i2 < changes.add.length; ++i2) {
        element2.classList.add(changes.add[i2].item);
      }
      previousClasses = newClasses;
    });
  });
}
function applyStyle(element2, lifecycle, style2) {
  var _a;
  if (!style2) {
    return;
  }
  if (!(0, import_eventiq2.isVariableOf)(style2)) {
    let styleKey;
    for (styleKey in style2) {
      element2.style[styleKey] = (_a = style2[styleKey]) != null ? _a : "";
    }
    return;
  }
  lifecycle.subscribeDisposable((active) => !active ? emptyDisposable : listenObjectKVChanges(style2, (keysToDelete, changesToAddOrModify) => {
    var _a2;
    if (keysToDelete !== null) {
      for (let key of keysToDelete) {
        element2.style.removeProperty(key);
      }
    }
    if (changesToAddOrModify !== null) {
      for (let key in changesToAddOrModify) {
        element2.style[key] = (_a2 = changesToAddOrModify[key]) != null ? _a2 : "";
      }
    }
  }));
}
function applyDataset(element2, lifecycle, dataset) {
  if (!dataset) {
    return;
  }
  if (!(0, import_eventiq2.isVariableOf)(dataset)) {
    for (let key in dataset) {
      element2.dataset[key] = dataset[key];
    }
    return;
  }
  lifecycle.subscribeDisposable((active) => !active ? emptyDisposable : listenObjectKVChanges(dataset, (keysToDelete, changesToAddOrModify) => {
    if (keysToDelete !== null) {
      for (let key of keysToDelete) {
        delete element2.dataset[key];
      }
    }
    if (changesToAddOrModify !== null) {
      for (let key in changesToAddOrModify) {
        element2.dataset[key] = changesToAddOrModify[key];
      }
    }
  }));
}
function applyController(element2, controller) {
  useController(controller, element2);
}
function applyOnMount(element2, lifecycle, onMount) {
  if (!onMount) {
    return;
  }
  if (!(0, import_eventiq2.isVariableOf)(onMount)) {
    lifecycle.subscribeDisposable((active) => {
      var _a;
      return active ? createDisposable((_a = onMount.call(element2)) != null ? _a : emptyDisposable) : emptyDisposable;
    });
    return;
  }
  lifecycle.subscribeDisposable((active) => !active ? emptyDisposable : onMount.subscribeDisposable((value) => {
    var _a;
    return !value ? emptyDisposable : createDisposable((_a = onMount.call(element2)) != null ? _a : emptyDisposable);
  }));
}
function applyProperty(element2, lifecycle, key, value) {
  if (!(0, import_eventiq2.isVariableOf)(value)) {
    element2[key] = value;
    return;
  }
  lifecycle.subscribeDisposable(
    (active) => !active ? emptyDisposable : value.subscribe((newValue) => element2[key] = newValue)
  );
}
function applyParent(element2, lifecycle, parent) {
  if (!parent) {
    return;
  }
  if (!(0, import_eventiq2.isVariableOf)(parent)) {
    parent.appendChild(element2);
    return;
  }
  let previousParent;
  lifecycle.subscribeDisposable((active) => !active ? emptyDisposable : parent.subscribe((newParent) => {
    if (previousParent === newParent) {
      return;
    }
    if (!newParent) {
      if (previousParent !== void 0) {
        previousParent.removeChild(element2);
        previousParent = void 0;
      }
      return;
    }
    if (previousParent === void 0) {
      newParent.appendChild(element2);
      previousParent = newParent;
      return;
    }
    previousParent.removeChild(element2);
    newParent.appendChild(element2);
    previousParent = newParent;
  }));
}
function listenObjectKVChanges(variable, handler) {
  let currentState = variable.value;
  const subscription = variable.subscribeSilent((value) => {
    let [keysToDelete, dataToAddOrChange] = getObjectValuesChanges(currentState, value);
    currentState = value;
    handler(keysToDelete, dataToAddOrChange);
  });
  handler(null, currentState);
  return subscription;
}
function swapNodes(child1, child2) {
  const parent = child1.node.parentNode;
  const nextSibling = child2.node.nextSibling;
  if (nextSibling === child1.node) {
    parent == null ? void 0 : parent.insertBefore(child1.node, child2.node);
  } else {
    parent == null ? void 0 : parent.insertBefore(child2.node, child1.node);
    parent == null ? void 0 : parent.insertBefore(child1.node, nextSibling);
  }
}
function createNode(value) {
  if (!value) {
    return document.createDocumentFragment();
  }
  if (value instanceof Node) {
    return value;
  }
  if (typeof value === "string") {
    return document.createTextNode(value);
  }
  console.warn("Unsupported type of value.", { value });
  return createEmptyNode();
}
function createVarNode(value) {
  const fragment = document.createDocumentFragment();
  let previousChild = null;
  const disposable = value.subscribe((newValue) => {
    const childNode = createNode(newValue);
    if (previousChild) {
      fragment.removeChild(previousChild);
    }
    fragment.appendChild(childNode);
    previousChild = childNode;
  });
  return [fragment, disposable];
}
function createEmptyNode() {
  return document.createTextNode("");
}
runMutationObserver();

// src/dom/dom-elements.ts
function text(text2) {
  return document.createTextNode(text2);
}
function a(options) {
  return element("a", options);
}
function abbr(options) {
  return element("abbr", options);
}
function address(options) {
  return element("address", options);
}
function area(options) {
  return element("area", options);
}
function article(options) {
  return element("article", options);
}
function aside(options) {
  return element("aside", options);
}
function audio(options) {
  return element("audio", options);
}
function b(options) {
  return element("b", options);
}
function base(options) {
  return element("base", options);
}
function bdi(options) {
  return element("bdi", options);
}
function bdo(options) {
  return element("bdo", options);
}
function blockquote(options) {
  return element("blockquote", options);
}
function body(options) {
  return element("body", options);
}
function br(options) {
  return element("br", options);
}
function button(options) {
  return element("button", options);
}
function canvas(options) {
  return element("canvas", options);
}
function caption(options) {
  return element("caption", options);
}
function cite(options) {
  return element("cite", options);
}
function code(options) {
  return element("code", options);
}
function col(options) {
  return element("col", options);
}
function colgroup(options) {
  return element("colgroup", options);
}
function data(options) {
  return element("data", options);
}
function datalist(options) {
  return element("datalist", options);
}
function dd(options) {
  return element("dd", options);
}
function del(options) {
  return element("del", options);
}
function details(options) {
  return element("details", options);
}
function dfn(options) {
  return element("dfn", options);
}
function dialog(options) {
  return element("dialog", options);
}
function div(options) {
  return element("div", options);
}
function dl(options) {
  return element("dl", options);
}
function dt(options) {
  return element("dt", options);
}
function em(options) {
  return element("em", options);
}
function embed(options) {
  return element("embed", options);
}
function fieldset(options) {
  return element("fieldset", options);
}
function figcaption(options) {
  return element("figcaption", options);
}
function figure(options) {
  return element("figure", options);
}
function footer(options) {
  return element("footer", options);
}
function form(options) {
  return element("form", options);
}
function h1(options) {
  return element("h1", options);
}
function h2(options) {
  return element("h2", options);
}
function h3(options) {
  return element("h3", options);
}
function h4(options) {
  return element("h4", options);
}
function h5(options) {
  return element("h5", options);
}
function h6(options) {
  return element("h6", options);
}
function head(options) {
  return element("head", options);
}
function header(options) {
  return element("header", options);
}
function hgroup(options) {
  return element("hgroup", options);
}
function hr(options) {
  return element("hr", options);
}
function html(options) {
  return element("html", options);
}
function i(options) {
  return element("i", options);
}
function iframe(options) {
  return element("iframe", options);
}
function img(options) {
  return element("img", options);
}
function input(options) {
  return element("input", options);
}
function ins(options) {
  return element("ins", options);
}
function kbd(options) {
  return element("kbd", options);
}
function label(options) {
  return element("label", options);
}
function legend(options) {
  return element("legend", options);
}
function li(options) {
  return element("li", options);
}
function link(options) {
  return element("link", options);
}
function main(options) {
  return element("main", options);
}
function map(options) {
  return element("map", options);
}
function mark(options) {
  return element("mark", options);
}
function menu(options) {
  return element("menu", options);
}
function meta(options) {
  return element("meta", options);
}
function meter(options) {
  return element("meter", options);
}
function nav(options) {
  return element("nav", options);
}
function noscript(options) {
  return element("noscript", options);
}
function object(options) {
  return element("object", options);
}
function ol(options) {
  return element("ol", options);
}
function optgroup(options) {
  return element("optgroup", options);
}
function option(options) {
  return element("option", options);
}
function output(options) {
  return element("output", options);
}
function p(options) {
  return element("p", options);
}
function picture(options) {
  return element("picture", options);
}
function pre(options) {
  return element("pre", options);
}
function progress(options) {
  return element("progress", options);
}
function q(options) {
  return element("q", options);
}
function rp(options) {
  return element("rp", options);
}
function rt(options) {
  return element("rt", options);
}
function ruby(options) {
  return element("ruby", options);
}
function s(options) {
  return element("s", options);
}
function samp(options) {
  return element("samp", options);
}
function script(options) {
  return element("script", options);
}
function search(options) {
  return element("search", options);
}
function section(options) {
  return element("section", options);
}
function select(options) {
  return element("select", options);
}
function slot(options) {
  return element("slot", options);
}
function small(options) {
  return element("small", options);
}
function source(options) {
  return element("source", options);
}
function span(options) {
  return element("span", options);
}
function strong(options) {
  return element("strong", options);
}
function style(options) {
  return element("style", options);
}
function sub(options) {
  return element("sub", options);
}
function summary(options) {
  return element("summary", options);
}
function sup(options) {
  return element("sup", options);
}
function table(options) {
  return element("table", options);
}
function tbody(options) {
  return element("tbody", options);
}
function td(options) {
  return element("td", options);
}
function template(options) {
  return element("template", options);
}
function textarea(options) {
  return element("textarea", options);
}
function tfoot(options) {
  return element("tfoot", options);
}
function th(options) {
  return element("th", options);
}
function thead(options) {
  return element("thead", options);
}
function time(options) {
  return element("time", options);
}
function title(options) {
  return element("title", options);
}
function tr(options) {
  return element("tr", options);
}
function track(options) {
  return element("track", options);
}
function u(options) {
  return element("u", options);
}
function ul(options) {
  return element("ul", options);
}
function var_(options) {
  return element("var", options);
}
function video(options) {
  return element("video", options);
}
function wbr(options) {
  return element("wbr", options);
}

// src/render/index.ts
function render(value, parent) {
  if (typeof value === "function") {
    const element2 = value({});
    parent.appendChild(element2);
    return;
  }
  parent.appendChild(value);
}

// src/styles/index.ts
var _addedStyles = [];
function addRawStyle(rawCss) {
  return _addRawStyle(rawCss);
}
function addStyles(styles) {
  return _addStyles(styles);
}
var _classNames = /* @__PURE__ */ new Map();
function makeClassStyles(styles, disposable) {
  const result = {};
  const stylesResult = [];
  for (let key in styles) {
    key = key.trim();
    const style2 = styles[key];
    if (key.indexOf(" ") !== -1 || key.indexOf(".") !== -1 || key.indexOf(">") !== -1 || key.indexOf(":") !== -1) {
      let kKey = getFirstWord(key);
      const classCounter = _classNames.get(kKey);
      if (classCounter === void 0) {
        console.error("Invalid class name", key);
        continue;
      }
      const className2 = kKey + classCounter;
      stylesResult.push({
        rule: "." + className2 + key.substring(kKey.length),
        declaration: style2
      });
      continue;
    }
    const existingClassCounter = _classNames.get(key);
    let className = key;
    if (existingClassCounter === void 0) {
      _classNames.set(key, 1);
      className += "1";
    } else {
      _classNames.set(key, existingClassCounter + 1);
      className += (existingClassCounter + 1).toString();
    }
    stylesResult.push({
      rule: "." + className,
      declaration: style2
    });
    result[key] = className;
  }
  const subscription = _addStyles(stylesResult);
  if (disposable) {
    disposable.add(subscription);
  }
  return result;
}
function removeAllGeneratedStyles() {
  const styles = [..._addedStyles];
  _addedStyles.length = 0;
  for (let style2 of styles) {
    style2.remove();
  }
}
function _addRawStyle(rawCss) {
  const style2 = document.createElement("style");
  style2.id = generateStyleId();
  style2.textContent = rawCss;
  return attachStyleElement(style2);
}
function _addStyles(styles) {
  const style2 = document.createElement("style");
  style2.textContent = "\n";
  style2.id = generateStyleId();
  const attachSubscription = attachStyleElement(style2);
  for (let style1 of styles) {
    const styleData = getStyleDeclaration(style1.declaration);
    style2.sheet.insertRule(`${style1.rule} { ${styleData.cssText} }`, style2.sheet.cssRules.length);
  }
  return attachSubscription;
}
function attachStyleElement(style2) {
  const head2 = document.head;
  head2.appendChild(style2);
  _addedStyles.push(style2);
  return new DisposableAction(() => {
    const index = _addedStyles.indexOf(style2);
    if (index !== -1) {
      _addedStyles.splice(index, 1);
    }
    head2.removeChild(style2);
  });
}
function getStyleDeclaration(style2) {
  const span2 = document.createElement("span");
  const spanStyle = span2.style;
  let key;
  for (key in style2) {
    spanStyle[key] = style2[key];
  }
  return spanStyle;
}
var styleIdCounter = 0;
function generateStyleId() {
  return "elemiq-style-" + ++styleIdCounter;
}
function getFirstWord(str) {
  for (let i2 = 0; i2 < str.length; i2++) {
    const charCode = str.charCodeAt(i2);
    let aLetter = charCode >= 65 && charCode < 91 || charCode >= 97 && charCode < 123;
    if (aLetter) {
      continue;
    }
    let aDigit = charCode >= 48 && charCode < 58;
    if (aDigit) {
      continue;
    }
    let isUnderscoreOrHyphen = charCode === 95 || charCode === 45;
    if (isUnderscoreOrHyphen) {
      continue;
    }
    return str.substring(0, i2);
  }
  return str;
}

// src/jsx-runtime/render.ts
function renderJsx(tag, props, _key) {
  if (!tag) {
    return span({
      innerText: "Not supported tag '" + tag + "'"
    });
  }
  if (typeof tag === "string") {
    return element(tag, props);
  }
  if (typeof tag !== "function") {
    return span({
      innerText: "Not supported tag '" + tag + "'"
    });
  }
  if (isClassComponent(tag)) {
    const instance = new tag(props);
    return instance.render();
  }
  return tag(props);
}
function isClassComponent(tag) {
  if (tag.prototype === void 0) {
    return false;
  }
  return "render" in tag.prototype;
}

// src/jsx-runtime/index.ts
var jsx = renderJsx;
var jsxs = renderJsx;
var jsxDEV = renderJsx;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  a,
  abbr,
  addModifier,
  addRawStyle,
  addStyles,
  addTagModifier,
  address,
  applyModification,
  area,
  article,
  aside,
  audio,
  b,
  base,
  bdi,
  bdo,
  blockquote,
  body,
  br,
  button,
  canvas,
  caption,
  cite,
  code,
  col,
  colgroup,
  createController,
  data,
  datalist,
  dd,
  del,
  details,
  dfn,
  dialog,
  div,
  dl,
  dt,
  element,
  em,
  embed,
  fieldset,
  figcaption,
  figure,
  footer,
  form,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  head,
  header,
  hgroup,
  hr,
  html,
  i,
  iframe,
  img,
  input,
  ins,
  jsx,
  jsxDEV,
  jsxs,
  kbd,
  label,
  legend,
  li,
  link,
  main,
  makeClassStyles,
  map,
  mark,
  menu,
  meta,
  meter,
  nav,
  noscript,
  object,
  ol,
  optgroup,
  option,
  output,
  p,
  picture,
  pre,
  progress,
  q,
  removeAllGeneratedStyles,
  render,
  renderJsx,
  rp,
  rt,
  ruby,
  s,
  samp,
  script,
  search,
  section,
  select,
  slot,
  small,
  source,
  span,
  strong,
  style,
  sub,
  summary,
  sup,
  table,
  tbody,
  td,
  template,
  text,
  textarea,
  tfoot,
  th,
  thead,
  time,
  title,
  tr,
  track,
  u,
  ul,
  useController,
  useFunctionController,
  var_,
  video,
  wbr
});
