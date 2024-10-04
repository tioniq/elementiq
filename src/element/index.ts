import {
  ElementChild,
  ElementChildren,
  ElementController,
  ElementDataset,
  ElementOptions,
  ElementStyle,
  ElementValue
} from "@/types/element";
import {domListenKey, runMutationObserver} from "@/lifecycle";
import {getObjectValuesChanges, StringArrayKeyOf} from "@/diff/object";
import {getArrayChanges} from "@/diff/array";
import {
  createDisposiq,
  DisposableAction,
  DisposableStore,
  emptyDisposable,
  IDisposable,
  toDisposable
} from "@tioniq/disposiq";
import {isVariableOf, LazyVariable, Var, VarOrVal} from "@tioniq/eventiq";
import {applyModification} from "./modifier";
import {useController} from "@/controller";

const propsKey = "_elemiqProps"
const noProps = Object.freeze({})
const emptyStringArray: string[] = []

declare global {
  interface HTMLElement {
    _elemiqProps: any
  }
}

export function element<K extends keyof HTMLElementTagNameMap>(tag: K, elementOptions?: ElementOptions<HTMLElementTagNameMap[K]>): ElementValue<HTMLElementTagNameMap[K]> {
  const element = document.createElement(tag)
  if (elementOptions == undefined) {
    element[propsKey] = noProps
    applyModification(element, elementOptions)
    return element
  }
  element[propsKey] = elementOptions
  const lifecycle = createLifecycle(element)
  applyOptions(element, elementOptions, lifecycle)
  applyModification(element, elementOptions)
  return element
}

function applyOptions<K extends keyof HTMLElementTagNameMap, E extends HTMLElementTagNameMap[K] = HTMLElementTagNameMap[K]>(element: E, elementOptions: ElementOptions<E>, lifecycle: Var<boolean>) {
  let parent: VarOrVal<ParentNode | undefined> | undefined = undefined
  let key: keyof ElementOptions<E>
  for (key in elementOptions) {
    const value = elementOptions[key]
    if (key === "children") {
      applyChildren(element, lifecycle, value)
      continue
    }
    if (key === "classes") {
      applyClasses(element, lifecycle, value)
      continue;
    }
    if (key === "style") {
      applyStyle(element, lifecycle, value)
      continue;
    }
    if (key === "parent") {
      parent = value
      continue
    }
    if (key === "dataset") {
      applyDataset(element, lifecycle, value)
      continue
    }
    if (key === "controller") {
      applyController(element, value)
      continue
    }
    if (key.startsWith("on")) {
      if (key === "onMount") {
        applyOnMount(element, lifecycle, value)
        continue
      }
      if (key === "onAttachedToDom") {
        element.addEventListener("attachedToDom", value as EventListener)
        continue
      }
      if (key === "onDetachedFromDom") {
        element.addEventListener("detachedFromDom", value as EventListener)
        continue
      }
      const eventName = key[2].toLowerCase() + key.slice(3)
      element.addEventListener(eventName, value as EventListener)
      continue
    }
    applyProperty(element, lifecycle, key as any, value)
  }
  if (parent !== undefined) {
    applyParent(element, lifecycle, parent)
  }
}

function createLifecycle(element: HTMLElement): Var<boolean> {
  return new LazyVariable<boolean>(vary => {
    element.dataset[domListenKey] = "t"
    const attachListener = function () {
      vary.value = true
    }
    const detachListener = function () {
      vary.value = false
    }
    element.addEventListener("attachedToDom", attachListener)
    element.addEventListener("detachedFromDom", detachListener)
    vary.value = element.isConnected
    return createDisposiq(() => {
      element.removeEventListener("attachedToDom", attachListener)
      element.removeEventListener("detachedFromDom", detachListener)
    })
  }, () => element.isConnected)
}

function applyChildren(element: HTMLElement, lifecycle: Var<boolean>, children: VarOrVal<ElementChildren>) {
  if (!children) {
    return
  }
  lifecycle.subscribeDisposable(active => {
    if (!active) {
      return emptyDisposable;
    }
    const disposables = new DisposableStore()
    let previousElementOpts: VarOrVal<ElementChild>[] = []
    let addedNodes: AddedChild[] = []
    if (isVariableOf<ElementChildren>(children)) {
      disposables.add(children.subscribe(updateChildren))
    } else {
      updateChildren(children)
    }
    disposables.add(new DisposableAction(() => detachChildren()))
    return disposables;

    function updateChildren(newChildrenOpts: ElementChildren) {
      if (!newChildrenOpts || (Array.isArray(newChildrenOpts) && newChildrenOpts.length === 0)) {
        previousElementOpts = []
        if (addedNodes.length === 0) {
          return
        }
        for (let i = 0; i < addedNodes.length; i++) {
          const addedNode = addedNodes[i]
          addedNode.disposable.dispose()
          element.removeChild(addedNode.node)
        }
        addedNodes = []
        return
      }
      const newElementOpts: VarOrVal<ElementChild>[] = Array.isArray(newChildrenOpts) ? [...newChildrenOpts] : [newChildrenOpts]
      if (addedNodes.length === 0) {
        addedNodes = []
        for (let i = 0; i < newElementOpts.length; i++) {
          const child = newElementOpts[i]
          if (isVariableOf<ElementChild>(child)) {
            const [childNode, disposable] = createVarNode(child)
            element.appendChild(childNode)
            addedNodes.push({node: childNode, disposable, value: child})
            continue
          }
          const childNode = createNode(child)
          element.appendChild(childNode)
          addedNodes.push({node: childNode, disposable: emptyDisposable, value: child})
        }
        return
      }
      const changes = getArrayChanges(previousElementOpts, newElementOpts)
      if (changes.remove.length > 0) {
        for (let i = changes.remove.length - 1; i >= 0; --i) {
          const remove = changes.remove[i]
          const addedNodeIndex = remove.index
          const addedNode = addedNodes[addedNodeIndex]
          addedNodes.splice(addedNodeIndex, 1)
          addedNode.disposable.dispose()
          element.removeChild(addedNode.node)
        }
      }
      for (let i = 0; i < changes.add.length; ++i) {
        const add = changes.add[i]
        const child = newElementOpts[add.index]
        let addedNode: AddedChild
        if (isVariableOf<ElementChild>(child)) {
          const [childNode, disposable] = createVarNode(child)
          addedNode = {
            node: childNode,
            disposable,
            value: child
          }
        } else {
          const childNode = createNode(child)
          addedNode = {
            node: childNode,
            disposable: emptyDisposable,
            value: child
          }
        }
        if (add.index >= addedNodes.length) {
          element.appendChild(addedNode.node)
        } else {
          const previousNode = addedNodes[add.index].node
          element.insertBefore(addedNode.node, previousNode)
        }
        addedNodes.splice(add.index, 0, addedNode)
      }
      for (let i = 0; i < changes.swap.length; ++i) {
        const swap = changes.swap[i]
        const child = addedNodes[swap.index]
        const nextChild = addedNodes[swap.newIndex]
        swapNodes(child, nextChild)
        addedNodes[swap.index] = nextChild
        addedNodes[swap.newIndex] = child
      }
      previousElementOpts = newElementOpts
    }

    function detachChildren() {
      if (addedNodes.length === 0) {
        return;
      }
      for (let i = 0; i < addedNodes.length; i++) {
        let child = addedNodes[i]
        child.disposable.dispose()
        child.node.parentNode?.removeChild(child.node)
      }
      addedNodes = []
    }
  })
}

interface AddedChild {
  node: Node
  disposable: IDisposable
  value: VarOrVal<ElementChild>
}

function applyClasses(element: HTMLElement, lifecycle: Var<boolean>, classes: VarOrVal<string[]>) {
  if (!classes) {
    return
  }
  if (!isVariableOf<string[]>(classes)) {
    element.classList.add(...classes)
    return
  }
  let previousClasses: string[] = emptyStringArray
  lifecycle.subscribeDisposable(active => {
    return !active
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
        if (previousClasses.length === 0) {
          element.classList.add(...newClasses)
          previousClasses = newClasses
          return
        }
        const changes = getArrayChanges(previousClasses, newClasses)
        for (let i = 0; i < changes.remove.length; ++i) {
          element.classList.remove(changes.remove[i].item)
        }
        for (let i = 0; i < changes.add.length; ++i) {
          element.classList.add(changes.add[i].item)
        }
        previousClasses = newClasses
      });
  })
}

function applyStyle(element: HTMLElement, lifecycle: Var<boolean>, style: VarOrVal<ElementStyle>) {
  if (!style) {
    return
  }
  if (!isVariableOf<ElementStyle>(style)) {
    let styleKey: keyof ElementStyle
    for (styleKey in style) {
      element.style[styleKey] = style[styleKey] ?? ""
    }
    return
  }
  lifecycle.subscribeDisposable(active => !active
    ? emptyDisposable
    : listenObjectKVChanges(style, (keysToDelete, changesToAddOrModify) => {
      if (keysToDelete !== null) {
        for (let key of keysToDelete) {
          element.style.removeProperty(key)
        }
      }
      if (changesToAddOrModify !== null) {
        for (let key in changesToAddOrModify) {
          element.style[key] = changesToAddOrModify[key] ?? ""
        }
      }
    }))
}

function applyDataset(element: HTMLElement, lifecycle: Var<boolean>, dataset: VarOrVal<ElementDataset>) {
  if (!dataset) {
    return
  }
  if (!isVariableOf<ElementDataset>(dataset)) {
    for (let key in dataset) {
      element.dataset[key] = dataset[key]
    }
    return
  }
  lifecycle.subscribeDisposable(active => !active
    ? emptyDisposable
    : listenObjectKVChanges(dataset, (keysToDelete, changesToAddOrModify) => {
      if (keysToDelete !== null) {
        for (let key of keysToDelete) {
          delete element.dataset[key]
        }
      }
      if (changesToAddOrModify !== null) {
        for (let key in changesToAddOrModify) {
          element.dataset[key] = changesToAddOrModify[key]
        }
      }
    }))
}

function applyController<T extends HTMLElement>(element: T, controller: ElementController<T>) {
  useController(controller, element)
}

type OnMountHandler = (this: HTMLElement) => IDisposable | void

function applyOnMount(element: HTMLElement, lifecycle: Var<boolean>, onMount: OnMountHandler) {
  if (!onMount) {
    return
  }
  if (!isVariableOf<OnMountHandler>(onMount)) {
    lifecycle.subscribeDisposable(active => active
      ? toDisposable(onMount.call(element) ?? emptyDisposable)
      : emptyDisposable)
    return
  }
  lifecycle.subscribeDisposable(active => !active
    ? emptyDisposable
    : onMount.subscribeDisposable(value => !value
      ? emptyDisposable
      : toDisposable(onMount.call(element) ?? emptyDisposable)))
}

function applyProperty<T extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementTagNameMap[T]>(
  element: HTMLElementTagNameMap[T], lifecycle: Var<boolean>, key: K, value: VarOrVal<HTMLElementTagNameMap[T][K]>) {
  if (!isVariableOf<HTMLElementTagNameMap[T][K]>(value)) {
    element[key] = value
    return
  }
  lifecycle.subscribeDisposable(active => !active
    ? emptyDisposable
    : value.subscribe(newValue => element[key] = newValue as any)
  )
}

function applyParent(element: HTMLElement, lifecycle: Var<boolean>, parent: VarOrVal<ParentNode | undefined>) {
  if (!parent) {
    return
  }
  if (!isVariableOf<ParentNode | undefined>(parent)) {
    parent.appendChild(element)
    return
  }
  let previousParent: ParentNode | undefined
  lifecycle.subscribeDisposable(active => !active
    ? emptyDisposable
    : parent.subscribe(newParent => {
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
    }))
}


type ListenObjectKVChangesHandler<T extends Record<string, any>> = (keysToDelete: StringArrayKeyOf<T> | null, changesToAddOrModify: Partial<T> | null) => void

function listenObjectKVChanges<T extends Record<string, any>>(variable: Var<T>, handler: ListenObjectKVChangesHandler<T>): IDisposable {
  let currentState: T = variable.value
  const subscription = variable.subscribeSilent(value => {
    let [keysToDelete, dataToAddOrChange] = getObjectValuesChanges(currentState, value)
    currentState = value
    handler(keysToDelete, dataToAddOrChange)
  })
  handler(null, currentState)
  return subscription
}

function swapNodes(child1: AddedChild, child2: AddedChild) {
  const parent = child1.node.parentNode
  const nextSibling = child2.node.nextSibling
  if (nextSibling === child1.node) {
    parent?.insertBefore(child1.node, child2.node)
  } else {
    parent?.insertBefore(child2.node, child1.node)
    parent?.insertBefore(child1.node, nextSibling)
  }
}

function createNode(value: ElementChild): Node {
  if (!value) {
    return document.createDocumentFragment()
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

function createVarNode(value: Var<ElementChild>): [Node, IDisposable] {
  const fragment = document.createDocumentFragment()
  let previousChild: Node | null = null
  const disposable = value.subscribe(newValue => {
    const childNode = createNode(newValue)
    if (!previousChild) {
      fragment.appendChild(childNode)
      previousChild = childNode
      return
    }
    const parent = previousChild.parentNode
    if (!parent) {
      fragment.appendChild(childNode)
      previousChild = childNode
      return
    }
    parent.insertBefore(previousChild, childNode)
    parent.removeChild(previousChild)
    previousChild = childNode
  })
  return [fragment, disposable]
}

function createEmptyNode() {
  return document.createTextNode("")
}

runMutationObserver()