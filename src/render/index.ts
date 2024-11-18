import type { ElementValue } from "@/types/element.ts"
import type { FunctionComponent } from "@/jsx-runtime/types.ts"

export function render<T extends HTMLElement>(
  value: ElementValue<T> | FunctionComponent,
  parent: HTMLElement,
): void {
  if (typeof value === "function") {
    const element = value({})
    parent.appendChild(element)
    return
  }
  parent.appendChild(value)
}
