import { createConstVar, createDelegate, DelegateVariable, isVariableOf, Var } from "@tioniq/eventiq";

export type ContextType = Record<string, any>

export type Context<T extends ContextType> = {}

export type ContextValue<T extends ContextType> = {
  [P in keyof T]: T[P] extends Var<unknown> ? T[P] : Var<T[P]>
}

const setContextValueSymbol = Symbol("setContextValue")
const getContextSymbol = Symbol("getContextProvider")

export function getContext<T extends ContextType>(value: ContextValue<T>): Context<T> {
  return (value as any)[getContextSymbol]
}

export function setContextValue<T extends ContextType>(contextValue: ContextValue<T>, value: T | null): void {
  (contextValue as any)[setContextValueSymbol](value)
}

export function useContext<T extends ContextType>(context: Context<T>, defaultValue?: T | null): ContextValue<T> {
  const pro = context as ContextImpl<T>
  const type = typeof pro.__key
  if (type !== "string") {
    throw new Error("Invalid context object")
  }
  const initialValue: T | null = defaultValue ?? pro.__defaultValue ?? null
  const val = {} as ContextValue<T>
  const dataMap = new Map<string, DelegateVariable<any>>()
  return new Proxy<ContextValue<T>>(val, {
    get(_, key) {
      if (typeof key !== "string") {
        if (key === getContextSymbol) {
          return context
        }
        if (key === setContextValueSymbol) {
          return function (newValue: any) {
            if (!newValue) {
              for (let dataMapElement of dataMap) {
                dataMapElement[1].setSource(null)
              }
              return true
            }
            for (let key in newValue) {
              let value = dataMap.get(key)
              if (!value) {
                value = createDelegate(initialValue ? initialValue[key as keyof T] : null)
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
      if (!initialValue) {
        value = createDelegate(null)
        dataMap.set(key, value)
        return value
      }
      value = createDelegate(initialValue[key as keyof T])
      dataMap.set(key, value)
      return value
    }
  })
}

function randomUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === "x" ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function createContext<T extends ContextType>(key: string, defaultValue?: T | null): Context<T> {
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
    }
  }
  return result
}

interface ContextImpl<T extends ContextType> extends Context<T> {
  readonly __key: string
  readonly __id: string
  __defaultValue?: T | null
}