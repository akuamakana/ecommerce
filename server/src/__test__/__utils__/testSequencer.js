const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  constructor() {
    super();
    this.prefixTests = [];
    this.tests = [];
    this.suffixTests = [];
  }

  /**
   * Set tests to be used
   */
  setTests(tests) {
    this.tests = tests;
  }

  /**
   * Returns all tests sorted
   */
  getSortedTests = () => this.tests.sort((testA, testZ) => testA - testZ);

  /**
   * Gets test from tests array
   * @param {string} testName - The name of the test file
   */
  getTest = (testName) => {
    const test = this.tests.find((test) => test.path.includes(testName));
    if (!test) {
      throw new Error(`Test ${testName} not found`);
    }
    this.tests.splice(this.tests.indexOf(test), 1);
    return test;
  };

  /**
   * Sets tests that are set to run first in the sequence
   * @param {string[]} tests - The names of the test files
   */
  setPrefixTests = (tests) => {
    const prefixTests = tests.map((test) => this.getTest(test));
    this.prefixTests = prefixTests;
  };

  /**
   * Sets tests that are set to run last in the sequence
   * @param {string[]} tests - The names of the test files
   */
  setSuffixTests = (tests) => {
    const suffixTests = tests.map((test) => this.getTest(test));
    this.suffixTests = suffixTests;
  };

  sort(tests) {
    this.setTests(tests);
    this.setPrefixTests(['Register', 'ConfirmEmail', 'Login']);
    this.setSuffixTests(['ResetPassword']);

    const testSequence = [...this.prefixTests, ...this.getSortedTests(), ...this.suffixTests];
    return testSequence;
  }
}

module.exports = CustomSequencer;
