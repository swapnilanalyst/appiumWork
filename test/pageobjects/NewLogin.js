const { expect } = require("chai");
const logger = require("../utils/logger");
const handlePermissions = require('../utils/permissions'); // Importing permission handler

class NewLogin {
  get emailInput() {
    return $('//android.widget.EditText[@text="Email address"]');
  }

  get passwordInput() {
    return $('//android.widget.EditText[@text="Password"]');
  }

  get continueBtn() {
    return $('//android.view.ViewGroup[@content-desc="CONTINUE"]');
  }

  async login(email, password) {
    await this.emailInput.waitForDisplayed({ timeout: 20000 });
    await this.emailInput.clearValue();
    await this.emailInput.setValue(email);
    logger.info("✅ Email entered");

    await this.passwordInput.clearValue();
    await this.passwordInput.setValue(password);
    logger.info("✅ Password entered");

    await this.continueBtn.waitForDisplayed({ timeout: 10000 });
    const buttonLabel = await this.continueBtn.getAttribute("content-desc");
    await this.continueBtn.click();
    logger.info(`✅ Clicked on "${buttonLabel}" button`);

    // 🟢 Handle runtime permissions after login if needed
    try {
  await handlePermissions(driver);
  logger.info("✅ All permissions handled successfully.");
} catch (err) {
  logger.error(`❌ Permission handling failed: ${err.message}`);
  throw err; 
}

    // Optional pause if needed
    await driver.pause(3000);
  }
}

module.exports = new NewLogin();
