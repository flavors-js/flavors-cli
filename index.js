#!/usr/bin/env node
'use strict';

const
  yargs = require('yargs');

const parseArgs = argv => {
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
    command: argv.command,
    configName: argv.name,
    options: {
      configDirName: argv.dirName,
      configFileName: argv.fileName,
      configNameSeparator: argv.separator,
      loaders: loaders,
      skipModulePrefix: argv.skipModulePrefix,
      spawnOptions: {stdio: 'inherit'},
      transform: argv.transform ? require(argv.transform) : undefined,
      workingDir: argv.workingDir
    }
  };
};

// noinspection BadExpressionStatementJS
yargs// eslint-disable-line no-unused-expressions
  .usage('flavors - CLI tool powered by Flavors (https://github.com/flavors-js/flavors) configuration management library. ' +
    'It allows to run commands in the pre-configured environment')
  .command({
    command: 'print',
    desc: 'Load and print configuration in JSON format',
    handler: argv => {
      const {configName, options} = parseArgs(argv);
      process.stdout.write(JSON.stringify(require('flavors')(configName, options), null, 2) + '\n');
    }
  })
  .command({
    command: 'run [command...]',
    desc: 'Load configuration and run command',
    handler: argv => {
      const {configName, command, options} = parseArgs(argv);
      return require('flavors/runner')(command, configName, options);
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
