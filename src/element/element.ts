import {ElementChildren, ElementDataset, ElementOptions, ElementStyle} from "../types/element";
import {domListenKey, runMutationObserver} from "../lifecycle";
import {getObjectValuesChanges, StringArrayKeyOf} from "../diff/object";
import {getArrayChanges} from "../diff/array";
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

const propsKey = "_elemiqProps"
const noProps = Object.freeze({})

declare global {
  interface HTMLElement {
    _elemiqProps: any
  }
}

export function element<K extends keyof HTMLElementTagNameMap>(tag: K, elementOptions?: ElementOptions<HTMLElementTagNameMap[K]>): HTMLElementTagNameMap[K] {
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
  if (!isVariableOf<ElementChildren>(children)) {
    setElementChildren(element, children)
    return
  }
  lifecycle.subscribeDisposable(active => {
    if (!active) {
      return emptyDisposable;
    }
    const disposables = new DisposableStore()
    let previousChildrenOpts: ElementChildren = undefined
    let childrenNodes: Node[]
    disposables.add(children.subscribe(newChildrenOpts => {
      if (newChildrenOpts === previousChildrenOpts) {
        return
      }
      if (!previousChildrenOpts) {
        childrenNodes = setElementChildren(element, newChildrenOpts)
        previousChildrenOpts = newChildrenOpts
        return
      }
      if (!newChildrenOpts) {
        element.innerHTML = ""
        childrenNodes = []
        previousChildrenOpts = newChildrenOpts
        return
      }
      const newChildrenOptsType = typeof newChildrenOpts
      if (typeof previousChildrenOpts !== newChildrenOptsType) {
        detachChildren()
        childrenNodes = setElementChildren(element, newChildrenOpts)
        previousChildrenOpts = newChildrenOpts
        return
      }
      if (!Array.isArray(newChildrenOpts) || !Array.isArray(previousChildrenOpts)) {
        detachChildren()
        childrenNodes = setElementChildren(element, newChildrenOpts)
        previousChildrenOpts = newChildrenOpts
        return
      }
      const newChildrenOptsLength = newChildrenOpts.length
      const previousChildrenOptsLength = previousChildrenOpts.length
      if (newChildrenOptsLength === 0) {
        detachChildren()
        previousChildrenOpts = newChildrenOpts
        return
      }
      if (previousChildrenOptsLength === 0) {
        childrenNodes = setElementChildren(element, newChildrenOpts)
        previousChildrenOpts = newChildrenOpts
        return
      }
      const changes = getArrayChanges(previousChildrenOpts, newChildrenOpts)
      if (changes.remove.length > 0) {
        for (let i = changes.remove.length - 1; i >= 0; --i) {
          const remove = changes.remove[i]
          const child = childrenNodes[remove.index]
          childrenNodes.splice(remove.index, 1)
          element.removeChild(child)
        }
      }
      for (let i = 0; i < changes.add.length; ++i) {
        const add = changes.add[i]
        const child = newChildrenOpts[add.index]
        const childNode = typeof child === "string" ? document.createTextNode(child) : child
        const previousNode = childrenNodes[add.index]
        childrenNodes.splice(add.index, 0, childNode)
        if (add.index >= childrenNodes.length) {
          element.appendChild(childNode)
          continue
        }
        element.insertBefore(childNode, previousNode)
      }
      for (let i = 0; i < changes.swap.length; ++i) {
        const swap = changes.swap[i]
        const child = childrenNodes[swap.index]
        const nextChild = childrenNodes[swap.newIndex]
        swapNodes(child, nextChild)
      }
      previousChildrenOpts = newChildrenOpts
    }))
    disposables.add(new DisposableAction(() => detachChildren()))
    return disposables;

    function detachChildren() {
      if (childrenNodes) {
        for (let i = 0; i < childrenNodes.length; i++) {
          let child = childrenNodes[i]
          child.parentNode?.removeChild(child)
        }
        childrenNodes = []
      }
    }
  })
}

function applyClasses(element: HTMLElement, lifecycle: Var<boolean>, classes: VarOrVal<string[]>) {
  if (!classes) {
    return
  }
  if (!isVariableOf<string[]>(classes)) {
    element.classList.add(...classes)
    return
  }
  let previousClasses: string[] = []
  lifecycle.subscribeDisposable(active => {
    return !active
      ? emptyDisposable
      : classes.subscribe(newClasses => {
        if (!newClasses) {
          if (previousClasses.length === 0) {
            return
          }
          for (let i = 0; i < previousClasses.length; ++i) {
            element.classList.remove(previousClasses[i])
          }
          previousClasses = newClasses
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

function swapNodes(node1: Node, node2: Node) {
  const parent = node1.parentNode
  const nextSibling = node2.nextSibling
  if (nextSibling === node1) {
    parent?.insertBefore(node1, node2)
  } else {
    parent?.insertBefore(node2, node1)
    parent?.insertBefore(node1, nextSibling)
  }
}

function setElementChildren(element: HTMLElement, children: ElementChildren): Node[] {
  if (Array.isArray(children)) {
    if (children.length === 0) {
      return []
    }
    // TODO add document.createDocumentFragment()
    let parent = element
    let result: Node[] = []
    for (let child of children) {
      if (!child) {
        continue
      }
      const childNode = typeof child === "string" ? document.createTextNode(child) : child
      parent.append(childNode)
      result.push(childNode)
    }
    return result
  }
  if (typeof children === "string") {
    element.innerText = children
    return nodeListToArray(element.childNodes)
  }
  if (typeof children === "object") {
    element.appendChild(children as Node)
    return [children as Node]
  }
  if (typeof children === "boolean") {
    return [createEmptyNode()]
  }
  if (typeof children === "number") {
    console.error("Number is not supported as a child of an element.")
  } else {
    console.error(`Unsupported type '${typeof children}' of children.`)
  }
  return [createEmptyNode()]
}

function createEmptyNode() {
  return document.createTextNode("")
}

function nodeListToArray(nodeList: NodeList): Node[] {
  const size = nodeList.length
  if (size === 0) {
    return []
  }
  const nodes = new Array<Node>(size)
  for (let i = 0; i < size; i++) {
    nodes[i] = nodeList[i]
  }
  return nodes
}

runMutationObserver()