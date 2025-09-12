// pageobjects/LoginPage.js
const logger = require("../utils/logger");

class LoginPage {
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
    logger.info("ℹ️ Login process shuru kiya ja raha hai...");
    await this.emailInput.waitForDisplayed({ timeout: 20000 });
    await this.emailInput.setValue(email);
    logger.info("✅ Enter email");

    await this.passwordInput.setValue(password);
    logger.info("✅ Enter password");

    await this.continueBtn.click();
    logger.info("✅ CONTINUE button par click kiya");
  }
}

module.exports = new LoginPage();
