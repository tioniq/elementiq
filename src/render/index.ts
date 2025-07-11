import type { ElementValue } from "@/types/element.ts"
import type { FunctionComponent } from "@/jsx-runtime/types.ts"

export function render<T extends HTMLElement>(
  value: ElementValue<T> | FunctionComponent,
  parent: HTMLElement,
): void {
  if (typeof value === "function") {
    const element = value({})
    if (element instanceof Node) {
      parent.appendChild(element)
      return
    }
    if (!element) {
      return
    }
    if (typeof element === "string") {
      parent.appendChild(document.createTextNode(element))
      return
    }
    if (typeof element === "number") {
      parent.appendChild(document.createTextNode(String(element)))
      return
    }
    console.warn("Invalid element type returned from function component:", element)
    parent.appendChild(document.createTextNode(`${element}`))
    return
  }
  parent.appendChild(value)
}
