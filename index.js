#!/usr/bin/env node
'use strict';

const
  yargs = require('yargs');

const getOptions = argv => {
  let loaders;
  if (argv.loader) {
    if (Array.isArray(argv.loader) && argv.loader.length > 0) {
      loaders = argv.loader;
    } else {
      loaders = [argv.loader];
    }
    loaders = loaders.map(require);
  }
  return {
    args: argv.args,
    command: argv.command,
    configDirName: argv.dirName,
    configFileName: argv.fileName,
    configName: argv.name,
    configNameSeparator: argv.separator,
    loaders: loaders,
    module: argv.module,
    overrideLoaders: argv.overrideLoaders,
    overrideTransform: argv.overrideTransform,
    skipCwd: argv.skipCwd,
    skipEnv: argv.skipEnv,
    skipModulePrefix: argv.skipModulePrefix,
    transform: argv.transform ? require(argv.transform) : undefined,
    workingDir: argv.workingDir
  };
};

// noinspection BadExpressionStatementJS
yargs// eslint-disable-line no-unused-expressions
  .usage('flavors - CLI tool powered by Flavors (https://github.com/flavors-js/flavors) configuration management library. ' +
    'It allows to run commands in the pre-configured environment')
  .command('print', 'Load and print configuration in JSON format',
    yargs => yargs,
    argv => require('flavors-runner').print(getOptions(argv)))
  .command('run', 'Load configuration and run command', yargs => {
    return yargs.options({
      'command': {
        alias: 'c',
        demandOption: true,
        describe: 'Command or Node.js module (if --module is specified) to execute.',
        requiresArg: true
      },
      'module': {
        alias: 'm',
        boolean: true,
        default: false,
        describe: 'By default a command specified with --command option is executed with child_process.execSync(). ' +
        'If --module option is specified then the command is treated like a name of a Node.js module or a path to it. ' +
        'This Node.js module should export one of the following: 1. a string containing command; 2. a function that accepts configuration object and returns string containing command; ' +
        '3. a function that accepts configuration object and returns object with the following properties: ' +
        'command, args, options (see arguments of https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options); ' +
        '4. a plugin object with fields: command - can be a value from 1., 2. or 3., options - object passed to Flavors (see https://github.com/flavors-js/flavors#options-parameter)'
      },
      'skip-env': {
        boolean: true,
        default: false,
        describe: 'Skip environment initialization using loaded configuration'
      },
      'skip-cwd': {
        boolean: true,
        default: false,
        describe: 'By default working directory of a process which runs the command is set to value specified in ' +
        '--working-dir option. Pass --skip-cwd to skip this step'
      },
      'skip-module-prefix': {
        boolean: true,
        default: false,
        describe: 'By default program tries first to load Node.js module with `flavored-` prefix. It\'s recommended prefix for modules providing plugins. ' +
        'For example, if `--command docker-compose --module` options are specified then program will try first to load `flavored-docker-compose` module. ' +
        'If no such module is found then it will try to load `docker-compose` module. Use this option to disable such behavior'
      },
      'override-loaders': {
        boolean: true,
        default: false,
        describe: 'By default loaders specified in module `options` field are prepended to list of loaders provided by --loader option. ' +
        'Use this option to change the behavior and use only --loader loaders'
      },
      'override-transform': {
        boolean: true,
        default: false,
        describe: 'By default transformation specified in module `transform` field is executed before transformation provided by --transform option. ' +
        'Use this option to change the behavior and use only --transform transformation'
      },
      'args': {
        alias: 'a',
        array: true,
        describe: 'Additional command arguments',
        requiresArg: true
      }
    });
  }, argv => require('flavors-runner').run(getOptions(argv)))
  .options({
    'dir-name': {
      alias: 'd',
      describe: 'Configuration directory name',
      requiresArg: true
    },
    'file-name': {
      alias: 'f',
      describe: 'Configuration file name (excluding extension)',
      requiresArg: true
    },
    'loader': {
      alias: 'l',
      describe: 'Name of a Node.js module or a path to it',
      requiresArg: true
    },
    'name': {
      alias: 'n',
      demandOption: true,
      describe: 'Configuration name',
      requiresArg: true
    },
    'separator': {
      alias: 's',
      describe: 'Configuration name separator',
      requiresArg: true
    },
    'transform': {
      alias: 't',
      describe: 'Path to Flavors transformation Node.js module',
      requiresArg: true
    },
    'working-dir': {
      alias: 'w',
      describe: 'Directory from which configuration will be loaded',
      requiresArg: true
    }
  })
  .epilogue('for more information, please read our documentation at https://github.com/flavors-js/flavors-cli')
  .demandCommand(1, 'Please specify at least one command')
  .help()
  .version()
  .wrap(yargs.terminalWidth())
  .argv;
