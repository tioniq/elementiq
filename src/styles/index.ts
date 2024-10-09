import {ClassNameMap, Style, StyleDeclaration} from "./types.js";
import {DisposableAction, IDisposable, IDisposablesContainer} from "@tioniq/disposiq";

export * from "./types.js"

const _addedStyles: HTMLStyleElement[] = []

export function addRawStyle(rawCss: string): IDisposable {
  return _addRawStyle(rawCss)
}

export function addStyles(styles: Style[]): IDisposable {
  return _addStyles(styles)
}

const _classNames = new Map<string, number>()

export function makeClassStyles<ClassKey extends string = string>(
  styles: Record<ClassKey, StyleDeclaration>, disposable?: IDisposablesContainer)
  : ClassNameMap<ClassKey> {
  const result: ClassNameMap<ClassKey> = {} as any
  const stylesResult: Style[] = []
  for (let key in styles) {
    key = key.trim() as any
    const style = styles[key]
    if (key.indexOf(" ") !== -1 || key.indexOf(".") !== -1 || key.indexOf(">") !== -1 || key.indexOf(":") !== -1) {
      let kKey = getFirstWord(key)
      const classCounter = _classNames.get(kKey)
      if (classCounter === undefined) {
        console.error("Invalid class name", key)
        continue
      }
      const className = kKey + classCounter
      stylesResult.push({
        rule: "." + className + key.substring(kKey.length),
        declaration: style
      })
      continue
    }
    const existingClassCounter = _classNames.get(key)
    let className: string = key
    if (existingClassCounter === undefined) {
      _classNames.set(key, 1)
      className += "1"
    } else {
      _classNames.set(key, existingClassCounter + 1)
      className += (existingClassCounter + 1).toString()
    }
    stylesResult.push({
      rule: "." + className,
      declaration: style
    })
    result[key] = className
  }
  const subscription = _addStyles(stylesResult)
  if (disposable) {
    disposable.add(subscription)
  }
  return result
}

export function removeAllGeneratedStyles() {
  const styles = [..._addedStyles]
  _addedStyles.length = 0
  for (let style of styles) {
    style.remove()
  }
}

function _addRawStyle(rawCss: string): IDisposable {
  const style = document.createElement("style")
  style.id = generateStyleId()
  style.textContent = rawCss
  return attachStyleElement(style)
}

function _addStyles(styles: Style[]): IDisposable {
  const style = document.createElement("style")
  style.textContent = '\n'
  style.id = generateStyleId()
  const attachSubscription = attachStyleElement(style)
  for (let style1 of styles) {
    const styleData = getStyleDeclaration(style1.declaration)
    style.sheet!.insertRule(`${style1.rule} { ${styleData.cssText} }`, style.sheet!.cssRules.length)
  }
  return attachSubscription
}

function attachStyleElement(style: HTMLStyleElement): IDisposable {
  const head = document.head
  head.appendChild(style)
  _addedStyles.push(style)
  return new DisposableAction(() => {
    const index = _addedStyles.indexOf(style)
    if (index !== -1) {
      _addedStyles.splice(index, 1)
    }
    head.removeChild(style);
  })
}

function getStyleDeclaration(style: StyleDeclaration): StyleDeclaration {
  const span = document.createElement('span')
  const spanStyle = span.style
  let key: keyof StyleDeclaration
  for (key in style) {
    spanStyle[key] = style[key] as string
  }
  return spanStyle
}


let styleIdCounter = 0

function generateStyleId() {
  return "elemiq-style-" + ++styleIdCounter
}

function getFirstWord(str: string): string {
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i)
    let aLetter = (charCode >= 65 && charCode < 91) || (charCode >= 97 && charCode < 123);
    if (aLetter) {
      continue
    }
    let aDigit = charCode >= 48 && charCode < 58
    if (aDigit) {
      continue
    }
    let isUnderscoreOrHyphen = charCode === 95 || charCode === 45
    if (isUnderscoreOrHyphen) {
      continue
    }
    return str.substring(0, i)
  }
  return str
}
