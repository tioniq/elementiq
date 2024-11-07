import {
  ElementController,
  ElementDataset,
  ElementOptions,
  ElementStyle,
  ElementValue
} from "@/types/element.ts";
import { domListenKey, runMutationObserver } from "@/lifecycle/index.ts";
import { getObjectValuesChanges, StringArrayKeyOf } from "@/diff/object.ts";
import { getArrayChanges } from "@/diff/array.ts";
import {
  createDisposiq,
  DisposableMapStore,
  DisposableStore,
  emptyDisposable,
  IDisposable,
  toDisposable
} from "@tioniq/disposiq";
import { isVariableOf, LazyVariable, Var, VarOrVal } from "@tioniq/eventiq";
import { applyModification } from "./modifier.ts";
import { useController } from "@/controller/index.ts";
import { applyChildren } from "@/element/children.ts";
import { applyContext } from "@/element/context.ts";

const propsKey = "_elemiqProps"
const noProps = Object.freeze({})
const emptyStringArray: string[] = []

declare global {
  interface HTMLElement {
    _elemiqProps: any
  }
}

export function element<K extends keyof HTMLElementTagNameMap>(tag: K, elementOptions?: ElementOptions<HTMLElementTagNameMap[K]>): ElementValue<HTMLElementTagNameMap[K]> {
  const element = document.createElement(tag)
  if (elementOptions == undefined) {
    element[propsKey] = noProps
    applyModification(element, elementOptions)
    return element
  }
  element[propsKey] = elementOptions
  const lifecycle = createLifecycle(element)
  applyOptions(element, elementOptions, lifecycle)
  applyModification(element, elementOptions)
  return element
}

function applyOptions<K extends keyof HTMLElementTagNameMap, E extends HTMLElementTagNameMap[K] = HTMLElementTagNameMap[K]>(element: E, elementOptions: ElementOptions<E>, lifecycle: Var<boolean>) {
  let parent: VarOrVal<ParentNode | undefined> | undefined = undefined
  let key: keyof ElementOptions<E>
  const context = elementOptions.context
  if (context != undefined) {
    applyContext(element, lifecycle, context)
  }
  for (key in elementOptions) {
    if (key === "context") {
      continue
    }
    const value = elementOptions[key]
    if (key === "children") {
      applyChildren(element, lifecycle, value)
      continue
    }
    if (key === "classes") {
      applyClasses(element, lifecycle, value)
      continue;
    }
    if (key === "style") {
      applyStyle(element, lifecycle, value)
      continue;
    }
    if (key === "parent") {
      parent = value
      continue
    }
    if (key === "dataset") {
      applyDataset(element, lifecycle, value)
      continue
    }
    if (key === "controller") {
      applyController(element, value)
      continue
    }
    if (key.startsWith("on")) {
      if (key === "onMount") {
        applyOnMount(element, lifecycle, value)
        continue
      }
      if (key === "onAttachedToDom") {
        element.addEventListener("attachedToDom", value as EventListener)
        continue
      }
      if (key === "onDetachedFromDom") {
        element.addEventListener("detachedFromDom", value as EventListener)
        continue
      }
      const eventName = key[2].toLowerCase() + key.slice(3)
      element.addEventListener(eventName, value as EventListener)
      continue
    }
    applyProperty(element, lifecycle, key as any, value)
  }
  if (parent !== undefined) {
    applyParent(element, lifecycle, parent)
  }
}

function createLifecycle(element: HTMLElement): Var<boolean> {
  return new LazyVariable<boolean>(vary => {
    element.dataset[domListenKey] = "t"
    const attachListener = function () {
      vary.value = true
    }
    const detachListener = function () {
      vary.value = false
    }
    element.addEventListener("attachedToDom", attachListener)
    element.addEventListener("detachedFromDom", detachListener)
    vary.value = element.isConnected
    return createDisposiq(() => {
      element.removeEventListener("attachedToDom", attachListener)
      element.removeEventListener("detachedFromDom", detachListener)
    })
  }, () => element.isConnected)
}

function applyClasses(element: HTMLElement, lifecycle: Var<boolean>, classes: VarOrVal<string[]>) {
  if (!classes) {
    return
  }
  if (!isVariableOf<string[]>(classes)) {
    element.classList.add(...classes.filter(c => !!c))
    return
  }
  let previousClasses: string[] = emptyStringArray
  lifecycle.subscribeDisposable(active => {
    return !active
      ? emptyDisposable
      : classes.subscribe(newClasses => {
        if (!Array.isArray(newClasses) || newClasses.length === 0) {
          if (previousClasses.length === 0) {
            return
          }
          for (let i = 0; i < previousClasses.length; ++i) {
            element.classList.remove(previousClasses[i])
          }
          previousClasses = emptyStringArray
          return
        }
        const newValues = [...newClasses.filter(c => !!c)]
        if (previousClasses.length === 0) {
          element.classList.add.apply(element.classList, newValues)
          previousClasses = newValues
          return
        }
        const changes = getArrayChanges(previousClasses, newValues)
        for (let i = 0; i < changes.remove.length; ++i) {
          element.classList.remove(changes.remove[i].item)
        }
        for (let i = 0; i < changes.add.length; ++i) {
          element.classList.add(changes.add[i].item)
        }
        previousClasses = newValues
      });
  })
}

function applyStyle(element: HTMLElement, lifecycle: Var<boolean>, style: VarOrVal<ElementStyle>) {
  if (!style) {
    return
  }
  lifecycle.subscribeDisposable(active => {
    if (!active) {
      return emptyDisposable;
    }
    const disposables = new DisposableStore()
    if (isVariableOf<ElementStyle>(style)) {
      const dispoMapStore = new DisposableMapStore<string>()
      disposables.add(dispoMapStore)
      disposables.add(listenObjectKVChanges(style, (keysToDelete, changesToAddOrModify) => {
        if (keysToDelete !== null) {
          for (let key of keysToDelete) {
            element.style.removeProperty(key)
            dispoMapStore.delete(key)
          }
        }
        if (changesToAddOrModify !== null) {
          for (let key in changesToAddOrModify) {
            const value = changesToAddOrModify[key]
            if (isVariableOf<string | undefined>(value)) {
              dispoMapStore.set(key, value.subscribe(newValue => {
                if (newValue === undefined) {
                  element.style.removeProperty(key)
                  return
                }
                element.style[key] = newValue ?? ""
              }))
              continue
            }
            dispoMapStore.delete(key)
            if (value === undefined) {
              element.style.removeProperty(key)
              continue
            }
            element.style[key] = value ?? ""
          }
        }
      }))
    } else {
      let styleKey: keyof ElementStyle & string
      for (styleKey in style) {
        const value = style[styleKey]
        if (isVariableOf<string | undefined>(value)) {
          disposables.add(value.subscribe(newValue => {
            if (newValue === undefined) {
              element.style.removeProperty(styleKey)
              return
            }
            element.style[styleKey] = newValue ?? ""
          }))
          continue
        }
        if (value === undefined) {
          element.style.removeProperty(styleKey)
          continue
        }
        element.style[styleKey] = value ?? ""
      }
    }
    return disposables
  })
}

function applyDataset(element: HTMLElement, lifecycle: Var<boolean>, dataset: VarOrVal<ElementDataset>) {
  if (!dataset) {
    return
  }
  if (!isVariableOf<ElementDataset>(dataset)) {
    for (let key in dataset) {
      element.dataset[key] = dataset[key]
    }
    return
  }
  lifecycle.subscribeDisposable(active => !active
    ? emptyDisposable
    : listenObjectKVChanges(dataset, (keysToDelete, changesToAddOrModify) => {
      if (keysToDelete !== null) {
        for (let key of keysToDelete) {
          delete element.dataset[key]
        }
      }
      if (changesToAddOrModify !== null) {
        for (let key in changesToAddOrModify) {
          element.dataset[key] = changesToAddOrModify[key]
        }
      }
    }))
}

function applyController<T extends HTMLElement>(element: T, controller: ElementController<T>) {
  useController(controller, element)
}

type OnMountHandler = (this: HTMLElement) => IDisposable | void

function applyOnMount(element: HTMLElement, lifecycle: Var<boolean>, onMount: OnMountHandler) {
  if (!onMount) {
    return
  }
  if (!isVariableOf<OnMountHandler>(onMount)) {
    lifecycle.subscribeDisposable(active => active
      ? toDisposable(onMount.call(element) ?? emptyDisposable)
      : emptyDisposable)
    return
  }
  lifecycle.subscribeDisposable(active => !active
    ? emptyDisposable
    : onMount.subscribeDisposable(value => !value
      ? emptyDisposable
      : toDisposable(onMount.call(element) ?? emptyDisposable)))
}

function applyProperty<T extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementTagNameMap[T]>(
  element: HTMLElementTagNameMap[T], lifecycle: Var<boolean>, key: K, value: VarOrVal<HTMLElementTagNameMap[T][K]>) {
  if (value === undefined) {
    return
  }
  if (!isVariableOf<HTMLElementTagNameMap[T][K]>(value)) {
    element[key] = value
    return
  }
  lifecycle.subscribeDisposable(active => !active
    ? emptyDisposable
    : value.subscribe(newValue => element[key] = newValue as any)
  )
}

function applyParent(element: HTMLElement, lifecycle: Var<boolean>, parent: VarOrVal<ParentNode | undefined>) {
  if (!parent) {
    return
  }
  if (!isVariableOf<ParentNode | undefined>(parent)) {
    parent.appendChild(element)
    return
  }
  let previousParent: ParentNode | undefined
  lifecycle.subscribeDisposable(active => !active
    ? emptyDisposable
    : parent.subscribe(newParent => {
      if (previousParent === newParent) {
        return
      }
      if (!newParent) {
        if (previousParent !== undefined) {
          previousParent.removeChild(element)
          previousParent = undefined
        }
        return
      }
      if (previousParent === undefined) {
        newParent.appendChild(element)
        previousParent = newParent
        return
      }
      previousParent.removeChild(element)
      newParent.appendChild(element)
      previousParent = newParent
    }))
}


type ListenObjectKVChangesHandler<T extends Record<string, any>> = (keysToDelete: StringArrayKeyOf<T> | null, changesToAddOrModify: Partial<T> | null) => void

function listenObjectKVChanges<T extends Record<string, any>>(variable: Var<T>, handler: ListenObjectKVChangesHandler<T>): IDisposable {
  let currentState: T = variable.value
  const subscription = variable.subscribeSilent(value => {
    let [keysToDelete, dataToAddOrChange] = getObjectValuesChanges(currentState, value)
    currentState = value
    handler(keysToDelete, dataToAddOrChange)
  })
  handler(null, currentState)
  return subscription
}

runMutationObserver()