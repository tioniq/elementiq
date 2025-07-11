import type { ElementValue } from "../index.ts"

export type FunctionComponent<P = object> = (props: P) => ElementValue

export interface ClassComponent<P = object> {
  // biome-ignore lint/suspicious/noMisleadingInstantiator: Instantiator is needed for type checking
  new(props: P): ClassComponent

  render(): ElementValue
}
