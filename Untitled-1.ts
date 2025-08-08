const { expect } = require("chai");
const testData = require("../utils/testData"); // ✅ Adjust path as needed
const appPackage = "com.salesninjacrm";

describe("Sales Ninja App - Login Test", () => {
  let deviceName;
  let credentials;

  before(async () => {
    // ✅ Get device name used in current test run
    deviceName = await driver
      .getDeviceTime()
      .then(() => driver.capabilities.deviceName);
    credentials = testData[deviceName];
    if (!credentials) throw new Error(No login data found for ${deviceName});
  });

  // ✅ Login flow test
  it("should login successfully and validate dashboard", async () => {
    const { email, password } = credentials;
    try {
      // 🔐 Email input
      const emailInput = await $(
        '//android.widget.EditText[@text="Email address"]'
      );
      await emailInput.waitForDisplayed({ timeout: 20000 });
      await emailInput.clearValue();
      await emailInput.setValue(email);
      console.log("✅ Email entered");

      // 🔐 Password input
      const passwordField = await $(
        '//android.widget.EditText[@text="Password"]'
      );
      await passwordField.clearValue();
      await passwordField.setValue(password);
      console.log("✅ Password entered");

      const continueBtn = await $(
        '//android.view.ViewGroup[@content-desc="CONTINUE"]'
      );
      await continueBtn.waitForDisplayed({ timeout: 10000 });
      const buttonLabel = await continueBtn.getAttribute("content-desc");
      await continueBtn.click();
      console.log(✅ Clicked on "${buttonLabel}" button);

      // ⏳ Wait after click to allow "Loading..." and dashboard to load
      await driver.pause(5000);

      // 📍 Validate Home tab
      const dashboardTitle = await $('//android.widget.TextView[@text="Home"]');

      // Wait for Home screen to be visible
      await dashboardTitle.waitForDisplayed({ timeout: 10000 });

      let isVisible = false;
      try {
        isVisible = await dashboardTitle.isDisplayed();
      } catch (e) {
        console.warn("⚠️ Home screen not found or timed out");
      }

      if (isVisible) {
        console.log("✅ Login successful and Home screen loaded");
      } else {
        console.log("❌ Login failed or Home not visible");
      }

      expect(isVisible).to.be.true;
    } catch (err) {
      console.error("❌ Test failed with error:", err.message);
      throw err;
    } finally {
      // Attempt logout if app is still running
      try {
        const menuIcon = await $$("android.widget.ImageView")[0];
        await menuIcon.click();
        console.log("☰ Menu opened");

        const logoutBtn = await $('//android.widget.TextView[@text="Logout"]');
        await logoutBtn.waitForDisplayed({ timeout: 5000 });
        await logoutBtn.click();
        console.log("🚪 Logout clicked");

        const confirmLogoutBtn = await $("id=android:id/button1");
        await confirmLogoutBtn.waitForDisplayed({ timeout: 2000 });
        await confirmLogoutBtn.click();
        console.log("✅ Logout confirmed");

        await driver.pause(10000);
      } catch (e) {
        console.warn(
          "⚠️ Logout may have failed or menu not visible:",
          e.message
        );
      }

      // ✅ Ensure app is closed after test
      // await driver.closeApp();
      // console.log("📱 App closed after test");
    }
  });
});

// 🔘 CONTINUE button ko coordinates se tap karo, then verify "Loading..." text
// async function clickContinueButton() {
//   try {
//     // 🔍 ViewGroup first attempt (if present and clickable)
//     const viewGroup = await $('//android.view.ViewGroup[@content-desc="CONTINUE"]');
//     await viewGroup.waitForDisplayed({ timeout: 5000 });

//     const { x, y, width, height } = await viewGroup.getRect();
//     const centerX = x + width / 2;
//     const centerY = y + height / 2;

//     console.log(🧭 ViewGroup CONTINUE bounds: [x=${x}, y=${y}, w=${width}, h=${height}]);
//     await driver.touchAction({ action: 'tap', x: centerX, y: centerY });
//     console.log('✅ CONTINUE tapped via ViewGroup');

//   } catch (err1) {
//     console.warn(⚠️ ViewGroup tap failed, trying TextView fallback);

//     try {
//       // 🟡 Fallback: use TextView's bounds if ViewGroup fails
//       const textView = await $('//android.widget.TextView[@text="CONTINUE"]');
//       await textView.waitForDisplayed({ timeout: 5000 });

//       const { x, y, width, height } = await textView.getRect();
//       const centerX = x + width / 2;
//       const centerY = y + height / 2;

//       console.log(📍 TextView CONTINUE bounds: [x=${x}, y=${y}, w=${width}, h=${height}]);
//       await driver.touchAction({ action: 'tap', x: centerX, y: centerY });
//       console.log('✅ CONTINUE tapped via TextView fallback');

//     } catch (err2) {
//       console.error(❌ Fallback tap failed: ${err2.message});
//       throw err2;
//     }
//   }
// }
