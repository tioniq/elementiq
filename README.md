# Elementiq

**Elementiq** is a simple and lightweight library for building web applications using JSX (or without) and reactive
programming.
The package is still in alpha stage and is not recommended for production use.

## Installation

```bash  
npm install @tioniq/elementiq
```

## Required setup

Set the following options in your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "...": "...",
    "jsx": "react-jsx",
    "jsxImportSource": "@tioniq/elementiq"
  }
}

```

## Basic Usage

```typescript jsx
import {createVar} from "@tioniq/eventiq"
import {render} from "@tioniq/elementiq"

function AnotherView() {
  return <span>
    Tapped count: 
  </span>
}

function View() {
  const count = createVar(0)
  return <div>
    <AnotherView/>
    <span>
      {count.map(c => c.toString())}
    </span>
    <button
      onClick={() => {
        count.value += 1
      }}>Tap
    </button>
  </div>
}

window.onload = () => {
  render(<View/>, document.body)
}
```