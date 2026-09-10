import { parseArgs } from './cli/parseArgs.js';

const args = process.argv.slice(2);
const options = parseArgs(args);

console.log(options);