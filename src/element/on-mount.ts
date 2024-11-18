import { isVariableOf, type Var, type VarOrVal } from "@tioniq/eventiq"
import {
  emptyDisposable,
  type IDisposable,
  toDisposable,
} from "@tioniq/disposiq"

export type OnMountHandler = (this: HTMLElement) => IDisposable | undefined

export function applyOnMount(
  element: HTMLElement,
  lifecycle: Var<boolean>,
  onMount: VarOrVal<OnMountHandler>,
): void {
  if (!onMount) {
    return
  }
  if (!isVariableOf<OnMountHandler>(onMount)) {
    lifecycle.subscribeDisposable((active) =>
      active
        ? toDisposable(onMount.call(element) ?? emptyDisposable)
        : emptyDisposable,
    )
    return
  }
  lifecycle.subscribeDisposable((active) =>
    !active
      ? emptyDisposable
      : onMount.subscribeDisposable((value) =>
          !value
            ? emptyDisposable
            : toDisposable(value.call(element) ?? emptyDisposable),
        ),
  )
}
