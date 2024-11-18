import type { ElementController } from "@/types/element.ts"
import { useController } from "@/controller/index.ts"

export function applyController<T extends HTMLElement>(
  element: T,
  controller: ElementController<T>,
) {
  useController(controller, element)
}
