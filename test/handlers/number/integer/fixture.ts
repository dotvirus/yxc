export default (<[number, boolean][]>[
  [4, true],
  [-4, true],
  [0, true],
  [5.4, false],
]).map((tuple) => ({
  value: tuple[0],
  expected: tuple[1],
}));
