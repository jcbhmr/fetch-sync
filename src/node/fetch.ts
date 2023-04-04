import Request, { request } from "./Request.ts";
import Worker from "web-worker";

// Don't worry! SharedArrayBuffer is available un-flagged in Node.js. It's the
// browser environments where it's complicated.
const signalBuffer = new Int32Array(1);
const sharedSigna = new SharedArrayBuffer(signalBuffer);

const workerFetch = new Worker(new URL("worker-fetch.ts", import.meta.url));
workerFetch.postMessage({ type: "load", sharedBuffer }, [sharedBuffer]);

function fetch(input: RequestInfo, init: RequestInit = {}): Response {
  // 2. Let requestObject be the result of invoking the initial value of Request
  // as constructor with input and init as arguments. If this throws an
  // exception, reject p with it and return p.
  const requestObject = new Request(input, init);

  // 3. Let request be requestObject’s request.
  const request_ = request.get(requestObject)!;

  // 4. If requestObject’s signal is aborted, then:
  //     1. Abort the fetch() call with p, request, null, and requestObject’s
  //        signal’s abort reason.
  if (requestObject.signal.aborted) {
    throw requestObject.signal.reason;
  }

  // 7. Let responseObject be null.
  let responseObject: Response | null = null;

  // If locallyAborted is true, then abort these steps.

  // If response’s aborted flag is set, then:

  // Let deserializedError be the result of deserialize a serialized abort reason given controller’s serialized abort reason and relevantRealm.

  // Abort the fetch() call with p, request, responseObject, and deserializedError.

  // Abort these steps.

  // If response is a network error, then reject p with a TypeError and abort
  // these steps.
  if (response.type === "error") {
    throw new TypeError();
  }

  // Set responseObject to the result of creating a Response object, given response, "immutable", and relevantRealm.
  responseObject = responseCreate(response, "immutable");

  // Resolve p with responseObject.
  return responseObject;
}
