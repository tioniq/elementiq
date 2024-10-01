import {ElementValue} from "../index";

export type FunctionComponent<P = {}> = (props: P) => ElementValue

export interface ClassComponent<P = {}> {
  new(props: P): ClassComponent

  render(): ElementValue
}