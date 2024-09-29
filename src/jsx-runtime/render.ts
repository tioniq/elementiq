import {span, element, ElementOptions} from "../index";
import {FunctionComponent} from "./types";
import {JSX} from "./index";

export function renderJsx<TProps extends object>(func: (props?: TProps) => JSX.Element, props: TProps, _key?: string): JSX.Element

export function renderJsx<K extends keyof HTMLElementTagNameMap>(tag: K, props: ElementOptions<HTMLElementTagNameMap[K]>, _key?: string): JSX.Element

export function renderJsx<K extends FunctionComponent | keyof HTMLElementTagNameMap>(
  tag: K,
  props: any,
  _key?: string): JSX.Element {
  if (!tag) {
    return span({
      innerText: "Not supported tag '" + tag + "'"
    })
  }
  if (typeof tag === "function") {
    return tag(props)
  }
  return element(tag as any, props)
}