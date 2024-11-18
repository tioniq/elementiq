import {
  createConst,
  isVariableOf,
  type Var,
  type VarOrVal,
} from "@tioniq/eventiq"

export function toVariable<T>(
  value: VarOrVal<T> | undefined | null,
): Var<T | null> {
  if (isVariableOf<T>(value)) {
    return value
  }
  return createConst(value ?? null)
}

/**
 * Converts a variable or value to a variable that will always have a value
 * @param value the variable or value
 * @param defaultValue the default value of the variable if the value is undefined or null
 */
export function toDefinedVariable<T, TDefault extends T>(
  value: VarOrVal<T | null | undefined> | null | undefined,
  defaultValue: TDefault,
): Var<T> {
  if (isVariableOf<T | undefined | null>(value)) {
    return value.map((v) => v ?? defaultValue)
  }
  return createConst(value ?? defaultValue)
}
