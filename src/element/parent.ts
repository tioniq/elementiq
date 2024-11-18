import { isVariableOf, type Var, type VarOrVal } from "@tioniq/eventiq"
import { emptyDisposable } from "@tioniq/disposiq"

export function applyParent(
  element: HTMLElement,
  lifecycle: Var<boolean>,
  parent: VarOrVal<ParentNode | undefined>,
): void {
  if (!parent) {
    return
  }
  if (!isVariableOf<ParentNode | undefined>(parent)) {
    parent.appendChild(element)
    return
  }
  let previousParent: ParentNode | undefined
  lifecycle.subscribeDisposable((active) =>
    !active
      ? emptyDisposable
      : parent.subscribe((newParent) => {
          if (previousParent === newParent) {
            return
          }
          if (!newParent) {
            if (previousParent !== undefined) {
              previousParent.removeChild(element)
              previousParent = undefined
            }
            return
          }
          if (previousParent === undefined) {
            newParent.appendChild(element)
            previousParent = newParent
            return
          }
          previousParent.removeChild(element)
          newParent.appendChild(element)
          previousParent = newParent
        }),
  )
}
