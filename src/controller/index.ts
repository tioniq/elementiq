const setHandler = Symbol("setHandler")

interface ControllerProxy<T> {
  [setHandler](handler: T): void
}

export function createController<T extends object>(): T {
  let ref: T | undefined = undefined
  const obj = {} as T
  return new Proxy<T>(obj, {
    get(target, p, receiver) {
      if (p === setHandler) {
        return (handler: T) => {
          if (ref !== undefined) {
            console.error("Controller used multiple times")
          }
          ref = handler
        }
      }
      if (ref === undefined) {
        throw new Error("Controller is not in use")
      }
      const value = ref[p as keyof T];
      if (value instanceof Function) {
        return function () {
          return value.apply(ref, arguments);
        };
      }
      return ref[p as keyof T]
    }
  })
}

export function useController<T>(controller: T, handler: T): void {
  if (!controller) {
    return
  }
  (controller as unknown as ControllerProxy<T>)[setHandler](handler)
}