
import { Test, ExecutionTest, ConditionTest, ValueTest, AssertionTest, ErrorTest, BundledTest } from '../tsts.js'

function functionThatRunsWithoutErrors() { }
function functionThatReturns42(): number { return 42 }
function functionThatReturnsTrue(): boolean { return true }
function functionThatReturnsFalse(): boolean { return false }
function functionThatThrowsAnError() { throw 'Error' }
class CustomError extends Error { name = 'CustomError' }
function functionThatThrowsACustomError() { throw new CustomError() }

function runTestOnTest(test: Test, expectedToPass: boolean) {
	console.log(`========== Running test on ${test.constructor.name} named "${test.name}..."`)
	test.run()
	if (test.passed == expectedToPass) {
		console.log(`%c ========== PASSED test on ${test.constructor.name} named "${test.name}"`, `background-color: #0C0`)
	} else {
		console.log(`%c ========== FAILED test on ${test.constructor.name} named "${test.name}"`, `background-color: #C00`)
	}
}



////////// Testing ExecutionTest //////////

let executionTest1 = new ExecutionTest({
	name: 'functionThatRunsWithoutErrors runs without errors',
	function: functionThatRunsWithoutErrors,
})
runTestOnTest(executionTest1, true)

let executionTest2 = new ExecutionTest({
	name: 'functionThatThrowsAnError runs without errors',
	function: functionThatThrowsAnError,
	catchErrors: true
})
runTestOnTest(executionTest2, false)



////////// Testing ConditionTest //////////

let conditionTest1 = new ConditionTest({
	name: 'functionThatReturns42 returns a positive number',
	function: functionThatReturns42,
	condition: (x) => x > 0,
})
runTestOnTest(conditionTest1, true)

let conditionTest2 = new ConditionTest({
	name: 'functionThatReturns42 returns a negative number',
	function: functionThatReturns42,
	condition: (x) => x < 0,
})
runTestOnTest(conditionTest2, false)

let conditionTest3 = new ConditionTest({
	name: 'functionThatThrowsAnError returns a positive number',
	function: functionThatThrowsAnError,
	condition: (x) => x > 0,
	catchErrors: true
})
runTestOnTest(conditionTest3, false)



////////// Testing ValueTest //////////

let valueTest1 = new ValueTest({
	name: 'functionThatReturns42 returns 42',
	function: functionThatReturns42,
	value: 42,
})
runTestOnTest(valueTest1, true)

let valueTest2 = new ValueTest({
	name: 'functionThatReturns42 returns 43',
	function: functionThatReturns42,
	value: 43,
})
runTestOnTest(valueTest2, false)

let valueTest3 = new ValueTest({
	name: 'functionThatThrowsAnError returns 42',
	function: functionThatThrowsAnError,
	value: 42,
	catchErrors: true
})
runTestOnTest(valueTest3, false)



////////// Testing AssertionTest //////////

let assertionTest1 = new AssertionTest({
	name: 'functionThatReturnsTrue() is true',
	function: functionThatReturnsTrue
})
runTestOnTest(assertionTest1, true)

let assertionTest2 = new AssertionTest({
	name: 'functionThatReturnsFalse() is true',
	function: functionThatReturnsFalse
})
runTestOnTest(assertionTest2, false)

let assertionTest3 = new AssertionTest({
	name: 'functionThatThrowsAnError() is true',
	function: functionThatThrowsAnError,
	catchErrors: true
})
runTestOnTest(valueTest3, false)



////////// Testing ErrorTest //////////

let errorTest1 = new ErrorTest({
	name: 'functionThatThrowsAnError throws an error',
	function: functionThatThrowsAnError
})
runTestOnTest(errorTest1, true)

let errorTest2 = new ErrorTest({
	name: 'functionThatRunsWithoutErrors throws an error',
	function: functionThatRunsWithoutErrors
})
runTestOnTest(errorTest2, false)

let errorTest3 = new ErrorTest({
	name: 'functionThatThrowsACustomError throws a CustomError',
	function: functionThatThrowsACustomError,
	errorName: 'CustomError'
})
runTestOnTest(errorTest3, true)

let errorTest4 = new ErrorTest({
	name: 'functionThatThrowsACustomError throws an error',
	function: functionThatThrowsACustomError,
})
runTestOnTest(errorTest4, true)

let errorTest5 = new ErrorTest({
	name: 'functionThatThrowsAnError throws a CustomError',
	function: functionThatThrowsAnError,
	errorName: 'CustomError'
})
runTestOnTest(errorTest5, false)



////////// Testing BundledTest //////////

let testBundle1 = new BundledTest({
	name: 'Bundling three tests',
	subtests: [
		executionTest1,
		conditionTest1,
		valueTest1
	],
	silent: false,
	silenceSubtests: false
})
runTestOnTest(testBundle1, true)

let testBundle2 = new BundledTest({
	name: 'Bundling three more tests',
	subtests: [
		executionTest1,
		conditionTest1,
		valueTest2
	],
	silent: false,
	silenceSubtests: false
})
runTestOnTest(testBundle2, false)

let testBundle3 = new BundledTest({
	name: 'Bundling two BundledTests',
	subtests: [
		testBundle1,
		testBundle2
	],
	silent: false,
	silenceSubtests: false
})
runTestOnTest(testBundle3, false)





