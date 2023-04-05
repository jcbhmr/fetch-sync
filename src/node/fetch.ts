import RequestSync from "../RequestSync.ts";
import ResponseSync from "../ResponseSync.ts";

if (typeof fetch === "undefined") {
  const undici = await import("undici");
  globalThis.fetch = undici.fetch;
  globalThis.Request = undici.Request;
  globalThis.Response = undici.Response;
  globalThis.Headers = undici.Headers;
}

if (typeof Worker === "undefined") {
  const { default: Worker } = import("web-worker");
  globalThis.Worker = Worker;
}

// Don't worry! SharedArrayBuffer is available un-flagged in Node.js. It's the
// browser environments where it's complicated.
const int32Array = new Int32Array(1 + 1024);
const sharedArrayBuffer = new SharedArrayBuffer(int32Array);

const fetchWorker = new Worker(new URL("fetch-worker.ts", import.meta.url), {
  type: "module",
});
fetchWorker.postMessage({ type: "load", sharedArrayBuffer }, [
  sharedArrayBuffer,
]);

function read(): Uint8Array {
  Atomics.wait(int32Array, 0, +true);
  const chunk = new Uint8Array(int32Array.slice(4).buffer);
  int32Array[0] = +false;
  Atomics.notify(int32Array, 0);
  return chunk;
}

function fetch(input: RequestInfo, init: RequestInit = {}): ResponseSync {
  let requestSync: RequestSync;
  if (input instanceof RequestSync) {
    requestSync = input;
  } else {
    requestSync = new RequestSync(input, init);
  }

  if (requestSync.signal.aborted) {
    throw requestSync.signal.reason;
  }

  fetchWorker.postMessage({ type: "fetch", requestSync });
  
}
