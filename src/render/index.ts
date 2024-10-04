import {ElementValue} from "@/types/element";
import {FunctionComponent} from "@/jsx-runtime/types";

export function render<T extends HTMLElement>(value: ElementValue<T> | FunctionComponent, parent: HTMLElement): void {
  if (typeof value === "function") {
    const element = value({})
    parent.appendChild(element)
    return
  }
  parent.appendChild(value)
}