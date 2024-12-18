import { defaultEqualityComparer } from "@tioniq/eventiq"

export type StringKeyOf<T> = Extract<keyof T, string>

export type StringArrayKeyOf<T> = Array<StringKeyOf<T>>

export type KeyedEqualityComparer<T, TKey> = (a: T, b: T, key: TKey) => boolean

export function getObjectValuesChanges<T extends object>(
  oldRecord: T,
  newRecord: T,
  equalityComparer?: KeyedEqualityComparer<unknown, string>,
): [
  keysToDelete: StringArrayKeyOf<T> | null,
  toAddOrChange: Partial<T> | null,
] {
  if (!oldRecord) {
    return [null, newRecord]
  }
  if (!newRecord) {
    return [Object.keys(oldRecord) as StringArrayKeyOf<T>, null]
  }

  let keysToDelete: StringArrayKeyOf<T> | null = null
  let toAddOrChange: Partial<T> | null = null

  for (const key in oldRecord) {
    if (!(key in newRecord)) {
      if (keysToDelete === null) {
        keysToDelete = [key]
      } else {
        keysToDelete.push(key)
      }
    }
  }

  const comparer = equalityComparer || defaultEqualityComparer
  for (const key in newRecord) {
    const oldValue = oldRecord[key]
    if (oldValue === undefined) {
      if (toAddOrChange === null) {
        toAddOrChange = { [key]: newRecord[key] } as unknown as Partial<T>
      } else {
        toAddOrChange[key] = newRecord[key]
      }
      continue
    }
    if (!comparer(oldValue, newRecord[key], key)) {
      if (toAddOrChange === null) {
        toAddOrChange = { [key]: newRecord[key] } as unknown as Partial<T>
      } else {
        toAddOrChange[key] = newRecord[key]
      }
    }
  }

  return [keysToDelete, toAddOrChange]
}
