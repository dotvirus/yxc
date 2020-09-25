import fixture from "./fixture";
import { expect } from "chai";
import yxc, { createExecutableSchema } from "../../../../src/index";

describe("String length", () => {
  for (const test of fixture) {
    const handler = yxc.string().len(test.length);
    it(`${test.value} should be a ${
      test.expected ? "valid" : "invalid"
    } string with length ${test.length}`, () => {
      const result = createExecutableSchema(handler)(test.value);
      if (test.expected) {
        expect(result.errors).to.be.empty;
      } else {
        expect(result.errors).to.not.be.empty;
      }
      expect(result.ok).to.be.equal(test.expected);
    });
  }
});
