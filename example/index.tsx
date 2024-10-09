import { createVar, Var, Vary } from "@tioniq/eventiq"
import { Button, ElementChildren, render } from "@tioniq/elementiq"

function AnotherView() {
  return <span>
    Hello, you tapped:
  </span>
}

function View() {
  const count = createVar(0)
  const variants: Array<keyof Button.Variant> = ["normal", "primary", "secondary", "success", "error", "warning", "info"]
  const appearances: Array<keyof Button.Appearance> = ["normal", "solid", "outline", "link", "ghost"]
  const variant = createVar<keyof Button.Variant>("normal")
  const appearance = createVar<keyof Button.Appearance>("normal")
  const dynamicElements: Vary<ElementChildren> = createVar<ElementChildren>([])
  return <div>
    <AnotherView/>
    <span>
      {count.map(c => c % 10 === 0 ? <span>Wow!</span> : c.toString())}
      {" "} times. {" "}{count.map(c => "Next: " + (c + 1))}
    </span>
    <br/>
    <Button variant={variant} appearance={appearance} onClick={() => {
      count.value += 1
    }}>
      Click me
    </Button>
    <Button variant={variant} appearance={appearance} disabled>Disabled</Button>
    <br/>
    <br/>
    {variants.map(v => (<Button variant={v} onClick={() => variant.value = v}>{v}</Button>))}
    <br/>
    {appearances.map(a => (<Button appearance={a} onClick={() => appearance.value = a}>{a}</Button>))}
    <br/>
    {dynamicElements}
    <br/>
    <Button onClick={() => {
      const startTime = performance.now()
      const random = Math.random() * 1_000_000
      dynamicElements.value = [dynamicElements.value, <Button>Dynamic {random.toString()}</Button>]
      console.info("Dynamic elements", dynamicElements.value)
      console.log("Dynamic elements change time:", performance.now() - startTime, "ms")
    }}>
      Add dynamic element
    </Button>
  </div>
}

window.onload = () => {
  let startTime = performance.now()
  render(View, document.body)
  console.log("Render time:", performance.now() - startTime, "ms")
  startTime = performance.now()
  render(AnotherView, document.body)
  console.log("Render 2 time:", performance.now() - startTime, "ms")
}