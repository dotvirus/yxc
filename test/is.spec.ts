import yxc, { createExecutableSchema, is } from "../src";
import tests from "./schema.fixture";
import { expect } from "chai";

const Person = yxc.object({
  id: yxc.string().alphanum().min(16),
  firstName: yxc.string().notEmpty(),
  lastName: yxc.string().notEmpty(),
  age: yxc.number().integer(),
});

describe("Validate a schema", () => {
  for (const test of tests) {
    it(`Should be ${
      test.valid ? "valid" : "invalid"
    } instance of schema`, () => {
      const result = createExecutableSchema(Person)(test.value);
      expect(result.ok).to.equal(test.valid);
      if (test.valid) {
        expect(result.errors).to.be.empty;
      } else {
        expect(result.errors).to.not.be.empty;
      }
      expect(is(test.value, Person)).to.equal(test.valid);
    });
  }
});
