import { createInterface } from 'readline';

function outputCommand(command: string): void {
  console.log(`${command}: command not found`);
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '$ ',
});

rl.prompt();

rl.on('line', (command: string) => {
  outputCommand(command);
  rl.prompt();
});
