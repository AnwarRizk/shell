import { createInterface } from 'readline';
import { existsSync, accessSync, constants } from 'fs';
import path from 'path';

const types = ['echo', 'exit', 'type'];

function outputLine(command: string): void {
  console.log(command);
}

function outputNotFound(command: string): void {
  console.log(`${command}: command not found`);
}

function findExecutable(command: string): string | null {
  const pathEnv = process.env.PATH || '';
  const directories = pathEnv.split(path.delimiter);

  for (const dir of directories) {
    const fullPath = path.join(dir, command);

    if (!existsSync(fullPath)) {
      continue;
    }

    try {
      accessSync(fullPath, constants.X_OK);
      return fullPath;
    } catch {
      continue;
    }
  }

  return null;
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '$ ',
});

rl.prompt();

rl.on('line', (command: string) => {
  const args = command.trim().split(' ');
  if (args[0] === 'exit') {
    rl.close();
    return;
  } else if (args[0] === 'echo') {
    outputLine(args.slice(1).join(' '));
  } else if (args[0] === 'type') {
    const typeName = args[1];

    if (types.includes(typeName)) {
      console.log(`${typeName} is a shell builtin`);
    } else {
      const executable = findExecutable(typeName);

      if (executable) {
        console.log(`${typeName} is ${executable}`);
      } else {
        console.log(`${typeName}: not found`);
      }
    }
  } else {
    outputNotFound(command);
  }

  rl.prompt();
});
