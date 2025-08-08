// pageobjects/AppHandler.js
const logger = require("../utils/logger");
const LoginPage = require("./LoginPage");
const HomePage = require("./homePage"); // Sahi casing 'HomePage'

class AppHandler {
  /**
   * Ye method app ke poore initialisation ko handle karta hai.
   * @param {string} email
   * @param {string} password
   */
  async handleAppInitialisation(email, password) {
    logger.info("ℹ️ App ka initialisation process shuru ho raha hai...");

    // Step 1: Decide karein Login karna hai ya nahi
    try {
      await LoginPage.emailInput.waitForDisplayed({ timeout: 5000 });
      logger.info("➡️ Login screen mili. Login process shuru kiya ja raha hai...");
      await LoginPage.login(email, password);
    } catch (error) {
      logger.info("➡️ User pehle se logged in hai. Home screen flow shuru kiya ja raha hai.");
    }

    // Step 2: Ab Home Page ko bolein ki woh aage ka saara flow khud handle kare.
    // Ye method khud decide karega ki update karna hai ya seedha home screen verify karni hai.
    await HomePage.handleHomePageFlow();
    
    logger.info("✅ Initialisation aur update check poora hua.");
  }
}

module.exports = new AppHandler();
