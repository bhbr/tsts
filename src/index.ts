
/*******************************************

TypeScript tests (tsts) provides a number of test classes for unit testing.
Any test runs on a function to be tested.

- ExecutionTest (testing whether the function exits without error)
- ValueTest (testing the function's result)
- NumberValueTest (with customizable precision)
- ConditionTest (testing a condition on the function's result)
- AssertionTest (testing a boolean function)
- ErrorTest (testing whether the function throws an error as expected)
- BundledTest (running several tests in sequence)

*******************************************/

import { equal } from '@bhbr/egalite'

const NB_INDENTATION_SPACES: number = 8

export class Test {

	// a short description of the test (preferably a sentence)
	name: string
	// the function to test
	functionToTest: () => any
	// saving the function's return value
	functionResult: any
	// 
	catchErrors: boolean
	silent: boolean
	indentationLevel: number
	passed?: boolean

	constructor(args) {
		this.functionToTest = args['function']
		this.functionResult = undefined
		this.silent = args['silent'] ?? false
		this.catchErrors = args['catchErrors'] ?? false
		this.indentationLevel = args['indentationLevel'] ?? 0
		if (!this.functionToTest) { return } // might be a bundled test, where this function is only defined later
		this.name = args['name'] ?? 'Test_' + this.functionToTest.name
		this.passed = null
	}

	run(silent: boolean = null): boolean {
		silent = (silent ?? this.silent) || this.silent
		if (silent) return this.mereRun()
		
		this.testLog(`Running ${this.name}...`)
		this.passed = this.mereRun()
		if (this.passed) {
			this.logPassedTest(this.name)
		} else {
			this.logFailedTest(this.name)
			this.onTestFailed()
		}
		return this.passed
	}

	testLog(str: string, color: string = 'rgba(0, 0, 0, 0)') {
		let indentation = ' '.repeat(NB_INDENTATION_SPACES * this.indentationLevel)
		console.log(indentation + '%c ' + str, `background-color: ${color}`)
	}

	logPassedTest(testName?: string) {
		testName = testName ?? this.name
		this.testLog(`PASSED: ${testName} `, '#070')
	}

	logFailedTest(testName?: string) {
		testName = testName ?? this.name
		this.testLog(`FAILED: ${testName} `, '#700')
	}

	mereRun(): boolean {
		if (this.catchErrors) {
			try {
				return this.unsafeRun()
			} catch {
				return false
			}
		} else {
			return this.unsafeRun()
		}
	}

	unsafeRun(): boolean {
		console.error('Please subclass Test')
		return false
	}

	onTestFailed() { }

}


export class ExecutionTest extends Test {

	unsafeRun(): boolean {
		this.functionResult = this.functionToTest()
		return true
	}

}


export class ConditionTest extends Test {

	condition: (any) => boolean

	constructor(args) {
		super(args)
		this.condition = args['condition']
	}

	unsafeRun(): boolean {
		this.functionResult = this.functionToTest()
		return this.condition(this.functionResult)
	}

}


export class ValueTest extends ConditionTest {

	expectedResult: any

	constructor(args) {
		super(args)
		this.expectedResult = args['value']
		this.condition = (x: any) => {
			if (x instanceof Array && this.expectedResult instanceof Array) {
				return equal(x, this.expectedResult)
			} else if (typeof x == 'object' && typeof this.expectedResult == 'object') {
				return equal(x, this.expectedResult)
			} else {
				return x === this.expectedResult
			}
		}
	}

	logResult(result: any, type: 'expected' | 'gotten') {
		if (typeof result == 'object') {
			this.testLog(`${type} result:`)
			console.log(result)
		} else {
			this.testLog(`${type} result: ${result}`)
		}
	}

	onTestFailed() {
		this.logResult(this.functionResult, 'gotten')
		this.logResult(this.expectedResult, 'expected')
	}

}


export class NumberValueTest extends ValueTest {

	declare expectedResult: number
	precision: number

	constructor(args) {
		super(args)
		this.expectedResult = args['value']
		this.precision = args['precision'] ?? 1e-12
		this.condition = (x: number) => {
			return Math.abs(x - this.expectedResult) < this.precision
		}
	}
}


export class AssertionTest extends ValueTest {

	declare expectedResult: boolean

	constructor(args) {
		super(args)
		this.expectedResult = true
		this.condition = (x: boolean) => x
	}
}


export class ErrorTest extends Test {

	errorName?: string

	constructor(args) {
		super(args)
		this.errorName = args['errorName'] ?? null
		this.catchErrors = true
	}

	mereRun(): boolean {
		try {
			this.functionResult = this.functionToTest()
		} catch (error) {
			if (this.errorName === null ) { return true }
			if (error.name == this.errorName) { return true }
			if (this.catchErrors) { return false }
			throw error
		}
		return false
	}
}


export class BundledTest extends AssertionTest {

	subtests: Array<Test>
	silenceSubtests: boolean

	constructor(args) {
		super(args)
		this.subtests = args['subtests'] || []
		this.silenceSubtests = args['silenceSubtests'] ?? false
		this.functionToTest = function(): boolean {
			var result: boolean = true
			for (let test of this.subtests) {
				let previousIndentationLevel = test.indentationLevel
				let previousSilentFlag = test.silent
				test.indentationLevel = this.indentationLevel + 1
				test.silent = this.silenceSubtests || this.silent || test.silent
				let subtestResult = test.run()
				result = result && subtestResult
				test.indentationLevel = previousIndentationLevel
				test.silent = previousSilentFlag
			}
			return result
		}
		if (args['name']) {
			this.name = args['name']
		} else {
			this.name = 'BundledTest'
			for (let test of this.subtests) {
				this.name += '_' + test.name
			}
		}
	}

}






