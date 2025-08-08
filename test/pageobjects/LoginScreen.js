const { expect } = require("chai");
const logger = require("../utils/logger");

class LoginScreen {
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
    try {
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

      await driver.pause(5000);

      const dashboardTitle = await $('//android.widget.TextView[@text="Home"]');
      await dashboardTitle.waitForDisplayed({ timeout: 10000 });

      let isVisible = false;
      try {
        isVisible = await dashboardTitle.isDisplayed();
      } catch (e) {
        logger.warn("⚠️ Home screen not found or timed out");
      }

      if (isVisible) {
        logger.info("✅ Login successful and Home screen loaded");
      } else {
        logger.error("❌ Login failed or Home not visible");
      }

      expect(isVisible).to.be.true;
    } catch (err) {
      const timestamp = Date.now();
      const screenshotPath = `./error_screenshots/login_error_${timestamp}.png`;
      const pageSourcePath = `./error_screenshots/page_source_${timestamp}.xml`;

      await driver.saveScreenshot(screenshotPath);
      const source = await driver.getPageSource();
      require("fs").writeFileSync(pageSourcePath, source);

      logger.error(`❌ Test failed: ${err.message}`);
      logger.error(`📸 Screenshot: ${screenshotPath}`);
      logger.error(`📄 PageSource: ${pageSourcePath}`);
      throw err;
    } finally {
      try {
        const menuIcon = await $$("android.widget.ImageView")[0];
        await menuIcon.click();
        logger.info("☰ Menu opened");

        const logoutBtn = await $('//android.widget.TextView[@text="Logout"]');
        await logoutBtn.waitForDisplayed({ timeout: 5000 });
        await logoutBtn.click();
        logger.info("🚪 Logout clicked");

        const confirmLogoutBtn = await $("id=android:id/button1");
        await confirmLogoutBtn.waitForDisplayed({ timeout: 2000 });
        await confirmLogoutBtn.click();
        logger.info("✅ Logout confirmed");

        await driver.pause(10000);
      } catch (e) {
        logger.warn(`⚠️ Logout may have failed or menu not visible: ${e.message}`);
      }
    }
  }
}

module.exports = new LoginScreen();
