// pageobjects/HomePage.js
const logger = require("../utils/logger");

class HomePage {
  // --- Selectors ---
  get homeScreenTitle() {
    // Ye aapki Home screen ka asli title hai. "Home" ko apne app ke title se badal lein.
    return $('//android.widget.TextView[@text="Home"]');
  }

  get popupTitle() {
    return $('//android.widget.TextView[@resource-id="com.salesninjacrm:id/alert_title"]');
  }

  get inAppUpdateButton() {
    return $('//android.widget.Button[@resource-id="android:id/button1"]');
  }

  get playStoreUpdateButton() {
  return $('~Update'); // Tilde ~ means accessibility id
}
  get playStoreOpenButton() {
    return $('~Open'); // Tilde ~ means accessibility id
  }

  // --- Helper Method ---
  async verifyHomePageIsDisplayed() {
    logger.info("ℹ️ Home screen ko verify kiya ja raha hai...");
    await this.homeScreenTitle.waitForDisplayed({ timeout: 15000 });
    logger.info("✅ Home screen safaltapoorvak dikh rahi hai.");
  }
  
  /**
   * Ye hai hamara naya master method jo Home screen par sab kuch handle karega.
   */
  async handleHomePageFlow() {
    logger.info("ℹ️ Home screen ka flow handle kiya ja raha hai...");
    
    try {
      // Sabse pehle, sirf popup dhoondhne ki koshish karein.
      await this.popupTitle.waitForDisplayed({ timeout: 7000 });
      logger.info("✅ 'New Update Available' popup mila! Update cycle shuru kiya ja raha hai.");

      // --- AGAR POPUP MILA TO POORA UPDATE FLOW CHALEGA ---
      await this.inAppUpdateButton.click();
      logger.info("✅ App ke UPDATE button par click kiya.");

      await driver.waitUntil(
        async () => (await driver.getCurrentPackage()) === 'com.android.vending',
        { timeout: 15000, timeoutMsg: 'Google Play Store par redirect nahi hua.' }
      );
      logger.info("✅ Hum Play Store par hain (package 'com.android.vending' confirm hua).");

      await this.playStoreUpdateButton.click();
      logger.info("✅ Play Store par 'Update' button click kiya.");

      logger.info("⏳ App update hone ka intezaar kiya ja raha hai... (2 minute tak wait karega)");
      await this.playStoreOpenButton.waitForDisplayed({ timeout: 180000 });
      logger.info("✅ App safaltapoorvak update ho gayi. 'Open' button dikh raha hai.");

      await this.playStoreOpenButton.click();
      logger.info("✅ 'Open' button par click kiya. App dobara shuru ho rahi hai.");
      
      // AAKHRI STEP: Ab Home Screen ko verify karein.
      await this.verifyHomePageIsDisplayed();
      logger.info("🎉 SUCCESS: Update cycle poora hua aur Home screen safaltapoorvak verify ho gayi!");

    } catch (error) {
      // --- AGAR POPUP NAHI MILA TO SIRF HOME SCREEN VERIFY HOGI ---
      logger.info("ℹ️ Update popup nahi tha. Seedha Home screen ko verify kiya ja raha hai.");
      await this.verifyHomePageIsDisplayed();
    }
  }
}

module.exports = new HomePage();
