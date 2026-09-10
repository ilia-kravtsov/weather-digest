import { parseArgs } from './cli/parseArgs.js';

function main(): void {
  try {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    console.log(options);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Ошибка: ${error.message}`);
    } else {
      console.error('Произошла неизвестная ошибка');
    }

    process.exitCode = 1;
  }
}

main();