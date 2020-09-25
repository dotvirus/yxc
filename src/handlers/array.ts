import { Handler } from "./index";
import { IValidationResult } from "../types";
import { Infer } from "../index";
import { BaseHandler } from "./base";

export class ArrayHandler<T extends Handler> extends BaseHandler {
  _type!: Array<Infer<T>>;

  _handler: Handler;

  constructor(handler: T) {
    super();
    this._rules.push((v: unknown) => Array.isArray(v) || "Must be an array");
    this._handler = handler;
  }

  any(
    pred: (v: Infer<T>, i: number, arr: Array<Infer<T>>) => boolean,
  ): ArrayHandler<T> {
    return this.some(pred);
  }

  all(
    pred: (v: Infer<T>, i: number, arr: Array<Infer<T>>) => boolean,
  ): ArrayHandler<T> {
    return this.every(pred);
  }

  some(
    pred: (v: Infer<T>, i: number, arr: Array<Infer<T>>) => boolean,
  ): ArrayHandler<T> {
    this._rules.push((arr: Array<Infer<T>>) => arr.some(pred));
    return this;
  }

  every(
    pred: (v: Infer<T>, i: number, arr: Array<Infer<T>>) => boolean,
  ): ArrayHandler<T> {
    this._rules.push((arr: Array<Infer<T>>) => arr.every(pred));
    return this;
  }

  length(num: number): ArrayHandler<T> {
    this._rules.push(
      (v: any[]) => v.length === num || `Must be of length ${num}`,
    );
    return this;
  }

  len(num: number): ArrayHandler<T> {
    this.length(num);
    return this;
  }

  notEmpty(): ArrayHandler<T> {
    this._rules.push((v: Array<Infer<T>>) => !!v.length || `Must not be empty`);
    return this;
  }

  between(min: number, max: number): ArrayHandler<T> {
    return this.min(min).max(max);
  }

  min(min: number): ArrayHandler<T> {
    this._rules.push(
      (v: Array<Infer<T>>) =>
        v.length >= min || `Must have at least ${min} items`,
    );
    return this;
  }

  max(max: number): ArrayHandler<T> {
    this._rules.push(
      (v: Array<Infer<T>>) =>
        v.length <= max || `Must have at most ${max} items`,
    );
    return this;
  }

  validate(
    value: unknown,
    key: string[] = [],
    root?: unknown,
  ): IValidationResult[] {
    const myResults = super.validate(value, key, root);
    const keyResults: IValidationResult[] = [];

    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        const myKey = i.toString();
        const results = this._handler.validate(v, [...key, myKey], root);
        keyResults.push(...results);
      });
    }

    return myResults.concat(keyResults);
  }
}
