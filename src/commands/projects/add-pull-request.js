/**
 * This command adds a pull request to a GitHub project column.
 *
 * @see: https://octokit.github.io/rest.js/#api-Projects-createCard
 * const result = await octokit.projects.createCard({column_id, note, content_id, content_type})
 * /projects/columns/:column_id/cards
 */
const flow = require('lodash.flow')

const commonYargs = require('../../../lib/common-yargs')
const printOutput = require('../../../lib/print-output')
const authenticatedOctokit = require('../../../lib/octokit')

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = yargs => {
	const baseOptions = flow([
		commonYargs.withToken,
		commonYargs.withJson,
	])
	return baseOptions(yargs)
		.option('column_id', {
			describe: 'Project column ID',
			demandOption: true,
			type: 'number'
		})
		.option('pull_request_id', {
			describe: 'Pull request ID',
			demandOption: true,
			type: 'number'
		});
}

/**
 * Return the contents of a pull request body and create a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {number} argv.column_id
 * @param {number} argv.pull_request_id
 * @throws {Error} - Throws an error if any required properties are invalid
 */
const handler = async ({ token, json, column_id, pull_request_id }) => {

	// Ensure that all required properties have values
	const requiredProperties = {
		column_id,
		pull_request_id,
	}
	if (Object.values(requiredProperties).some(property => !property)) {
		throw new Error(`Please provide all required properties: ${Object.keys(requiredProperties).join(', ')}`)
	}

	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.projects.createCard({
			column_id,
			content_id: pull_request_id,
			content_type: 'PullRequest'
		})
		printOutput({ json, resource: result.data })
	}
	catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'add-pull-request',
	desc: 'Add a pull request to a GitHub project column',
	builder,
	handler
}