'use strict';

const
  assert = require('assert'),
  child = require('child_process'),
  path = require('path');

function testPath(...names) {
  return path.resolve(__dirname, ...names);
}

const
  commonTestPath = testPath('commonTest'),
  cliPath = path.resolve(__dirname, '..','index.js');

describe('cli', () => {
  it('prints config', () => {
    assert.equal(child.execSync(`${cliPath} -w ${commonTestPath} -n a print`).toString(), '{\n  "value": 1\n}\n');
  });
  it('initializes environment', () => {
    assert.equal(child.execSync(`${cliPath} -w ${commonTestPath} -n a run -c 'echo $value'`).toString(), '1\n');
  });
  it('skips environment initialization', () => {
    assert.equal(child.execSync(`${cliPath} -w ${commonTestPath} -n a run --skip-env -c 'echo $value'`).toString(), '\n');
  });
  it('flattens config', () => {
    assert.equal(child.execSync(`${cliPath} -w ${testPath('nested')} -n a run -c 'echo $nested_value'`).toString(), '1\n');
  });
  it('applies transform', () => {
    assert.equal(child.execSync(`${cliPath} -w ${commonTestPath} -n a -t ${testPath('transform', 'index.js')} run -c 'echo $value'`).toString(), '2\n');
  });
  it('applies configDirName', () => {
    assert.equal(child.execSync(`${cliPath} -w ${testPath('configDirName')} -n a -d config run -c 'echo $value'`).toString(), '1\n');
  });
  it('applies configFileName', () => {
    assert.equal(child.execSync(`${cliPath} -w ${testPath('configFileName')} -n a -f custom run -c 'echo $value'`).toString(), '1\n');
  });
  it('applies loaders', () => {
    assert.equal(child.execSync(`${cliPath} -w ${testPath('loaders')} -n a-b-c -l ${testPath('..', 'node_modules', 'flavors', 'jsonLoader.js')} -l flavors/jsLoader -l flavors-loader-yaml run -c 'echo $value1$value2$value3'`).toString(), '123\n');
  });
  it('execs command from Node.js module', () => {
    assert.equal(child.execSync(`${cliPath} -w ${testPath('module')} -n a run -m -c ${testPath('module', 'exec.js')}`).toString(), '1\n');
  });
  it('spawns command from Node.js module', () => {
    assert.equal(child.execSync(`${cliPath} -w ${testPath('module')} -n a run -m -c ${testPath('module', 'spawn.js')}`).toString(), '1\n');
  });
});