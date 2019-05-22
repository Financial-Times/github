/**
 * Parse appropriate values from a GitHub URL.
 */
const SUPPORTED_GITHUB_URL_PATTERNS = [
	// prettier-ignore
	'https://github.com/[owner]/[repository]/[endpoint]/[value]',
	'https://github.com/[scope]/[owner]/[endpoint]/[value]',
	'github.com/[owner]/[repository]/[endpoint]/[value]',
	'[subdomain].github.com/[owner]/[repository]/[endpoint]/[value]',
]

/**
 * @param {string} arg A URL expected to be in an acceptable GitHub format.
 *
 * Pattern: https://github.com/[scope?]/[owner?]/[repository?]/[endpoint?]/[value?]
 */
const parseGitHubURL = arg => {
	const GITHUB_URL_REGEX = /^(?:\S*github\.com(?:\/|:))+([\w-\/\#]+)/i
	const matches = GITHUB_URL_REGEX.exec(arg)
	if (matches === null) {
		throw new Error(`Invalid GitHub URL. The URL must match one of the following:\n\n- ${SUPPORTED_GITHUB_URL_PATTERNS.join('\n- ')}`)
	}
	// Convert a string to a number (e.g from '123#column-456' to 456)
	const getNumber = slug => {
		let integized
		try {
			integized = parseInt((slug && slug.split('-')[1]) || slug)
		} catch (error) {
			throw new Error('Could not get the project number.')
		}
		return integized
	}

	const parsed = {
		scope: null,
		owner: null,
		repo: null,
		endpoint: null,
		number: null,
		value: null,
	}
	const parts = matches[1].split('/')
	if (parts[0] === 'orgs') {
		// Project: https://github.com/orgs/[owner]/projects/[id]
		// Project column: https://github.com/orgs/[owner]/projects/[id]#column-[columnId]
		const [scope, owner, endpoint, number] = parts
		Object.assign(parsed, { scope, owner, endpoint, number: getNumber(number) })
	} else if (['projects', 'pull'].includes(parts[2])) {
		// Pull request ID: https://github.com/[owner]/[repo]/pull/[id]
		const [owner, repo, endpoint, number] = parts
		Object.assign(parsed, { owner, repo, endpoint, number: getNumber(number) })
	} else {
		// Some other GitHub URL, e.g: https://github.com/[owner]/[repo]/tree/[value]
		const [owner, repo, endpoint, value] = parts
		Object.assign(parsed, {
			owner,
			repo,
			endpoint,
			value: parseInt(value) || value,
		})
	}
	return parsed
}

module.exports = parseGitHubURL
