import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '$ ',
});

// TODO: Uncomment the code below to pass the first stage
rl.prompt();
rl.on('line', (command: any) => {
  outputCommand(command);
  rl.prompt();
});

function outputCommand(command: any) {
  console.log(`${command}: command not found`);
}
