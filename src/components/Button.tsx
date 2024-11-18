import { createController, useController } from "@/controller/index.ts"
import type {
  ElementChildren,
  ElementController,
  ElementStyle,
} from "@/types/element.ts"
import { combine, createConst, type Var, type VarOrVal } from "@tioniq/eventiq"
import { toDefinedVariable, toVariable } from "@/variable/variable.ts"
import { button } from "@/dom/dom-elements.ts"
import { buttonStyles } from "@/components/button-styles.ts"
import {
  getThemeStyleFromContext,
  ThemeContext,
} from "@/components/theme-style.ts"
import { useContext } from "@/context/context.ts"

export function Button(props: Button.Props) {
  const controller: ElementController<HTMLButtonElement> | undefined =
    props.controller == undefined
      ? undefined
      : createController<ElementController<HTMLButtonElement>>()
  if (controller) {
    useController(props.controller, {
      click() {
        controller.click()
      },
      focus() {
        controller.focus()
      },
    })
  }
  const context = useContext(ThemeContext)
  const themeStyle = getThemeStyleFromContext(context)

  const variant = toDefinedVariable(props.variant, "normal")
  const appearance = toDefinedVariable(props.appearance, "normal")
  const size = toDefinedVariable(props.size, "normal")
  const classes = combine(
    createConst(buttonStyles.button),
    appearance.map((a) => (a === "ghost" ? buttonStyles.buttonGhost : "")),
    size.map((s) => buttonStyles[`button-size-${s}`] ?? ""),
  )
  const variantColor = variant.switchMap((v) => themeStyle[`${v}Color`])
  const borderWidth = appearance.map((a) => (a === "outline" ? "2px" : "0"))
  const backgroundColor = appearance.switchMap((a) =>
    a === "normal" || a === "solid" ? variantColor : createConst("transparent"),
  )
  const borderColor = variantColor
  const textColor = appearance.switchMap((a) => {
    switch (a) {
      case "solid":
        return variantColor.map((c) => lightenColor(c, 0.6))
      case "link":
      case "ghost":
      case "outline":
        return variantColor
      default:
        return themeStyle.textColor
    }
  })
  const textDecoration = appearance.map((a) =>
    a === "link" ? "underline" : "none",
  )
  const style: Var<ElementStyle> = toVariable(props.style).map((s) => ({
    backgroundColor: backgroundColor,
    color: textColor,
    borderColor: borderColor,
    borderWidth: borderWidth,
    textDecoration: textDecoration,
    ...(s ?? {}),
  }))
  return button({
    controller,
    classes: classes,
    className: props.className,
    style: style,
    onClick: props.onClick,
    children: props.children,
    type: props.type,
    disabled: props.disabled,
    context: context,
  })
}

export namespace Button {
  export interface Props {
    controller?: Button.Controller
    variant?: VarOrVal<keyof Button.Variant>
    size?: VarOrVal<keyof Button.Size>
    appearance?: VarOrVal<keyof Button.Appearance>
    children?: VarOrVal<ElementChildren>
    onClick?: VarOrVal<(event: MouseEvent) => void>
    className?: VarOrVal<string | undefined>
    style?: VarOrVal<ElementStyle | undefined>
    type?: VarOrVal<HTMLButtonElement["type"]>
    disabled?: VarOrVal<boolean>
  }

  export interface Controller {
    click(): void

    focus(): void
  }

  export interface Variant {
    normal: true
    primary: true
    secondary: true
    success: true
    error: true
    warning: true
    info: true
  }

  export interface Size {
    normal: true
    small: true
    large: true
  }

  export interface Theme {
    system: true
    dark: true
    light: true
  }

  export interface Appearance {
    normal: true
    solid: true
    outline: true
    link: true
    ghost: true
  }
}

function lightenColor(hex: string, percent: number): string {
  // Convert hex to RGB
  const num = Number.parseInt(hex.slice(1), 16)
  const r = (num >> 16) + Math.round(255 * percent)
  const g = ((num >> 8) & 0x00ff) + Math.round(255 * percent)
  const b = (num & 0x0000ff) + Math.round(255 * percent)

  // Ensure values are within the valid range
  const newR = Math.min(255, Math.max(0, r))
  const newG = Math.min(255, Math.max(0, g))
  const newB = Math.min(255, Math.max(0, b))

  // Convert RGB back to hex
  const newHex = (newR << 16) | (newG << 8) | newB
  return `#${newHex.toString(16).padStart(6, "0")}`
}
