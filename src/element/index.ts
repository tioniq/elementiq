import type {
  ElementChildren,
  ElementController,
  ElementDataset,
  ElementOptions,
  ElementStyle,
  ElementValue,
} from "@/types/element.ts"
import { domListenKey, runMutationObserver } from "@/lifecycle/index.ts"
import { createDisposiq } from "@tioniq/disposiq"
import { LazyVariable, type Var, type VarOrVal } from "@tioniq/eventiq"
import { applyModification } from "./modifier.ts"
import { applyChildren } from "@/element/children.ts"
import { applyContext } from "@/element/context.ts"
import { applyClasses } from "@/element/classes.ts"
import { applyStyle } from "@/element/style.ts"
import { applyDataset } from "@/element/dataset.ts"
import { applyController } from "@/element/controller.ts"
import { applyParent } from "@/element/parent.ts"
import { applyProperty } from "@/element/property.ts"
import { applyEvent } from "@/element/event.ts"

const propsKey = "_elemiqProps"
const noProps = Object.freeze({})

declare global {
  interface HTMLElement {
    _elemiqProps: unknown
  }
}

export function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  elementOptions?: ElementOptions<HTMLElementTagNameMap[K]>,
): ElementValue<HTMLElementTagNameMap[K]> {
  const element = document.createElement(tag)
  if (elementOptions == undefined) {
    element[propsKey] = noProps
    applyModification(element, elementOptions)
    return element
  }
  element[propsKey] = elementOptions
  const lifecycle = createElementLifecycle(element)
  applyOptions(element, elementOptions, lifecycle)
  applyModification(element, elementOptions)
  return element
}

function applyOptions<
  K extends keyof HTMLElementTagNameMap,
  E extends HTMLElementTagNameMap[K] = HTMLElementTagNameMap[K],
>(
  element: E,
  elementOptions: ElementOptions<E>,
  lifecycle: Var<boolean>,
): void {
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
      applyChildren(
        element,
        lifecycle,
        value as unknown as VarOrVal<ElementChildren>,
      )
      continue
    }
    if (key === "classes") {
      applyClasses(element, lifecycle, value as unknown as VarOrVal<string[]>)
      continue
    }
    if (key === "style") {
      applyStyle(element, lifecycle, value as unknown as VarOrVal<ElementStyle>)
      continue
    }
    if (key === "parent") {
      parent = value as unknown as VarOrVal<ParentNode | undefined>
      continue
    }
    if (key === "dataset") {
      applyDataset(
        element,
        lifecycle,
        value as unknown as VarOrVal<ElementDataset>,
      )
      continue
    }
    if (key === "controller") {
      applyController(element, value as unknown as ElementController<E>)
      continue
    }
    if (key.startsWith("on")) {
      applyEvent(element, key, value as unknown as EventListener, lifecycle)
      continue
    }
    // biome-ignore lint/suspicious/noExplicitAny: Cannot infer type of key
    applyProperty(element, lifecycle, key as any, value)
  }
  if (parent != undefined) {
    applyParent(element, lifecycle, parent)
  }
}

function createElementLifecycle(element: HTMLElement): Var<boolean> {
  return new LazyVariable<boolean>(
    (vary) => {
      element.dataset[domListenKey] = "t"
      const attachListener = () => {
        vary.value = true
      }
      const detachListener = () => {
        vary.value = false
      }
      element.addEventListener("attachedToDom", attachListener)
      element.addEventListener("detachedFromDom", detachListener)
      vary.value = element.isConnected
      return createDisposiq(() => {
        element.removeEventListener("attachedToDom", attachListener)
        element.removeEventListener("detachedFromDom", detachListener)
      })
    },
    () => element.isConnected,
  )
}

runMutationObserver()
