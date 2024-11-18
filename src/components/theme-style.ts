import { type Var, Vary } from "@tioniq/eventiq"
import {
  type Context,
  type ContextValue,
  createContext,
} from "@/context/context.ts"

export const theme: Var<Exclude<keyof Theme, "system">> = new Vary("dark")

export interface Theme {
  dark: true
  light: true
  system: true
}

export function getThemeStyle(forTheme?: Var<keyof Theme>) {
  const styleTheme = forTheme ?? theme
  return {
    normalColor: new Vary("#232323"),
    primaryColor: new Vary("#227093"),
    secondaryColor: new Vary("#706fd3"),
    successColor: new Vary("#33d9b2"),
    errorColor: new Vary("#ff5252"),
    warningColor: new Vary("#ffda79"),
    infoColor: new Vary("#34ace0"),
    textColor: styleTheme.map((t) => {
      // console.debug("Getting text color for theme", t)
      return t === "dark" ? "#ffffff" : "#000000"
    }),
  }
}

export function getThemeStyleFromContext(
  context: ContextValue<ThemeContextValue>,
) {
  return getThemeStyle(context.theme)
}

export const themeStyle = getThemeStyle(theme)

export interface ThemeContextValue {
  theme: Var<keyof Theme>
}

export function createThemeContext(): Context<ThemeContextValue> {
  return createContext<ThemeContextValue>("theme")
}

export const ThemeContext = createThemeContext()
