import { AtomicHandler } from "./index";
import { UnionHandler } from "./union";
import { NullHandler } from "./null";
import { OptionalHandler } from "./optional";

export class NumberHandler extends AtomicHandler<number> {
  constructor() {
    super();
    this._rules.push(
      (v: unknown) => typeof v === "number" || "Must be a number",
    );
  }

  nullable(): UnionHandler<[this, NullHandler]> {
    return new UnionHandler([this, new NullHandler()]);
  }

  optional(): UnionHandler<[this, OptionalHandler]> {
    return new UnionHandler([this, new OptionalHandler()]);
  }

  integer(): NumberHandler {
    this._rules.push(
      (v: number) => Number.isInteger(v) || `Must be an integer`,
    );
    return this;
  }

  negative(): NumberHandler {
    this._rules.push((v: number) => v < 0 || `Must be a negative number`);
    return this;
  }

  positive(): NumberHandler {
    this._rules.push((v: number) => v >= 0 || `Must be a positive number`);
    return this;
  }

  between(min: number, max: number): NumberHandler {
    this._rules.push(
      (v: number) => (v >= min && v <= max) || `Must be ${min} and ${max}`,
    );
    return this;
  }

  min(min: number): NumberHandler {
    this._rules.push((v: number) => v >= min || `Must be at least ${min}`);
    return this;
  }

  max(max: number): NumberHandler {
    this._rules.push(
      (v: number) => v <= max || `Must be less than or equal ${max}`,
    );
    return this;
  }
}
