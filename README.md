# Synchronous `fetch()`

⏱ Synchronous wrapper around the `fetch()` API

<div align="center">

</div>

🖥️ Works in Node.js using subprocess RPC \
👨‍🏭 Works great in web `Worker` threads! \
⚛️ Perfect for WebAssembly \
💻 Works in the browser using [`XMLHttpRequest`]

## Installation

You can use this with both Node.js and the browser! If you're using a bundler
like [Vite] or [webpack], you can install it using npm. If you're importing it
live in your browser, you can use an npm CDN like [ESM>CDN] or [jsDelivr].

```sh
npm install sync-fetch
```

```js
import {} from "https://esm.sh/@jcbhmr/fetch-sync";
```

## Usage

⚠️ It is **not recommended** to use this in a browser on the main UI thread!
`fetchSync()` is great for `Worker` threads, but you don't want to block your user's click events in the UI.

The API of this package is almost identical to the regular `fetch()` API. The only differences are the `.json()` and friends getters and the `fetch()` function itself. These functions will all return the raw value instead of a `Promise` instance.

```js
import { fetchSync, RequestSync, ResponseSync } from "@jcbhmr/fetch-sync";

// Note the lack of async/await!
const response = fetchSync("https://jsonplaceholder.typicode.com/todos/1");
const json = response.json();
console.log(json);
//=> { "userId": 1, "id": 1, "title": "delectus aut autem", "completed": false }

const text = fetchSync("https://api.ipify.org/").text();
console.log(text);
//=> '100.100.100.100'
```

Here's an example of using C ➡️ WASM and `fetchSync()` to make a basic `GET()`
function.

```c
void println(char* messagePointer, int messageLength);
char* GET(char* urlPointer, int urlLength, char* bodyTarget);

int main() {
  char urlPointer[] = "https://example.org/";
  int urlLength = sizeof(url);
  println(urlPointer, urlLength);

  char* bodyPointer;
  int bodyLength = GET(urlPointer, urlLength, bodyPointer);
  println(bodyPointer, bodyLength);
}
```

💡 You can compile this C code to WASM using [WasmFiddle]. Just make sure you
download the `.wasm` file, not the `.wat` file!

```js
function GET(urlPointer, urlLength, bodyPointer) {
  const urlBytes = new Uint8Array(memory, urlPointer, urlLength);
  const url = new TextDecoder().decode(urlBytes);

  // 🎉 Look at this cool SYNCHRONOUS network activity!
  const response = fetchSync(url);
  const body = response.arrayBuffer();

  const bodyBytes = new Uint8Array(body);
  memoryBytes.set(bodyBytes, 1000);

  return bodyBytes.byteLength;
}

function println(messagePointer, messageLength) {
  const messageBytes = new Uint8Array(memory, messagePointer, messageLength);
  const message = new TextDecoder().decode(messageBytes);

  console.log(message);
}

const imports = {
  env: { GET, println }
};
const { instance } = WebAssembly.instantiateStreaming(fetch("example.wasm"), imports);
const { main, memory } = instance.exports
const memoryBytes = new Uint8Array(memory.buffer);
main();
```

[WasmFiddle]: https://wasdk.github.io/WasmFiddle/


## Limitations

### Node.js

  - Does not support `Stream`s (or `FormData`) as input bodies since they cannot be read or serialized synchronously
  - Does not support `Blob`s as input bodies since they're too complex
  - Does not support the non-spec `agent` option as its value cannot be serialized

### Browser

  - Does not support most options, since `XMLHttpRequest` is pretty limited. Supported are:
    - `method`
    - `body`
    - `headers`
    - `credentials` (but not `omit`)
    - (Non-spec) `timeout`
  - Does not support [binary responses in the main thread](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType#Synchronous_XHR_restrictions)
  - CORS limitations apply, of course (note they may be stricter for synchronous requests)
