# Shell - TypeScript

A POSIX-compliant shell implementation built in TypeScript as part of the [CodeCrafters "Build Your Own Shell" challenge](https://codecrafters.io/courses/shell/overview).

## Features

- **REPL (Read-Eval-Print Loop)**: Interactive command-line interface with a `$` prompt
- **Built-in Commands**:
  - `echo` - Print arguments to standard output
  - `pwd` - Print current working directory
  - `cd` - Change directory (supports `~` for home directory)
  - `type` - Display information about a command (builtin or external)
  - `exit` - Exit the shell
- **External Command Execution**: Runs any executable found in your `PATH`
- **Quote Handling**: Supports single quotes, double quotes, and backslash escaping
- **PATH Resolution**: Automatically finds executables in your system's `PATH`

## Requirements

- [Bun](https://bun.sh/) runtime (v1.3 or later)

## Installation

```bash
git clone https://github.com/AnwarRizk/shell.git
cd shell
bun install
```

## Usage

### Running Locally

```bash
./your_program.sh
```

Or directly with Bun:

```bash
bun run app/main.ts
```

### Interactive Mode

Once started, you'll see a `$` prompt. Type commands just like in a regular shell:

```
$ echo Hello, World!
Hello, World!
$ pwd
/home/user
$ cd ~/Documents
$ type echo
echo is a shell builtin
$ type ls
ls is /usr/bin/ls
$ exit
```

### Examples

```bash
# Print text
$ echo This is a test

# Navigate directories
$ cd /tmp
$ pwd

# Check command type
$ type cd
cd is a shell builtin

# Run external commands
$ ls -la
$ cat file.txt
```

## Project Structure

```
.
├── app/
│   └── main.ts          # Shell implementation
├── codecrafters.yml     # CodeCrafters configuration
├── package.json
├── tsconfig.json
└── your_program.sh      # Local run script
```

## How It Works

1. **Parsing**: Input is tokenized with support for single/double quotes and backslash escaping
2. **Builtin Detection**: Checks if the command is a shell builtin (`echo`, `cd`, `pwd`, `type`, `exit`)
3. **PATH Resolution**: For external commands, searches directories in `PATH` for an executable
4. **Execution**: Builtins are handled internally; external commands are spawned as child processes

## Contributing

Feel free to open issues or submit pull requests.

## License

This project is part of the CodeCrafters challenge. See [codecrafters.io](https://codecrafters.io) for details.
