export type StyleDeclaration = Partial<CSSStyleDeclaration>

export interface Style {
  rule: string
  declaration: StyleDeclaration
}

export type ClassNameMap<ClassKey extends string = string> = Record<
  ClassKey,
  string
>
