import { createInterface } from 'readline';
import { existsSync, accessSync, constants } from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

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
  const cmd = args[0];
  if (cmd === 'exit') {
    rl.close();
    return;
  } else if (cmd === 'echo') {
    outputLine(args.slice(1).join(' '));
  } else if (cmd === 'type') {
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
    const executable = findExecutable(cmd);

    if (executable) {
      spawnSync(executable, args.slice(1), {
        stdio: 'inherit',
      });
    } else {
      outputNotFound(command);
    }
  }

  rl.prompt();
});
