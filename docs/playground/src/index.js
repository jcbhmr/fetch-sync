import { h, Component, render } from "https://esm.sh/preact";
import { useState } from "https://esm.sh/preact/hooks";
import htm from "https://esm.sh/htm";

const html = htm.bind(h);

function App() {
  return html`<>
    <h1>Hello world!</h1>
  </>`;
}

const root = document.getElementById("root");
render(html`<${App} />`, root);
