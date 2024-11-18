export interface ArrayAddChange<T> {
  item: T
  index: number
}

export interface ArrayRemoveChange<T> {
  item: T
  index: number
}

export interface ArraySwapChange<T> {
  item: T
  index: number
  newIndex: number
}

export interface ArrayChanges<T> {
  remove: ArrayRemoveChange<T>[]
  add: ArrayAddChange<T>[]
  swap: ArraySwapChange<T>[]
}

export function getArrayChanges<T>(
  oldArray: T[],
  newArray: T[],
): ArrayChanges<T> {
  const oldArrayLength = oldArray.length
  const newArrayLength = newArray.length
  const resultAdd: ArrayAddChange<T>[] = []
  const resultRemove: ArrayRemoveChange<T>[] = []
  const resultSwap: ArraySwapChange<T>[] = []
  const result: ArrayChanges<T> = {
    add: resultAdd,
    remove: resultRemove,
    swap: resultSwap,
  }
  const newArrayData: {
    item: T
    oldIndex: number
    moveIndex: number
  }[] = newArray.map((item) => ({
    item: item,
    oldIndex: -1,
    moveIndex: -1,
  }))
  for (let i = 0; i < oldArrayLength; i++) {
    const oldItem = oldArray[i]
    const newItemDataIndex = newArrayData.findIndex(
      (data) => data.oldIndex === -1 && data.item === oldItem,
    )
    if (newItemDataIndex === -1) {
      resultRemove.push({
        item: oldItem,
        index: i,
      })
      continue
    }
    const newData = newArrayData[newItemDataIndex]
    newData.oldIndex = i
    newData.moveIndex = i
  }
  const removedCount = resultRemove.length
  if (removedCount > 0) {
    for (let i = 0; i < newArrayLength; ++i) {
      const newItemData = newArrayData[i]
      if (newItemData.oldIndex === -1) {
        continue
      }
      let removesCount = 0
      for (let j = 0; j < removedCount; ++j) {
        if (resultRemove[j].index < newItemData.oldIndex) {
          removesCount++
        } else {
          break
        }
      }
      newItemData.moveIndex -= removesCount
    }
  }
  let addCounter = 0
  for (let i = 0; i < newArrayLength; i++) {
    const newItemData = newArrayData[i]
    if (newItemData.oldIndex === -1) {
      resultAdd.push({
        item: newItemData.item,
        index: i,
      })
      addCounter++
      continue
    }
    newArrayData[i].moveIndex += addCounter
  }
  for (let i = 0; i < newArrayLength; i++) {
    const newItemData = newArrayData[i]
    if (newItemData.oldIndex === -1) {
      continue
    }
    if (i === newItemData.moveIndex) {
      continue
    }
    const swapWith = newArrayData[newItemData.moveIndex]
    resultSwap.push({
      item: newItemData.item,
      index: newItemData.moveIndex,
      newIndex: i,
    })
    swapWith.moveIndex = newItemData.moveIndex
    newItemData.moveIndex = i
  }
  return result
}
