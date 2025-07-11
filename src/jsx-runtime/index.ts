import { ClassComponent, ElementChild, ElementOptions, FunctionComponent, } from "../index.ts"
import { renderJsx } from "./render.ts"

export namespace JSX {
  export type ElementType =
    | keyof IntrinsicElements
    | FunctionComponent
    | ClassComponent

  export type Element = Node | string | number | null | boolean

  export interface ElementClass extends ClassComponent {
  }

  export interface ElementAttributesProperty {
    // biome-ignore lint/complexity/noBannedTypes: No need to define a type for this property
    props: {}
  }

  export interface ElementChildrenAttribute {
    // biome-ignore lint/complexity/noBannedTypes: No need to define a type for this property
    children: {}
  }

  export type IntrinsicElements = {
    [K in keyof HTMLElementTagNameMap]: ElementOptions<HTMLElementTagNameMap[K]>
  }

  // biome-ignore lint/suspicious/noEmptyInterface: Empty interface is needed for type checking
  export interface IntrinsicAttributes {
    // key?: string | number | null | undefined
  }

  // biome-ignore lint/suspicious/noEmptyInterface: Empty interface is needed for type checking
  export interface IntrinsicClassAttributes<T> {
    // ref?: Ref<T> | undefined
  }
}

export const jsx = renderJsx
export const jsxs = renderJsx
export const jsxDEV = renderJsx
