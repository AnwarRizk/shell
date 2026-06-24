import { createInterface } from 'readline';

function outputLine(command: string): void {
  console.log(`${command}`);
}

function outputNotFound(command: string): void {
  console.log(`${command}: command not found`);
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '$ ',
});

rl.prompt();

rl.on('line', (command: string) => {
  if (command.trim() === 'exit') {
    rl.close();
    return;
  } else if (command.trim().split(' ')[0] === 'echo') {
    outputLine(command.trim().split(' ').slice(1).join(' '));
  } else {
    outputNotFound(command);
  }
  rl.prompt();
});
