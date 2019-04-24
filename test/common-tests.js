/* global expect */
const yargs = require('yargs')

const commandModuleExportsObject = (yargsModule, commandGroup, command) => {
	test(`The "${commandGroup} ${command}" command module exports an object that can be used by yargs`, () => {
		expect(yargsModule).toEqual(
			expect.objectContaining({
				command: expect.stringContaining(command),
				desc: expect.any(String),
				builder: expect.any(Function),
				handler: expect.any(Function),
			})
		)
	})
}
const commandModuleCanLoad = (yargsModule, commandGroup, command) => {
	test(`yargs can load the "${commandGroup} ${command}" command without any errors or warnings`, () => {
		expect(() => {
			yargs.command(yargsModule).argv
		}).not.toThrow()
		expect(console.warn).not.toBeCalled()
	})
}
const missingOptionWillThrow = (requiredOptions, commandGroup, command) => {
	for (let option of Object.keys(requiredOptions)) {
		test(`Running the command handler without '${option}' throws an error`, async () => {
			expect.assertions(1)
			try {
				const testOptions = Object.assign({}, requiredOptions)
				delete testOptions[option]

				const optionString = Object.keys(testOptions)
					.map(option => `--${option} ${testOptions[option]}`)
					.join(' ')

				/**
				 * Note: execSync() spawns a new process that nocks and mocks do not have access to.
				 * So you can only test for errors.
				 * If you test for successful execution, it will actually try to connect to GitHub.
				 */
				require('child_process').execSync(`./bin/github.js ${commandGroup} ${command} ${optionString}`)
			} catch (error) {
				expect(error.message).toEqual(expect.stringContaining(option))
			}
		})
	}
}
const describeYargs = (yargsModule, commandGroup, command, requiredOptions) => {
	jest.spyOn(global.console, 'warn')
	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('Yargs', () => {
		commandModuleExportsObject(yargsModule, commandGroup, command)
		commandModuleCanLoad(yargsModule, commandGroup, command)
		missingOptionWillThrow(requiredOptions, commandGroup, command)
	})
}
module.exports = {
	describeYargs,
}
