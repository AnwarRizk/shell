import { createInterface } from 'readline';
import { existsSync, accessSync, constants } from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { homedir } from 'os';

const builtins = new Set(['echo', 'exit', 'type', 'pwd', 'cd']);

const builtinHandlers = new Map<string, CommandHandler>([
  ['echo', builtinEcho],
  ['type', builtinType],
  ['pwd', builtinPwd],
  ['cd', builtinCd],
]);

type CommandHandler = (args: string[]) => void;
interface ParsedCommand {
  command: string;
  args: string[];
}

function parseInput(input: string): ParsedCommand {
  const tokens: string[] = [];

  let current = '';
  let inSingleQuotes = false;
  let inDoubleQuotes = false;

  for (const ch of input) {
    if (ch === "'" && !inDoubleQuotes) {
      inSingleQuotes = !inSingleQuotes;
      continue;
    }

    if (ch === '"') {
      inDoubleQuotes = !inDoubleQuotes;
      continue;
    }

    if (ch === ' ' && !inSingleQuotes && !inDoubleQuotes) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += ch;
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return {
    command: tokens[0],
    args: tokens.slice(1),
  };
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
      // File exists but isn't executable.
      continue;
    }
  }

  return null;
}

function builtinEcho(args: string[]): void {
  console.log(args.join(' '));
}

function builtinType(args: string[]): void {
  const command = args[0];

  if (!command) {
    return;
  }

  if (builtins.has(command)) {
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

function builtinPwd(): void {
  console.log(process.cwd());
}

function builtinCd(args: string[]) {
  let target = args[0];

  if (!target) {
    return;
  }

  if (target === '~') {
    target = homedir();
  }

  try {
    process.chdir(target);
  } catch {
    console.log(`cd: ${target}: No such file or directory`);
  }
}

function runExternalCommand(command: string, args: string[]): void {
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

function execute(parsedCommand: ParsedCommand): void {
  const handler = builtinHandlers.get(parsedCommand.command);
  if (handler) {
    handler(parsedCommand.args);
  } else if (parsedCommand.command === 'exit') {
    rl.close();
    return;
  } else {
    runExternalCommand(parsedCommand.command, parsedCommand.args);
  }
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

  execute(parseInput(input));

  rl.prompt();
});
