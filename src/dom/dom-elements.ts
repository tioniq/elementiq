import type { ElementOptions, ElementValue } from "@/types/element.ts"
import { element } from "@/element/index.ts"

export function text(text: string): Text {
  return document.createTextNode(text)
}

export function a(
  options?: ElementOptions<HTMLAnchorElement>,
): ElementValue<HTMLAnchorElement> {
  return element("a", options)
}

export function abbr(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("abbr", options)
}

export function address(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("address", options)
}

export function area(
  options?: ElementOptions<HTMLAreaElement>,
): ElementValue<HTMLElement> {
  return element("area", options)
}

export function article(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("article", options)
}

export function aside(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("aside", options)
}

export function audio(
  options?: ElementOptions<HTMLAudioElement>,
): ElementValue<HTMLAudioElement> {
  return element("audio", options)
}

export function b(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("b", options)
}

export function base(
  options?: ElementOptions<HTMLBaseElement>,
): ElementValue<HTMLBaseElement> {
  return element("base", options)
}

export function bdi(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("bdi", options)
}

export function bdo(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("bdo", options)
}

export function blockquote(
  options?: ElementOptions<HTMLQuoteElement>,
): ElementValue<HTMLQuoteElement> {
  return element("blockquote", options)
}

export function body(
  options?: ElementOptions<HTMLBodyElement>,
): ElementValue<HTMLBodyElement> {
  return element("body", options)
}

export function br(
  options?: ElementOptions<HTMLBRElement>,
): ElementValue<HTMLBRElement> {
  return element("br", options)
}

export function button(
  options?: ElementOptions<HTMLButtonElement>,
): ElementValue<HTMLButtonElement> {
  return element("button", options)
}

export function canvas(
  options?: ElementOptions<HTMLCanvasElement>,
): ElementValue<HTMLCanvasElement> {
  return element("canvas", options)
}

export function caption(
  options?: ElementOptions<HTMLTableCaptionElement>,
): ElementValue<HTMLTableCaptionElement> {
  return element("caption", options)
}

export function cite(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("cite", options)
}

export function code(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("code", options)
}

export function col(
  options?: ElementOptions<HTMLTableColElement>,
): ElementValue<HTMLTableColElement> {
  return element("col", options)
}

export function colgroup(
  options?: ElementOptions<HTMLTableColElement>,
): ElementValue<HTMLTableColElement> {
  return element("colgroup", options)
}

export function data(
  options?: ElementOptions<HTMLDataElement>,
): ElementValue<HTMLDataElement> {
  return element("data", options)
}

export function datalist(
  options?: ElementOptions<HTMLDataListElement>,
): ElementValue<HTMLDataListElement> {
  return element("datalist", options)
}

export function dd(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("dd", options)
}

export function del(
  options?: ElementOptions<HTMLModElement>,
): ElementValue<HTMLModElement> {
  return element("del", options)
}

export function details(
  options?: ElementOptions<HTMLDetailsElement>,
): ElementValue<HTMLDetailsElement> {
  return element("details", options)
}

export function dfn(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("dfn", options)
}

export function dialog(
  options?: ElementOptions<HTMLDialogElement>,
): ElementValue<HTMLDialogElement> {
  return element("dialog", options)
}

export function div(
  options?: ElementOptions<HTMLDivElement>,
): ElementValue<HTMLDivElement> {
  return element("div", options)
}

export function dl(
  options?: ElementOptions<HTMLDListElement>,
): ElementValue<HTMLDListElement> {
  return element("dl", options)
}

export function dt(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("dt", options)
}

export function em(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("em", options)
}

export function embed(
  options?: ElementOptions<HTMLEmbedElement>,
): ElementValue<HTMLEmbedElement> {
  return element("embed", options)
}

export function fieldset(
  options?: ElementOptions<HTMLFieldSetElement>,
): ElementValue<HTMLFieldSetElement> {
  return element("fieldset", options)
}

export function figcaption(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("figcaption", options)
}

export function figure(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("figure", options)
}

export function footer(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("footer", options)
}

export function form(
  options?: ElementOptions<HTMLFormElement>,
): ElementValue<HTMLFormElement> {
  return element("form", options)
}

export function h1(
  options?: ElementOptions<HTMLHeadingElement>,
): ElementValue<HTMLHeadingElement> {
  return element("h1", options)
}

export function h2(
  options?: ElementOptions<HTMLHeadingElement>,
): ElementValue<HTMLHeadingElement> {
  return element("h2", options)
}

export function h3(
  options?: ElementOptions<HTMLHeadingElement>,
): ElementValue<HTMLHeadingElement> {
  return element("h3", options)
}

export function h4(
  options?: ElementOptions<HTMLHeadingElement>,
): ElementValue<HTMLHeadingElement> {
  return element("h4", options)
}

export function h5(
  options?: ElementOptions<HTMLHeadingElement>,
): ElementValue<HTMLHeadingElement> {
  return element("h5", options)
}

export function h6(
  options?: ElementOptions<HTMLHeadingElement>,
): ElementValue<HTMLHeadingElement> {
  return element("h6", options)
}

export function head(
  options?: ElementOptions<HTMLHeadElement>,
): ElementValue<HTMLHeadElement> {
  return element("head", options)
}

export function header(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("header", options)
}

export function hgroup(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("hgroup", options)
}

export function hr(
  options?: ElementOptions<HTMLHRElement>,
): ElementValue<HTMLHRElement> {
  return element("hr", options)
}

export function html(
  options?: ElementOptions<HTMLHtmlElement>,
): ElementValue<HTMLHtmlElement> {
  return element("html", options)
}

export function i(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("i", options)
}

export function iframe(
  options?: ElementOptions<HTMLIFrameElement>,
): ElementValue<HTMLIFrameElement> {
  return element("iframe", options)
}

export function img(
  options?: ElementOptions<HTMLImageElement>,
): ElementValue<HTMLImageElement> {
  return element("img", options)
}

export function input(
  options?: ElementOptions<HTMLInputElement>,
): ElementValue<HTMLInputElement> {
  return element("input", options)
}

export function ins(
  options?: ElementOptions<HTMLModElement>,
): ElementValue<HTMLModElement> {
  return element("ins", options)
}

export function kbd(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("kbd", options)
}

export function label(
  options?: ElementOptions<HTMLLabelElement>,
): ElementValue<HTMLLabelElement> {
  return element("label", options)
}

export function legend(
  options?: ElementOptions<HTMLLegendElement>,
): ElementValue<HTMLLegendElement> {
  return element("legend", options)
}

export function li(
  options?: ElementOptions<HTMLLIElement>,
): ElementValue<HTMLLIElement> {
  return element("li", options)
}

export function link(
  options?: ElementOptions<HTMLLinkElement>,
): ElementValue<HTMLLinkElement> {
  return element("link", options)
}

export function main(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("main", options)
}

export function map(
  options?: ElementOptions<HTMLMapElement>,
): ElementValue<HTMLMapElement> {
  return element("map", options)
}

export function mark(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("mark", options)
}

export function menu(
  options?: ElementOptions<HTMLMenuElement>,
): ElementValue<HTMLMenuElement> {
  return element("menu", options)
}

export function meta(
  options?: ElementOptions<HTMLMetaElement>,
): ElementValue<HTMLMetaElement> {
  return element("meta", options)
}

export function meter(
  options?: ElementOptions<HTMLMeterElement>,
): ElementValue<HTMLMeterElement> {
  return element("meter", options)
}

export function nav(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("nav", options)
}

export function noscript(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("noscript", options)
}

export function object(
  options?: ElementOptions<HTMLObjectElement>,
): ElementValue<HTMLObjectElement> {
  return element("object", options)
}

export function ol(
  options?: ElementOptions<HTMLOListElement>,
): ElementValue<HTMLOListElement> {
  return element("ol", options)
}

export function optgroup(
  options?: ElementOptions<HTMLOptGroupElement>,
): ElementValue<HTMLOptGroupElement> {
  return element("optgroup", options)
}

export function option(
  options?: ElementOptions<HTMLOptionElement>,
): ElementValue<HTMLOptionElement> {
  return element("option", options)
}

export function output(
  options?: ElementOptions<HTMLOutputElement>,
): ElementValue<HTMLOutputElement> {
  return element("output", options)
}

export function p(
  options?: ElementOptions<HTMLParagraphElement>,
): ElementValue<HTMLParagraphElement> {
  return element("p", options)
}

export function picture(
  options?: ElementOptions<HTMLPictureElement>,
): ElementValue<HTMLPictureElement> {
  return element("picture", options)
}

export function pre(
  options?: ElementOptions<HTMLPreElement>,
): ElementValue<HTMLPreElement> {
  return element("pre", options)
}

export function progress(
  options?: ElementOptions<HTMLProgressElement>,
): ElementValue<HTMLProgressElement> {
  return element("progress", options)
}

export function q(
  options?: ElementOptions<HTMLQuoteElement>,
): ElementValue<HTMLQuoteElement> {
  return element("q", options)
}

export function rp(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("rp", options)
}

export function rt(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("rt", options)
}

export function ruby(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("ruby", options)
}

export function s(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("s", options)
}

export function samp(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("samp", options)
}

export function script(
  options?: ElementOptions<HTMLScriptElement>,
): ElementValue<HTMLScriptElement> {
  return element("script", options)
}

export function search(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("search", options)
}

export function section(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("section", options)
}

export function select(
  options?: ElementOptions<HTMLSelectElement>,
): ElementValue<HTMLSelectElement> {
  return element("select", options)
}

export function slot(
  options?: ElementOptions<HTMLSlotElement>,
): ElementValue<HTMLSlotElement> {
  return element("slot", options)
}

export function small(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("small", options)
}

export function source(
  options?: ElementOptions<HTMLSourceElement>,
): ElementValue<HTMLSourceElement> {
  return element("source", options)
}

export function span(
  options?: ElementOptions<HTMLSpanElement>,
): ElementValue<HTMLSpanElement> {
  return element("span", options)
}

export function strong(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("strong", options)
}

export function style(
  options?: ElementOptions<HTMLStyleElement>,
): ElementValue<HTMLStyleElement> {
  return element("style", options)
}

export function sub(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("sub", options)
}

export function summary(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("summary", options)
}

export function sup(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("sup", options)
}

export function table(
  options?: ElementOptions<HTMLTableElement>,
): ElementValue<HTMLTableElement> {
  return element("table", options)
}

export function tbody(
  options?: ElementOptions<HTMLTableSectionElement>,
): ElementValue<HTMLTableSectionElement> {
  return element("tbody", options)
}

export function td(
  options?: ElementOptions<HTMLTableCellElement>,
): ElementValue<HTMLTableCellElement> {
  return element("td", options)
}

export function template(
  options?: ElementOptions<HTMLTemplateElement>,
): ElementValue<HTMLTemplateElement> {
  return element("template", options)
}

export function textarea(
  options?: ElementOptions<HTMLTextAreaElement>,
): ElementValue<HTMLTextAreaElement> {
  return element("textarea", options)
}

export function tfoot(
  options?: ElementOptions<HTMLTableSectionElement>,
): ElementValue<HTMLTableSectionElement> {
  return element("tfoot", options)
}

export function th(
  options?: ElementOptions<HTMLTableCellElement>,
): ElementValue<HTMLTableCellElement> {
  return element("th", options)
}

export function thead(
  options?: ElementOptions<HTMLTableSectionElement>,
): ElementValue<HTMLTableSectionElement> {
  return element("thead", options)
}

export function time(
  options?: ElementOptions<HTMLTimeElement>,
): ElementValue<HTMLTimeElement> {
  return element("time", options)
}

export function title(
  options?: ElementOptions<HTMLTitleElement>,
): ElementValue<HTMLTitleElement> {
  return element("title", options)
}

export function tr(
  options?: ElementOptions<HTMLTableRowElement>,
): ElementValue<HTMLTableRowElement> {
  return element("tr", options)
}

export function track(
  options?: ElementOptions<HTMLTrackElement>,
): ElementValue<HTMLTrackElement> {
  return element("track", options)
}

export function u(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("u", options)
}

export function ul(
  options?: ElementOptions<HTMLUListElement>,
): ElementValue<HTMLUListElement> {
  return element("ul", options)
}

export function var_(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("var", options)
}

export function video(
  options?: ElementOptions<HTMLVideoElement>,
): ElementValue<HTMLVideoElement> {
  return element("video", options)
}

export function wbr(
  options?: ElementOptions<HTMLElement>,
): ElementValue<HTMLElement> {
  return element("wbr", options)
}

export const elements = {
  rootElement: {
    html,
  },
  metadataAndScripting: {
    head,
    title,
    meta,
    base,
    link,
    style,
    noscript,
    script,
  },
  embeddingContent: {
    img,
    area,
    map,
    embed,
    object,
    source,
    iframe,
    canvas,
    track,
    audio,
    video,
  },
  textLevelSemantics: {
    span,
    a,
    rt,
    dfn,
    em,
    i,
    small,
    ins,
    s,
    rp,
    abbr,
    time,
    b,
    strong,
    del,
    kbd,
    q,
    var_,
    sub,
    mark,
    bdi,
    wbr,
    cite,
    samp,
    sup,
    ruby,
    bdo,
    code,
  },
  groupingContent: {
    div,
    pre,
    br,
    p,
    blockquote,
    hr,
    ol,
    dl,
    figcaption,
    ul,
    dt,
    figure,
    li,
    dd,
  },
  forms: {
    form,
    fieldset,
    meter,
    select,
    legend,
    optgroup,
    label,
    option,
    datalist,
    input,
    output,
    textarea,
    button,
    progress,
  },
  documentSections: {
    body,
    h1,
    section,
    aside,
    h2,
    header,
    address,
    h3,
    nav,
    h4,
    article,
    h5,
    footer,
    h6,
    hgroup,
  },
  tabularData: {
    table,
    col,
    tbody,
    colgroup,
    tr,
    caption,
    td,
    thead,
    th,
    tfoot,
  },
  interactiveElements: {
    menu,
    summary,
    details,
  },
}
