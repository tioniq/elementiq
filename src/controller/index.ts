const setHandler = Symbol("setHandler")

type ControllerHandler<T> = <K extends keyof T>(key: K) => unknown

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
    },
  })
}

export function useController<T>(controller: T, handler: T): void {
  if (!controller) {
    return
  }
  ;(controller as unknown as ControllerProxy<T>)[setHandler](
    (key: keyof T): unknown => {
      const value = handler[key as keyof T]
      if (value instanceof Function) {
        return (...args: unknown[]) => value.apply(handler, args)
      }
      return value
    },
  )
}

export function useFunctionController<T>(
  controller: T,
  handler: (key: keyof T, ...args: unknown[]) => unknown,
): void {
  if (!controller) {
    return
  }
  ;(controller as unknown as ControllerProxy<T>)[setHandler](
    (key: keyof T): unknown => {
      return (...args: unknown[]) => handler(key, args)
    },
  )
}
