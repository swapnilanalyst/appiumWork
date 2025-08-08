const { expect } = require("chai");
const testData = require("../utils/testData");
const handlePermissions = require('../utils/permissions');
const LoginScreen = require("../pageobjects/LoginScreen");
const DashboardScreen = require("../pageobjects/DashboardScreen");
const logger = require("../utils/logger");
const NewLogin = require("../pageobjects/NewLogin");
const AppHandler = require("../pageobjects/VersionUpdate");

describe("Sales Ninja App - Fresh Install Login Flow", () => {
  let deviceName;
  let credentials;

  before(async () => {
    const testFile = __filename.split("test")[1]; // ✅ Moved inside before()
    deviceName = await driver.capabilities.deviceName || "UNKNOWN_DEVICE";
    const startTime = new Date().toLocaleTimeString();

    console.log(`⏱️ STARTING TEST on ${deviceName} | File: ${testFile} | Time: ${startTime}`);

    credentials = testData[deviceName];
    if (!credentials) {
      logger.error(`❌ No login data found for device: ${deviceName}`);
      throw new Error(`No login data found for ${deviceName}`);
    }

    logger.info(`🚀 Starting test on device: ${deviceName}`);
    logger.info(`🔐 Using email: ${credentials.email}`);
  });

  // it("Login with valid email and password", async () => {
  //   try {
  //     const { email, password } = credentials;
  //     const emailField = await $('//android.widget.EditText[@text="Email address"]');
  //     await emailField.waitForDisplayed({ timeout: 10000 });

  //     await NewLogin.login(email, password);
  //     logger.info(`✅ Login test completed on ${deviceName}`);
  //   } catch (err) {
  //     logger.error(`❌ Login test failed on ${deviceName}: ${err.message}`);
  //     throw err;
  //   }
  // });

  // // // Uncomment as needed
  it("Handle app permission popups (fresh install only)", async () => {
    try {
       const { email, password } = credentials;
      const emailField = await $('//android.widget.EditText[@text="Email address"]');
      await emailField.waitForDisplayed({ timeout: 10000 });

      await NewLogin.login(email, password);
      logger.info(`✅ Login test completed on ${deviceName}`);
    } catch (err) {
      logger.error(`❌ Login test failed on ${deviceName}: ${err.message}`);
      throw err;
    }
  });

  // it("Validate Home screen and logout", async () => {
  //   const isVisible = await DashboardScreen.validateHomeScreen();
  //   expect(isVisible).to.be.true;
  //   logger.info(`🏠 Home screen validated on ${deviceName}`);

  //   await DashboardScreen.logout();
  //   logger.info(`🚪 Logout successful on ${deviceName}`);
  // });

  //   it("Checking Version update functionality", async () => {
  //   try {
  //     const { email, password } = credentials;
  //     const emailField = await $('//android.widget.EditText[@text="Email address"]');
  //     await emailField.waitForDisplayed({ timeout: 10000 });

  //     await VersionUpdate.login(email, password);
  //     logger.info(`✅ Now application up to date ${deviceName}`);
  //   } catch (err) {
  //     logger.error(`❌ Login test failed on ${deviceName}: ${err.message}`);
  //     throw err;
  //   }
  // });

  //  it("should handle initial screen and check for version update", async () => {
  //   try {
  //     const { email, password } = credentials;

  //     // Hamara smart handler jo saara initial kaam karega.
  //     await AppHandler.handleAppInitialisation(email, password);

  //     logger.info(`✅ Initial setup (login & update check) completed successfully on ${deviceName}`);

  //     // Optional: Aap yahan confirm kar sakte hain ki aap Home/Dashboard screen par hain.
  //     const isVisible = await DashboardScreen.validateHomeScreen();
  //     expect(isVisible).to.be.true;
  //     logger.info(`🏠 Home screen validated on ${deviceName}`);

  //   } catch (err) {
  //     logger.error(`❌ Test failed during initial setup on ${deviceName}: ${err.message}`);
  //     throw err; // Test ko fail karein
  //   }
  // });

    after(async () => {
    const endTime = new Date().toLocaleTimeString(); // ✅ End time
    console.log(`✅ FINISHED TEST on ${deviceName} | Time: ${endTime}`); // ✅ LOG ADDED
  });
});
