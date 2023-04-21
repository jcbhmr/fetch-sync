import MIMEType from "whatwg-mimetype";

/**
 * `.body` is now a `Uint8Array` instead. Normally, `.body` is a `ReadableStream<Uint8Array>`, but since we are in synchronous land, that won't cut it. The next-closest thing is either an `ArrayBuffer` or a raw complete `Uint8Array`. In this case, we have chosen the `Uint8Array` option since it fits with the `Uint8Array` from the `ReadableStream`.
 */
const body = new WeakMap<BodySyncMixin, null | Uint8Array>();
const bodyUsed = new WeakMap<BodySyncMixin, boolean>();
const mimeType = new WeakMap<BodySyncMixin, () => MIMEType>();

type BodySyncMixin = typeof BodySyncMixin.prototype;
const BodySyncMixin = {
  prototype: {
    /**
     * `.body` is now a `Uint8Array` instead. Normally, `.body` is a `ReadableStream<Uint8Array>`, but since we are in synchronous land, that won't cut it. The next-closest thing is either an `ArrayBuffer` or a raw complete `Uint8Array`. In this case, we have chosen the `Uint8Array` option since it fits with the `Uint8Array` from the `ReadableStream`.
     */
    get body(): Uint8Array | null {
      return body.get(this)!;
    },

    get bodyUsed(): boolean {
      return bodyUsed.get(this)!;
    },

    /**
     * Consumes the entire body as an `ArrayBuffer`.
     *
     * @returns An `ArrayBuffer`, possibly with a length of zero
     */
    arrayBuffer(): ArrayBuffer {
      bodyUsed.set(this, true);
      if (this.body) {
        return this.body.buffer;
      } else {
        return new ArrayBuffer();
      }
    },

    /**
     * Consumes the body as a string.
     * @returns A string, possibly empty
     */
    text(): string {
      if (this.body) {
        return new TextDecoder().decode(this.body);
      } else {
        return "";
      }
    },

    /**
     * Transfers the entire body into a `Blob` instance.
     * @returns A Blob, possibly with a size of zero
     */
    blob(): Blob {
      const type = mimeType.get(Object.getPrototypeOf(this))!.call(this);
      return new Blob([this.body], { type });
    },

    /**
     * Assumes the body is encoded as UTF-8. Parses the body as JSON and consumes it.
     * @returns A string, number, boolean, object, array, or null JSON value.
     */
    json(): any {
      return JSON.parse(this.text());
    },

    // TODO: Add .formData()
    // formData(): FormData {}
  },
};

export default BodySyncMixin;
export { body, mimeType };
