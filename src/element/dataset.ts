import { isVariableOf, type Var, type VarOrVal } from "@tioniq/eventiq"
import type { ElementDataset } from "@/types/element.ts"
import { emptyDisposable } from "@tioniq/disposiq"
import { listenObjectKVChanges } from "@/diff/object-var.ts"

export function applyDataset(
  element: HTMLElement,
  lifecycle: Var<boolean>,
  dataset: VarOrVal<ElementDataset>,
) {
  if (!dataset) {
    return
  }
  if (!isVariableOf<ElementDataset>(dataset)) {
    for (const key in dataset) {
      element.dataset[key] = dataset[key]
    }
    return
  }
  lifecycle.subscribeDisposable((active) =>
    !active
      ? emptyDisposable
      : listenObjectKVChanges(dataset, (keysToDelete, changesToAddOrModify) => {
          if (keysToDelete !== null) {
            for (const key of keysToDelete) {
              delete element.dataset[key]
            }
          }
          if (changesToAddOrModify !== null) {
            for (const key in changesToAddOrModify) {
              element.dataset[key] = changesToAddOrModify[key]
            }
          }
        }),
  )
}
