const setHandler = Symbol("setHandler")

type ControllerHandler<T> = <K extends keyof T>(key: K) => any

interface ControllerProxy<T> {
  [setHandler](handler: ControllerHandler<T>): void
}

export function createController<T extends object>(): T {
  let ref: ControllerHandler<T> | undefined = undefined
  const obj = {} as T
  return new Proxy<T>(obj, {
    get(target, p, receiver) {
      if (p === setHandler) {
        return (handler: ControllerHandler<T>) => {
          if (ref !== undefined) {
            console.error("Controller used multiple times")
          }
          ref = handler
        }
      }
      if (ref === undefined) {
        throw new Error("Controller is not in use")
      }
      return ref(p as keyof T)
    }
  })
}

export function useController<T>(controller: T, handler: T): void {
  if (!controller) {
    return
  }
  (controller as unknown as ControllerProxy<T>)[setHandler](((key: keyof T): any => {
    const value = handler[key as keyof T];
    if (value instanceof Function) {
      return function () {
        return value.apply(handler, arguments);
      };
    }
    return value
  }))
}

export function useFunctionController<T>(controller: T, handler: (key: keyof T, ...args: any[]) => any): void {
  if (!controller) {
    return
  }
  (controller as unknown as ControllerProxy<T>)[setHandler]((key: keyof T): any => {
    return function () {
      return handler(key, arguments);
    }
  })
}