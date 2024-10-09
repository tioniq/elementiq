import { makeClassStyles } from "@/styles/index.js";

export const buttonStyles = makeClassStyles({
  button: {
    transitionProperty: "color transform background-color border-color border",
    transitionTimingFunction: "ease-in-out",
    cursor: "pointer",
    userSelect: "none",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "medium",
    transitionDuration: "0.15s",
    borderRadius: "0.76rem",
    textTransform: "none",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
    border: "0 solid transparent",
  },
  "button:active": {
    scale: "0.95",
  },
  "button:focus": {
    outlineWidth: "2px",
  },
  "button:disabled": {
    pointerEvents: "none",
    opacity: "0.5",
  },
  "button-size-normal": {
    padding: "0.375rem 0.75rem",
    fontSize: "1rem",
    lineHeight: "1.5",
    height: "2.5rem",
    borderRadius: "0.25rem",
  },
  "button-size-small": {
    padding: "0.25rem 0.5rem",
    fontSize: "0.875rem",
    lineHeight: "1.5",
    height: "1.75rem",
    borderRadius: "0.2rem",
  },
  "button-size-large": {
    padding: "0.5rem 1rem",
    fontSize: "1.25rem",
    lineHeight: "1.5",
    height: "3.5rem",
    borderRadius: "0.3rem",
  },
  buttonGhost: {},
  "buttonGhost:hover": {
    backgroundColor: "#282828"
  },
})