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
[![Join the chat at https://gitter.im/flavors-js/flavors](https://badges.gitter.im/flavors-js/flavors.svg)](https://gitter.im/flavors-js/flavors?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
</div>

# flavors-cli

CLI tool powered by [Flavors](https://github.com/flavors-js/flavors) configuration management library.<br>
It allows to run commands in the pre-configured environment.

## Install

```text
$ npm install -g flavors-cli
```

## Usage

```text
$ flavors --help

flavors - CLI tool powered by Flavors (https://github.com/flavors-js/flavors) configuration management library. It allows to run commands in the pre-configured environment

Commands:
  index.js print             Load and print configuration in JSON format
  index.js run [command...]  Load configuration and run command

Options:
  --dir-name, -d     Configuration directory name
  --file-name, -f    Configuration file name (excluding extension)
  --loader, -l       Name of a Node.js module or a path to it
  --name, -n         Configuration name                                                                                                                                                                                      [required]
  --separator, -s    Configuration name separator
  --working-dir, -w  Directory from which configuration will be loaded
  --help             Show help                                                                                                                                                                                                [boolean]
  --version          Show version number                                                                                                                                                                                      [boolean]
```

## Maintainers

- [@mxl](https://github.com/mxl)

## License

See the [LICENSE](https://github.com/flavors-js/flavors-cli/blob/master/LICENSE) file for details.
