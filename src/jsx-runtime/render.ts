import { span, element, type ElementOptions } from "../index.ts"
import type { JSX } from "./index.ts"

export function renderJsx<TProps extends object>(
  func: (props?: TProps) => JSX.Element,
  props: TProps,
  _key?: string,
): JSX.Element

export function renderJsx<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: ElementOptions<HTMLElementTagNameMap[K]>,
  _key?: string,
): JSX.Element

export function renderJsx<K extends JSX.ElementType>(
  tag: K,
  props: unknown,
  _key?: string,
): JSX.Element {
  if (!tag) {
    return span({
      innerText: `Not supported tag '${tag}'`,
    })
  }
  if (typeof tag === "string") {
    return element(tag, props as ElementOptions)
  }
  if (typeof tag !== "function") {
    return span({
      innerText: `Not supported tag '${tag}'`,
    })
  }
  if (isClassComponent(tag)) {
    const instance = new tag(props as ElementOptions)
    return instance.render()
  }
  return tag(props as ElementOptions)
}

// biome-ignore lint/complexity/noBannedTypes: Should be able to handle different types
function isClassComponent(tag: Function): tag is JSX.ElementClass {
  if (tag.prototype === undefined) {
    return false
  }
  return "render" in tag.prototype
}
