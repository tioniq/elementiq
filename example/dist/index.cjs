"use strict";

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
  for (let i = 0; i < size; i++) {
    holder[i] = disposables[i];
  }
  disposables.length = 0;
  for (let i = 0; i < size; ++i) {
    const disposable = holder[i];
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
  for (let i = 0; i < disposables.length; ++i) {
    const disposable = disposables[i];
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
    for (let i = 0; i < disposables.length; i++) {
      const disposable = disposables[i];
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
var DisposableContainer = class extends Disposiq {
  constructor(disposable = void 0) {
    super();
    this._disposed = false;
    this._disposable = disposable;
  }
  /**
   * Returns true if the container is disposed
   */
  get disposed() {
    return this._disposed;
  }
  /**
   * Returns the current disposable object
   */
  get disposable() {
    return this._disposable;
  }
  /**
   * Set the new disposable and dispose the old one
   * @param disposable a new disposable to set
   */
  set(disposable) {
    if (this._disposed) {
      disposable.dispose();
      return;
    }
    const oldDisposable = this._disposable;
    this._disposable = disposable;
    if (oldDisposable != void 0) {
      oldDisposable.dispose();
    }
  }
  /**
   * Replace the disposable with a new one. Does not dispose the old one
   * @param disposable a new disposable to replace the old one
   */
  replace(disposable) {
    if (this._disposed) {
      disposable.dispose();
      return;
    }
    this._disposable = disposable;
  }
  /**
   * Dispose only the current disposable object without affecting the container's state.
   */
  disposeCurrent() {
    const disposable = this._disposable;
    if (disposable != void 0) {
      this._disposable = void 0;
      disposable.dispose();
    }
  }
  dispose() {
    if (this._disposed) {
      return;
    }
    this._disposed = true;
    if (this._disposable == void 0) {
      return;
    }
    this._disposable.dispose();
    this._disposable = void 0;
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

// node_modules/@tioniq/eventiq/dist/index.js
var Variable = class {
  /**
   * Overload of the `toString` method. Returns the string representation of the value of the variable
   * @returns the string representation of the value of the variable
   */
  toString() {
    const _value = this.value;
    if (_value === null || _value === void 0) {
      return `${_value}`;
    }
    return _value.toString();
  }
  /**
   * Overload of the `valueOf` method. Converts the variable to a primitive value, in this case, the value of the variable
   * @returns the primitive value of the variable
   */
  valueOf() {
    return this.value;
  }
};
function strictEqualityComparer(a, b) {
  return a === b;
}
function simpleEqualityComparer(a, b) {
  return a == b;
}
var defaultEqualityComparer = strictEqualityComparer;
function functionEqualityComparer(a, b) {
  return a === b;
}
function generalEqualityComparer(a, b) {
  if (a === b) {
    return true;
  }
  const typeA = typeof a;
  const typeB = typeof b;
  if (typeA !== typeB) {
    return false;
  }
  if (typeA === "object") {
    return objectEqualityComparer(a, b);
  }
  if (typeA === "function") {
    return functionEqualityComparer(a, b);
  }
  return simpleEqualityComparer(a, b);
}
function objectEqualityComparer(a, b) {
  if (a === b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  let arrayA = Array.isArray(a);
  let arrayB = Array.isArray(b);
  if (arrayA !== arrayB) {
    return false;
  }
  if (arrayA) {
    return arrayEqualityComparer(a, b);
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (const key of keysA) {
    if (!keysB.includes(key)) {
      return false;
    }
    const valueA = a[key];
    const valueB = b[key];
    if (!generalEqualityComparer(valueA, valueB)) {
      return false;
    }
  }
  return true;
}
function arrayEqualityComparer(a, b) {
  if (a === b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; ++i) {
    if (!generalEqualityComparer(a[i], b[i])) {
      return false;
    }
  }
  return true;
}
var LinkedChain = class _LinkedChain {
  constructor(equalityComparer) {
    this._head = null;
    this._tail = null;
    this._invoking = false;
    this._pendingHead = null;
    this._pendingTail = null;
    this._actionHead = null;
    this._equalityComparer = equalityComparer != null ? equalityComparer : defaultEqualityComparer;
  }
  /**
   * Checks if the chain has any elements
   */
  get hasAny() {
    return this._head !== null || this._pendingHead !== null;
  }
  /**
   * Checks if the chain is empty
   */
  get empty() {
    return this._head === null && this._pendingHead === null;
  }
  /**
   * Gets the number of elements in the chain
   * @remarks This getter should be used only for debugging purposes
   */
  get count() {
    let count = 0;
    let node = this._head;
    if (node !== null) {
      do {
        ++count;
        node = node.next;
      } while (node !== null);
    }
    node = this._pendingHead;
    if (node !== null) {
      do {
        count++;
        node = node.next;
      } while (node !== null);
    }
    return count;
  }
  /**
   * Converts the chain to an array
   * @returns an array containing the elements of the chain
   * @remarks This method should be used only for debugging purposes
   */
  toArray() {
    const count = this.count;
    if (count === 0) {
      return [];
    }
    const array = new Array(count);
    let node = this._head;
    let index = 0;
    if (node !== null) {
      do {
        array[index++] = node.value;
        node = node.next;
      } while (node !== null);
    }
    node = this._pendingHead;
    if (node !== null) {
      do {
        array[index++] = node.value;
        node = node.next;
      } while (node !== null);
    }
    return array;
  }
  /**
   * Adds an element to the chain. If the element is already in the chain, it will not be added again.
   * @param value the element to add
   * @returns an array containing the subscription and a boolean value indicating if the element was added
   */
  addUnique(value) {
    const existing = this._findNode(value);
    if (existing !== null) {
      return [new DisposableAction(() => this._unlinkNode(existing)), false];
    }
    return [this.add(value), true];
  }
  /**
   * Adds an element to the end of the chain
   * @param value the element to add
   * @returns a subscription that can be used to remove the element from the chain
   */
  add(value) {
    let node;
    if (this._invoking) {
      if (this._pendingHead === null) {
        node = new ChainNode(value);
        this._pendingHead = node;
        this._pendingTail = node;
      } else {
        node = new ChainNode(value, this._pendingTail, null);
        this._pendingTail.next = node;
        this._pendingTail = node;
      }
      return new DisposableAction(() => this._unlinkNode(node));
    }
    if (this._head === null) {
      node = new ChainNode(value);
      this._head = node;
      this._tail = node;
    } else {
      node = new ChainNode(value, this._tail, null);
      this._tail.next = node;
      this._tail = node;
    }
    return new DisposableAction(() => this._unlinkNode(node));
  }
  /**
   * Adds an element to the beginning of the chain. If the element is already in the chain, it will not be added again.
   * @param value the element to add
   * @returns an array containing the subscription and a boolean value indicating if the element was added
   */
  addToBeginUnique(value) {
    const existing = this._findNode(value);
    if (existing !== null) {
      return [new DisposableAction(() => this._unlinkNode(existing)), false];
    }
    return [this.addToBegin(value), true];
  }
  /**
   * Adds an element to the beginning of the chain
   * @param value the element to add
   * @returns a subscription that can be used to remove the element from the chain
   */
  addToBegin(value) {
    let node;
    if (this._head === null) {
      node = new ChainNode(value);
      this._head = node;
      this._tail = node;
    } else {
      node = new ChainNode(value, null, this._head);
      this._head.previous = node;
      this._head = node;
    }
    return new DisposableAction(() => this._unlinkNode(node));
  }
  /**
   * Adds a node and its children to the end of the chain
   * @param node
   * @remarks This method does not check if the node is already in a chain
   */
  addToBeginNode(node) {
    let chainNode = _LinkedChain._clearNode(node);
    if (chainNode === null) {
      return;
    }
    if (this._head === null) {
      this._head = chainNode;
      while (chainNode.next !== null) {
        chainNode = chainNode.next;
      }
      this._tail = chainNode;
      return;
    }
    let tail = chainNode;
    while (tail.next !== null) {
      tail = tail.next;
    }
    tail.next = this._head;
    this._head.previous = tail;
    this._head = chainNode;
  }
  /**
   * Removes an element from the chain
   * @param value the element to remove
   * @returns true if the element was removed, false otherwise
   */
  remove(value) {
    let checkNode = this._head;
    while (checkNode !== null) {
      if (this._equalityComparer(checkNode.value, value)) {
        this._unlinkNode(checkNode);
        return true;
      }
      checkNode = checkNode.next;
    }
    checkNode = this._pendingHead;
    while (checkNode !== null) {
      if (this._equalityComparer(checkNode.value, value)) {
        this._unlinkNode(checkNode);
        return true;
      }
      checkNode = checkNode.next;
    }
    return false;
  }
  /**
   * Removes all elements from the chain
   */
  clear() {
    let node = this._head;
    if (node !== null) {
      while (node !== null) {
        node.disposed = true;
        node = node.next;
      }
      this._head = null;
      this._tail = null;
    }
    node = this._pendingHead;
    if (node !== null) {
      while (node !== null) {
        node.disposed = true;
        node = node.next;
      }
      this._pendingHead = null;
      this._pendingTail = null;
    }
  }
  /**
   * Removes all elements from the chain and returns the head node
   * @returns the head node of the chain or null if the chain is empty
   */
  removeAll() {
    let node = this._head;
    this._head = null;
    this._tail = null;
    return node;
  }
  /**
   * Iterates over the elements of the chain and invokes the specified action for each element
   * @param valueHandler the action to invoke for each element
   */
  forEach(valueHandler) {
    while (valueHandler !== null) {
      if (this._head !== null) {
        if (this._invoking) {
          if (this._actionHead == null) {
            this._actionHead = new ChainNode(valueHandler);
            return;
          }
          let actionTail = this._actionHead;
          while (actionTail.next !== null) {
            actionTail = actionTail.next;
          }
          actionTail.next = new ChainNode(valueHandler, actionTail, null);
          return;
        }
        this._invoking = true;
        let node = this._head;
        while (node !== null) {
          if (!node.disposed) {
            valueHandler(node.value);
          }
          node = node.next;
        }
        this._invoking = false;
        if (this._pendingHead != null) {
          if (this._head == null) {
            this._head = this._pendingHead;
            this._tail = this._pendingTail;
          } else {
            this._pendingHead.previous = this._tail;
            this._tail.next = this._pendingHead;
            this._tail = this._pendingTail;
          }
          this._pendingHead = null;
          this._pendingTail = null;
        }
      }
      if (this._actionHead == null) {
        return;
      }
      let nextActionNode = this._actionHead;
      nextActionNode.disposed = true;
      this._actionHead = nextActionNode.next;
      if (this._actionHead != null) {
        this._actionHead.previous = null;
        nextActionNode.next = null;
      }
      valueHandler = nextActionNode.value;
    }
  }
  /**
   * @internal
   */
  _findNode(value) {
    let checkNode = this._head;
    while (checkNode !== null) {
      if (this._equalityComparer(checkNode.value, value)) {
        return checkNode;
      }
      checkNode = checkNode.next;
    }
    if (this._invoking) {
      checkNode = this._pendingHead;
      while (checkNode !== null) {
        if (this._equalityComparer(checkNode.value, value)) {
          return checkNode;
        }
        checkNode = checkNode.next;
      }
    }
    return null;
  }
  /**
   * @internal
   */
  _unlinkNode(node) {
    if (node.disposed) {
      return;
    }
    node.disposed = true;
    if (node === this._head) {
      if (node.next === null) {
        this._head = null;
        this._tail = null;
        return;
      }
      this._head = node.next;
      this._head.previous = null;
      return;
    }
    if (node === this._tail) {
      this._tail = node.previous;
      this._tail.next = null;
      return;
    }
    if (node === this._pendingHead) {
      if (node.next == null) {
        this._pendingHead = null;
        this._pendingTail = null;
        return;
      }
      this._pendingHead = node.next;
      this._pendingHead.previous = null;
      return;
    }
    if (node === this._pendingTail) {
      this._pendingTail = node.previous;
      this._pendingTail.next = null;
      return;
    }
    if (node.previous !== null) {
      node.previous.next = node.next;
    }
    if (node.next !== null) {
      node.next.previous = node.previous;
    }
  }
  /**
   * @internal
   */
  static _clearNode(node) {
    let root = null;
    let tail = null;
    let next = node;
    while (next !== null) {
      node = next;
      next = node.next;
      if (node.disposed) {
        continue;
      }
      if (root === null) {
        root = node;
        tail = node;
        node.previous = null;
        continue;
      }
      tail.next = node;
      node.previous = tail;
      tail = node;
    }
    if (tail !== null) {
      tail.next = null;
    }
    return root;
  }
};
var ChainNode = class {
  constructor(value, previous, next) {
    this.disposed = false;
    this.value = value;
    this.previous = previous != null ? previous : null;
    this.next = next != null ? next : null;
  }
};
var CompoundVariable = class extends Variable {
  constructor(initValue, equalityComparer) {
    super();
    this._chain = new LinkedChain(functionEqualityComparer);
    this._value = initValue;
    this._equalityComparer = equalityComparer != null ? equalityComparer : defaultEqualityComparer;
  }
  /**
   * Checks if there are any subscriptions
   * @returns true if there are any subscriptions, false otherwise
   */
  get active() {
    return this._chain.hasAny;
  }
  get value() {
    if (this._chain.hasAny) {
      return this._value;
    }
    return this.getExactValue();
  }
  /**
   * Sets the value of the variable. If the value is the same as the current value, the method will do nothing
   * @param value the new value of the variable
   * @protected internal use only
   */
  set value(value) {
    if (this._equalityComparer(value, this._value)) {
      return;
    }
    this._value = value;
    this._chain.forEach((a) => a(value));
  }
  subscribe(callback) {
    if (this._chain.empty) {
      this.activate();
    }
    const [disposable, added] = this._chain.addUnique(callback);
    if (added) {
      callback(this._value);
    }
    return new DisposableAction(() => {
      disposable.dispose();
      if (this._chain.empty) {
        this.deactivate();
      }
    });
  }
  subscribeSilent(callback) {
    if (this._chain.empty) {
      this.activate();
    }
    const disposable = this._chain.addUnique(callback)[0];
    return new DisposableAction(() => {
      disposable.dispose();
      if (this._chain.empty) {
        this.deactivate();
      }
    });
  }
  /**
   * A method for getting the exact value of the variable. It is called when there are no subscriptions
   * @protected internal use only
   * @returns the default behavior is to return the current (last) value of the variable
   * @remarks this method should be implemented in the derived class
   */
  getExactValue() {
    return this._value;
  }
  /**
   * A method for setting the value of the variable without notifying subscribers
   * @protected internal use only
   * @param value the new value of the variable
   */
  setValueSilent(value) {
    this._value = value;
  }
  /**
   * A method for setting the value of the variable and notifying subscribers without checking the equality
   * @protected internal use only
   * @param value the new value of the variable
   */
  setValueForce(value) {
    this._value = value;
    this._chain.forEach((a) => a(value));
  }
  /**
   * A method for notifying subscribers about the value change
   * @protected internal use only
   */
  notify() {
    const value = this._value;
    this._chain.forEach((a) => a(value));
  }
};
var AndVariable = class extends CompoundVariable {
  constructor(variables) {
    super(false);
    this._subscriptions = [];
    this._variables = variables;
  }
  activate() {
    this._listen(0);
  }
  deactivate() {
    disposeAll(this._subscriptions);
  }
  getExactValue() {
    const variables = this._variables;
    for (let i = 0; i < variables.length; ++i) {
      if (!variables[i].value) {
        return false;
      }
    }
    return true;
  }
  /**
   * @internal
   */
  _listen(index) {
    if (index >= this._variables.length) {
      this.value = true;
      return;
    }
    if (this._subscriptions.length > index) {
      return;
    }
    const __listener = (value) => {
      if (value) {
        this._listen(index + 1);
      } else {
        this._unsubscribeFrom(index + 1);
        this.value = false;
      }
    };
    const variable = this._variables[index];
    this._subscriptions.push(variable.subscribeSilent(__listener));
    __listener(variable.value);
    return;
  }
  /**
   * @internal
   */
  _unsubscribeFrom(index) {
    var _a;
    while (index < this._subscriptions.length) {
      (_a = this._subscriptions.pop()) == null ? void 0 : _a.dispose();
    }
  }
};
var CombinedVariable = class extends CompoundVariable {
  constructor(vars) {
    if (!(vars == null ? void 0 : vars.length)) {
      throw new Error("No variables provided");
    }
    super(stubArray, arrayEqualityComparer);
    this._subscriptions = new DisposableStore();
    this._vars = vars.slice();
  }
  activate() {
    this._subscriptions.disposeCurrent();
    const length = this._vars.length;
    const result = new Array(length);
    for (let i = 0; i < length; ++i) {
      const vary = this._vars[i];
      this._subscriptions.add(vary.subscribeSilent((value) => {
        result[i] = value;
        this.setValueForce(result);
      }));
      result[i] = vary.value;
    }
    this.setValueForce(result);
  }
  deactivate() {
    this._subscriptions.disposeCurrent();
  }
  getExactValue() {
    const length = this._vars.length;
    const result = new Array(length);
    for (let i = 0; i < length; ++i) {
      result[i] = this._vars[i].value;
    }
    return result;
  }
};
var stubArray = Object.freeze([]);
var ConstantVariable = class extends Variable {
  constructor(value, equalityComparer) {
    super();
    this._value = value;
    this._equalityComparer = equalityComparer != null ? equalityComparer : defaultEqualityComparer;
  }
  get value() {
    return this._value;
  }
  get equalityComparer() {
    return this._equalityComparer;
  }
  subscribe(callback) {
    callback(this._value);
    return emptyDisposable;
  }
  subscribeSilent(_) {
    return emptyDisposable;
  }
};
var DelegateVariable = class extends CompoundVariable {
  constructor(sourceOrDefaultValue) {
    super(sourceOrDefaultValue instanceof Variable ? null : sourceOrDefaultValue != void 0 ? sourceOrDefaultValue : null);
    this._sourceSubscription = new DisposableContainer();
    if (sourceOrDefaultValue instanceof Variable) {
      this._source = sourceOrDefaultValue;
    } else {
      this._source = null;
    }
  }
  /**
   * Sets the source variable. The source variable will be used to get the value for the delegate variable
   * @param source the source variable or null to remove the source
   * @returns a disposable that will remove the source when disposed
   */
  setSource(source) {
    if (!source) {
      if (this._source) {
        this.value = this._source.value;
        this._source = null;
      }
      this._sourceSubscription.disposeCurrent();
      return emptyDisposable;
    }
    this._source = source;
    this._sourceSubscription.disposeCurrent();
    if (this.active) {
      this._sourceSubscription.set(source.subscribeSilent((v) => this.setValueForce(v)));
      this.value = source.value;
    }
    return new DisposableAction(() => {
      if (this._source !== source) {
        return;
      }
      this.setSource(null);
    });
  }
  activate() {
    if (this._source === null) {
      return;
    }
    this._sourceSubscription.disposeCurrent();
    this._sourceSubscription.set(this._source.subscribeSilent((v) => this.setValueForce(v)));
    this.value = this._source.value;
  }
  deactivate() {
    if (this._source === null) {
      return;
    }
    this._sourceSubscription.disposeCurrent();
  }
  getExactValue() {
    return this._source !== null ? this._source.value : super.getExactValue();
  }
};
var FuncVariable = class extends CompoundVariable {
  constructor(activate, exactValue) {
    super(null);
    const disposable = new DisposableContainer();
    this._activator = (self) => {
      disposable.disposeCurrent();
      disposable.set(activate(self));
    };
    this._deactivator = () => {
      disposable.disposeCurrent();
    };
    this._exactValue = exactValue;
  }
  get value() {
    return super.value;
  }
  /**
   * Sets the value of the variable. If the value is the same as the current value, the method will do nothing
   * @param value the new value of the variable
   */
  set value(value) {
    super.value = value;
  }
  /**
   * A method for setting the value of the variable and notifying subscribers without checking the equality
   * @param value the new value of the variable
   */
  setValueForce(value) {
    super.setValueForce(value);
  }
  /**
   * A method for setting the value of the variable without notifying subscribers
   * @param value the new value of the variable
   */
  setValueSilent(value) {
    super.setValueSilent(value);
  }
  /**
   * A method for notifying subscribers about the value change
   */
  notify() {
    super.notify();
  }
  activate() {
    this._activator(this);
  }
  deactivate() {
    this._deactivator(this);
  }
  getExactValue() {
    return this._exactValue();
  }
};
var InvertVariable = class extends Variable {
  constructor(variable) {
    super();
    this._chain = new LinkedChain(functionEqualityComparer);
    this._value = false;
    this._subscription = new DisposableContainer();
    this._variable = variable;
  }
  get value() {
    if (this._chain.hasAny) {
      return this._value;
    }
    return !this._variable.value;
  }
  subscribe(callback) {
    if (this._chain.empty) {
      this._activate();
    }
    const [disposable, added] = this._chain.addUnique(callback);
    if (added) {
      callback(this._value);
    }
    return new DisposableAction(() => {
      disposable.dispose();
      if (this._chain.empty) {
        this._deactivate();
      }
    });
  }
  subscribeSilent(callback) {
    return this._variable.subscribeSilent((value) => callback(!value));
  }
  /**
   * @internal
   */
  _activate() {
    this._subscription.disposeCurrent();
    this._subscription.set(this._variable.subscribeSilent((v) => {
      const value = this._value = !v;
      this._chain.forEach((a) => a(value));
    }));
    this._value = !this._variable.value;
  }
  /**
   * @internal
   */
  _deactivate() {
    this._subscription.disposeCurrent();
  }
};
var MapVariable = class extends CompoundVariable {
  constructor(variable, mapper, equalityComparer) {
    super(mapper(variable.value), equalityComparer);
    this._subscription = new DisposableContainer();
    this._listener = (value) => {
      this.value = this._mapper(value);
    };
    this._variable = variable;
    this._mapper = mapper;
  }
  activate() {
    this._subscription.disposeCurrent();
    this._subscription.set(this._variable.subscribeSilent(this._listener));
    this._listener(this._variable.value);
  }
  deactivate() {
    this._subscription.disposeCurrent();
  }
  getExactValue() {
    return this._mapper(this._variable.value);
  }
};
var MutableVariable = class extends Variable {
  constructor(value, equalityComparer) {
    super();
    this._chain = new LinkedChain(functionEqualityComparer);
    this._value = value;
    this._equalityComparer = equalityComparer != null ? equalityComparer : defaultEqualityComparer;
  }
  get value() {
    return this._value;
  }
  /**
   * Sets the value of the variable. The value will be changed only if the new value is different from the old value
   * @param value the new value for the variable
   */
  set value(value) {
    if (this._equalityComparer(value, this._value)) {
      return;
    }
    this._value = value;
    this._chain.forEach((a) => a(value));
  }
  get equalityComparer() {
    return this._equalityComparer;
  }
  subscribe(callback) {
    const [disposable, added] = this._chain.addUnique(callback);
    if (added) {
      callback(this._value);
    }
    return disposable;
  }
  subscribeSilent(callback) {
    return this._chain.addUnique(callback)[0];
  }
  /**
   * Sets the value of the variable without notifying the subscribers
   * @param value the new value for the variable
   * @remarks Use this method only if you are sure what you are doing. Combine this method with the `notify` method
   */
  setSilent(value) {
    this._value = value;
  }
  /**
   * Notifies all subscribers about the change of the value forcibly
   * @remarks Use this method only if you are sure what you are doing. Combine this method with the `setSilent` method
   */
  notify() {
    const value = this._value;
    this._chain.forEach((a) => a(value));
  }
};
var OrVariable = class extends CompoundVariable {
  constructor(variables) {
    super(false);
    this._subscriptions = [];
    this._variables = variables;
  }
  activate() {
    this._listen(0);
  }
  deactivate() {
    disposeAll(this._subscriptions);
  }
  getExactValue() {
    const variables = this._variables;
    for (let i = 0; i < variables.length; ++i) {
      if (variables[i].value) {
        return true;
      }
    }
    return false;
  }
  /**
   * @internal
   */
  _listen(index) {
    if (index >= this._variables.length) {
      this.value = false;
      return;
    }
    if (this._subscriptions.length > index) {
      return;
    }
    const __listener = (value) => {
      if (value) {
        this._unsubscribeFrom(index + 1);
        this.value = true;
      } else {
        this._listen(index + 1);
      }
    };
    const variable = this._variables[index];
    this._subscriptions.push(variable.subscribeSilent(__listener));
    __listener(variable.value);
    return;
  }
  /**
   * @internal
   */
  _unsubscribeFrom(index) {
    var _a;
    while (index < this._subscriptions.length) {
      (_a = this._subscriptions.pop()) == null ? void 0 : _a.dispose();
    }
  }
};
var SealVariable = class extends Variable {
  constructor(vary, equalityComparer) {
    super();
    this._chain = new LinkedChain(functionEqualityComparer);
    this._varSubscription = new DisposableContainer();
    this._value = null;
    this._sealed = false;
    this._var = vary;
    this._equalityComparer = typeof equalityComparer === "function" ? equalityComparer : defaultEqualityComparer;
  }
  get value() {
    if (this._sealed) {
      return this._value;
    }
    if (this._chain.empty) {
      return this._var.value;
    }
    return this._value;
  }
  get equalityComparer() {
    return this._equalityComparer;
  }
  subscribe(callback) {
    if (this._sealed) {
      callback(this._value);
      return emptyDisposable;
    }
    if (this._chain.empty) {
      this._activate();
    }
    const [disposable, added] = this._chain.addUnique(callback);
    if (added) {
      callback(this._value);
    }
    return new DisposableAction(() => {
      disposable.dispose();
      if (!this._sealed && this._chain.empty) {
        this._deactivate();
      }
    });
  }
  subscribeSilent(callback) {
    if (this._sealed) {
      return emptyDisposable;
    }
    if (this._chain.empty) {
      this._activate();
    }
    const disposable = this._chain.addUnique(callback)[0];
    return new DisposableAction(() => {
      disposable.dispose();
      if (!this._sealed && this._chain.empty) {
        this._deactivate();
      }
    });
  }
  /**
   * Seals the variable. If the variable is already sealed, the method will do nothing
   * @param valueToSeal the value to seal. If the value is not provided, the current value of the variable will be
   * sealed
   * @returns true if the variable was sealed, false if the variable was already sealed
   */
  seal(valueToSeal) {
    if (this._sealed) {
      return false;
    }
    this._sealed = true;
    this._varSubscription.dispose();
    if (arguments.length === 0) {
      let currentValue = this._chain.empty ? this._var.value : this._value;
      this._varSubscription.dispose();
      this._sealValue(currentValue);
      return true;
    }
    this._varSubscription.dispose();
    this._sealValue(valueToSeal);
    return true;
  }
  /**
   * @internal
   */
  _activate() {
    this._varSubscription.disposeCurrent();
    this._varSubscription.set(this._var.subscribeSilent((v) => {
      this._value = v;
      this._chain.forEach((a) => a(v));
    }));
    this._value = this._var.value;
  }
  /**
   * @internal
   */
  _deactivate() {
    this._varSubscription.disposeCurrent();
  }
  /**
   * @internal
   */
  _sealValue(value) {
    if (this._equalityComparer(value, this._value)) {
      this._chain.clear();
      return;
    }
    this._value = value;
    this._chain.forEach((a) => a(value));
    this._chain.clear();
  }
};
var SumVariable = class extends CompoundVariable {
  constructor(vars) {
    super(0);
    this._subscriptions = new DisposableStore();
    this._vars = vars.slice();
  }
  activate() {
    const vars = this._vars;
    const length = vars.length;
    const subscriptions = this._subscriptions;
    subscriptions.disposeCurrent();
    for (let i = 0; i < length; ++i) {
      const variable = vars[i];
      subscriptions.add(variable.subscribeSilent(() => {
        this.postValue();
      }));
    }
    this.postValue();
  }
  deactivate() {
    this._subscriptions.dispose();
  }
  getExactValue() {
    const vars = this._vars;
    const length = vars.length;
    let result = 0;
    for (let i = 0; i < length; ++i) {
      result += vars[i].value;
    }
    return result;
  }
  postValue() {
    const vars = this._vars;
    const length = vars.length;
    let result = 0;
    for (let i = 0; i < length; ++i) {
      result += vars[i].value;
    }
    this.value = result;
  }
};
var SwitchMapVariable = class extends CompoundVariable {
  constructor(vary, mapper) {
    super(null);
    this._switchSubscription = new DisposableContainer();
    this._varSubscription = new DisposableContainer();
    this._var = vary;
    this._mapper = mapper;
  }
  activate() {
    this._switchSubscription.disposeCurrent();
    this._switchSubscription.set(this._var.subscribeSilent((i) => this._handleSwitch(i)));
    this._handleSwitch(this._var.value);
  }
  deactivate() {
    this._switchSubscription.disposeCurrent();
    this._varSubscription.disposeCurrent();
  }
  getExactValue() {
    return this._mapper(this._var.value).value;
  }
  /**
   * @internal
   */
  _handleSwitch(input) {
    this._varSubscription.disposeCurrent();
    const mappedVariable = this._mapper(input);
    this._varSubscription.set(mappedVariable.subscribeSilent((result) => this.value = result));
    this.value = mappedVariable.value;
  }
};
var noScheduledValue = Object.freeze({});
var ThrottledVariable = class extends CompoundVariable {
  constructor(vary, onUpdate, equalityComparer) {
    super(null, equalityComparer);
    this._subscription = new DisposableContainer();
    this._updateSubscription = new DisposableContainer();
    this._scheduledValue = noScheduledValue;
    this._var = vary;
    this._onUpdate = onUpdate;
  }
  activate() {
    this._subscription.disposeCurrent();
    this._subscription.set(this._var.subscribeSilent((v) => {
      this._scheduleUpdate(v);
    }));
    this.value = this._var.value;
  }
  deactivate() {
    this._subscription.disposeCurrent();
    this._updateSubscription.disposeCurrent();
  }
  getExactValue() {
    return this._var.value;
  }
  /**
   * @internal
   */
  _scheduleUpdate(value) {
    if (this._scheduledValue !== noScheduledValue) {
      this._scheduledValue = value;
      return;
    }
    this._scheduledValue = value;
    this._updateSubscription.disposeCurrent();
    this._updateSubscription.set(this._onUpdate.subscribeOnce(() => {
      const val = this._scheduledValue;
      this._scheduledValue = noScheduledValue;
      this.value = val === noScheduledValue ? this._var.value : val;
    }));
  }
};
var EventObserver = class {
};
var EventDispatcher = class extends EventObserver {
  constructor() {
    super(...arguments);
    this._nodes = new LinkedChain(functionEqualityComparer);
  }
  subscribe(action) {
    return this._nodes.add(action);
  }
  /**
   * Dispatches the event to all subscribers
   * @param value the value of the event
   */
  dispatch(value) {
    this._nodes.forEach((a) => a(value));
  }
  /**
   * Checks if there are any subscriptions
   * @returns true if there are any subscriptions, false otherwise
   */
  get hasSubscriptions() {
    return this._nodes.hasAny;
  }
};
var LazyEventDispatcher = class extends EventObserver {
  constructor(activator) {
    super();
    this._nodes = new LinkedChain(functionEqualityComparer);
    this._subscription = new DisposableContainer();
    this._activator = activator;
  }
  /**
   * Checks if there are any subscriptions
   * @returns true if there are any subscriptions, false otherwise
   */
  get hasSubscription() {
    return this._nodes.hasAny;
  }
  subscribe(callback) {
    let subscription;
    if (this._nodes.empty) {
      subscription = this._nodes.add(callback);
      this._activate();
    } else {
      subscription = this._nodes.add(callback);
    }
    return new DisposableAction(() => {
      subscription.dispose();
      if (this._nodes.hasAny) {
        return;
      }
      this._deactivate();
    });
  }
  /**
   * Dispatches the event to all subscribers
   * @param value the value of the event
   */
  dispatch(value) {
    this._nodes.forEach((a) => a(value));
  }
  /**
   * @internal
   */
  _activate() {
    this._subscription.disposeCurrent();
    this._subscription.set(createDisposable(this._activator(this)));
  }
  /**
   * @internal
   */
  _deactivate() {
    this._subscription.disposeCurrent();
  }
};
EventObserver.prototype.subscribeOnce = function(callback) {
  const subscription = new DisposableContainer();
  subscription.set(this.subscribe((value) => {
    subscription.dispose();
    callback(value);
  }));
  return subscription;
};
EventObserver.prototype.subscribeOnceWhere = function(callback, condition) {
  const subscription = new DisposableContainer();
  subscription.set(this.subscribe((value) => {
    if (!condition(value)) {
      return;
    }
    subscription.dispose();
    callback(value);
  }));
  return subscription;
};
EventObserver.prototype.subscribeWhere = function(callback, condition) {
  return this.subscribe((value) => {
    if (condition(value)) {
      callback(value);
    }
  });
};
EventObserver.prototype.subscribeOn = function(callback, condition) {
  return condition.subscribeDisposable((value) => value ? this.subscribe(callback) : emptyDisposable);
};
EventObserver.prototype.map = function(mapper) {
  return new LazyEventDispatcher((dispatcher) => this.subscribe((value) => dispatcher.dispatch(mapper(value))));
};
EventObserver.prototype.where = function(condition) {
  return new LazyEventDispatcher((dispatcher) => this.subscribe((value) => {
    if (condition(value)) {
      dispatcher.dispatch(value);
    }
  }));
};
EventDispatcher.prototype.dispatchSafe = function(value) {
  try {
    this.dispatch(value);
  } catch (e) {
  }
};
function createVar(initialValue) {
  return new MutableVariable(initialValue);
}
function createConst(value) {
  return new ConstantVariable(value);
}
function createDelegate(sourceOrDefaultValue) {
  return new DelegateVariable(sourceOrDefaultValue);
}
function combine(...vars) {
  if (vars.length === 0) {
    throw new Error("At least one variable must be provided");
  }
  if (vars.length === 1) {
    return vars[0];
  }
  return new CombinedVariable(vars);
}
function createDelayDispatcher(delay) {
  return new LazyEventDispatcher((dispatcher) => {
    const timeout = setTimeout(() => dispatcher.dispatch(), delay);
    return new DisposableAction(() => clearTimeout(timeout));
  });
}
var noop2 = Object.freeze(function() {
});
Variable.prototype.subscribeDisposable = function(callback) {
  const container = new DisposableContainer();
  const subscription = this.subscribe((v) => {
    container.disposeCurrent();
    container.set(createDisposable(callback(v)));
  });
  return new DisposableAction(() => {
    subscription.dispose();
    container.dispose();
  });
};
Variable.prototype.subscribeOnceWhere = function(callback, condition) {
  const container = new DisposableContainer();
  container.set(this.subscribeSilent((v) => {
    if (!condition(v)) {
      return;
    }
    container.dispose();
    callback(v);
  }));
  const value = this.value;
  if (!condition(value)) {
    return container;
  }
  container.dispose();
  callback(value);
  return emptyDisposable;
};
Variable.prototype.map = function(mapper) {
  return new MapVariable(this, mapper);
};
Variable.prototype.or = function(other) {
  return new OrVariable([this, other]);
};
Variable.prototype.and = function(other) {
  return new AndVariable([this, other]);
};
Variable.prototype.invert = function() {
  return new InvertVariable(this);
};
Variable.prototype.with = function(...others) {
  return new CombinedVariable([this, ...others]);
};
Variable.prototype.switchMap = function(mapper) {
  return new SwitchMapVariable(this, mapper);
};
Variable.prototype.throttle = function(delay, equalityComparer) {
  if (typeof delay === "number") {
    return new ThrottledVariable(this, createDelayDispatcher(delay), equalityComparer);
  }
  return new ThrottledVariable(this, delay, equalityComparer);
};
Variable.prototype.streamTo = function(receiver) {
  return this.subscribe((value) => receiver.value = value);
};
Variable.prototype.startPersistent = function() {
  return this.subscribeSilent(noop2);
};
Variable.prototype.plus = function(other) {
  if (other instanceof Variable) {
    return new SumVariable([this, other]);
  }
  return new MapVariable(this, (v) => v + other);
};
Variable.prototype.minus = function(other) {
  if (other instanceof Variable) {
    return new SumVariable([this, new MapVariable(other, (v) => -v)]);
  }
  return new MapVariable(this, (v) => v - other);
};
Variable.prototype.multiply = function(other) {
  if (other instanceof Variable) {
    return this.with(other).map(([a, b]) => a * b);
  }
  return new MapVariable(this, (v) => v * other);
};
Variable.prototype.divide = function(other) {
  if (other instanceof Variable) {
    return this.with(other).map(([a, b]) => a / b);
  }
  return new MapVariable(this, (v) => v / other);
};
Variable.prototype.round = function() {
  return new MapVariable(this, Math.round);
};
Variable.prototype.moreThan = function(other) {
  if (other instanceof Variable) {
    return this.with(other).map(([a, b]) => a > b);
  }
  return new MapVariable(this, (v) => v > other);
};
Variable.prototype.lessThan = function(other) {
  if (other instanceof Variable) {
    return this.with(other).map(([a, b]) => a < b);
  }
  return new MapVariable(this, (v) => v < other);
};
Variable.prototype.moreOrEqual = function(other) {
  if (other instanceof Variable) {
    return this.with(other).map(([a, b]) => a >= b);
  }
  return new MapVariable(this, (v) => v >= other);
};
Variable.prototype.lessOrEqual = function(other) {
  if (other instanceof Variable) {
    return this.with(other).map(([a, b]) => a <= b);
  }
  return new MapVariable(this, (v) => v <= other);
};
Variable.prototype.equal = function(other, equalityComparer) {
  if (!equalityComparer) {
    equalityComparer = defaultEqualityComparer;
  }
  if (other instanceof Variable) {
    return this.with(other).map(([a, b]) => equalityComparer(a, b));
  }
  return new MapVariable(this, (v) => equalityComparer(v, other));
};
Variable.prototype.sealed = function() {
  return new ConstantVariable(this.value);
};
Variable.prototype.sealWhen = function(condition, equalityComparer) {
  if (!equalityComparer) {
    equalityComparer = defaultEqualityComparer;
  }
  const vary = new SealVariable(this, equalityComparer);
  if (typeof condition === "function") {
    vary.subscribeOnceWhere((v) => vary.seal(v), condition);
    return vary;
  }
  vary.subscribeOnceWhere((v) => vary.seal(v), (v) => equalityComparer(v, condition));
  return vary;
};
function isVariableOf(value, typeCheckerOrExampleValue) {
  if (!(value instanceof Variable)) {
    return false;
  }
  if (typeCheckerOrExampleValue == void 0) {
    return true;
  }
  let checker;
  if (typeof typeCheckerOrExampleValue === "function") {
    checker = typeCheckerOrExampleValue;
  } else {
    checker = (v) => typeof v === typeof typeCheckerOrExampleValue;
  }
  return checker(value.value);
}

// dist/index.js
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
  equalityComparer = equalityComparer || defaultEqualityComparer;
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
var __async2 = (__this, __arguments, generator) => {
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
var Disposiq2 = class {
  /**
   * Support for the internal Disposable API
   */
  [Symbol.dispose]() {
    this.dispose();
  }
};
var AsyncDisposiq2 = class extends Disposiq2 {
  /**
   * Support for the internal Disposable API
   */
  [Symbol.asyncDispose]() {
    return this.dispose();
  }
};
var AbortDisposable2 = class extends Disposiq2 {
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
  dispose() {
    this._controller.abort();
  }
};
var noop3 = Object.freeze(() => {
});
var noopAsync2 = Object.freeze(() => Promise.resolve());
var DisposableAction2 = class extends Disposiq2 {
  constructor(action) {
    super();
    this._disposed = false;
    this._action = typeof action === "function" ? action : noop3;
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
var AsyncDisposableAction2 = class extends AsyncDisposiq2 {
  constructor(action) {
    super();
    this._disposed = false;
    this._action = typeof action === "function" ? action : noopAsync2;
  }
  /**
   * Returns true if the action has been disposed.
   */
  get disposed() {
    return this._disposed;
  }
  dispose() {
    return __async2(this, null, function* () {
      if (this._disposed) {
        return;
      }
      this._disposed = true;
      yield this._action();
    });
  }
};
var Node22 = class {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
};
var Queue2 = class {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  enqueue(value) {
    const node = new Node22(value);
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
var ObjectPool2 = class {
  constructor(poolSize) {
    this._scrap = new Queue2();
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
var pool2 = new ObjectPool2(10);
function disposeAll2(disposables) {
  let size = disposables.length;
  if (size === 0) {
    return;
  }
  let holder = pool2.lift();
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
  if (pool2.full) {
    pool2.size *= 2;
  }
  pool2.throw(holder);
}
function disposeAllUnsafe2(disposables) {
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
var ObjectDisposedException2 = class extends Error {
  constructor(message) {
    super(message || "Object disposed");
  }
};
var DisposableStore2 = class _DisposableStore2 extends Disposiq2 {
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
      this._disposables.push(typeof disposable === "function" ? new DisposableAction2(disposable) : disposable);
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
      disposable = new DisposableAction2(disposable);
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
      throw new ObjectDisposedException2(message);
    }
  }
  dispose() {
    if (this._disposed) {
      return;
    }
    this._disposed = true;
    disposeAllUnsafe2(this._disposables);
  }
  /**
   * Dispose all disposables in the store. The store does not become disposed. The disposables are removed from the
   * store. The store can continue to be used after this method is called. This method is useful when the store is
   * used as a temporary container. The store can be disposed later by calling the dispose method. Calling add during
   * this method will safely add the disposable to the store without disposing it immediately.
   */
  disposeCurrent() {
    disposeAll2(this._disposables);
  }
  static from(disposables, mapper) {
    if (typeof mapper === "function") {
      const store2 = new _DisposableStore2();
      store2.addAll(disposables.map(mapper));
      return store2;
    }
    const store = new _DisposableStore2();
    store.addAll(disposables);
    return store;
  }
};
var emptyPromise2 = Promise.resolve();
var EmptyDisposable2 = class extends AsyncDisposiq2 {
  dispose() {
    return emptyPromise2;
  }
  [Symbol.dispose]() {
  }
  [Symbol.asyncDispose]() {
    return emptyPromise2;
  }
};
var emptyDisposableImpl2 = new EmptyDisposable2();
var emptyDisposable2 = Object.freeze(emptyDisposableImpl2);
function createDisposable2(disposableLike) {
  if (!disposableLike) {
    return emptyDisposable2;
  }
  if (typeof disposableLike === "function") {
    return new DisposableAction2(disposableLike);
  }
  if (typeof disposableLike !== "object") {
    return emptyDisposable2;
  }
  if ("dispose" in disposableLike) {
    return disposableLike;
  }
  if (Symbol.dispose in disposableLike) {
    return new DisposableAction2(() => {
      disposableLike[Symbol.dispose]();
    });
  }
  if (Symbol.asyncDispose in disposableLike) {
    return new AsyncDisposableAction2(() => __async2(this, null, function* () {
      yield disposableLike[Symbol.asyncDispose]();
    }));
  }
  if ("unref" in disposableLike) {
    return new DisposableAction2(() => disposableLike.unref());
  }
  if (disposableLike instanceof AbortController) {
    return new AbortDisposable2(disposableLike);
  }
  return emptyDisposable2;
}
function createDisposiq(disposableLike) {
  if (!disposableLike) {
    return emptyDisposable2;
  }
  if (disposableLike instanceof Disposiq2) {
    return disposableLike;
  }
  if (typeof disposableLike === "function") {
    return new DisposableAction2(disposableLike);
  }
  if (typeof disposableLike !== "object") {
    return emptyDisposable2;
  }
  const hasDispose = "dispose" in disposableLike && typeof disposableLike.dispose === "function";
  const hasSymbolDispose = Symbol.dispose in disposableLike;
  if (hasDispose && hasSymbolDispose) {
    return new class extends Disposiq2 {
      dispose() {
        disposableLike.dispose();
      }
      [Symbol.dispose]() {
        disposableLike[Symbol.dispose]();
      }
    }();
  }
  if (hasDispose) {
    return new DisposableAction2(() => disposableLike.dispose());
  }
  if (hasSymbolDispose) {
    return new DisposableAction2(() => disposableLike[Symbol.dispose]());
  }
  if (Symbol.asyncDispose in disposableLike) {
    return new AsyncDisposableAction2(() => __async2(this, null, function* () {
      yield disposableLike[Symbol.asyncDispose]();
    }));
  }
  if ("unref" in disposableLike) {
    return new DisposableAction2(() => disposableLike.unref());
  }
  if (disposableLike instanceof AbortController) {
    return new AbortDisposable2(disposableLike);
  }
  return emptyDisposable2;
}
var DisposableMapStore = class extends Disposiq2 {
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
    const disposable = createDisposable2(value);
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
Disposiq2.prototype.disposeWith = function(container) {
  return container.add(this);
};
var ExceptionHandlerManager2 = class {
  /**
   * Create a new ExceptionHandlerManager with the default handler
   * @param defaultHandler the default handler. If not provided, the default handler will be a no-op
   */
  constructor(defaultHandler) {
    this._handler = this._defaultHandler = typeof defaultHandler === "function" ? defaultHandler : noop3;
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
var safeDisposableExceptionHandlerManager2 = new ExceptionHandlerManager2();
var modifiers = [];
var hasModifiers = false;
function applyModification(element2, elementOptions) {
  if (!hasModifiers) {
    return;
  }
  for (const modifier of modifiers) {
    modifier(element2, elementOptions);
  }
}
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
function applyChildren(element2, lifecycle, children) {
  if (!children) {
    return;
  }
  lifecycle.subscribeDisposable((active) => {
    if (!active) {
      return emptyDisposable2;
    }
    const disposables = new DisposableStore2();
    let controller = null;
    if (isVariableOf(children)) {
      disposables.add(children.subscribe(updateChildren));
    } else {
      updateChildren(children);
    }
    disposables.add(new DisposableAction2(() => {
      if (controller) {
        controller.remove();
        controller = null;
      }
    }));
    return disposables;
    function updateChildren(newChildrenOpts) {
      if (!controller) {
        controller = setChildren(newChildrenOpts, element2, null);
        return;
      }
      controller = controller.replace(newChildrenOpts);
    }
  });
}
function setChildren(children, element2, mark2) {
  if (Array.isArray(children)) {
    if (children.length === 0) {
      return {
        replace(child) {
          return setChildren(child, element2, mark2);
        },
        remove() {
        }
      };
    }
    children = [...children];
    const controllers = [];
    const beginMark = createEmptyNode();
    element2.insertBefore(beginMark, mark2);
    let slots = new Array(children.length);
    for (let i2 = 0; i2 < children.length; i2++) {
      let slot2 = createEmptyNode();
      element2.insertBefore(slot2, mark2);
      slots[i2] = slot2;
      const child = children[i2];
      const controller = setChildren(child, element2, slot2);
      controllers.push(controller);
    }
    return {
      replace(child) {
        if (!Array.isArray(child)) {
          const controller = setChildren(child, element2, slots[slots.length - 1]);
          this.remove();
          return controller;
        }
        if (child.length === 0) {
          const slot2 = createEmptyNode();
          element2.insertBefore(slot2, slots[slot2.length - 1]);
          this.remove();
          return {
            replace(child2) {
              const controller = setChildren(child2, element2, slot2);
              this.remove();
              return controller;
            },
            remove() {
              element2.removeChild(slot2);
              element2.removeChild(beginMark);
            }
          };
        }
        child = [...child];
        const changes = getArrayChanges(children, child);
        for (let i2 = changes.remove.length - 1; i2 >= 0; --i2) {
          const remove = changes.remove[i2];
          controllers[remove.index].remove();
          element2.removeChild(slots[remove.index]);
          slots.splice(remove.index, 1);
          controllers.splice(remove.index, 1);
        }
        for (let i2 = 0; i2 < changes.add.length; i2++) {
          const add = changes.add[i2];
          const slot2 = createEmptyNode();
          const elementToInsertAfter = add.index === 0 ? beginMark : slots[add.index - 1];
          insertAfter(slot2, elementToInsertAfter);
          const controller = setChildren(child[add.index], element2, slot2);
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
        children = child;
        return this;
      },
      remove() {
        for (let i2 = 0; i2 < controllers.length; i2++) {
          controllers[i2].remove();
        }
        for (let i2 = 0; i2 < slots.length; i2++) {
          element2.removeChild(slots[i2]);
        }
        element2.removeChild(beginMark);
      }
    };
  }
  if (isVariableOf(children)) {
    const slot2 = createEmptyNode();
    element2.insertBefore(slot2, mark2);
    let lastController = null;
    const subscription = children.subscribe((c) => {
      if (lastController) {
        lastController = lastController.replace(c);
      } else {
        lastController = setChildren(c, element2, slot2);
      }
    });
    return {
      replace(child) {
        subscription.dispose();
        const controller = setChildren(child, element2, slot2);
        if (lastController) {
          lastController.remove();
        }
        lastController = controller;
        return controller;
      },
      remove() {
        subscription.dispose();
        element2.removeChild(slot2);
      }
    };
  }
  const node = createNode(children);
  element2.insertBefore(node, mark2);
  return {
    replace(child) {
      const controller = setChildren(child, element2, node);
      element2.removeChild(node);
      return controller;
    },
    remove() {
      element2.removeChild(node);
    }
  };
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
var setContextValueSymbol = Symbol("setContextValue");
var getContextSymbol = Symbol("getContextProvider");
function getContext(value) {
  return value[getContextSymbol];
}
function setContextValue(contextValue, value) {
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
          return function(newValue) {
            if (!newValue) {
              for (let dataMapElement of dataMap) {
                dataMapElement[1].setSource(null);
              }
              return true;
            }
            for (let key2 in newValue) {
              let value2 = dataMap.get(key2);
              if (!value2) {
                value2 = createDelegate(initialValue ? initialValue[key2] : null);
                dataMap.set(key2, value2);
              }
              const v = newValue[key2];
              if (isVariableOf(v)) {
                value2.setSource(v);
              } else {
                value2.setSource(createConst(v));
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
      if (!initialValue) {
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
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
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
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
var providers = /* @__PURE__ */ new Map();
function applyContext(element2, lifecycle, contextValue) {
  if (!contextValue) {
    return;
  }
  lifecycle.subscribeDisposable((active) => {
    if (!active) {
      return emptyDisposable2;
    }
    const context = getContext(contextValue);
    const provider = findContextProvider(element2, context);
    if (!provider) {
      return emptyDisposable2;
    }
    setContextValue(contextValue, provider.value);
    return emptyDisposable2;
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
  console.error("No context provider found");
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
  if (isVariableOf(children)) {
    children.subscribe((value) => {
      applyContextProvider(value, provider);
    });
    return;
  }
  if (Array.isArray(children)) {
    for (let child of children) {
      applyContextProvider(child, provider);
    }
    return;
  }
  console.warn("Invalid children type");
}
function createProvider(context, value) {
  const key = context.__key;
  const id = context.__id;
  if (typeof key !== "string") {
    throw new Error("Invalid context object");
  }
  if (typeof id !== "string") {
    throw new Error("Invalid context object");
  }
  let dataKey = getDataKey(key);
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
function getDataKey(key) {
  return "elCtx" + capitalize(key.replace("-", ""));
}
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
    if (key === "context") {
      applyContext(element2, lifecycle, value);
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
  return new FuncVariable((vary) => {
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
function applyClasses(element2, lifecycle, classes) {
  if (!classes) {
    return;
  }
  if (!isVariableOf(classes)) {
    element2.classList.add(...classes.filter((c) => !!c));
    return;
  }
  let previousClasses = emptyStringArray;
  lifecycle.subscribeDisposable((active) => {
    return !active ? emptyDisposable2 : classes.subscribe((newClasses) => {
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
    });
  });
}
function applyStyle(element2, lifecycle, style2) {
  if (!style2) {
    return;
  }
  lifecycle.subscribeDisposable((active) => {
    if (!active) {
      return emptyDisposable2;
    }
    const disposables = new DisposableStore2();
    if (isVariableOf(style2)) {
      const dispoMapStore = new DisposableMapStore();
      disposables.add(dispoMapStore);
      disposables.add(listenObjectKVChanges(style2, (keysToDelete, changesToAddOrModify) => {
        if (keysToDelete !== null) {
          for (let key of keysToDelete) {
            element2.style.removeProperty(key);
            dispoMapStore.delete(key);
          }
        }
        if (changesToAddOrModify !== null) {
          for (let key in changesToAddOrModify) {
            const value = changesToAddOrModify[key];
            if (isVariableOf(value)) {
              dispoMapStore.set(key, value.subscribe((newValue) => {
                if (newValue === void 0) {
                  element2.style.removeProperty(key);
                  return;
                }
                element2.style[key] = newValue != null ? newValue : "";
              }));
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
      }));
    } else {
      let styleKey;
      for (styleKey in style2) {
        const value = style2[styleKey];
        if (isVariableOf(value)) {
          disposables.add(value.subscribe((newValue) => {
            if (newValue === void 0) {
              element2.style.removeProperty(styleKey);
              return;
            }
            element2.style[styleKey] = newValue != null ? newValue : "";
          }));
          continue;
        }
        if (value === void 0) {
          element2.style.removeProperty(styleKey);
          continue;
        }
        element2.style[styleKey] = value != null ? value : "";
      }
    }
    return disposables;
  });
}
function applyDataset(element2, lifecycle, dataset) {
  if (!dataset) {
    return;
  }
  if (!isVariableOf(dataset)) {
    for (let key in dataset) {
      element2.dataset[key] = dataset[key];
    }
    return;
  }
  lifecycle.subscribeDisposable((active) => !active ? emptyDisposable2 : listenObjectKVChanges(dataset, (keysToDelete, changesToAddOrModify) => {
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
  if (!isVariableOf(onMount)) {
    lifecycle.subscribeDisposable((active) => {
      var _a;
      return active ? createDisposable2((_a = onMount.call(element2)) != null ? _a : emptyDisposable2) : emptyDisposable2;
    });
    return;
  }
  lifecycle.subscribeDisposable((active) => !active ? emptyDisposable2 : onMount.subscribeDisposable((value) => {
    var _a;
    return !value ? emptyDisposable2 : createDisposable2((_a = onMount.call(element2)) != null ? _a : emptyDisposable2);
  }));
}
function applyProperty(element2, lifecycle, key, value) {
  if (value === void 0) {
    return;
  }
  if (!isVariableOf(value)) {
    element2[key] = value;
    return;
  }
  lifecycle.subscribeDisposable(
    (active) => !active ? emptyDisposable2 : value.subscribe((newValue) => element2[key] = newValue)
  );
}
function applyParent(element2, lifecycle, parent) {
  if (!parent) {
    return;
  }
  if (!isVariableOf(parent)) {
    parent.appendChild(element2);
    return;
  }
  let previousParent;
  lifecycle.subscribeDisposable((active) => !active ? emptyDisposable2 : parent.subscribe((newParent) => {
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
runMutationObserver();
var theme = new MutableVariable("dark");
function getThemeStyle(forTheme) {
  forTheme = forTheme != null ? forTheme : theme;
  return {
    normalColor: new MutableVariable("#232323"),
    primaryColor: new MutableVariable("#227093"),
    secondaryColor: new MutableVariable("#706fd3"),
    successColor: new MutableVariable("#33d9b2"),
    errorColor: new MutableVariable("#ff5252"),
    warningColor: new MutableVariable("#ffda79"),
    infoColor: new MutableVariable("#34ace0"),
    textColor: forTheme.map((t) => t === "dark" ? "#ffffff" : "#000000")
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
function button(options) {
  return element("button", options);
}
function span(options) {
  return element("span", options);
}
function render(value, parent) {
  if (typeof value === "function") {
    const element2 = value({});
    parent.appendChild(element2);
    return;
  }
  parent.appendChild(value);
}
var _addedStyles = [];
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
  return new DisposableAction2(() => {
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
function toVariable(value) {
  if (isVariableOf(value)) {
    return value;
  }
  return createConst(value != null ? value : null);
}
function toDefinedVariable(value, defaultValue) {
  if (isVariableOf(value)) {
    return value.map((v) => v != null ? v : defaultValue);
  }
  return createConst(value != null ? value : defaultValue);
}
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
function Button(props) {
  let controller = props.controller == void 0 ? void 0 : createController();
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
    createConst(buttonStyles.button),
    appearance.map((a2) => a2 === "ghost" ? buttonStyles.buttonGhost : ""),
    size.map((s2) => {
      var _a;
      return (_a = buttonStyles[`button-size-${s2}`]) != null ? _a : "";
    })
  );
  const variantColor = variant.switchMap((v) => themeStyle2[`${v}Color`]);
  const borderWidth = appearance.map((a2) => a2 === "outline" ? "2px" : "0");
  const backgroundColor = appearance.switchMap((a2) => a2 === "normal" || a2 === "solid" ? variantColor : createConst("transparent"));
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
  const textDecoration = appearance.map((a2) => a2 === "link" ? "underline" : "none");
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
  const num = parseInt(hex.slice(1), 16);
  const r = (num >> 16) + Math.round(255 * percent);
  const g = (num >> 8 & 255) + Math.round(255 * percent);
  const b2 = (num & 255) + Math.round(255 * percent);
  const newR = Math.min(255, Math.max(0, r));
  const newG = Math.min(255, Math.max(0, g));
  const newB = Math.min(255, Math.max(0, b2));
  const newHex = newR << 16 | newG << 8 | newB;
  return `#${newHex.toString(16).padStart(6, "0")}`;
}
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
var jsx = renderJsx;
var jsxs = renderJsx;

// example/index.tsx
function AnotherView() {
  return /* @__PURE__ */ jsx("span", { children: "Hello, you tapped:" });
}
function View() {
  const theme2 = createVar("dark");
  const count = createVar(0);
  const variants = ["normal", "primary", "secondary", "success", "error", "warning", "info"];
  const appearances = ["normal", "solid", "outline", "link", "ghost"];
  const variant = createVar("normal");
  const appearance = createVar("normal");
  const dynamicElements = createVar([]);
  return /* @__PURE__ */ jsx(ContextProvider, { context: ThemeContext, value: { theme: theme2 }, children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AnotherView, {}),
    /* @__PURE__ */ jsxs("span", { children: [
      count.map((c) => c % 10 === 0 ? /* @__PURE__ */ jsx("span", { children: "Wow!" }) : c.toString()),
      " ",
      " times. ",
      " ",
      count.map((c) => "Next: " + (c + 1))
    ] }),
    /* @__PURE__ */ jsx("br", {}),
    /* @__PURE__ */ jsx(Button, { variant, appearance, onClick: () => {
      count.value += 1;
    }, children: "Click me" }),
    /* @__PURE__ */ jsx(Button, { variant, appearance, disabled: true, children: "Disabled" }),
    /* @__PURE__ */ jsx("br", {}),
    /* @__PURE__ */ jsx("br", {}),
    variants.map((v) => /* @__PURE__ */ jsx(Button, { variant: v, onClick: () => variant.value = v, children: v })),
    /* @__PURE__ */ jsx("br", {}),
    appearances.map((a) => /* @__PURE__ */ jsx(Button, { appearance: a, onClick: () => appearance.value = a, children: a })),
    /* @__PURE__ */ jsx("br", {}),
    dynamicElements,
    /* @__PURE__ */ jsx("br", {}),
    /* @__PURE__ */ jsx(Button, { onClick: () => {
      const startTime = performance.now();
      const random = Math.random() * 1e6;
      dynamicElements.value = [dynamicElements.value, /* @__PURE__ */ jsxs(Button, { children: [
        "Dynamic ",
        random.toString()
      ] })];
      console.info("Dynamic elements", dynamicElements.value);
      console.log("Dynamic elements change time:", performance.now() - startTime, "ms");
    }, children: "Add dynamic element" }),
    /* @__PURE__ */ jsx(Button, { onClick: () => {
      theme2.value = theme2.value === "light" ? "dark" : "light";
    }, children: "Change theme" })
  ] }) });
}
window.onload = () => {
  let startTime = performance.now();
  render(View, document.body);
  console.log("Render time:", performance.now() - startTime, "ms");
  startTime = performance.now();
  render(AnotherView, document.body);
  console.log("Render 2 time:", performance.now() - startTime, "ms");
};
