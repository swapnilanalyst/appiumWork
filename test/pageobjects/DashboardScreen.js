class DashboardScreen {
  get homeTab() {
    return $('//android.widget.TextView[@text="Home"]');
  }

  get menuIcon() {
    return $$("android.widget.ImageView")[0]; // Assuming 1st icon is ☰ menu
  }

  get logoutBtn() {
    return $('//android.widget.TextView[@text="Logout"]');
  }

  get confirmLogoutBtn() {
    return $("id=android:id/button1");
  }

  async validateHomeScreen() {
    try {
      await this.homeTab.waitForDisplayed({ timeout: 10000 });
      const visible = await this.homeTab.isDisplayed();
      console.log("✅ Login successful and Home screen loaded");
      return visible;
    } catch {
      console.warn("⚠️ Home screen not found or timed out");
      return false;
    }
  }

  async logout() {
    try {
      await this.menuIcon.click();
      console.log("☰ Menu opened");

      await this.logoutBtn.waitForDisplayed({ timeout: 5000 });
      await this.logoutBtn.click();
      console.log("🚪 Logout clicked");

      await this.confirmLogoutBtn.waitForDisplayed({ timeout: 2000 });
      await this.confirmLogoutBtn.click();
      console.log("✅ Logout confirmed");

      await driver.pause(10000);
    } catch (e) {
      console.warn("⚠️ Logout may have failed or menu not visible:", e.message);
    }
  }
}

module.exports = new DashboardScreen();
