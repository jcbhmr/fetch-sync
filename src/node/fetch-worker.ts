import FetchSerializer from "./FetchSerializer.ts";
import SimpleEvent from "./SimpleEvent.ts";

if (typeof fetch === "undefined") {
  const undici = await import("undici");
  globalThis.fetch = undici.fetch;
  globalThis.Request = undici.Request;
  globalThis.Response = undici.Response;
  globalThis.Headers = undici.Headers;
}

let sharedArrayBuffer: SharedArrayBuffer | null = null;
let int32Array: Int32Array | null = null;

function handleLoad(event: SimpleEvent): any {
  sharedArrayBuffer = event.sharedArrayBuffer;
  int32Array = new Int32Array(sharedArrayBuffer);
}

async function write(value: any): Promise<void> {
  const s = new FetchSerializer();
  s.writeHeader();
  s.writeValue(value);
  const b = s.releaseBuffer();

  for (let i = 0; i < b.length; i += int32Array.byteLength - 4) {
    const chunk = b.subarray(i, int32Array.byteLength - 4);

    int32Array!.set(chunk, 4);
    int32Array[0] = +true;
    Atomics.notify(int32Array, 0);

    await Atomics.waitAsync(int32Array, 0, +false);
  }
}

async function handleFetch(event: SimpleEvent): Promise<any> {
  const request = new Request(event.requestSync.url, event.requestSync);
  let responseSync: ResponseSync | null;
  let error: Error | null;
  try {
    const response = await fetch(request);
    if (response.body) {
      responseSync = new ResponseSync(await response.arrayBuffer(), response);
    } else {
      responseSync = new ResponseSync(null, response);
    }
  } catch (e) {
    error = e;
  }

  await write(responseSync ?? error);
}

globalThis.addEventListener("message", (event) => {
  if (event.data?.type === "load") {
    handleLoad(event as SimpleEvent);
  } else if (event.data?.type === "fetch") {
    handleFetch(event as SimpleEvent);
  }
});
