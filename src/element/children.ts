import { isVariableOf, Var, VarOrVal } from "@tioniq/eventiq";
import { ElementChild, ElementChildren } from "@/types/element.js";
import { DisposableAction, DisposableStore, emptyDisposable } from "@tioniq/disposiq";
import { getArrayChanges } from "@/diff/array.js";

export function applyChildren(element: HTMLElement, lifecycle: Var<boolean>, children: VarOrVal<ElementChildren>) {
  if (!children) {
    return
  }
  lifecycle.subscribeDisposable(active => {
    if (!active) {
      return emptyDisposable;
    }
    const disposables = new DisposableStore()
    let controller: ChildController | null = null
    if (isVariableOf<ElementChildren>(children)) {
      disposables.add(children.subscribe(updateChildren))
    } else {
      updateChildren(children)
    }
    disposables.add(new DisposableAction(() => {
      if (controller) {
        controller.remove()
        controller = null
      }
    }))
    return disposables;

    function updateChildren(newChildrenOpts: ElementChildren) {
      if (!controller) {
        controller = setChildren(newChildrenOpts, element, null)
        return
      }
      controller = controller.replace(newChildrenOpts)
    }
  })
}

type Children = ElementChild | Var<Children | Children[]> | VarOrVal<Children>[]

interface ChildController {
  replace(child: Children): ChildController

  remove(): void
}

function setChildren(children: Children, element: HTMLElement, mark: Node | null): ChildController {
  if (Array.isArray(children)) {
    if (children.length === 0) {
      return {
        replace(child: Children): ChildController {
          return setChildren(child, element, mark)
        },
        remove() {
        }
      }
    }
    children = [...children]
    const controllers: ChildController[] = []
    const beginMark = createEmptyNode()
    element.insertBefore(beginMark, mark)
    let slots = new Array<Node>(children.length)
    for (let i = 0; i < children.length; i++) {
      let slot = createEmptyNode()
      element.insertBefore(slot, mark)
      slots[i] = slot
      const child = children[i]
      const controller = setChildren(child, element, slot)
      controllers.push(controller)
    }
    return {
      replace(child: Children): ChildController {
        if (!Array.isArray(child)) {
          const controller = setChildren(child, element, slots[slots.length - 1])
          this.remove()
          return controller
        }
        if (child.length === 0) {
          const slot = createEmptyNode()
          element.insertBefore(slot, slots[slot.length - 1])
          this.remove()
          return {
            replace(child: Children): ChildController {
              const controller = setChildren(child, element, slot)
              this.remove()
              return controller
            },
            remove() {
              element.removeChild(slot)
              element.removeChild(beginMark)
            }
          }
        }
        child = [...child]
        const changes = getArrayChanges(children as Children[], child)
        for (let i = changes.remove.length - 1; i >= 0; --i) {
          const remove = changes.remove[i]
          controllers[remove.index].remove()
          element.removeChild(slots[remove.index])
          slots.splice(remove.index, 1)
          controllers.splice(remove.index, 1)
        }
        for (let i = 0; i < changes.add.length; i++) {
          const add = changes.add[i]
          const slot = createEmptyNode()
          const elementToInsertAfter = add.index === 0 ? beginMark : slots[add.index - 1]
          insertAfter(slot, elementToInsertAfter)
          const controller = setChildren(child[add.index], element, slot)
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
        children = child
        return this
      },
      remove() {
        for (let i = 0; i < controllers.length; i++) {
          controllers[i].remove()
        }
        for (let i = 0; i < slots.length; i++) {
          element.removeChild(slots[i])
        }
        element.removeChild(beginMark)
      }
    }
  }
  if (isVariableOf<Children | Children[]>(children)) {
    const slot = createEmptyNode()
    element.insertBefore(slot, mark)
    let lastController: ChildController | null = null
    const subscription = children.subscribe(c => {
      if (lastController) {
        lastController = lastController.replace(c)
      } else {
        lastController = setChildren(c, element, slot)
      }
    })
    return {
      replace(child: Children): ChildController {
        subscription.dispose()
        const controller = setChildren(child, element, slot)
        if (lastController) {
          lastController.remove()
        }
        lastController = controller
        return controller
      },
      remove() {
        subscription.dispose()
        element.removeChild(slot)
      }
    }
  }
  const node = createNode(children)
  element.insertBefore(node, mark)
  return {
    replace(child: Children): ChildController {
      const controller = setChildren(child, element, node)
      element.removeChild(node)
      return controller
    },
    remove() {
      element.removeChild(node)
    }
  }
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
  console.warn("Unsupported type of value.", {value})
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

function createEmptyNode() {
  return document.createTextNode("")
}
