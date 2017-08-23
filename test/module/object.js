'use strict';

module.exports = {
  command: config => ({
    command: 'echo',
    args: [config.value]
  }),
  options: {
    transform: config => {
      config.value += 1;
      return config;
    }
  }
};
