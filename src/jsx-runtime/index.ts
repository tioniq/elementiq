import {renderJsx} from "./render.ts"
import {ClassComponent, ElementOptions, ElementValue, FunctionComponent} from "../index.ts";

export namespace JSX {
  export type ElementType =
    | keyof IntrinsicElements
    | FunctionComponent
    | ClassComponent

  export interface Element extends ElementValue {
  }

  export interface ElementClass extends ClassComponent {
  }

  export interface ElementAttributesProperty {
    props: {}
  }

  export interface ElementChildrenAttribute {
    children: {}
  }

  export type IntrinsicElements = {
    [K in keyof HTMLElementTagNameMap]: ElementOptions<HTMLElementTagNameMap[K]>
  }

  export interface IntrinsicAttributes {
    // key?: string | number | null | undefined
  }

  export interface IntrinsicClassAttributes<T> {
    // ref?: Ref<T> | undefined
  }
}

export const jsx = renderJsx
export const jsxs = renderJsx
export const jsxDEV = renderJsx
