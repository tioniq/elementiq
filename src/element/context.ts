import { isVariableOf, type Var } from "@tioniq/eventiq"
import {
  type Context,
  type ContextType,
  type ContextValue,
  getContext,
  setContextValue,
} from "@/context/context.ts"
import { emptyDisposable } from "@tioniq/disposiq"
import type { ElementChildren } from "@/types/element.ts"
import { capitalize } from "@/utils/string-utils.ts"

const providers: Map<string, IContextProvider<ContextType>> = new Map()

export function applyContext(
  element: HTMLElement,
  lifecycle: Var<boolean>,
  contextValue: ContextValue<ContextType>,
) {
  if (!contextValue) {
    return
  }
  lifecycle.subscribeDisposable((active) => {
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

function findContextProvider(
  element: HTMLElement,
  context: Context<ContextType>,
): IContextProvider<ContextType> | null {
  if (!context) {
    return null
  }
  let el: HTMLElement | null = element
  const keyToFind = getDataKey((context as ContextImpl<ContextType>).__key)
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
  context: Context<T>
  value: T
  children: ElementChildren
}) {
  const provider = createProvider(props.context, props.value)
  if (!props.children) {
    return null
  }
  applyContextProvider(props.children, provider)
  return props.children
}

function applyContextProvider(
  children: ElementChildren,
  provider: IContextProvider<ContextType>,
) {
  if (!provider) {
    return
  }
  if (children instanceof HTMLElement) {
    children.dataset[provider.dataKey] = provider.id
    return
  }
  if (isVariableOf(children)) {
    children.subscribe((value) => {
      applyContextProvider(value, provider)
    })
    return
  }
  if (Array.isArray(children)) {
    for (const child of children) {
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
  const { key, id } = getContextData(context)
  const dataKey = getDataKey(key)
  const provider: IContextProvider<T> = {
    context: context,
    value: value,
    key: key,
    id: id,
    dataKey: dataKey,
  }
  providers.set(id, provider)
  return provider
}

function getContextData<T extends ContextType>(
  context: Context<T>,
): {
  key: string
  id: string
} {
  if (!("__key" in context) || !("__id" in context)) {
    throw new Error("Invalid context object")
  }
  const c = context as ContextImpl<ContextType>
  return {
    key: c.__key,
    id: c.__id,
  }
}

function getDataKey(key: string) {
  return `elCtx${capitalize(key.replace("-", ""))}`
}

interface ContextImpl<T extends ContextType> extends Context<T> {
  readonly __key: string
  readonly __id: string
  __defaultValue?: T | null
}
