import { createInterface } from 'readline';

const types = ['echo', 'exit', 'type'];

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
  } else if (command.trim().split(' ')[0] === 'type') {
    const typeName = command.trim().split(' ')[1];
    if (types.includes(typeName)) {
      console.log(`${typeName} is a shell builtin`);
    } else {
      console.log(`${typeName}: not found`);
    }
  } else {
    outputNotFound(command);
  }
  rl.prompt();
});
