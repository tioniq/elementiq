import {ElementValue} from "@/types/element";

export function render<T extends HTMLElement>(value: ElementValue<T>, parent: HTMLElement): void {
  parent.appendChild(value as Node)
}