
module.exports = async function handlePermissions(driver) {
  
  //Step 1: Access Call History
  try {
    console.log("📞 Step 1: Access Call History...");
    const callHistoryBtn = await driver.$("~ALLOW ACCESS");
    await callHistoryBtn.waitForExist({ timeout: 5000 });
    await callHistoryBtn.click();
     await driver.pause(1000);
    const confirm1 = await driver.$(
      'android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_button")'
    );
    await confirm1.waitForExist({ timeout: 5000 });
    await confirm1.click();
  } catch (err) {
    throw new Error("❌ Step 1 Failed: Call history - " + err.message);
  }

   await driver.pause(1000);

  //Step 2: Access Phone Number
  try {
    console.log("📱 Step 2: Access Phone Number...");
    const phoneNumberBtn = await driver.$("~ALLOW ACCESS");
    await phoneNumberBtn.waitForExist({ timeout: 5000 });
    await phoneNumberBtn.click();
     await driver.pause(1000);
    const confirm2 = await driver.$(
      'android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_button")'
    );
    await confirm2.waitForExist({ timeout: 5000 });
    await confirm2.click();
  } catch (err) {
    throw new Error("❌ Step 2 Failed: Phone number - " + err.message);
  }
   await driver.pause(1000);
  // Step 3: Access Contacts
  try {
    console.log("📇 Step 3: Access Contacts...");
    const contactsBtn = await driver.$("~ALLOW ACCESS");
    await contactsBtn.waitForExist({ timeout: 5000 });
    await contactsBtn.click();

    const confirm3 = await driver.$(
      'android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_button")'
    );
    await confirm3.waitForExist({ timeout: 5000 });
    await confirm3.click();
  } catch (err) {
    throw new Error("❌ Step 3 Failed: Contacts - " + err.message);
  }

  // Step 4: Access Call State
  try {
    console.log("📶 Step 4: Call State...");
    const callStateBtn = await driver.$("~ALLOW ACCESS");
    await callStateBtn.waitForExist({ timeout: 5000 });
    await callStateBtn.click();
  } catch (err) {
    throw new Error("❌ Step 4 Failed: Call state - " + err.message);
  }

  // Step 5: Media Audio
  try {
    console.log("🎧 Step 5: Media Audio...");
    const mediaAudioBtn = await driver.$("~ALLOW ACCESS");
    await mediaAudioBtn.waitForExist({ timeout: 5000 });
    await mediaAudioBtn.click();

    const confirm5 = await driver.$(
      'android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_button")'
    );
    await confirm5.waitForExist({ timeout: 5000 });
    await confirm5.click();
  } catch (err) {
    throw new Error("❌ Step 5 Failed: Media audio - " + err.message);
  }

  // Step 6: Folder Access for recording files
  try {
    console.log('📂 Step 6: Grant folder access via "USE THIS FOLDER"...');

    // Step 6.1: Tap "USE THIS FOLDER"
    const useThisFolderBtn = await driver.$(
      '//android.widget.Button[@resource-id="android:id/button1" and @text="USE THIS FOLDER"]'
    );
    await useThisFolderBtn.waitForExist({ timeout: 10000 });
    await useThisFolderBtn.click();
    console.log('✅ Clicked "USE THIS FOLDER"');

    // Step 6.2: Tap "ALLOW" on system permission popup
    const allowAccessBtn = await driver.$(
      '//android.widget.Button[@resource-id="android:id/button1" and @text="ALLOW"]'
    );
    await allowAccessBtn.waitForExist({ timeout: 10000 });
    await allowAccessBtn.click();
    console.log('✅ Confirmed folder access with "ALLOW"');
  } catch (err) {
    throw new Error(
      "❌ Step 6 Failed: Folder access permission - " + err.message
    );
  }

  // Step 7: Notifications
  try {
    console.log("🔔 Step 7: Enable Notifications...");

    const notifBtn = await driver.$("~ALLOW ACCESS");

    // Optional: check if visible
    const isDisplayed = await notifBtn.isDisplayed().catch(() => false);

    if (isDisplayed) {
      await notifBtn.click();
      console.log("✅ Clicked 'ALLOW ACCESS'");
    } else {
      console.log(
        "ℹ️ Notification permission screen skipped or already granted"
      );
    }

    const confirm7 = await driver.$(
      'android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_button")'
    );

    const isConfirmVisible = await confirm7.isDisplayed().catch(() => false);
    if (isConfirmVisible) {
      await confirm7.click();
      console.log("✅ Allowed notifications via system dialog");
    } else {
      console.log(
        "ℹ️ System permission popup not shown — likely already granted"
      );
    }
  } catch (err) {
    console.warn("⚠️ Step 7 warning (not critical):", err.message);
    // Do not throw here to allow step 8 to proceed
    console.log("➡️ Proceeding to Step 8...");
  }

  // Step 8: Display Over Other Apps
  try {
    console.log("🧩 Step 8: Display Over Other Apps...");

    // Step 8.1: Scroll to find 'salesninjacrm' app label
    await driver.$(
      'android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("salesninjacrm")'
    );
    const appLabel = await driver.$(
      'android=new UiSelector().text("salesninjacrm")'
    );
    await appLabel.waitForExist({ timeout: 10000 });
    await appLabel.click();
    console.log('✅ Opened "salesninjacrm" overlay settings');

   let toggleSwitch;
    try {
      toggleSwitch = await driver.$(
        'android=new UiSelector().resourceId("com.android.settings:id/switchWidget")'
      );
      if (!(await toggleSwitch.isExisting())) {
        toggleSwitch = await driver.$(
          'android=new UiSelector().resourceId("android:id/switch_widget")'
        );
      }
    } catch {
      toggleSwitch = await driver.$(
        'android=new UiSelector().resourceId("android:id/switch_widget")'
      );
    }

    await toggleSwitch.waitForExist({ timeout: 7000 });
    const isChecked = await toggleSwitch.getAttribute("checked");
    console.log("Toggle checked status:", isChecked);

    if (isChecked === "false") {
      const location = await toggleSwitch.getLocation();
      const size = await toggleSwitch.getSize();
      const centerX = location.x + size.width / 2;
      const centerY = location.y + size.height / 2;

      await driver.execute("mobile: clickGesture", { x: centerX, y: centerY });
      console.log("✅ Toggled ON the overlay permission using clickGesture");
    } else {
      console.log("ℹ️ Overlay permission already enabled");
    }

    // Step 8.3: Navigate back twice to reach dashboard
    await driver.back(); // Back from salesninjacrm settings
    await driver.back(); // Back from Display Over Apps list
    console.log("🔙 Navigated back to main screen");
  } catch (err) {
    throw new Error("❌ Step 8 Failed: Overlay permission - " + err.message);
  }
  
  await driver.pause(10000); 
  // Step 9: Verify HomePage
  try {
    console.log("✅ Step 9: Verifying HomePage...");

    const dashboardEl = await driver.$('android=new UiSelector().text("Home")');
    await dashboardEl.waitForExist({ timeout: 10000 });

    console.log("🎉 Reached HomePage successfully");
  } catch (err) {
    throw new Error("❌ Step 9 Failed: HomePage not found - " + err.message);
  }
};