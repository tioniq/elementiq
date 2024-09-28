export const domListenKey = "elemiqDomListen"

export class AttachedToDOMEvent extends Event {
  constructor() {
    super("attachedToDom", {
      bubbles: false,
      cancelable: false,
      composed: false,
    })
  }
}

export class DetachedFromDOMEvent extends Event {
  constructor() {
    super("detachedFromDom", {
      bubbles: false,
      cancelable: false,
      composed: false,
    })
  }
}

export function runMutationObserver() {
  const mutationObserver = new MutationObserver((mutations, observer) => {
    for (let mutation of mutations) {
      if (mutation.type === "childList") {
        if (mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; ++i) {
            const node = mutation.addedNodes[i]
            if (node instanceof HTMLElement) {
              checkAndDispatchAttachedToDOMEvent(node)
            }
          }
        }
        if (mutation.removedNodes.length > 0) {
          for (let i = 0; i < mutation.removedNodes.length; ++i) {
            const node = mutation.removedNodes[i]
            if (node instanceof HTMLElement) {
              checkAndDispatchDetachedFromDOMEvent(node)
            }
          }
        }
      }
    }
  })

  mutationObserver.observe(document, {
    childList: true,
    subtree: true
  })
}

function checkAndDispatchAttachedToDOMEvent(node: HTMLElement) {
  if (node.dataset[domListenKey] === "t") {
    node.dispatchEvent(new AttachedToDOMEvent())
  }
  if (node.children.length > 0) {
    for (let i = 0; i < node.children.length; ++i) {
      const child = node.children[i]
      if (child instanceof HTMLElement) {
        checkAndDispatchAttachedToDOMEvent(child)
      }
    }
  }
}

function checkAndDispatchDetachedFromDOMEvent(node: HTMLElement) {
  if (node.dataset[domListenKey] === "t") {
    node.dispatchEvent(new DetachedFromDOMEvent())
  }
  if (node.children.length > 0) {
    for (let i = 0; i < node.children.length; ++i) {
      const child = node.children[i]
      if (child instanceof HTMLElement) {
        checkAndDispatchDetachedFromDOMEvent(child)
      }
    }
  }
}