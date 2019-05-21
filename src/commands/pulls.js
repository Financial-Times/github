/**
 * This project follows the example provided in the Yards documentation for command hierarchy and directory structure.
 * @see: https://github.com/yargs/yargs/blob/master/docs/advanced.md#commanddirdirectory-opts
 */
exports.command = 'pulls <subcommand> [...options]'
exports.desc = 'Manage GitHub pull requests'
exports.builder = function(yargs) {
	return yargs.commandDir('pulls')
}
exports.handler = function() {}
