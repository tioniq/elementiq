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
    for (const mutation of mutations) {
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
  const asyncDisposeSymbol = Symbol(
    "Symbol.asyncDispose"
  );
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
    this._controller = controller != null ? controller : new AbortController();
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
var ObjectDisposedException = class extends Error {
  constructor(message) {
    super(message || "Object disposed");
    this.name = "ObjectDisposedException";
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
var asyncPool = new ObjectPool(10);
function justDispose(disposable) {
  if (!disposable) {
    return;
  }
  if (typeof disposable === "function") {
    disposable();
  } else {
    disposable.dispose();
  }
}
function justDisposeAll(disposables) {
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
}
function disposeAll(disposables) {
  const size = disposables.length;
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
  try {
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
  } finally {
    holder.fill(void 0, 0, size);
    if (pool.full) {
      pool.size *= 2;
    }
    pool.throw(holder);
  }
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
function disposeAllSafely(disposables, onErrorCallback) {
  if (disposables.length === 0) {
    return;
  }
  for (let i2 = 0; i2 < disposables.length; ++i2) {
    const disposable = disposables[i2];
    if (!disposable) {
      continue;
    }
    try {
      if (typeof disposable === "function") {
        disposable();
      } else {
        disposable.dispose();
      }
    } catch (e) {
      onErrorCallback == null ? void 0 : onErrorCallback(e);
    }
  }
  disposables.length = 0;
}
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
    if (!disposables || disposables.length === 0) {
      return;
    }
    const first = disposables[0];
    const value = Array.isArray(first) ? first : disposables;
    if (this._disposed) {
      justDisposeAll(value);
      return;
    }
    for (let i2 = 0; i2 < value.length; i2++) {
      const disposable = value[i2];
      if (!disposable) {
        continue;
      }
      this._disposables.push(disposable);
    }
  }
  /**
   * Add multiple disposables to the store. If the store has already been disposed, the disposables will be disposed.
   * @param disposables an array of disposables to add
   */
  addAll(disposables) {
    if (!disposables || disposables.length === 0) {
      return;
    }
    if (this._disposed) {
      justDisposeAll(disposables);
      return;
    }
    for (let i2 = 0; i2 < disposables.length; i2++) {
      const disposable = disposables[i2];
      if (!disposable) {
        continue;
      }
      this._disposables.push(disposable);
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
      justDispose(disposable);
      return;
    }
    this._disposables.push(disposable);
  }
  /**
   * Remove a disposable from the store. If the disposable is found and removed, it will NOT be disposed
   * @param disposable a disposable to remove
   * @returns true if the disposable was found and removed
   */
  remove(disposable) {
    if (!disposable || this._disposed) {
      return false;
    }
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
      this.addOne(() => clearTimeout(handle));
      return;
    }
    this.addOne(() => clearTimeout(callbackOrTimeout));
  }
  /**
   * @internal
   */
  addInterval(callbackOrInterval, interval) {
    if (typeof callbackOrInterval === "function") {
      const handle = setInterval(callbackOrInterval, interval);
      this.addOne(() => clearInterval(handle));
      return;
    }
    this.addOne(() => clearInterval(callbackOrInterval));
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
   * Accepts a function that returns a disposable and adds it to the store. If the function is asynchronous,
   * it waits for the result and then adds it to the store. Returns a Promise if the supplier is asynchronous,
   * otherwise returns the disposable directly.
   * @param supplier A function that returns a disposable or a promise resolving to a disposable.
   * @returns The disposable or a promise resolving to the disposable.
   */
  use(supplier) {
    const result = supplier();
    if (result instanceof Promise) {
      return result.then((disposable) => {
        if (this._disposed) {
          justDispose(disposable);
          return disposable;
        }
        this._disposables.push(disposable);
        return disposable;
      });
    }
    if (this._disposed) {
      justDispose(result);
      return result;
    }
    this._disposables.push(result);
    return result;
  }
  /**
   * Dispose all disposables in the store. The store does not become disposed. The disposables are removed from the
   * store. The store can continue to be used after this method is called. This method is useful when the store is
   * used as a temporary container. The store can be disposed later by calling the dispose method. Calling add during
   * this method will safely add the disposable to the store without disposing it immediately.
   */
  disposeCurrent() {
    if (this._disposed) {
      return;
    }
    disposeAll(this._disposables);
  }
  /**
   * Dispose the store and all disposables safely. If an error occurs during disposal, the error is caught and
   * passed to the onErrorCallback.
   */
  disposeSafely(onErrorCallback) {
    if (this._disposed) {
      return;
    }
    this._disposed = true;
    disposeAllSafely(this._disposables, onErrorCallback);
  }
  dispose() {
    if (this._disposed) {
      return;
    }
    this._disposed = true;
    disposeAllUnsafe(this._disposables);
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
var DisposableMapStore = class extends Disposiq {
  constructor() {
    super(...arguments);
    this._map = /* @__PURE__ */ new Map();
    this._disposed = false;
  }
  /**
   * Get the disposed state of the store
   */
  get disposed() {
    return this._disposed;
  }
  /**
   * Set a disposable value for the key. If the store contains a value for the key, the previous value will be disposed.
   * If the store is disposed, the value will be disposed immediately
   * @param key the key
   * @param value the disposable value
   */
  set(key, value) {
    const disposable = createDisposable(value);
    if (this._disposed) {
      disposable.dispose();
      return;
    }
    const prev = this._map.get(key);
    this._map.set(key, disposable);
    prev == null ? void 0 : prev.dispose();
  }
  /**
   * Get the disposable value for the key
   * @param key the key
   * @returns the disposable value or undefined if the key is not found
   */
  get(key) {
    if (this._disposed) {
      return;
    }
    return this._map.get(key);
  }
  /**
   * Delete the disposable value for the key
   * @param key the key
   * @returns true if the key was found and the value was deleted, false otherwise
   */
  delete(key) {
    if (this._disposed) {
      return false;
    }
    const disposable = this._map.get(key);
    if (!disposable) {
      return false;
    }
    this._map.delete(key);
    disposable.dispose();
    return true;
  }
  /**
   * Remove the disposable value for the key and return it. The disposable value will not be disposed
   * @param key the key
   * @returns the disposable value or undefined if the key is not found
   */
  extract(key) {
    if (this._disposed) {
      return;
    }
    const disposable = this._map.get(key);
    if (!disposable) {
      return;
    }
    this._map.delete(key);
    return disposable;
  }
  dispose() {
    if (this._disposed) {
      return;
    }
    this._disposed = true;
    for (const value of this._map.values()) {
      value.dispose();
    }
    this._map.clear();
  }
};
var Disposable = class extends Disposiq {
  constructor() {
    super(...arguments);
    this._store = new DisposableStore();
  }
  /**
   * Returns true if the object has been disposed.
   */
  get disposed() {
    return this._store.disposed;
  }
  /**
   * Register a disposable object. The object will be disposed when the current object is disposed.
   * @param t a disposable object
   * @protected inherited classes should use this method to register disposables
   * @returns the disposable object
   */
  register(t) {
    this._store.addOne(t);
    return t;
  }
  registerAsync(promiseOrAction) {
    return __async(this, null, function* () {
      if (typeof promiseOrAction === "function") {
        return this._store.use(promiseOrAction);
      }
      if (promiseOrAction instanceof Promise) {
        const disposable = yield promiseOrAction;
        this._store.addOne(disposable);
        return disposable;
      }
      this._store.addOne(promiseOrAction);
      return promiseOrAction;
    });
  }
  /**
   * Throw an exception if the object has been disposed.
   * @param message the message to include in the exception
   * @protected inherited classes can use this method to throw an exception if the object has been disposed
   */
  throwIfDisposed(message) {
    this._store.throwIfDisposed(message);
  }
  /**
   * Add disposables to the store. If the store has already been disposed, the disposables will be disposed.
   * @param disposable a disposable to add
   */
  addDisposable(disposable) {
    this._store.addOne(disposable);
  }
  /**
   * Add disposables to the store. If the store has already been disposed, the disposables will be disposed.
   * @param disposables disposables to add
   */
  addDisposables(...disposables) {
    this._store.addAll(disposables);
  }
  dispose() {
    this._store.dispose();
  }
};
function addEventListener(target, type, listener, options) {
  target.addEventListener(type, listener, options);
  return new DisposableAction(
    () => target.removeEventListener(type, listener, options)
  );
}
Disposiq.prototype.disposeWith = function(container) {
  if (container instanceof Disposable) {
    container.addDisposable(this);
    return;
  }
  container.add(this);
};
Disposiq.prototype.toFunction = function() {
  return () => {
    this.dispose();
  };
};
var g = globalThis;
Disposiq.prototype.disposeIn = function(ms) {
  g.setTimeout(() => {
    this.dispose();
  }, ms);
};
Disposiq.prototype.toPlainObject = function() {
  return {
    dispose: () => {
      this.dispose();
    }
  };
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
import { LazyVariable } from "@tioniq/eventiq";

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

// src/element/children.ts
import { isVariableOf } from "@tioniq/eventiq";

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
    const newItemDataIndex = newArrayData.findIndex(
      (data2) => data2.oldIndex === -1 && data2.item === oldItem
    );
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

// src/element/children.ts
function applyChildren(element2, lifecycle, children) {
  if (!children) {
    return;
  }
  if (!isVariableOf(children)) {
    setStaticChildren(children, element2, lifecycle);
    return;
  }
  const slot2 = createEmptyNode();
  element2.appendChild(slot2);
  setVariableChild(children, element2, lifecycle, slot2);
}
function setStaticChildren(children, element2, lifecycle) {
  if (!Array.isArray(children)) {
    const node = createNode(children);
    element2.appendChild(node);
    return;
  }
  if (children.length === 0) {
    return;
  }
  for (let i2 = 0; i2 < children.length; i2++) {
    const child = children[i2];
    if (!isVariableOf(child)) {
      setStaticChildren(child, element2, lifecycle);
      continue;
    }
    const slot2 = createEmptyNode();
    element2.appendChild(slot2);
    setVariableChild(child, element2, lifecycle, slot2);
  }
}
function setDynamicChildren(children, element2, mark2) {
  if (Array.isArray(children)) {
    return setDynamicArrayChild(children, element2, mark2);
  }
  if (isVariableOf(children)) {
    return setDynamicVariableChild(children, element2, mark2);
  }
  return setDynamicSimpleChild(children, element2, mark2);
}
function setDynamicSimpleChild(children, element2, mark2) {
  const node = createNode(children);
  insertAfter(node, mark2);
  return {
    replace(child) {
      this.remove();
      return setDynamicChildren(child, element2, mark2);
    },
    remove() {
      element2.removeChild(node);
    }
  };
}
function setDynamicVariableChild(child, element2, mark2) {
  let lastController = null;
  const subscription = child.subscribe((c) => {
    if (lastController !== null) {
      lastController = lastController.replace(c);
    } else {
      lastController = setDynamicChildren(c, element2, mark2);
    }
  });
  return {
    replace(child2) {
      this.remove();
      return setDynamicChildren(child2, element2, mark2);
    },
    remove() {
      subscription.dispose();
      if (lastController !== null) {
        lastController.remove();
        lastController = null;
      }
    }
  };
}
function setDynamicArrayChild(child, element2, mark2) {
  if (child.length === 0) {
    return {
      replace(child2) {
        return setDynamicChildren(child2, element2, mark2);
      },
      remove() {
      }
    };
  }
  let children = [...child];
  const controllers = [];
  const endMark = createEmptyNode();
  insertAfter(endMark, mark2);
  let previousSlot = mark2;
  const slots = new Array(children.length);
  for (let i2 = 0; i2 < children.length; i2++) {
    const slot2 = createEmptyNode();
    insertAfter(slot2, previousSlot);
    previousSlot = slot2;
    slots[i2] = slot2;
  }
  for (let i2 = 0; i2 < children.length; i2++) {
    const slot2 = slots[i2];
    const child2 = children[i2];
    const controller = setDynamicChildren(child2, element2, slot2);
    controllers.push(controller);
  }
  return {
    replace(child2) {
      if (!Array.isArray(child2)) {
        this.remove();
        return setDynamicChildren(child2, element2, mark2);
      }
      if (child2.length === 0) {
        this.remove();
        return {
          replace(child3) {
            return setDynamicChildren(child3, element2, mark2);
          },
          remove() {
          }
        };
      }
      const newChildren = [...child2];
      const changes = getArrayChanges(children, newChildren);
      for (let i2 = changes.remove.length - 1; i2 >= 0; --i2) {
        const remove = changes.remove[i2];
        controllers[remove.index].remove();
        controllers.splice(remove.index, 1);
        element2.removeChild(slots[remove.index]);
        slots.splice(remove.index, 1);
      }
      for (let i2 = 0; i2 < changes.add.length; i2++) {
        const add = changes.add[i2];
        const slot2 = createEmptyNode();
        if (add.index === slots.length) {
          element2.insertBefore(slot2, endMark);
        } else {
          const slotToInsertBefore = slots[add.index];
          element2.insertBefore(slot2, slotToInsertBefore);
        }
        const controller = setDynamicChildren(
          newChildren[add.index],
          element2,
          slot2
        );
        slots.splice(add.index, 0, slot2);
        controllers.splice(add.index, 0, controller);
      }
      for (let i2 = 0; i2 < changes.swap.length; i2++) {
        const swap = changes.swap[i2];
        const controller = controllers[swap.index];
        const slot2 = slots[swap.index];
        controllers[swap.index] = controllers[swap.newIndex];
        slots[swap.index] = slots[swap.newIndex];
        controllers[swap.newIndex] = controller;
        slots[swap.newIndex] = slot2;
      }
      children = newChildren;
      return this;
    },
    remove() {
      for (let i2 = 0; i2 < controllers.length; i2++) {
        controllers[i2].remove();
      }
      for (let i2 = 0; i2 < slots.length; i2++) {
        element2.removeChild(slots[i2]);
      }
      element2.removeChild(endMark);
    }
  };
}
function setVariableChild(child, element2, lifecycle, mark2) {
  lifecycle.subscribeDisposable((active) => {
    if (!active) {
      return emptyDisposable;
    }
    let controller = null;
    const disposables = new DisposableStore();
    disposables.add(child.subscribe(updateChildren));
    disposables.add(
      new DisposableAction(() => {
        if (controller) {
          controller.remove();
          controller = null;
        }
      })
    );
    return disposables;
    function updateChildren(newChildrenOpts) {
      if (!controller) {
        controller = setDynamicChildren(newChildrenOpts, element2, mark2);
        return;
      }
      controller = controller.replace(newChildrenOpts);
    }
  });
}
function createNode(value) {
  if (!value) {
    return createEmptyNode();
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
function insertAfter(node, after) {
  const parent = after.parentNode;
  if (!parent) {
    return;
  }
  if (after.nextSibling) {
    parent.insertBefore(node, after.nextSibling);
    return;
  }
  parent.appendChild(node);
}
function createEmptyNode() {
  return document.createTextNode("");
}

// src/element/context.ts
import { isVariableOf as isVariableOf3 } from "@tioniq/eventiq";

// src/context/context.ts
import {
  createConstVar,
  createDelegate,
  isVariableOf as isVariableOf2
} from "@tioniq/eventiq";
var setContextValueSymbol = Symbol("setContextValue");
var getContextSymbol = Symbol("getContextProvider");
function getContext(value) {
  return value[getContextSymbol];
}
function setContextValue(contextValue, value) {
  ;
  contextValue[setContextValueSymbol](value);
}
function useContext(context, defaultValue) {
  var _a;
  const pro = context;
  const type = typeof pro.__key;
  if (type !== "string") {
    throw new Error("Invalid context object");
  }
  const initialValue = (_a = defaultValue != null ? defaultValue : pro.__defaultValue) != null ? _a : null;
  const val = {};
  const dataMap = /* @__PURE__ */ new Map();
  return new Proxy(val, {
    get(_, key) {
      if (typeof key !== "string") {
        if (key === getContextSymbol) {
          return context;
        }
        if (key === setContextValueSymbol) {
          return (newValue) => {
            if (!newValue) {
              for (const dataMapElement of dataMap.values()) {
                dataMapElement.setSource(null);
              }
              return true;
            }
            for (const key2 in newValue) {
              let value2 = dataMap.get(key2);
              if (!value2) {
                if (initialValue && key2 in initialValue) {
                  value2 = createDelegate(initialValue[key2]);
                } else {
                  value2 = createDelegate(null);
                }
                dataMap.set(key2, value2);
              }
              const v = newValue[key2];
              if (isVariableOf2(v)) {
                value2.setSource(v);
              } else {
                value2.setSource(createConstVar(v));
              }
            }
            return true;
          };
        }
        return void 0;
      }
      let value = dataMap.get(key);
      if (value) {
        return value;
      }
      if (!initialValue || !(key in initialValue)) {
        value = createDelegate(null);
        dataMap.set(key, value);
        return value;
      }
      value = createDelegate(initialValue[key]);
      dataMap.set(key, value);
      return value;
    }
  });
}
function randomUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function createContext(key, defaultValue) {
  if (!key) {
    throw new Error("Context key cannot be empty");
  }
  const id = randomUUID();
  const result = {
    __defaultValue: defaultValue,
    get __key() {
      return key;
    },
    get __id() {
      return id;
    }
  };
  return result;
}

// src/utils/string-utils.ts
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// src/element/context.ts
var providers = /* @__PURE__ */ new Map();
function applyContext(element2, lifecycle, contextValue) {
  if (!contextValue) {
    return;
  }
  lifecycle.subscribeDisposable((active) => {
    if (!active) {
      return emptyDisposable;
    }
    const context = getContext(contextValue);
    const provider = findContextProvider(element2, context);
    if (!provider) {
      return emptyDisposable;
    }
    setContextValue(contextValue, provider.value);
    return emptyDisposable;
  });
}
function findContextProvider(element2, context) {
  if (!context) {
    return null;
  }
  let el = element2;
  const keyToFind = getDataKey(context.__key);
  while (el != null) {
    const providerId = el.dataset[keyToFind];
    if (providerId) {
      const result = providers.get(providerId);
      if (result) {
        return result;
      }
      console.warn("Invalid context provider id");
    }
    el = el.parentElement;
  }
  return null;
}
function ContextProvider(props) {
  const provider = createProvider(props.context, props.value);
  if (!props.children) {
    return null;
  }
  applyContextProvider(props.children, provider);
  return props.children;
}
function applyContextProvider(children, provider) {
  if (!provider) {
    return;
  }
  if (children instanceof HTMLElement) {
    children.dataset[provider.dataKey] = provider.id;
    return;
  }
  if (isVariableOf3(children)) {
    children.subscribe((value) => {
      applyContextProvider(value, provider);
    });
    return;
  }
  if (Array.isArray(children)) {
    for (const child of children) {
      applyContextProvider(child, provider);
    }
    return;
  }
  console.warn("Invalid children type");
}
function createProvider(context, value) {
  const { key, id } = getContextData(context);
  const dataKey = getDataKey(key);
  const provider = {
    context,
    value,
    key,
    id,
    dataKey
  };
  providers.set(id, provider);
  return provider;
}
function getContextData(context) {
  if (!("__key" in context) || !("__id" in context)) {
    throw new Error("Invalid context object");
  }
  const c = context;
  return {
    key: c.__key,
    id: c.__id
  };
}
function getDataKey(key) {
  return `elCtx${capitalize(key.replace("-", ""))}`;
}

// src/element/classes.ts
import { isVariableOf as isVariableOf4 } from "@tioniq/eventiq";
var emptyStringArray = [];
function applyClasses(element2, lifecycle, classes) {
  if (!classes) {
    return;
  }
  if (!isVariableOf4(classes)) {
    element2.classList.add(...classes.filter((c) => !!c));
    return;
  }
  let previousClasses = emptyStringArray;
  lifecycle.subscribeDisposable(
    (active) => !active ? emptyDisposable : classes.subscribe((newClasses) => {
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
      const newValues = [...newClasses.filter((c) => !!c)];
      if (previousClasses.length === 0) {
        element2.classList.add.apply(element2.classList, newValues);
        previousClasses = newValues;
        return;
      }
      const changes = getArrayChanges(previousClasses, newValues);
      for (let i2 = 0; i2 < changes.remove.length; ++i2) {
        element2.classList.remove(changes.remove[i2].item);
      }
      for (let i2 = 0; i2 < changes.add.length; ++i2) {
        element2.classList.add(changes.add[i2].item);
      }
      previousClasses = newValues;
    })
  );
}

// src/element/style.ts
import { isVariableOf as isVariableOf5 } from "@tioniq/eventiq";

// src/diff/object.ts
import { defaultEqualityComparer } from "@tioniq/eventiq";
function getObjectValuesChanges(oldRecord, newRecord, equalityComparer) {
  if (!oldRecord) {
    return [null, newRecord];
  }
  if (!newRecord) {
    return [Object.keys(oldRecord), null];
  }
  let keysToDelete = null;
  let toAddOrChange = null;
  for (const key in oldRecord) {
    if (!(key in newRecord)) {
      if (keysToDelete === null) {
        keysToDelete = [key];
      } else {
        keysToDelete.push(key);
      }
    }
  }
  const comparer = equalityComparer || defaultEqualityComparer;
  for (const key in newRecord) {
    const oldValue = oldRecord[key];
    if (oldValue === void 0) {
      if (toAddOrChange === null) {
        toAddOrChange = { [key]: newRecord[key] };
      } else {
        toAddOrChange[key] = newRecord[key];
      }
      continue;
    }
    if (!comparer(oldValue, newRecord[key], key)) {
      if (toAddOrChange === null) {
        toAddOrChange = { [key]: newRecord[key] };
      } else {
        toAddOrChange[key] = newRecord[key];
      }
    }
  }
  return [keysToDelete, toAddOrChange];
}

// src/diff/object-var.ts
function listenObjectKVChanges(variable, handler) {
  let currentState = variable.value;
  const subscription = variable.subscribeSilent((value) => {
    const [keysToDelete, dataToAddOrChange] = getObjectValuesChanges(
      currentState,
      value
    );
    currentState = value;
    handler(keysToDelete, dataToAddOrChange);
  });
  handler(null, currentState);
  return subscription;
}

// src/element/style.ts
function applyStyle(element2, lifecycle, style2) {
  if (!style2) {
    return;
  }
  if (!isVariableOf5(style2)) {
    for (const styleKey in style2) {
      const value = style2[styleKey];
      if (!isVariableOf5(value)) {
        if (value === void 0) {
          element2.style.removeProperty(styleKey);
          continue;
        }
        element2.style[styleKey] = value != null ? value : "";
        continue;
      }
      lifecycle.subscribeDisposable((active) => {
        if (!active) {
          return emptyDisposable;
        }
        return value.subscribe((newValue) => {
          if (newValue === void 0) {
            element2.style.removeProperty(styleKey);
            return;
          }
          element2.style[styleKey] = newValue != null ? newValue : "";
        });
      });
    }
    return;
  }
  lifecycle.subscribeDisposable((active) => {
    if (!active) {
      return emptyDisposable;
    }
    const disposables = new DisposableStore();
    const dispoMapStore = new DisposableMapStore();
    disposables.add(dispoMapStore);
    disposables.add(
      listenObjectKVChanges(style2, (keysToDelete, changesToAddOrModify) => {
        if (keysToDelete !== null) {
          for (const key of keysToDelete) {
            element2.style.removeProperty(key);
            dispoMapStore.delete(key);
          }
        }
        if (changesToAddOrModify !== null) {
          for (const key in changesToAddOrModify) {
            const value = changesToAddOrModify[key];
            if (isVariableOf5(value)) {
              dispoMapStore.set(
                key,
                value.subscribe((newValue) => {
                  if (newValue === void 0) {
                    element2.style.removeProperty(key);
                    return;
                  }
                  element2.style[key] = newValue != null ? newValue : "";
                })
              );
              continue;
            }
            dispoMapStore.delete(key);
            if (value === void 0) {
              element2.style.removeProperty(key);
              continue;
            }
            element2.style[key] = value != null ? value : "";
          }
        }
      })
    );
    return disposables;
  });
}

// src/element/dataset.ts
import { isVariableOf as isVariableOf6 } from "@tioniq/eventiq";
function applyDataset(element2, lifecycle, dataset) {
  if (!dataset) {
    return;
  }
  if (!isVariableOf6(dataset)) {
    for (const key in dataset) {
      element2.dataset[key] = dataset[key];
    }
    return;
  }
  lifecycle.subscribeDisposable(
    (active) => !active ? emptyDisposable : listenObjectKVChanges(dataset, (keysToDelete, changesToAddOrModify) => {
      if (keysToDelete !== null) {
        for (const key of keysToDelete) {
          delete element2.dataset[key];
        }
      }
      if (changesToAddOrModify !== null) {
        for (const key in changesToAddOrModify) {
          element2.dataset[key] = changesToAddOrModify[key];
        }
      }
    })
  );
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
  ;
  controller[setHandler](
    (key) => {
      const value = handler[key];
      if (value instanceof Function) {
        return (...args) => value.apply(handler, args);
      }
      return value;
    }
  );
}
function useFunctionController(controller, handler) {
  if (!controller) {
    return;
  }
  ;
  controller[setHandler](
    (key) => {
      return (...args) => handler(key, args);
    }
  );
}

// src/element/controller.ts
function applyController(element2, controller) {
  useController(controller, element2);
}

// src/element/parent.ts
import { isVariableOf as isVariableOf7 } from "@tioniq/eventiq";
function applyParent(element2, lifecycle, parent) {
  if (!parent) {
    return;
  }
  if (!isVariableOf7(parent)) {
    parent.appendChild(element2);
    return;
  }
  let previousParent;
  lifecycle.subscribeDisposable(
    (active) => !active ? emptyDisposable : parent.subscribe((newParent) => {
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
    })
  );
}

// src/element/property.ts
import { isVariableOf as isVariableOf8 } from "@tioniq/eventiq";
function applyProperty(element2, lifecycle, key, value) {
  if (value === void 0) {
    return;
  }
  if (!isVariableOf8(value)) {
    element2[key] = value;
    return;
  }
  lifecycle.subscribeDisposable(
    (active) => !active ? emptyDisposable : value.subscribe((newValue) => {
      element2[key] = newValue;
    })
  );
}

// src/element/on-mount.ts
import { isVariableOf as isVariableOf9 } from "@tioniq/eventiq";
function applyOnMount(element2, lifecycle, onMount) {
  if (!onMount) {
    return;
  }
  if (!isVariableOf9(onMount)) {
    lifecycle.subscribeDisposable(
      (active) => {
        var _a;
        return active ? createDisposable((_a = onMount.call(element2)) != null ? _a : emptyDisposable) : emptyDisposable;
      }
    );
    return;
  }
  lifecycle.subscribeDisposable(
    (active) => !active ? emptyDisposable : onMount.subscribeDisposable(
      (value) => {
        var _a;
        return !value ? emptyDisposable : createDisposable((_a = value.call(element2)) != null ? _a : emptyDisposable);
      }
    )
  );
}

// src/element/event.ts
import { isVariableOf as isVariableOf10 } from "@tioniq/eventiq";
function applyEvent(element2, key, value, lifecycle) {
  if (key === "onMount") {
    applyOnMount(
      element2,
      lifecycle,
      value
    );
    return;
  }
  const eventName = key[2].toLowerCase() + key.slice(3);
  if (!isVariableOf10(value)) {
    element2.addEventListener(eventName, value);
    return;
  }
  lifecycle.subscribeDisposable(
    (active) => !active ? emptyDisposable : value.subscribeDisposable((newValue) => {
      return addEventListener(element2, eventName, newValue);
    })
  );
}

// src/element/index.ts
var propsKey = "_elemiqProps";
var noProps = Object.freeze({});
function element(tag, elementOptions) {
  const element2 = document.createElement(tag);
  if (elementOptions == void 0) {
    element2[propsKey] = noProps;
    applyModification(element2, elementOptions);
    return element2;
  }
  element2[propsKey] = elementOptions;
  const lifecycle = createElementLifecycle(element2);
  applyOptions(element2, elementOptions, lifecycle);
  applyModification(element2, elementOptions);
  return element2;
}
function applyOptions(element2, elementOptions, lifecycle) {
  let parent = void 0;
  let key;
  const context = elementOptions.context;
  if (context != void 0) {
    applyContext(element2, lifecycle, context);
  }
  for (key in elementOptions) {
    if (key === "context") {
      continue;
    }
    const value = elementOptions[key];
    if (key === "children") {
      applyChildren(
        element2,
        lifecycle,
        value
      );
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
      applyDataset(
        element2,
        lifecycle,
        value
      );
      continue;
    }
    if (key === "controller") {
      applyController(element2, value);
      continue;
    }
    if (key.startsWith("on")) {
      applyEvent(element2, key, value, lifecycle);
      continue;
    }
    applyProperty(element2, lifecycle, key, value);
  }
  if (parent != void 0) {
    applyParent(element2, lifecycle, parent);
  }
}
function createElementLifecycle(element2) {
  return new LazyVariable(
    (vary) => {
      element2.dataset[domListenKey] = "t";
      const attachListener = () => {
        vary.value = true;
      };
      const detachListener = () => {
        vary.value = false;
      };
      element2.addEventListener("attachedToDom", attachListener);
      element2.addEventListener("detachedFromDom", detachListener);
      vary.value = element2.isConnected;
      return createDisposiq(() => {
        element2.removeEventListener("attachedToDom", attachListener);
        element2.removeEventListener("detachedFromDom", detachListener);
      });
    },
    () => element2.isConnected
  );
}
runMutationObserver();

// src/components/theme-style.ts
import { Vary } from "@tioniq/eventiq";
var theme = new Vary("dark");
function getThemeStyle(forTheme) {
  const styleTheme = forTheme != null ? forTheme : theme;
  return {
    normalColor: new Vary("#232323"),
    primaryColor: new Vary("#227093"),
    secondaryColor: new Vary("#706fd3"),
    successColor: new Vary("#33d9b2"),
    errorColor: new Vary("#ff5252"),
    warningColor: new Vary("#ffda79"),
    infoColor: new Vary("#34ace0"),
    textColor: styleTheme.map((t) => {
      return t === "dark" ? "#ffffff" : "#000000";
    })
  };
}
function getThemeStyleFromContext(context) {
  return getThemeStyle(context.theme);
}
var themeStyle = getThemeStyle(theme);
function createThemeContext() {
  return createContext("theme");
}
var ThemeContext = createThemeContext();

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
var elements = {
  rootElement: {
    html
  },
  metadataAndScripting: {
    head,
    title,
    meta,
    base,
    link,
    style,
    noscript,
    script
  },
  embeddingContent: {
    img,
    area,
    map,
    embed,
    object,
    source,
    iframe,
    canvas,
    track,
    audio,
    video
  },
  textLevelSemantics: {
    span,
    a,
    rt,
    dfn,
    em,
    i,
    small,
    ins,
    s,
    rp,
    abbr,
    time,
    b,
    strong,
    del,
    kbd,
    q,
    var_,
    sub,
    mark,
    bdi,
    wbr,
    cite,
    samp,
    sup,
    ruby,
    bdo,
    code
  },
  groupingContent: {
    div,
    pre,
    br,
    p,
    blockquote,
    hr,
    ol,
    dl,
    figcaption,
    ul,
    dt,
    figure,
    li,
    dd
  },
  forms: {
    form,
    fieldset,
    meter,
    select,
    legend,
    optgroup,
    label,
    option,
    datalist,
    input,
    output,
    textarea,
    button,
    progress
  },
  documentSections: {
    body,
    h1,
    section,
    aside,
    h2,
    header,
    address,
    h3,
    nav,
    h4,
    article,
    h5,
    footer,
    h6,
    hgroup
  },
  tabularData: {
    table,
    col,
    tbody,
    colgroup,
    tr,
    caption,
    td,
    thead,
    th,
    tfoot
  },
  interactiveElements: {
    menu,
    summary,
    details
  }
};

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
      const kKey = getFirstWord(key);
      const classCounter = _classNames.get(kKey);
      if (classCounter === void 0) {
        console.error("Invalid class name", key);
        continue;
      }
      const className2 = kKey + classCounter;
      stylesResult.push({
        rule: `.${className2}${key.substring(kKey.length)}`,
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
      rule: `.${className}`,
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
  for (const style2 of styles) {
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
  const sheet = style2.sheet;
  if (!sheet) {
    return attachSubscription;
  }
  for (const style1 of styles) {
    const styleData = getStyleDeclaration(style1.declaration);
    sheet.insertRule(
      `${style1.rule} { ${styleData.cssText} }`,
      sheet.cssRules.length
    );
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
  return `elemiq-style-${++styleIdCounter}`;
}
function getFirstWord(str) {
  for (let i2 = 0; i2 < str.length; i2++) {
    const charCode = str.charCodeAt(i2);
    const aLetter = charCode >= 65 && charCode < 91 || charCode >= 97 && charCode < 123;
    if (aLetter) {
      continue;
    }
    const aDigit = charCode >= 48 && charCode < 58;
    if (aDigit) {
      continue;
    }
    const isUnderscoreOrHyphen = charCode === 95 || charCode === 45;
    if (isUnderscoreOrHyphen) {
      continue;
    }
    return str.substring(0, i2);
  }
  return str;
}

// src/components/Button.tsx
import { combine, createConst as createConst2 } from "@tioniq/eventiq";

// src/variable/variable.ts
import {
  createConst,
  isVariableOf as isVariableOf11
} from "@tioniq/eventiq";
function toVariable(value) {
  if (isVariableOf11(value)) {
    return value;
  }
  return createConst(value != null ? value : null);
}
function toDefinedVariable(value, defaultValue) {
  if (isVariableOf11(value)) {
    return value.map((v) => v != null ? v : defaultValue);
  }
  return createConst(value != null ? value : defaultValue);
}

// src/components/button-styles.ts
var buttonStyles = makeClassStyles({
  button: {
    transitionProperty: "color transform background-color border-color border",
    transitionTimingFunction: "ease-in-out",
    cursor: "pointer",
    userSelect: "none",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "medium",
    transitionDuration: "0.15s",
    borderRadius: "0.76rem",
    textTransform: "none",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
    border: "0 solid transparent"
  },
  "button:active": {
    scale: "0.95"
  },
  "button:focus": {
    outlineWidth: "2px"
  },
  "button:disabled": {
    pointerEvents: "none",
    opacity: "0.5"
  },
  "button-size-normal": {
    padding: "0.375rem 0.75rem",
    fontSize: "1rem",
    lineHeight: "1.5",
    height: "2.5rem",
    borderRadius: "0.25rem"
  },
  "button-size-small": {
    padding: "0.25rem 0.5rem",
    fontSize: "0.875rem",
    lineHeight: "1.5",
    height: "1.75rem",
    borderRadius: "0.2rem"
  },
  "button-size-large": {
    padding: "0.5rem 1rem",
    fontSize: "1.25rem",
    lineHeight: "1.5",
    height: "3.5rem",
    borderRadius: "0.3rem"
  },
  buttonGhost: {},
  "buttonGhost:hover": {
    backgroundColor: "#282828"
  }
});

// src/components/Button.tsx
function Button(props) {
  const controller = props.controller == void 0 ? void 0 : createController();
  if (controller) {
    useController(props.controller, {
      click() {
        controller.click();
      },
      focus() {
        controller.focus();
      }
    });
  }
  const context = useContext(ThemeContext);
  const themeStyle2 = getThemeStyleFromContext(context);
  const variant = toDefinedVariable(props.variant, "normal");
  const appearance = toDefinedVariable(props.appearance, "normal");
  const size = toDefinedVariable(props.size, "normal");
  const classes = combine(
    createConst2(buttonStyles.button),
    appearance.map((a2) => a2 === "ghost" ? buttonStyles.buttonGhost : ""),
    size.map((s2) => {
      var _a;
      return (_a = buttonStyles[`button-size-${s2}`]) != null ? _a : "";
    })
  );
  const variantColor = variant.switchMap((v) => themeStyle2[`${v}Color`]);
  const borderWidth = appearance.map((a2) => a2 === "outline" ? "2px" : "0");
  const backgroundColor = appearance.switchMap(
    (a2) => a2 === "normal" || a2 === "solid" ? variantColor : createConst2("transparent")
  );
  const borderColor = variantColor;
  const textColor = appearance.switchMap((a2) => {
    switch (a2) {
      case "solid":
        return variantColor.map((c) => lightenColor(c, 0.6));
      case "link":
      case "ghost":
      case "outline":
        return variantColor;
      default:
        return themeStyle2.textColor;
    }
  });
  const textDecoration = appearance.map(
    (a2) => a2 === "link" ? "underline" : "none"
  );
  const style2 = toVariable(props.style).map((s2) => ({
    backgroundColor,
    color: textColor,
    borderColor,
    borderWidth,
    textDecoration,
    ...s2 != null ? s2 : {}
  }));
  return button({
    controller,
    classes,
    className: props.className,
    style: style2,
    onClick: props.onClick,
    children: props.children,
    type: props.type,
    disabled: props.disabled,
    context
  });
}
function lightenColor(hex, percent) {
  const num = Number.parseInt(hex.slice(1), 16);
  const r = (num >> 16) + Math.round(255 * percent);
  const g2 = (num >> 8 & 255) + Math.round(255 * percent);
  const b2 = (num & 255) + Math.round(255 * percent);
  const newR = Math.min(255, Math.max(0, r));
  const newG = Math.min(255, Math.max(0, g2));
  const newB = Math.min(255, Math.max(0, b2));
  const newHex = newR << 16 | newG << 8 | newB;
  return `#${newHex.toString(16).padStart(6, "0")}`;
}

// src/jsx-runtime/render.ts
function renderJsx(tag, props, _key) {
  if (!tag) {
    return span({
      innerText: `Not supported tag '${tag}'`
    });
  }
  if (typeof tag === "string") {
    return element(tag, props);
  }
  if (typeof tag !== "function") {
    return span({
      innerText: `Not supported tag '${tag}'`
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
export {
  Button,
  ContextProvider,
  ThemeContext,
  a,
  abbr,
  addModifier,
  addRawStyle,
  addStyles,
  addTagModifier,
  address,
  applyClasses,
  applyController,
  applyDataset,
  applyModification,
  applyOnMount,
  applyParent,
  applyProperty,
  applyStyle,
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
  createContext,
  createController,
  createThemeContext,
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
  elements,
  em,
  embed,
  fieldset,
  figcaption,
  figure,
  footer,
  form,
  getThemeStyle,
  getThemeStyleFromContext,
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
  theme,
  themeStyle,
  time,
  title,
  tr,
  track,
  u,
  ul,
  useContext,
  useController,
  useFunctionController,
  var_,
  video,
  wbr
};
