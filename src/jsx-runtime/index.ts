import { renderJsx } from "./render.ts"
import type {
  ClassComponent,
  ElementOptions,
  ElementValue,
  FunctionComponent,
} from "../index.ts"

export namespace JSX {
  export type ElementType =
    | keyof IntrinsicElements
    | FunctionComponent
    | ClassComponent

  export interface Element extends ElementValue {}

  export interface ElementClass extends ClassComponent {}

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
