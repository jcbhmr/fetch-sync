import { Serializer } from "node:v8";

/**
 * @see https://nodejs.org/api/v8.html#class-v8serializer
 * @see https://github.com/nodejs/node/blob/main/lib/v8.js#L310
 */
class FetchSerializer extends Serializer {
  constructor() {
    super();
    this._setTreatArrayBufferViewsAsHostObjects(true);
  }

  _writeHostObject()
}

export default FetchSerializer;
