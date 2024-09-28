import {ObjectWritableProps, WritableKeys} from "./object"
import {AttachedToDOMEvent, DetachedFromDOMEvent} from "../lifecycle"
import {DisposableLike} from "@tioniq/disposiq"
import {Variable} from "@tioniq/eventiq"

type MappedEvents<T, ThisArg> = {
  [P in Extract<keyof T, string> as `on${Capitalize<P>}`]?: (
    this: ThisArg,
    ev: T[P]
  ) => any
}

interface MissingAttributes {
  ariaControls?: string | null
  ariaLabelledby?: string | null
  role?: string | null
}

export type ElementChildren = (Node | string)[] | Node | string | undefined | null | boolean

export type ElementDataset = Record<string, string>

export type ElementStyle = Partial<ObjectWritableProps<CSSStyleDeclaration>>

export type ElementProps<T extends HTMLElement = HTMLElement> = {
  [P in WritableKeys<T> as (T[P] extends (string | number | boolean) ? P : never)]?: T[P]
} & MissingAttributes & {
  classes?: string[]
  style?: ElementStyle
  children?: ElementChildren
} & {
  dataset?: ElementDataset
}
  & MappedEvents<HTMLElementEventMap, T>
  & {
  modifierData?: any
} & {
  onAttachedToDom?: (this: T, ev: AttachedToDOMEvent) => any
  onDetachedFromDom?: (this: T, ev: DetachedFromDOMEvent) => any
} & {
  onMount?: (this: T) => DisposableLike | void
}

export type VariableOrValue<Type extends Record<string, any>> = {
  [P in keyof Type]: Type[P] | Variable<Type[P]>
}

export type ElementOptions<T extends HTMLElement = HTMLElement> = VariableOrValue<ElementProps<T>> & {
  parent?: ParentNode
}
