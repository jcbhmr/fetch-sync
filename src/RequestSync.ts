import MIMEType from "whatwg-mimetype";
import BodySyncMixin, { body, mimeType } from "./BodySyncMixin.ts";

function headerExtractMIMEType(this: RequestSync) {
  if (this.headers.has("Content-Type")) {
    const contentType = this.headers.get("Content-Type")!;
    const mimeType = new MIMEType(contentType);
    return mimeType;
  } else if (this.headers.get("X-Content-Type-Options") === "nosniff") {
    return new MIMEType("application/octet-stream");
  } else {
    // TODO: Support MIME sniffing?
    return new MIMEType("application/octet-stream");
  }
}

//
class RequestSync implements BodySyncMixin {
  #url: string;
  #method: string;
  #headers: Headers;
  constructor(input: RequestInfo, init: RequestInitSync = {}) {}

  get method(): string {
    return this.#method;
  }
  get url(): string {
    return this.#url;
  }
  get headers(): Headers {
    return this.#headers;
  }

  clone(): Request {
    return new Request(this);
  }
}
includesMixin.call(Request, BodySyncMixin);
mimeType.set(Request);

export default RequestSync;
