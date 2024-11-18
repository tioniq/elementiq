import type { ContextType, ContextValue } from "@/context/context.ts"
import type {
  AttachedToDOMEvent,
  DetachedFromDOMEvent,
} from "@/lifecycle/index.ts"
import type { DisposableLike } from "@tioniq/disposiq"
import type { Var, VarOrVal, Variable } from "@tioniq/eventiq"
import type { ObjectWritableProps, WritableKeys } from "./object.ts"

interface MissingAttributes {
  ariaControls?: string | null
  ariaLabelledby?: string | null
  role?: string | null
}

export type NonUndefined<T> = T extends undefined ? never : T

export type ObjectValuesVariableOrValue<Type extends Record<string, unknown>> =
  {
    [P in keyof Type]:
      | Type[P]
      | Variable<Type[P]>
      | Variable<NonUndefined<Type[P]>>
  }

export type ElementChild = Node | string | undefined | null | boolean

export type ElementChildren =
  | ElementChild
  | Var<ElementChildren | ElementChildren[]>
  | VarOrVal<ElementChildren>[]

export type ElementDataset = Record<string, string>

export type ElementStyle = ObjectValuesVariableOrValue<
  Partial<ObjectWritableProps<CSSStyleDeclaration>>
>

type EventKeywordsArray = [
  "animation",
  "transition",
  "ended",
  "playing",
  "seeking",
  "waiting",
  "suspend",
  "invalid",
  "context",
  "update",
  "click",
  "cancel",
  "end",
  "toggle",
  "start",
  "pointer",
  "input",
  "transition",
  "change",
  "up",
  "in",
  "out",
  "over",
  "down",
  "press",
  "enter",
  "leave",
  "move",
  "play",
  "meta",
  "data",
  "policy",
]

type Split<
  S extends string,
  K extends string,
> = S extends `${infer Prefix}${K}${infer Suffix}` ? [Prefix, K, Suffix] : never

// Step 3: Iterate over the array and split at the first occurrence of a keyword
type SplitAtFirstKeyword<
  S extends string,
  Keywords extends readonly string[],
> = Keywords extends [
  infer FirstKeyword extends string,
  ...infer RestKeywords extends string[],
]
  ? Split<S, FirstKeyword> extends never
    ? SplitAtFirstKeyword<S, RestKeywords> // Try the next keyword in the array
    : Split<S, FirstKeyword> // First match found, stop and return
  : [S] // If no match is found, return the original string as a single element

type JoinCapitalized<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F extends string]
    ? Capitalize<F>
    : T extends [infer F, ...infer R]
      ? F extends string
        ? `${Capitalize<F>}${D}${JoinCapitalized<Extract<R, string[]>, D>}`
        : never
      : string

type KeywordSplitter<Event extends string> = SplitAtFirstKeyword<
  Event,
  EventKeywordsArray
> extends infer Result
  ? Result extends string[]
    ? JoinCapitalized<Result, "">
    : Capitalize<Event>
  : never

// Capitalize event names like "animationcancel" => "onAnimationCancel"
type MapEventName<Event extends string> = `on${KeywordSplitter<Event>}`

// Map the entire event map
type MappedEvents<T, ThisArg> = {
  [P in Extract<keyof T, string> as MapEventName<P>]?: (
    this: ThisArg,
    ev: T[P],
  ) => unknown
}

export type ElementProps<T extends HTMLElement = HTMLElement> = {
  [P in WritableKeys<T> as T[P] extends string | number | boolean
    ? P
    : never]?: T[P]
} & MissingAttributes & {
    classes?: string[]
    style?: ElementStyle
    children?: ElementChildren
  } & {
    dataset?: ElementDataset
  } & MappedEvents<HTMLElementEventMap, T> & {
    modifierData?: unknown
  } & {
    onAttachedToDom?: (this: T, ev: AttachedToDOMEvent) => void
    onDetachedFromDom?: (this: T, ev: DetachedFromDOMEvent) => void
  } & {
    onMount?: (this: T) => DisposableLike | undefined
  }

export type ElementController<T extends HTMLElement = HTMLElement> = {
  // biome-ignore lint/complexity/noBannedTypes: Should handle any function
  [P in keyof T as T[P] extends Function ? P : never]: T[P]
}

export type ElementOptions<T extends HTMLElement = HTMLElement> =
  ObjectValuesVariableOrValue<ElementProps<T>> & {
    parent?: ParentNode
    controller?: ElementController<T>
    context?: ContextValue<ContextType>
  }

export type StubElement = symbol

export type ElementValue<T extends HTMLElement = HTMLElement> = T
