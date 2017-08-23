<div align="center">
  <a href="https://github.com/flavors-js/flavors-cli">
    <img width="200" height="200" src="https://flavors-js.github.io/flavors/logo.svg">
  </a>
  <br>
  <br>

[![npm](https://img.shields.io/npm/v/flavors-cli.svg)](https://www.npmjs.com/package/flavors-cli)
[![Build Status](https://travis-ci.org/flavors-js/flavors-cli.svg?branch=master)](https://travis-ci.org/flavors-js/flavors-cli)
[![David](https://img.shields.io/david/flavors-js/flavors-cli.svg)](https://david-dm.org/flavors-js/flavors-cli)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
</div>

# flavors-cli

CLI tool powered by [Flavors](https://github.com/flavors-js/flavors) configuration management library.<br>
It allows to run commands in the pre-configured environment.

## Install

```text
$ npm install -g flavors-cli
```

## Usage

### Common options

```text
$ flavors --help

flavors - CLI tool powered by Flavors (https://github.com/flavors-js/flavors) configuration
management library. It allows to run commands in the pre-configured environment

Commands:
  print  Load and print configuration in JSON format
  run    Load configuration and run command

Options:
  --dir-name, -d     Configuration directory name
  --file-name, -f    Configuration file name (excluding extension)
  --loader, -l       Name of a Node.js module or a path to it
  --name, -n         Configuration name                                                   [required]
  --separator, -s    Configuration name separator
  --transform, -t    Path to Flavors transformation Node.js module
  --working-dir, -w  Directory from which configuration will be loaded
  --help             Show help                                                             [boolean]
  --version          Show version number                                                   [boolean]
```

### `run` options

```text
$ flavors run --help
  ...
  --command, -c         Command or Node.js module (if --module is specified) to execute.  [required]
  --module, -m          By default a command specified with --command option is executed with
                        child_process.execSync(). If --module option is specified then the command
                        is treated like a name of a Node.js module or a path to it. This Node.js
                        module should export one of the following: 1. a string containing command;
                        2. a function that accepts configuration object and returns string
                        containing command; 3. a function that accepts configuration object and
                        returns object with the following properties: command, args, options (see
                        arguments of
                        https://nodejs.org/api/child_process.html#child_process_child_process_spawn_
                        command_args_options); 4. a plugin object with fields: command - can be a
                        value from 1., 2. or 3., options - object passed to Flavors (see
                        https://github.com/flavors-js/flavors#options-parameter)
                                                                          [boolean] [default: false]
  --skip-env            Skip environment initialization using loaded configuration
                                                                          [boolean] [default: false]
  --skip-cwd            By default working directory of a process which runs the command is set to
                        value specified in --working-dir option. Pass --skip-cwd to skip this step
                                                                          [boolean] [default: false]
  --skip-module-prefix  By default program tries first to load Node.js module with `flavored-`
                        prefix. It's recommended prefix for modules providing plugins. For example,
                        if `--command docker-compose --module` options are specified then program
                        will try first to load `flavored-docker-compose` module. If no such module
                        is found then it will try to load `docker-compose` module. Use this option
                        to disable such behavior                          [boolean] [default: false]
  --override-loaders    By default loaders specified in module `options` field are prepended to list
                        of loaders provided by --loader option. Use this option to change the
                        behavior and use only --loader loaders            [boolean] [default: false]
  --override-transform  By default transformation specified in module `transform` field is executed
                        before transformation provided by --transform option. Use this option to
                        change the behavior and use only --transform transformation
                                                                          [boolean] [default: false]
  --args, -a            Additional command arguments                                         [array]
```

## Maintainers

- [@mxl](https://github.com/mxl)

## License

See the [LICENSE](https://github.com/flavors-js/flavors-cli/blob/master/LICENSE) file for details.
