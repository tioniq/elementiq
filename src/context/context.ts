import {
  createConstVar,
  createDelegate,
  type DelegateVariable,
  isVariableOf,
  type Var,
} from "@tioniq/eventiq"

export type ContextType = object

// biome-ignore lint/complexity/noBannedTypes: Should be empty
export type Context<T extends ContextType> = {}

export type ContextValue<T extends ContextType> = {
  [P in keyof T]: T[P] extends Var<unknown> ? T[P] : Var<T[P]>
}

const setContextValueSymbol = Symbol("setContextValue")
const getContextSymbol = Symbol("getContextProvider")

interface InternalContextValue<T extends ContextType> {
  [getContextSymbol]: Context<T>
  [setContextValueSymbol](value: T | null): void
}

export function getContext<T extends ContextType>(
  value: ContextValue<T>,
): Context<T> {
  return (value as InternalContextValue<T>)[getContextSymbol]
}

export function setContextValue<T extends ContextType>(
  contextValue: ContextValue<T>,
  value: T | null,
): void {
  ;(contextValue as InternalContextValue<T>)[setContextValueSymbol](value)
}

export function useContext<T extends ContextType>(
  context: Context<T>,
  defaultValue?: T | null,
): ContextValue<T> {
  const pro = context as ContextImpl<T>
  const type = typeof pro.__key
  if (type !== "string") {
    throw new Error("Invalid context object")
  }
  const initialValue: T | null = defaultValue ?? pro.__defaultValue ?? null
  const val = {} as ContextValue<T>
  const dataMap = new Map<string, DelegateVariable<unknown>>()
  return new Proxy<ContextValue<T>>(val, {
    get(_, key) {
      if (typeof key !== "string") {
        if (key === getContextSymbol) {
          return context
        }
        if (key === setContextValueSymbol) {
          return (newValue: T) => {
            if (!newValue) {
              for (const dataMapElement of dataMap.values()) {
                dataMapElement.setSource(null)
              }
              return true
            }
            for (const key in newValue) {
              let value = dataMap.get(key)
              if (!value) {
                if (initialValue && key in initialValue) {
                  value = createDelegate(initialValue[key])
                } else {
                  value = createDelegate(null)
                }
                dataMap.set(key, value)
              }
              const v = newValue[key]
              if (isVariableOf(v)) {
                value.setSource(v)
              } else {
                value.setSource(createConstVar(v))
              }
            }
            return true
          }
        }
        return undefined
      }
      let value = dataMap.get(key)
      if (value) {
        return value
      }
      if (!initialValue || !(key in initialValue)) {
        value = createDelegate(null)
        dataMap.set(key, value)
        return value
      }
      value = createDelegate(initialValue[key as keyof T])
      dataMap.set(key, value)
      return value
    },
  })
}

function randomUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function createContext<T extends ContextType>(
  key: string,
  defaultValue?: T | null,
): Context<T> {
  if (!key) {
    throw new Error("Context key cannot be empty")
  }
  const id = randomUUID()
  const result: ContextImpl<T> = {
    __defaultValue: defaultValue,
    get __key(): string {
      return key
    },
    get __id(): string {
      return id
    },
  }
  return result
}

interface ContextImpl<T extends ContextType> extends Context<T> {
  readonly __key: string
  readonly __id: string
  __defaultValue?: T | null
}
