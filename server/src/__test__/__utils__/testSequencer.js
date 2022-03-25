const Sequencer = require('@jest/test-sequencer').default;

const getTest = (tests, testName) => {
  const testIndex = tests.findIndex((t) => t.path.includes(testName));
  const test = tests[testIndex];
  tests.splice(testIndex, 1);

  return [tests, test];
};

class CustomSequencer extends Sequencer {
  sort(tests) {
    const copyTests = Array.from(tests);
    const [registerTests, registerTest] = getTest(copyTests, 'Register.test.ts');
    const [confirmEmailTests, confirmEmailTest] = getTest(registerTests, 'ConfirmEmail.test.ts');
    const [loginTests, loginTest] = getTest(confirmEmailTests, 'Login.test.ts');
    const [resetPasswordTests, resetPasswordTest] = getTest(loginTests, 'ResetPassword.test.ts');
    const testSequence = [registerTest, confirmEmailTest, loginTest, ...resetPasswordTests.sort((testA, testB) => (testA.path > testB.path ? 1 : -1)), resetPasswordTest];
    return testSequence;
  }
}

module.exports = CustomSequencer;
