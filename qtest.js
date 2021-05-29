
module.exports = function (mod) {
  return new QTest(mod);
};

function QTest(mod) {
  const self = this;

  const tests = [];

  self.add = function (name, test) {
    tests.push({[name]: test});
  };

  self.run = function () {
    console.error(`\nTesting ${mod.filename}`);

    let numAssertions = 0;
    let numFailures = 0;
    let numTests = 0;

    tests.forEach(function (testObj) {
      Object.keys(testObj).forEach(function (key) {
        const testFn = testObj[key];

        // console.error(`Running test for ${key}.`);

        numTests += 1;
        testFn(testAssert, {testAssert,testAssert2});
      });
    });

    if (numFailures === 0) {
      console.error(`Pass (${numTests} tests, ${numAssertions} assertions).`);
    } else {
      console.error(`Failures: ${numFailures} (${numTests} tests, ${numAssertions} assertions).`);
    }
    console.error('');

    if (numFailures !== 0) {
      process.exit(numFailures);
    }

    function testAssert(b, msg ='') {
      numAssertions += 1;
      if (!b) {
        numFailures += 1;
        console.error(`Fail: ${msg}.`);
      }
      return !b;
    }

    function testAssert2(actual, expected, msg) {
      return testAssert(actual === expected, `${msg}; (actual: ${actual}, expected: ${expected})`)
    }
  };
}
