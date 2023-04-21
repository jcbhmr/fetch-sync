function GET(urlPointer, urlLength) {
  const urlBytes = new Uint8Array(memory.buffer, urlPointer, urlLength);
  const url = new TextDecoder().decode(urlBytes);

  // 🎉 Look at this cool SYNCHRONOUS network activity!
  const response = fetchSync(url);
  const body = response.arrayBuffer();
  const bodyBytes = new Uint8Array(body);

  memoryBytes.set(bodyBytes, 1000);

  return bodyBytes.byteLength;
}

function println(messagePointer, messageLength) {
  const messageBytes = new Uint8Array(
    memory.buffer,
    messagePointer,
    messageLength
  );
  const message = new TextDecoder().decode(messageBytes);

  console.log(message);
}

const imports = {
  env: { GET, println },
};

const wasm = await new Promise((resolve, reject) => {
  const controller = new AbortController();
  const { signal } = controller;
  globalThis.addEventListener(
    "message",
    (event) => {
      if (event.data?.type === "wasm") {
        resolve(event.data.data);
      }
    },
    { signal }
  );
});

const module = new WebAssembly.Module(wasm);
const instance = new WebAssembly.Instance(module);
const { main, memory } = instance.exports;
const memoryBytes = new Uint8Array(memory.buffer);

const exitCode = main();
if (exitCode !== 0) {
  console.warn(`WASM exited with code ${exitCode}`);
}
