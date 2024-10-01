import {span, element, ElementOptions} from "../index";
import {JSX} from "./index";

export function renderJsx<TProps extends object>(func: (props?: TProps) => JSX.Element, props: TProps, _key?: string): JSX.Element

export function renderJsx<K extends keyof HTMLElementTagNameMap>(tag: K, props: ElementOptions<HTMLElementTagNameMap[K]>, _key?: string): JSX.Element

export function renderJsx<K extends JSX.ElementType>(
  tag: K,
  props: any,
  _key?: string): JSX.Element {
  if (!tag) {
    return span({
      innerText: "Not supported tag '" + tag + "'"
    })
  }
  if (typeof tag === "string") {
    return element(tag, props)
  }
  if (typeof tag !== "function") {
    return span({
      innerText: "Not supported tag '" + tag + "'"
    })
  }
  if (isClassComponent(tag)) {
    const instance = new tag(props)
    return instance.render()
  }
  return tag(props)
}

function isClassComponent(tag: any): tag is JSX.ElementClass {
  if (tag.prototype === undefined) {
    return false
  }
  return "render" in tag.prototype
}