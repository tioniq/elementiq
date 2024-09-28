import {ElementOptions} from "../types/element"
import {element} from "../element/element"

export function text(text: string): Text {
  return document.createTextNode(text)
}

export function a(options?: ElementOptions<HTMLAnchorElement>): HTMLAnchorElement {
  return element("a", options)
}

export function abbr(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("abbr", options)
}

export function address(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("address", options)
}

export function area(options?: ElementOptions<HTMLAreaElement>): HTMLElement {
  return element("area", options)
}

export function article(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("article", options)
}

export function aside(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("aside", options)
}

export function audio(options?: ElementOptions<HTMLAudioElement>): HTMLAudioElement {
  return element("audio", options)
}

export function b(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("b", options)
}

export function base(options?: ElementOptions<HTMLBaseElement>): HTMLBaseElement {
  return element("base", options)
}

export function bdi(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("bdi", options)
}

export function bdo(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("bdo", options)
}

export function blockquote(options?: ElementOptions<HTMLQuoteElement>): HTMLQuoteElement {
  return element("blockquote", options)
}

export function body(options?: ElementOptions<HTMLBodyElement>): HTMLBodyElement {
  return element("body", options)
}

export function br(options?: ElementOptions<HTMLBRElement>): HTMLBRElement {
  return element("br", options)
}

export function button(options?: ElementOptions<HTMLButtonElement>): HTMLButtonElement {
  return element("button", options)
}

export function canvas(options?: ElementOptions<HTMLCanvasElement>): HTMLCanvasElement {
  return element("canvas", options)
}

export function caption(options?: ElementOptions<HTMLTableCaptionElement>): HTMLTableCaptionElement {
  return element("caption", options)
}

export function cite(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("cite", options)
}

export function code(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("code", options)
}

export function col(options?: ElementOptions<HTMLTableColElement>): HTMLTableColElement {
  return element("col", options)
}

export function colgroup(options?: ElementOptions<HTMLTableColElement>): HTMLTableColElement {
  return element("colgroup", options)
}

export function data(options?: ElementOptions<HTMLDataElement>): HTMLDataElement {
  return element("data", options)
}

export function datalist(options?: ElementOptions<HTMLDataListElement>): HTMLDataListElement {
  return element("datalist", options)
}

export function dd(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("dd", options)
}

export function del(options?: ElementOptions<HTMLModElement>): HTMLModElement {
  return element("del", options)
}

export function details(options?: ElementOptions<HTMLDetailsElement>): HTMLDetailsElement {
  return element("details", options)
}

export function dfn(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("dfn", options)
}

export function dialog(options?: ElementOptions<HTMLDialogElement>): HTMLDialogElement {
  return element("dialog", options)
}

export function div(options?: ElementOptions<HTMLDivElement>): HTMLDivElement {
  return element("div", options)
}

export function dl(options?: ElementOptions<HTMLDListElement>): HTMLDListElement {
  return element("dl", options)
}

export function dt(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("dt", options)
}

export function em(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("em", options)
}

export function embed(options?: ElementOptions<HTMLEmbedElement>): HTMLEmbedElement {
  return element("embed", options)
}

export function fieldset(options?: ElementOptions<HTMLFieldSetElement>): HTMLFieldSetElement {
  return element("fieldset", options)
}

export function figcaption(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("figcaption", options)
}

export function figure(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("figure", options)
}

export function footer(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("footer", options)
}

export function form(options?: ElementOptions<HTMLFormElement>): HTMLFormElement {
  return element("form", options)
}

export function h1(options?: ElementOptions<HTMLHeadingElement>): HTMLHeadingElement {
  return element("h1", options)
}

export function h2(options?: ElementOptions<HTMLHeadingElement>): HTMLHeadingElement {
  return element("h2", options)
}

export function h3(options?: ElementOptions<HTMLHeadingElement>): HTMLHeadingElement {
  return element("h3", options)
}

export function h4(options?: ElementOptions<HTMLHeadingElement>): HTMLHeadingElement {
  return element("h4", options)
}

export function h5(options?: ElementOptions<HTMLHeadingElement>): HTMLHeadingElement {
  return element("h5", options)
}

export function h6(options?: ElementOptions<HTMLHeadingElement>): HTMLHeadingElement {
  return element("h6", options)
}

export function head(options?: ElementOptions<HTMLHeadElement>): HTMLHeadElement {
  return element("head", options)
}

export function header(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("header", options)
}

export function hgroup(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("hgroup", options)
}

export function hr(options?: ElementOptions<HTMLHRElement>): HTMLHRElement {
  return element("hr", options)
}

export function html(options?: ElementOptions<HTMLHtmlElement>): HTMLHtmlElement {
  return element("html", options)
}

export function i(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("i", options)
}

export function iframe(options?: ElementOptions<HTMLIFrameElement>): HTMLIFrameElement {
  return element("iframe", options)
}

export function img(options?: ElementOptions<HTMLImageElement>): HTMLImageElement {
  return element("img", options)
}

export function input(options?: ElementOptions<HTMLInputElement>): HTMLInputElement {
  return element("input", options)
}

export function ins(options?: ElementOptions<HTMLModElement>): HTMLModElement {
  return element("ins", options)
}

export function kbd(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("kbd", options)
}

export function label(options?: ElementOptions<HTMLLabelElement>): HTMLLabelElement {
  return element("label", options)
}

export function legend(options?: ElementOptions<HTMLLegendElement>): HTMLLegendElement {
  return element("legend", options)
}

export function li(options?: ElementOptions<HTMLLIElement>): HTMLLIElement {
  return element("li", options)
}

export function link(options?: ElementOptions<HTMLLinkElement>): HTMLLinkElement {
  return element("link", options)
}

export function main(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("main", options)
}

export function map(options?: ElementOptions<HTMLMapElement>): HTMLMapElement {
  return element("map", options)
}

export function mark(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("mark", options)
}

export function menu(options?: ElementOptions<HTMLMenuElement>): HTMLMenuElement {
  return element("menu", options)
}

export function meta(options?: ElementOptions<HTMLMetaElement>): HTMLMetaElement {
  return element("meta", options)
}

export function meter(options?: ElementOptions<HTMLMeterElement>): HTMLMeterElement {
  return element("meter", options)
}

export function nav(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("nav", options)
}

export function noscript(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("noscript", options)
}

export function object(options?: ElementOptions<HTMLObjectElement>): HTMLObjectElement {
  return element("object", options)
}

export function ol(options?: ElementOptions<HTMLOListElement>): HTMLOListElement {
  return element("ol", options)
}

export function optgroup(options?: ElementOptions<HTMLOptGroupElement>): HTMLOptGroupElement {
  return element("optgroup", options)
}

export function option(options?: ElementOptions<HTMLOptionElement>): HTMLOptionElement {
  return element("option", options)
}

export function output(options?: ElementOptions<HTMLOutputElement>): HTMLOutputElement {
  return element("output", options)
}

export function p(options?: ElementOptions<HTMLParagraphElement>): HTMLParagraphElement {
  return element("p", options)
}

export function picture(options?: ElementOptions<HTMLPictureElement>): HTMLPictureElement {
  return element("picture", options)
}

export function pre(options?: ElementOptions<HTMLPreElement>): HTMLPreElement {
  return element("pre", options)
}

export function progress(options?: ElementOptions<HTMLProgressElement>): HTMLProgressElement {
  return element("progress", options)
}

export function q(options?: ElementOptions<HTMLQuoteElement>): HTMLQuoteElement {
  return element("q", options)
}

export function rp(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("rp", options)
}

export function rt(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("rt", options)
}

export function ruby(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("ruby", options)
}

export function s(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("s", options)
}

export function samp(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("samp", options)
}

export function script(options?: ElementOptions<HTMLScriptElement>): HTMLScriptElement {
  return element("script", options)
}

export function search(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("search", options)
}

export function section(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("section", options)
}

export function select(options?: ElementOptions<HTMLSelectElement>): HTMLSelectElement {
  return element("select", options)
}

export function slot(options?: ElementOptions<HTMLSlotElement>): HTMLSlotElement {
  return element("slot", options)
}

export function small(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("small", options)
}

export function source(options?: ElementOptions<HTMLSourceElement>): HTMLSourceElement {
  return element("source", options)
}

export function span(options?: ElementOptions<HTMLSpanElement>): HTMLSpanElement {
  return element("span", options)
}

export function strong(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("strong", options)
}

export function style(options?: ElementOptions<HTMLStyleElement>): HTMLStyleElement {
  return element("style", options)
}

export function sub(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("sub", options)
}

export function summary(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("summary", options)
}

export function sup(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("sup", options)
}

export function table(options?: ElementOptions<HTMLTableElement>): HTMLTableElement {
  return element("table", options)
}

export function tbody(options?: ElementOptions<HTMLTableSectionElement>): HTMLTableSectionElement {
  return element("tbody", options)
}

export function td(options?: ElementOptions<HTMLTableCellElement>): HTMLTableCellElement {
  return element("td", options)
}

export function template(options?: ElementOptions<HTMLTemplateElement>): HTMLTemplateElement {
  return element("template", options)
}

export function textarea(options?: ElementOptions<HTMLTextAreaElement>): HTMLTextAreaElement {
  return element("textarea", options)
}

export function tfoot(options?: ElementOptions<HTMLTableSectionElement>): HTMLTableSectionElement {
  return element("tfoot", options)
}

/**
 * @deprecated
 */
export function th(options?: ElementOptions<HTMLTableHeaderCellElement>): HTMLTableHeaderCellElement {
  return element("th", options)
}

export function thead(options?: ElementOptions<HTMLTableSectionElement>): HTMLTableSectionElement {
  return element("thead", options)
}

export function time(options?: ElementOptions<HTMLTimeElement>): HTMLTimeElement {
  return element("time", options)
}

export function title(options?: ElementOptions<HTMLTitleElement>): HTMLTitleElement {
  return element("title", options)
}

export function tr(options?: ElementOptions<HTMLTableRowElement>): HTMLTableRowElement {
  return element("tr", options)
}

export function track(options?: ElementOptions<HTMLTrackElement>): HTMLTrackElement {
  return element("track", options)
}

export function u(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("u", options)
}

export function ul(options?: ElementOptions<HTMLUListElement>): HTMLUListElement {
  return element("ul", options)
}

export function var_(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("var", options)
}

export function video(options?: ElementOptions<HTMLVideoElement>): HTMLVideoElement {
  return element("video", options)
}

export function wbr(options?: ElementOptions<HTMLElement>): HTMLElement {
  return element("wbr", options)
}
