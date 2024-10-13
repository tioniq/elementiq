import { isVariableOf, Var } from "@tioniq/eventiq";
import { Context, ContextType, ContextValue, getContext, setContextValue } from "@/context/context.js";
import { emptyDisposable } from "@tioniq/disposiq";
import { ElementChildren } from "@/types/element.js";
import { capitalize } from "@/utils/string-utils.js";

const providers: Map<string, IContextProvider<any>> = new Map()

export function applyContext(element: HTMLElement, lifecycle: Var<boolean>, contextValue: ContextValue<any>) {
  if (!contextValue) {
    return
  }
  lifecycle.subscribeDisposable(active => {
    if (!active) {
      return emptyDisposable
    }
    const context = getContext(contextValue)
    const provider = findContextProvider(element, context)
    if (!provider) {
      return emptyDisposable
    }
    setContextValue(contextValue, provider.value)
    return emptyDisposable
  })
}

function findContextProvider(element: HTMLElement, context: Context<any>): IContextProvider<any> | null {
  if (!context) {
    return null
  }
  let el: HTMLElement | null = element
  const keyToFind = getDataKey((context as any).__key)
  while (el != null) {
    const providerId = el.dataset[keyToFind]
    if (providerId) {
      const result = providers.get(providerId)
      if (result) {
        return result
      }
      console.warn("Invalid context provider id")
    }
    el = el.parentElement
  }
  console.error("No context provider found")
  return null
}

export function ContextProvider<T extends ContextType>(props: {
  context: Context<T>,
  value: T,
  children: ElementChildren
}) {
  const provider = createProvider(props.context, props.value)
  if (!props.children) {
    return null
  }
  applyContextProvider(props.children, provider)
  return props.children
}

function applyContextProvider(children: ElementChildren, provider: IContextProvider<any>) {
  if (!provider) {
    return
  }
  if (children instanceof HTMLElement) {
    children.dataset[provider.dataKey] = provider.id
    return
  }
  if (isVariableOf(children)) {
    children.subscribe(value => {
      applyContextProvider(value, provider)
    })
    return
  }
  if (Array.isArray(children)) {
    for (let child of children) {
      applyContextProvider(child, provider)
    }
    return
  }
  console.warn("Invalid children type")
}

interface IContextProvider<T extends ContextType> {
  context: Context<T>
  value: T
  key: string
  id: string
  dataKey: string
}

function createProvider<T extends ContextType>(context: Context<T>, value: T) {
  const key = (context as any).__key
  const id = (context as any).__id
  if (typeof key !== "string") {
    throw new Error("Invalid context object")
  }
  if (typeof id !== "string") {
    throw new Error("Invalid context object")
  }
  let dataKey = getDataKey(key)
  const provider: IContextProvider<T> = {
    context: context,
    value: value,
    key: key,
    id: id,
    dataKey: dataKey
  }
  providers.set(id, provider)
  return provider
}

function getDataKey(key: string) {
  return 'elCtx' + capitalize(key.replace('-', ''))
}