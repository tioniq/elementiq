import {ElementValue} from "../index.ts";

export type FunctionComponent<P = {}> = (props: P) => ElementValue

export interface ClassComponent<P = {}> {
  new(props: P): ClassComponent

  render(): ElementValue
}