import RequestSync from "../RequestSync.ts";
import ResponseSync from "../ResponseSync.ts";
import { createSyncFn } from 'synckit'

function fetchSync(input: RequestInfo, init: RequestInit = {}): ResponseSync {
  let requestSync: RequestSync;
  if (arguments.length === 1 && input instanceof RequestSync) {
    requestSync = input;
  } else {
    requestSync = new RequestSync(input, init);
  }

  requestSync.signal.throwIfAborted()

  const { } = createSyncFn(async ({ }) => {
    if (typeof fetch === "undefined") {
      const undici = await import("undici");
      globalThis.fetch = undici.fetch;
      globalThis.Request = undici.Request;
      globalThis.Response = undici.Response;
      globalThis.Headers = undici.Headers;
      globalThis.FormData = undici.FormData;
    }
  })({  })

  return responseSync;
}

export default fetchSync;
