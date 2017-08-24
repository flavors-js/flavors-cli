'use strict';

const
  modulePrefix = 'flavored-';

const removeEmpty = (obj) => {
  Object.keys(obj).forEach((key) => (obj[key] === null || obj[key] === undefined) && delete obj[key]);
  return obj;
};

const flavors = (options, moduleOptions) => {
  moduleOptions = moduleOptions || {};
  let loaders = options.loaders;
  if (!options.overrideLoaders && moduleOptions.loaders) {
    loaders = [...moduleOptions.loaders, ...(loaders || [])];
  }

  let transform = options.transform;
  if (!options.overrideTransform && moduleOptions.transform) {
    if (transform) {
      const transform2 = transform, transform1 = moduleOptions.transform;
      transform = (config, info) => {
        transform2(transform1(config, info), info);
      };
    } else {
      transform = moduleOptions.transform;
    }
  }

  return require('flavors')(options.configName, Object.assign(moduleOptions, removeEmpty({
    configDirName: options.configDirName,
    configFileName: options.configFileName,
    configNameSeparator: options.configNameSeparator,
    workingDir: options.workingDir,
    loaders: loaders,
    transform: transform
  })));
};

const getProcessOptions = (options, processOptions, config) => {
  processOptions = processOptions || {};
  return Object.assign(processOptions, {
    cwd: (options.skipCwd ? undefined : options.workingDir) || processOptions.cwd || process.env.cwd,
    env: Object.assign(process.env, options.skipEnv ? {} : require('flat').flatten(config, { delimiter: '_' }), processOptions.env),
    stdio: 'inherit'
  });
};

const runCommand = (options, command, flavorsOptions) => {
  const child = require('child_process');
  const config = flavors(options, flavorsOptions);
  if (typeof command === 'function') {
    const r = command(config);
    if (typeof r === 'object') {
      child.spawn(r.command, [...(r.args || []), ...(options.args || [])], getProcessOptions(options, r.options || {}, config));
    } else {
      child.execSync([r, ...(options.args || [])].join(' '), getProcessOptions(options, {}, config));
    }
  } else if (typeof command === 'string') {
    child.execSync([command, ...(options.args || [])].join(' '), getProcessOptions(options, {}, config));
  }
};

const runModule = (argv) => {
  let m;
  try {
    m = require(modulePrefix + argv.command);
  } catch (ignore) { // eslint-disable-line no-empty
    m = require(argv.command);
  }
  if (typeof m === 'object') {
    runCommand(argv, m.command, m.options);
  } else {
    runCommand(argv, m);
  }
};

module.exports = {
  run: options => {
    if (options.module) {
      runModule(options);
    } else {
      runCommand(options, options.command);
    }
  },
  print: options => {
    process.stdout.write(JSON.stringify(flavors(options), null, 2) + '\n');
  }
};
