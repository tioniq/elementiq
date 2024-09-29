import {renderJsx} from "./render"
import {ElementOptions, ElementProps, ElementValue} from "../index";

export namespace JSX {
  export type HTMLAttributes = ElementProps

  export type IntrinsicElements = {
    [K in keyof HTMLElementTagNameMap]: ElementOptions<HTMLElementTagNameMap[K]>
  }

  export type Element = ElementValue
}

export const jsx = renderJsx
export const jsxs = renderJsx
export const jsxDEV = renderJsx
