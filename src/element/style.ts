import { isVariableOf, type Var, type VarOrVal } from "@tioniq/eventiq"
import type { ElementStyle } from "@/types/element.ts"
import {
  DisposableMapStore,
  DisposableStore,
  emptyDisposable,
} from "@tioniq/disposiq"
import { listenObjectKVChanges } from "@/diff/object-var.ts";

export function applyStyle(
  element: HTMLElement,
  lifecycle: Var<boolean>,
  style: VarOrVal<ElementStyle>,
) {
  if (!style) {
    return
  }
  if (!isVariableOf<ElementStyle>(style)) {
    let styleKey: keyof ElementStyle & string
    for (styleKey in style) {
      const value = style[styleKey]
      if (!isVariableOf<string | undefined>(value)) {
        if (value === undefined) {
          element.style.removeProperty(styleKey)
          continue
        }
        element.style[styleKey] = value ?? ""
        continue
      }
      lifecycle.subscribeDisposable((active) => {
        if (!active) {
          return emptyDisposable
        }
        return value.subscribe((newValue) => {
          if (newValue === undefined) {
            element.style.removeProperty(styleKey)
            return
          }
          element.style[styleKey] = newValue ?? ""
        })
      })
    }
    return
  }
  lifecycle.subscribeDisposable((active) => {
    if (!active) {
      return emptyDisposable
    }
    const disposables = new DisposableStore()
    const dispoMapStore = new DisposableMapStore<string>()
    disposables.add(dispoMapStore)
    disposables.add(
      listenObjectKVChanges(style, (keysToDelete, changesToAddOrModify) => {
        if (keysToDelete !== null) {
          for (const key of keysToDelete) {
            element.style.removeProperty(key)
            dispoMapStore.delete(key)
          }
        }
        if (changesToAddOrModify !== null) {
          for (const key in changesToAddOrModify) {
            const value = changesToAddOrModify[key]
            if (isVariableOf<string | undefined>(value)) {
              dispoMapStore.set(
                key,
                value.subscribe((newValue) => {
                  if (newValue === undefined) {
                    element.style.removeProperty(key)
                    return
                  }
                  element.style[key] = newValue ?? ""
                }),
              )
              continue
            }
            dispoMapStore.delete(key)
            if (value === undefined) {
              element.style.removeProperty(key)
              continue
            }
            element.style[key] = value ?? ""
          }
        }
      }),
    )
    return disposables
  })
}
