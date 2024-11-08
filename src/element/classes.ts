import { isVariableOf, Var, VarOrVal } from "@tioniq/eventiq";
import { emptyDisposable } from "@tioniq/disposiq";
import { getArrayChanges } from "@/diff/array.js";

const emptyStringArray: string[] = []

export function applyClasses(element: HTMLElement, lifecycle: Var<boolean>, classes: VarOrVal<string[]>) {
  if (!classes) {
    return
  }
  if (!isVariableOf<string[]>(classes)) {
    element.classList.add(...classes.filter(c => !!c))
    return
  }
  let previousClasses: string[] = emptyStringArray
  lifecycle.subscribeDisposable(active => !active
    ? emptyDisposable
    : classes.subscribe(newClasses => {
      if (!Array.isArray(newClasses) || newClasses.length === 0) {
        if (previousClasses.length === 0) {
          return
        }
        for (let i = 0; i < previousClasses.length; ++i) {
          element.classList.remove(previousClasses[i])
        }
        previousClasses = emptyStringArray
        return
      }
      const newValues = [...newClasses.filter(c => !!c)]
      if (previousClasses.length === 0) {
        element.classList.add.apply(element.classList, newValues)
        previousClasses = newValues
        return
      }
      const changes = getArrayChanges(previousClasses, newValues)
      for (let i = 0; i < changes.remove.length; ++i) {
        element.classList.remove(changes.remove[i].item)
      }
      for (let i = 0; i < changes.add.length; ++i) {
        element.classList.add(changes.add[i].item)
      }
      previousClasses = newValues
    }))
}