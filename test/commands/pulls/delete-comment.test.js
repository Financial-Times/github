const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/pulls/delete-comment')

// Don't let Octokit make network requests
nock.disableNetConnect()

// Reset any mocked network endpoints
nock.cleanAll()

/**
 * Common Yargs tests
 */
const command = 'pulls delete-comment'
const requiredArguments = {
	options: {
		token: 'Test-Token',
	},
	positionals: {
		'github-url': 'https://github.com/Test-Owner/Test-Repo/pull/1#issuecomment-1',
	},
}
commonTests.describeYargs(yargsModule, command, requiredArguments)

const yarguments = Object.assign({}, requiredArguments.options, {
	githubUrl: { owner: 'Test-Owner', repo: 'Test-Repo', number: 1 },
})

describe('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.delete('/repos/Test-Owner/Test-Repo/issues/comments/1')
		.reply(200, {})

	test('Running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler(yarguments)
		expect(successResponse.isDone()).toBe(true)
	})
})
