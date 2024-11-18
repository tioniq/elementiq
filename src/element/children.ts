import { isVariableOf, type Var, type VarOrVal } from "@tioniq/eventiq"
import type { ElementChild, ElementChildren } from "@/types/element.ts"
import {
  DisposableAction,
  DisposableStore,
  emptyDisposable,
} from "@tioniq/disposiq"
import { getArrayChanges } from "@/diff/array.ts"

export function applyChildren(
  element: HTMLElement,
  lifecycle: Var<boolean>,
  children: VarOrVal<ElementChildren>,
): void {
  if (!children) {
    return
  }
  if (!isVariableOf<ElementChildren>(children)) {
    setStaticChildren(children, element, lifecycle)
    return
  }
  const slot = createEmptyNode()
  element.appendChild(slot)
  setVariableChild(children, element, lifecycle, slot)
}

type Children = ElementChild | Var<Children | Children[]> | VarOrVal<Children>[]

interface ChildController {
  replace(child: Children): ChildController

  remove(): void
}

function setStaticChildren(
  children: ElementChild | VarOrVal<ElementChildren>[],
  element: HTMLElement,
  lifecycle: Var<boolean>,
): void {
  if (!Array.isArray(children)) {
    const node = createNode(children)
    element.appendChild(node)
    return
  }
  if (children.length === 0) {
    return
  }
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (!isVariableOf<Children>(child)) {
      setStaticChildren(child, element, lifecycle)
      continue
    }
    const slot = createEmptyNode()
    element.appendChild(slot)
    setVariableChild(child, element, lifecycle, slot)
  }
}

function setDynamicChildren(
  children: Children,
  element: HTMLElement,
  mark: Node,
): ChildController {
  if (Array.isArray(children)) {
    return setDynamicArrayChild(children, element, mark)
  }
  if (isVariableOf<Children | Children[]>(children)) {
    return setDynamicVariableChild(children, element, mark)
  }
  return setDynamicSimpleChild(children, element, mark)
}

function setDynamicSimpleChild(
  children: ElementChild,
  element: HTMLElement,
  mark: Node,
): ChildController {
  const node = createNode(children)
  insertAfter(node, mark)
  return {
    replace(child: Children): ChildController {
      this.remove()
      return setDynamicChildren(child, element, mark)
    },
    remove() {
      element.removeChild(node)
    },
  }
}

function setDynamicVariableChild(
  child: Var<Children | Children[]>,
  element: HTMLElement,
  mark: Node,
): ChildController {
  let lastController: ChildController | null = null
  const subscription = child.subscribe((c) => {
    if (lastController !== null) {
      lastController = lastController.replace(c)
    } else {
      lastController = setDynamicChildren(c, element, mark)
    }
  })
  return {
    replace(child: Children): ChildController {
      this.remove()
      return setDynamicChildren(child, element, mark)
    },
    remove() {
      subscription.dispose()
      if (lastController !== null) {
        lastController.remove()
        lastController = null
      }
    },
  }
}

function setDynamicArrayChild(
  child: VarOrVal<Children>[],
  element: HTMLElement,
  mark: Node,
): ChildController {
  if (child.length === 0) {
    return {
      replace(child: Children) {
        return setDynamicChildren(child, element, mark)
      },
      remove() {},
    }
  }
  let children = [...child]
  const controllers: ChildController[] = []
  const endMark = createEmptyNode()
  insertAfter(endMark, mark)
  let previousSlot = mark
  const slots = new Array<Node>(children.length)
  for (let i = 0; i < children.length; i++) {
    const slot = createEmptyNode()
    insertAfter(slot, previousSlot)
    previousSlot = slot
    slots[i] = slot
    const child = children[i]
    const controller = setDynamicChildren(child, element, slot)
    controllers.push(controller)
  }
  return {
    replace(child: Children): ChildController {
      if (!Array.isArray(child)) {
        this.remove()
        return setDynamicChildren(child, element, mark)
      }
      if (child.length === 0) {
        this.remove()
        return {
          replace(child: Children): ChildController {
            return setDynamicChildren(child, element, mark)
          },
          remove() {},
        }
      }
      const newChildren = [...child]
      const changes = getArrayChanges(children, newChildren)
      for (let i = changes.remove.length - 1; i >= 0; --i) {
        const remove = changes.remove[i]
        controllers[remove.index].remove()
        controllers.splice(remove.index, 1)
        element.removeChild(slots[remove.index])
        slots.splice(remove.index, 1)
      }
      for (let i = 0; i < changes.add.length; i++) {
        const add = changes.add[i]
        const slot = createEmptyNode()
        if (add.index === slots.length) {
          element.insertBefore(slot, endMark)
        } else {
          const slotToInsertBefore = slots[add.index]
          element.insertBefore(slot, slotToInsertBefore)
        }
        const controller = setDynamicChildren(
          newChildren[add.index],
          element,
          slot,
        )
        slots.splice(add.index, 0, slot)
        controllers.splice(add.index, 0, controller)
      }
      for (let i = 0; i < changes.swap.length; i++) {
        const swap = changes.swap[i]
        const controller = controllers[swap.index]
        const slot = slots[swap.index]
        controllers[swap.index] = controllers[swap.newIndex]
        slots[swap.index] = slots[swap.newIndex]
        controllers[swap.newIndex] = controller
        slots[swap.newIndex] = slot
      }
      children = newChildren
      return this
    },
    remove() {
      for (let i = 0; i < controllers.length; i++) {
        controllers[i].remove()
      }
      for (let i = 0; i < slots.length; i++) {
        element.removeChild(slots[i])
      }
      element.removeChild(endMark)
    },
  }
}

function setVariableChild(
  child: Var<ElementChildren>,
  element: HTMLElement,
  lifecycle: Var<boolean>,
  mark: Node,
): void {
  lifecycle.subscribeDisposable((active) => {
    if (!active) {
      return emptyDisposable
    }
    let controller: ChildController | null = null
    const disposables = new DisposableStore()
    disposables.add(child.subscribe(updateChildren))
    disposables.add(
      new DisposableAction(() => {
        if (controller) {
          controller.remove()
          controller = null
        }
      }),
    )
    return disposables

    function updateChildren(newChildrenOpts: ElementChildren) {
      if (!controller) {
        controller = setDynamicChildren(newChildrenOpts, element, mark)
        return
      }
      controller = controller.replace(newChildrenOpts)
    }
  })
}

function createNode(value: ElementChild): Node {
  if (!value) {
    return createEmptyNode()
  }
  if (value instanceof Node) {
    return value
  }
  if (typeof value === "string") {
    return document.createTextNode(value)
  }
  console.warn("Unsupported type of value.", { value })
  return createEmptyNode()
}

function insertAfter(node: Node, after: Node) {
  const parent = after.parentNode
  if (!parent) {
    return
  }
  if (after.nextSibling) {
    parent.insertBefore(node, after.nextSibling)
    return
  }
  parent.appendChild(node)
}

function createEmptyNode(): Node {
  return document.createTextNode("")
}
