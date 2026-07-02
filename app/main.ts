import { createInterface } from 'readline';
import { existsSync, accessSync, constants } from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const builtins = ['echo', 'exit', 'type', 'pwd'];

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
      // File exists but isn't executable.
      continue;
    }
  }

  return null;
}

function handleEcho(args: string[]): void {
  console.log(args.join(' '));
}

function handleType(args: string[]): void {
  const command = args[0];

  if (!command) {
    return;
  }

  if (builtins.includes(command)) {
    console.log(`${command} is a shell builtin`);
    return;
  }

  const executable = findExecutable(command);

  if (executable) {
    console.log(`${command} is ${executable}`);
  } else {
    console.log(`${command}: not found`);
  }
}

function executeExternal(command: string, args: string[]): void {
  const executable = findExecutable(command);

  if (!executable) {
    outputNotFound(command);
    return;
  }

  spawnSync(executable, args, {
    // Inherit stdio to allow the child process to use the same input/output as the parent
    stdio: 'inherit',
    argv0: command, // Set the first argument to the command name
  });
}

// *******************START OF THE SHELL*******************
// Create a readline interface for user input
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '$ ',
});

rl.prompt();

rl.on('line', (line: string) => {
  const input = line.trim();

  if (!input) {
    rl.prompt();
    return;
  }

  const parts = input.split(' ');
  const command = parts[0];
  const args = parts.slice(1);

  switch (command) {
    case 'exit':
      rl.close();
      return;

    case 'echo':
      handleEcho(args);
      break;

    case 'type':
      handleType(args);
      break;

    case 'pwd':
      console.log(process.cwd());
      break;

    default:
      executeExternal(command, args);
      break;
  }

  rl.prompt();
});
