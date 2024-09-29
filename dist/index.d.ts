import { DisposableLike } from '@tioniq/disposiq';
import { Variable } from '@tioniq/eventiq';

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;
type WritableKeys<T> = {
    [P in keyof T]-?: IfEquals<{
        [Q in P]: T[P];
    }, {
        -readonly [Q in P]: T[P];
    }, P>;
}[keyof T];
type ReadonlyKeys<T> = {
    [P in keyof T]-?: IfEquals<{
        [Q in P]: T[P];
    }, {
        -readonly [Q in P]: T[P];
    }, never, P>;
}[keyof T];
type ObjectWritableProps<T extends Record<string, any>> = {
    [P in WritableKeys<T>]: T[P];
};

declare class AttachedToDOMEvent extends Event {
    constructor();
}
declare class DetachedFromDOMEvent extends Event {
    constructor();
}

interface MissingAttributes {
    ariaControls?: string | null;
    ariaLabelledby?: string | null;
    role?: string | null;
}
type ElementChildren = (Node | string)[] | Node | string | undefined | null | boolean;
type ElementDataset = Record<string, string>;
type ElementStyle = Partial<ObjectWritableProps<CSSStyleDeclaration>>;
type EventKeywordsArray = [
    "animation",
    "transition",
    "ended",
    "playing",
    "seeking",
    "waiting",
    "suspend",
    "invalid",
    "context",
    "update",
    "click",
    "cancel",
    "end",
    "toggle",
    "start",
    "pointer",
    "input",
    "transition",
    "change",
    "up",
    "in",
    "out",
    "over",
    "down",
    "press",
    "enter",
    "leave",
    "move",
    "play",
    "meta",
    "data",
    "policy"
];
type Split<S extends string, K extends string> = S extends `${infer Prefix}${K}${infer Suffix}` ? [Prefix, K, Suffix] : never;
type SplitAtFirstKeyword<S extends string, Keywords extends readonly string[]> = Keywords extends [infer FirstKeyword extends string, ...infer RestKeywords extends string[]] ? Split<S, FirstKeyword> extends never ? SplitAtFirstKeyword<S, RestKeywords> : Split<S, FirstKeyword> : [S];
type JoinCapitalized<T extends string[], D extends string> = T extends [] ? never : T extends [infer F extends string] ? Capitalize<F> : T extends [infer F, ...infer R] ? F extends string ? `${Capitalize<F>}${D}${JoinCapitalized<Extract<R, string[]>, D>}` : never : string;
type KeywordSplitter<Event extends string> = SplitAtFirstKeyword<Event, EventKeywordsArray> extends infer Result ? Result extends string[] ? JoinCapitalized<Result, ""> : Capitalize<Event> : never;
type MapEventName<Event extends string> = `on${KeywordSplitter<Event>}`;
type MappedEvents<T, ThisArg> = {
    [P in Extract<keyof T, string> as MapEventName<P>]?: (this: ThisArg, ev: T[P]) => any;
};
type ElementProps<T extends HTMLElement = HTMLElement> = {
    [P in WritableKeys<T> as (T[P] extends (string | number | boolean) ? P : never)]?: T[P];
} & MissingAttributes & {
    classes?: string[];
    style?: ElementStyle;
    children?: ElementChildren;
} & {
    dataset?: ElementDataset;
} & MappedEvents<HTMLElementEventMap, T> & {
    modifierData?: any;
} & {
    onAttachedToDom?: (this: T, ev: AttachedToDOMEvent) => any;
    onDetachedFromDom?: (this: T, ev: DetachedFromDOMEvent) => any;
} & {
    onMount?: (this: T) => DisposableLike | void;
};
type VariableOrValue<Type extends Record<string, any>> = {
    [P in keyof Type]: Type[P] | Variable<Type[P]>;
};
type ElementOptions<T extends HTMLElement = HTMLElement> = VariableOrValue<ElementProps<T>> & {
    parent?: ParentNode;
};
type StubElement = Symbol;
type ElementValue<T extends HTMLElement = HTMLElement> = T;

declare global {
    interface HTMLElement {
        _elemiqProps: any;
    }
}
declare function element<K extends keyof HTMLElementTagNameMap>(tag: K, elementOptions?: ElementOptions<HTMLElementTagNameMap[K]>): ElementValue<HTMLElementTagNameMap[K]>;

interface Modifier {
    (element: HTMLElement, elementOptions?: ElementOptions): void;
}
declare function addModifier(modifier: Modifier): void;
declare function addTagModifier(tag: string, modifier: Modifier): void;
declare function applyModification<K extends keyof HTMLElementTagNameMap, E extends HTMLElementTagNameMap[K] = HTMLElementTagNameMap[K]>(element: E, elementOptions?: ElementOptions<E>): void;

declare function text(text: string): Text;
declare function a(options?: ElementOptions<HTMLAnchorElement>): ElementValue<HTMLAnchorElement>;
declare function abbr(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function address(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function area(options?: ElementOptions<HTMLAreaElement>): ElementValue<HTMLElement>;
declare function article(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function aside(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function audio(options?: ElementOptions<HTMLAudioElement>): ElementValue<HTMLAudioElement>;
declare function b(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function base(options?: ElementOptions<HTMLBaseElement>): ElementValue<HTMLBaseElement>;
declare function bdi(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function bdo(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function blockquote(options?: ElementOptions<HTMLQuoteElement>): ElementValue<HTMLQuoteElement>;
declare function body(options?: ElementOptions<HTMLBodyElement>): ElementValue<HTMLBodyElement>;
declare function br(options?: ElementOptions<HTMLBRElement>): ElementValue<HTMLBRElement>;
declare function button(options?: ElementOptions<HTMLButtonElement>): ElementValue<HTMLButtonElement>;
declare function canvas(options?: ElementOptions<HTMLCanvasElement>): ElementValue<HTMLCanvasElement>;
declare function caption(options?: ElementOptions<HTMLTableCaptionElement>): ElementValue<HTMLTableCaptionElement>;
declare function cite(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function code(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function col(options?: ElementOptions<HTMLTableColElement>): ElementValue<HTMLTableColElement>;
declare function colgroup(options?: ElementOptions<HTMLTableColElement>): ElementValue<HTMLTableColElement>;
declare function data(options?: ElementOptions<HTMLDataElement>): ElementValue<HTMLDataElement>;
declare function datalist(options?: ElementOptions<HTMLDataListElement>): ElementValue<HTMLDataListElement>;
declare function dd(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function del(options?: ElementOptions<HTMLModElement>): ElementValue<HTMLModElement>;
declare function details(options?: ElementOptions<HTMLDetailsElement>): ElementValue<HTMLDetailsElement>;
declare function dfn(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function dialog(options?: ElementOptions<HTMLDialogElement>): ElementValue<HTMLDialogElement>;
declare function div(options?: ElementOptions<HTMLDivElement>): ElementValue<HTMLDivElement>;
declare function dl(options?: ElementOptions<HTMLDListElement>): ElementValue<HTMLDListElement>;
declare function dt(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function em(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function embed(options?: ElementOptions<HTMLEmbedElement>): ElementValue<HTMLEmbedElement>;
declare function fieldset(options?: ElementOptions<HTMLFieldSetElement>): ElementValue<HTMLFieldSetElement>;
declare function figcaption(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function figure(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function footer(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function form(options?: ElementOptions<HTMLFormElement>): ElementValue<HTMLFormElement>;
declare function h1(options?: ElementOptions<HTMLHeadingElement>): ElementValue<HTMLHeadingElement>;
declare function h2(options?: ElementOptions<HTMLHeadingElement>): ElementValue<HTMLHeadingElement>;
declare function h3(options?: ElementOptions<HTMLHeadingElement>): ElementValue<HTMLHeadingElement>;
declare function h4(options?: ElementOptions<HTMLHeadingElement>): ElementValue<HTMLHeadingElement>;
declare function h5(options?: ElementOptions<HTMLHeadingElement>): ElementValue<HTMLHeadingElement>;
declare function h6(options?: ElementOptions<HTMLHeadingElement>): ElementValue<HTMLHeadingElement>;
declare function head(options?: ElementOptions<HTMLHeadElement>): ElementValue<HTMLHeadElement>;
declare function header(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function hgroup(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function hr(options?: ElementOptions<HTMLHRElement>): ElementValue<HTMLHRElement>;
declare function html(options?: ElementOptions<HTMLHtmlElement>): ElementValue<HTMLHtmlElement>;
declare function i(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function iframe(options?: ElementOptions<HTMLIFrameElement>): ElementValue<HTMLIFrameElement>;
declare function img(options?: ElementOptions<HTMLImageElement>): ElementValue<HTMLImageElement>;
declare function input(options?: ElementOptions<HTMLInputElement>): ElementValue<HTMLInputElement>;
declare function ins(options?: ElementOptions<HTMLModElement>): ElementValue<HTMLModElement>;
declare function kbd(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function label(options?: ElementOptions<HTMLLabelElement>): ElementValue<HTMLLabelElement>;
declare function legend(options?: ElementOptions<HTMLLegendElement>): ElementValue<HTMLLegendElement>;
declare function li(options?: ElementOptions<HTMLLIElement>): ElementValue<HTMLLIElement>;
declare function link(options?: ElementOptions<HTMLLinkElement>): ElementValue<HTMLLinkElement>;
declare function main(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function map(options?: ElementOptions<HTMLMapElement>): ElementValue<HTMLMapElement>;
declare function mark(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function menu(options?: ElementOptions<HTMLMenuElement>): ElementValue<HTMLMenuElement>;
declare function meta(options?: ElementOptions<HTMLMetaElement>): ElementValue<HTMLMetaElement>;
declare function meter(options?: ElementOptions<HTMLMeterElement>): ElementValue<HTMLMeterElement>;
declare function nav(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function noscript(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function object(options?: ElementOptions<HTMLObjectElement>): ElementValue<HTMLObjectElement>;
declare function ol(options?: ElementOptions<HTMLOListElement>): ElementValue<HTMLOListElement>;
declare function optgroup(options?: ElementOptions<HTMLOptGroupElement>): ElementValue<HTMLOptGroupElement>;
declare function option(options?: ElementOptions<HTMLOptionElement>): ElementValue<HTMLOptionElement>;
declare function output(options?: ElementOptions<HTMLOutputElement>): ElementValue<HTMLOutputElement>;
declare function p(options?: ElementOptions<HTMLParagraphElement>): ElementValue<HTMLParagraphElement>;
declare function picture(options?: ElementOptions<HTMLPictureElement>): ElementValue<HTMLPictureElement>;
declare function pre(options?: ElementOptions<HTMLPreElement>): ElementValue<HTMLPreElement>;
declare function progress(options?: ElementOptions<HTMLProgressElement>): ElementValue<HTMLProgressElement>;
declare function q(options?: ElementOptions<HTMLQuoteElement>): ElementValue<HTMLQuoteElement>;
declare function rp(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function rt(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function ruby(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function s(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function samp(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function script(options?: ElementOptions<HTMLScriptElement>): ElementValue<HTMLScriptElement>;
declare function search(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function section(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function select(options?: ElementOptions<HTMLSelectElement>): ElementValue<HTMLSelectElement>;
declare function slot(options?: ElementOptions<HTMLSlotElement>): ElementValue<HTMLSlotElement>;
declare function small(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function source(options?: ElementOptions<HTMLSourceElement>): ElementValue<HTMLSourceElement>;
declare function span(options?: ElementOptions<HTMLSpanElement>): ElementValue<HTMLSpanElement>;
declare function strong(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function style(options?: ElementOptions<HTMLStyleElement>): ElementValue<HTMLStyleElement>;
declare function sub(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function summary(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function sup(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function table(options?: ElementOptions<HTMLTableElement>): ElementValue<HTMLTableElement>;
declare function tbody(options?: ElementOptions<HTMLTableSectionElement>): ElementValue<HTMLTableSectionElement>;
declare function td(options?: ElementOptions<HTMLTableCellElement>): ElementValue<HTMLTableCellElement>;
declare function template(options?: ElementOptions<HTMLTemplateElement>): ElementValue<HTMLTemplateElement>;
declare function textarea(options?: ElementOptions<HTMLTextAreaElement>): ElementValue<HTMLTextAreaElement>;
declare function tfoot(options?: ElementOptions<HTMLTableSectionElement>): ElementValue<HTMLTableSectionElement>;
/**
 * @deprecated
 */
declare function th(options?: ElementOptions<HTMLTableHeaderCellElement>): ElementValue<HTMLTableHeaderCellElement>;
declare function thead(options?: ElementOptions<HTMLTableSectionElement>): ElementValue<HTMLTableSectionElement>;
declare function time(options?: ElementOptions<HTMLTimeElement>): ElementValue<HTMLTimeElement>;
declare function title(options?: ElementOptions<HTMLTitleElement>): ElementValue<HTMLTitleElement>;
declare function tr(options?: ElementOptions<HTMLTableRowElement>): ElementValue<HTMLTableRowElement>;
declare function track(options?: ElementOptions<HTMLTrackElement>): ElementValue<HTMLTrackElement>;
declare function u(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function ul(options?: ElementOptions<HTMLUListElement>): ElementValue<HTMLUListElement>;
declare function var_(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;
declare function video(options?: ElementOptions<HTMLVideoElement>): ElementValue<HTMLVideoElement>;
declare function wbr(options?: ElementOptions<HTMLElement>): ElementValue<HTMLElement>;

type StyleDeclaration = Partial<CSSStyleDeclaration>;
interface Style {
    rule: string;
    declaration: StyleDeclaration;
}
type ClassNameMap<ClassKey extends string = string> = Record<ClassKey, string>;

declare function render<T extends HTMLElement>(value: ElementValue<T>, parent: HTMLElement): void;

type FunctionComponent = (props: Record<string, unknown>) => ElementValue;

declare namespace JSX {
    type HTMLAttributes = ElementProps;
    type IntrinsicElements = {
        [K in keyof HTMLElementTagNameMap]: ElementOptions<HTMLElementTagNameMap[K]>;
    };
    type Element = ElementValue;
}
declare const jsx: typeof renderJsx;
declare const jsxs: typeof renderJsx;
declare const jsxDEV: typeof renderJsx;

declare function renderJsx<TProps extends object>(func: (props?: TProps) => JSX.Element, props: TProps, _key?: string): JSX.Element;
declare function renderJsx<K extends keyof HTMLElementTagNameMap>(tag: K, props: ElementOptions<HTMLElementTagNameMap[K]>, _key?: string): JSX.Element;

export { type ClassNameMap, type ElementChildren, type ElementDataset, type ElementOptions, type ElementProps, type ElementStyle, type ElementValue, type FunctionComponent, JSX, type Modifier, type ObjectWritableProps, type ReadonlyKeys, type StubElement, type Style, type StyleDeclaration, type VariableOrValue, type WritableKeys, a, abbr, addModifier, addTagModifier, address, applyModification, area, article, aside, audio, b, base, bdi, bdo, blockquote, body, br, button, canvas, caption, cite, code, col, colgroup, data, datalist, dd, del, details, dfn, dialog, div, dl, dt, element, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, head, header, hgroup, hr, html, i, iframe, img, input, ins, jsx, jsxDEV, jsxs, kbd, label, legend, li, link, main, map, mark, menu, meta, meter, nav, noscript, object, ol, optgroup, option, output, p, picture, pre, progress, q, render, renderJsx, rp, rt, ruby, s, samp, script, search, section, select, slot, small, source, span, strong, style, sub, summary, sup, table, tbody, td, template, text, textarea, tfoot, th, thead, time, title, tr, track, u, ul, var_, video, wbr };
