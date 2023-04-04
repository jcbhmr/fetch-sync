function includesMixin(this: {}, mixin: {}): this {
  const s = Object.getOwnPropertyDescriptors(mixin);
  delete s.name;
  delete s.length;
  delete s.prototype;
  Object.defineProperties(this, s);

  const p = Object.getOwnPropertyDescriptors(mixin.prototype);
  delete p.constructor;
  delete p[Symbol.toStringTag];
  Object.defineProperties(this.prototype, p);

  return this;
}

export default includesMixin;
