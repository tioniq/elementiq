import { getObjectValuesChanges, type StringArrayKeyOf } from "@/diff/object.ts"
import type { Var } from "@tioniq/eventiq"
import type { IDisposable } from "@tioniq/disposiq"

export type ListenObjectKVChangesHandler<T extends object> = (
  keysToDelete: StringArrayKeyOf<T> | null,
  changesToAddOrModify: Partial<T> | null,
) => void

export function listenObjectKVChanges<T extends object>(
  variable: Var<T>,
  handler: ListenObjectKVChangesHandler<T>,
): IDisposable {
  let currentState: T = variable.value
  const subscription = variable.subscribeSilent((value) => {
    const [keysToDelete, dataToAddOrChange] = getObjectValuesChanges(
      currentState,
      value,
    )
    currentState = value
    handler(keysToDelete, dataToAddOrChange)
  })
  handler(null, currentState)
  return subscription
}
