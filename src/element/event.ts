import { applyOnMount, type OnMountHandler } from "@/element/on-mount.ts"
import { isVariableOf, type Var, type VarOrVal } from "@tioniq/eventiq"
import { emptyDisposable, addEventListener } from "@tioniq/disposiq"

export function applyEvent(
  element: HTMLElement,
  key: string,
  value: VarOrVal<EventListener>,
  lifecycle: Var<boolean>,
): void {
  if (key === "onMount") {
    applyOnMount(
      element,
      lifecycle,
      value as unknown as VarOrVal<OnMountHandler>,
    )
    return
  }
  const eventName = key[2].toLowerCase() + key.slice(3)
  if (!isVariableOf<EventListener>(value)) {
    element.addEventListener(eventName, value)
    return
  }
  lifecycle.subscribeDisposable((active) =>
    !active
      ? emptyDisposable
      : value.subscribeDisposable((newValue) => {
          return addEventListener(element, eventName, newValue)
        }),
  )
}
