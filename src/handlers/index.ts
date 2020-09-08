import { Rule } from "../types";
import debug from "debug";
import { IValidationResult } from "schema";

const log = debug("yxc");

export abstract class Handler<T = any> {
  protected _rules: Rule<T>[] = [];
  protected _optional = false;
  protected _nullable = false;

  isNullable(): boolean {
    return this._nullable;
  }

  isOptional(): boolean {
    return this._optional;
  }

  // or(rules: Rule<T>[]) {
  //   this._rules.push((v: T, k, root) => {
  //     let _result: string | null = null;
  //     for (const rule of rules) {
  //       const result = rule(v, k, root);
  //       if (typeof result === "string") {
  //         return result;
  //       }
  //       if (!result) return false;
  //     }
  //     return true;
  //   });
  //   return this;
  // }

  validate(
    value: unknown,
    key?: string[],
    root?: unknown,
  ): IValidationResult[] {
    const results: { key: string[]; message: string | boolean }[] = [];

    log("Checking if undefined");
    if (value === undefined) {
      if (this._optional) {
        log("Value is undefined and optional!");
        return [];
      } else {
        log("Value is undefined, but not optional!");
        return [{ key: key || [], message: "Value required" }];
      }
    }

    log("Checking if null");
    if (value === null) {
      if (this._nullable) {
        log("Value is null and nullable!");
        return [];
      } else {
        log("Value is null, but not nullable!");
        return [{ key: key || [], message: "Value must not be null" }];
      }
    }

    log("Checking rules");
    for (const rule of this._rules) {
      const result = rule(<any>value, key || [], root || value);
      if (typeof result === "string" || !result) {
        log("Rule failed!");
        results.push({ key: key || [], message: result });
        log("Rule result: " + result);
      } else {
        log("Rule passed!");
      }
    }

    log(`Checked rules, ${results.length} errors`);
    return results;
  }

  test(rule: Rule<T>): Handler {
    this.custom(rule);
    return this;
  }

  check(rule: Rule<T>): Handler {
    this.custom(rule);
    return this;
  }

  use(rule: Rule<T>): Handler {
    this.custom(rule);
    return this;
  }

  custom(rule: Rule<T>): Handler {
    this._rules.push(rule);
    return this;
  }

  optional(): Handler {
    this._optional = true;
    return this;
  }

  nullable(): Handler {
    this._nullable = true;
    return this;
  }
}

export class AtomicHandler<T = string | number | boolean> extends Handler<T> {
  equals(expected: T): AtomicHandler<T> {
    this._rules.push(
      (v: T) => v === expected || `Must be equal to ${expected}`,
    );
    return this;
  }

  eq(expected: T): AtomicHandler<T> {
    return this.equals(expected);
  }

  equal(expected: T): AtomicHandler<T> {
    return this.equals(expected);
  }

  enum(values: T[]): AtomicHandler<T> {
    this._rules.push(
      (v) =>
        values.includes(v) ||
        `Must be one of the following values: ${values.join(", ")}`,
    );
    return this;
  }
}
