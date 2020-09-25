import { AtomicHandler } from "./atomic";

/**
 * Boolean handler
 */
export class BooleanHandler extends AtomicHandler<boolean> {
  constructor() {
    super();
    this._rules.push(
      (v: unknown) => typeof v === "boolean" || "Must be a boolean",
    );
  }

  /**
   * Only allows true
   */
  true(): BooleanHandler {
    return this.equals(true);
  }

  /**
   * Only allows false
   */
  false(): BooleanHandler {
    return this.equals(false);
  }
}
