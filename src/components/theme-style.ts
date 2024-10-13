import { Var, Vary } from "@tioniq/eventiq";
import { Context, ContextValue, createContext } from "@/context/context.js";

export const theme: Var<Exclude<keyof Theme, "system">> = new Vary("dark")

export interface Theme {
  dark: true
  light: true
  system: true
}

export function getThemeStyle(forTheme?: Var<keyof Theme>) {
  forTheme = forTheme ?? theme
  return {
    normalColor: new Vary("#232323"),
    primaryColor: new Vary("#227093"),
    secondaryColor: new Vary("#706fd3"),
    successColor: new Vary("#33d9b2"),
    errorColor: new Vary("#ff5252"),
    warningColor: new Vary("#ffda79"),
    infoColor: new Vary("#34ace0"),
    textColor: forTheme.map(t => t === "dark" ? "#ffffff" : "#000000"),
  }
}

export function getThemeStyleFromContext(context: ContextValue<ThemeContextValue>) {
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