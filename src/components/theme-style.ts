import {Var, Vary} from "@tioniq/eventiq";

export const theme: Var<Exclude<keyof Theme, "system">> = new Vary("dark")

export interface Theme {
  dark: true
  light: true
  system: true
}

export function createThemeStyle(theme: Var<keyof Theme>) {
  return {
    normalColor: new Vary("#232323"),
    primaryColor: new Vary("#227093"),
    secondaryColor: new Vary("#706fd3"),
    successColor: new Vary("#33d9b2"),
    errorColor: new Vary("#ff5252"),
    warningColor: new Vary("#ffda79"),
    infoColor: new Vary("#34ace0"),
    textColor: theme.map(t => t === "dark" ? "#ffffff" : "#000000"),
  }
}

export const themeStyle = createThemeStyle(theme)