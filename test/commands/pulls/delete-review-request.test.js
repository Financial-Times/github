const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/pulls/delete-review-request')

// Don't let Octokit make network requests
nock.disableNetConnect()

// Reset any mocked network endpoints
// nock.cleanAll()

jest.spyOn(global.console, 'warn')
afterEach(() => {
	jest.clearAllMocks()
})

/**
 * Common Yargs tests
 */
const commandGroup = 'pulls'
const command = 'delete-review-request'
const requiredArguments = {
	owner: 'test',
	repo: 'test',
	number: 1,
}
commonTests.describeYargs(yargsModule, commandGroup, command, requiredArguments)

describe('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.delete('/repos/test/test/pulls/1/requested_reviewers')
		.reply(200, {})

	test('Running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler({
			token: 'test',
			owner: 'test',
			repo: 'test',
			number: 1,
			requested_reviewers: 'test',
		})
		expect(successResponse.isDone()).toBe(true)
	})
})
