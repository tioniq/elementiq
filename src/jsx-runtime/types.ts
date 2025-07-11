import { JSX } from "../index.ts"

export type FunctionComponent<P = object> = (props: P) => JSX.Element

export interface ClassComponent<P = object> {
  // biome-ignore lint/suspicious/noMisleadingInstantiator: Instantiator is needed for type checking
  new(props: P): ClassComponent

  render(): JSX.Element
}
