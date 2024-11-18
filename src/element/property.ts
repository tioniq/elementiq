import { isVariableOf, type Var, type VarOrVal } from "@tioniq/eventiq"
import { emptyDisposable } from "@tioniq/disposiq"

export function applyProperty<
  T extends keyof HTMLElementTagNameMap,
  K extends keyof HTMLElementTagNameMap[T],
>(
  element: HTMLElementTagNameMap[T],
  lifecycle: Var<boolean>,
  key: K,
  value: VarOrVal<HTMLElementTagNameMap[T][K]>,
): void {
  if (value === undefined) {
    return
  }
  if (!isVariableOf<HTMLElementTagNameMap[T][K]>(value)) {
    element[key] = value
    return
  }
  lifecycle.subscribeDisposable((active) =>
    !active
      ? emptyDisposable
      : value.subscribe((newValue) => {
          element[key] = newValue
        }),
  )
}
