#!/usr/bin/env node
'use strict';

const yargs = require('yargs');

function flavors(argv) {
  return require('flavors')(argv.name, {
    configDirName: argv.dirName,
    configFileName: argv.fileName,
    configNameSeparator: argv.separator,
    workingDir: argv.workingDir,
    loaders: argv.loader ? (Array.isArray(argv.loader) ? argv.loader : [argv.loader]).map(l => require(l)) : undefined,
    transform: argv.transform ? require(argv.transform) : undefined
  });
}

// noinspection BadExpressionStatementJS
yargs// eslint-disable-line no-unused-expressions
  .usage('$0 - CLI tool powered by Flavors (https://github.com/flavors-js/flavors) configuration management library. ' +
    'It allows to run commands in the pre-configured environment')
  .command('print', 'Load and print configuration in JSON format', yargs => yargs, argv => {
    process.stdout.write(JSON.stringify(flavors(argv), null, 2) + '\n');
  })
  .command('run', 'Load configuration and run command', yargs => {
    return yargs.options({
      'command': {
        alias: 'c',
        demandOption: true,
        describe: 'Command to execute',
        requiresArg: true
      },
      'module': {
        alias: 'm',
        boolean: true,
        default: false,
        describe: 'By default a command specified with --command option is executed with child_process.execSync(). ' +
        'If --module option is specified then the command is treated like a name of a Node.js module or a path to it. ' +
        'This Node.js module should export function that accepts configuration object and returns string containing command ' +
        'or object with the following properties: command, args, options (see arguments of https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)'
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
      }
    });
  }, argv => {
    const config = flavors(argv);
    const getOptions = (options) => {
      options = options || {};
      return Object.assign(options, {
        cwd: (argv.skipCwd ? undefined : argv.workingDir) || options.cwd || process.env.cwd,
        env: Object.assign(process.env, argv.skipEnv ? {} : require('flat').flatten(config, { delimiter: '_' }), options.env),
        stdio: 'inherit'
      });
    };
    const child = require('child_process');
    if (argv.module) {
      const m = require(argv.command);
      const r = m(config);
      if (typeof r === 'object') {
        child.spawn(r.command, r.args, getOptions(r.options || {}));
      } else {
        child.execSync(r, getOptions());
      }
    } else {
      child.execSync(argv.command, getOptions());
    }
  })
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
