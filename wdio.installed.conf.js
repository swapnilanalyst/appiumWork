export const config = {
  // ... rest of setup
  services: ['appium'],
  port: 4723,
  capabilities: [{
    platformName: 'Android',
    deviceName: 'emulator-5554',
    automationName: 'UiAutomator2',
    appPackage: 'com.example.myapp',
    appActivity: '.MainActivity',
    noReset: true
  }]
}
