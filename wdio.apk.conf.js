const path = require('path');

export const config = {
  runner: 'local',
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',

  services: ['appium'],

  capabilities: [{
    platformName: 'Android',
    deviceName: 'Android Device', // ✔ real device auto detect
    automationName: 'UiAutomator2',
    app: path.resolve('./apps/app-release_16.apk'), // ✔ dynamic path
    autoGrantPermissions: true,                  // ✔ auto accept permissions
    appWaitActivity: '*',                        // ✔ wait for any launcher activity
  }],

  logLevel: 'info',
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  }
};
