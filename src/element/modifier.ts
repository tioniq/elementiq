import {ElementOptions} from "@/types/element";

export interface Modifier {
  (element: HTMLElement, elementOptions?: ElementOptions): void
}

const modifiers: Modifier[] = []
let hasModifiers = false

export function addModifier(modifier: Modifier) {
  modifiers.push(modifier)
  hasModifiers = true;
}

export function addTagModifier(tag: string, modifier: Modifier) {
  addModifier((element, elementOptions) => {
    if (element.tagName === tag) {
      modifier(element, elementOptions)
    }
  })
}

export function applyModification<K extends keyof HTMLElementTagNameMap, E extends HTMLElementTagNameMap[K] = HTMLElementTagNameMap[K]>(element: E, elementOptions?: ElementOptions<E>) {
  if (!hasModifiers) {
    return
  }
  for (const modifier of modifiers) {
    modifier(element, elementOptions as ElementOptions)
  }
}
