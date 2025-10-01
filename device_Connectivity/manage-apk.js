const { execSync } = require('child_process');
const path = require('path');

const packageName = 'com.salesninjacrm'; // 👈 your app package
const apkPath = path.resolve(__dirname, '../apps/snc_live_1.apk');   // 👈 APK path

// Get devices dynamically
function getConnectedDevices() {
  const output = execSync('adb devices').toString();
  return output
    .split('\n')
    .filter(line => line.trim().endsWith('device') && !line.includes('List of devices'))
    .map(line => line.split('\t')[0].trim());
}

// Uninstall app from device
function uninstallApp(deviceId) {
  try {
    console.log(`📱 [${deviceId}] ➤ Uninstalling ${packageName}...`);
    const result = execSync(`adb -s ${deviceId} uninstall ${packageName}`).toString();
    console.log(`   ✅ Uninstalled: ${result.trim()}`);
  } catch (error) {
    console.log(`   ❌ Uninstall failed on ${deviceId}`);
  }
}

// Install app to device
function installApp(deviceId) {
  try {
    console.log(`📱 [${deviceId}] ➤ Installing APK...`);
    const result = execSync(`adb -s ${deviceId} install ${apkPath}`).toString();
    console.log(`   ✅ Installed: ${result.trim()}`);
  } catch (error) {
    console.log(`   ❌ Install failed on ${deviceId}`);
  }
}

// Clear app data on device
function clearAppData(deviceId) {
  try {
    console.log(`📱 [${deviceId}] ➤ Clearing data/cache...`);
    const result = execSync(`adb -s ${deviceId} shell pm clear ${packageName}`).toString();
    console.log(`   🧹 Cleared: ${result.trim()}`);
  } catch (error) {
    console.log(`   ❌ Clear failed on ${deviceId}`);
  }
}

// Restricted install workaround
function restrictedInstall(deviceId) {
  try {
    console.log(`📱 [${deviceId}] 🚫 Restricted install: pushing APK manually...`);
    execSync(`adb -s ${deviceId} push "${apkPath}" /sdcard/`);
    execSync(`adb -s ${deviceId} shell am start -a android.intent.action.VIEW -d "file:///sdcard/${path.basename(apkPath)}" -t application/vnd.android.package-archive`);
    console.log(`   📦 Pushed APK. Please confirm install manually on device.`);
  } catch {
    console.log(`   ❌ Restricted install failed on ${deviceId}`);
  }
}
// 🔧 CHANGES: Added helper to extract specific device if passed
function getTargetDeviceFromArgs() {
  const index = process.argv.indexOf('--s');
  if (index !== -1 && process.argv[index + 1]) {
    return process.argv[index + 1];
  }
  return null;
}

/// --------- Main Controller ---------

const arg = process.argv[2]; // --install / --uninstall / --both / --clear / --restricted

const targetDevice = getTargetDeviceFromArgs(); // 🔧 NEW: check if user specified a device
const devices = getConnectedDevices();

// 🔧 Use only targetDevice if specified, otherwise use all devices
const devicesToProcess = targetDevice ? [targetDevice] : devices;

if (!arg || !['--install', '--uninstall', '--both', '--clear', '--restricted'].includes(arg)) {
  console.log(`
❓ Usage:
  node manage-apk.js --install         📲 Only install APK
  node manage-apk.js --uninstall       🗑️  Only uninstall app
  node manage-apk.js --both            🔁 Uninstall + then install
  node manage-apk.js --clear           🧹 Clear app data/cache
  node manage-apk.js --restricted      🚫 Workaround for restricted ADB installs (Xiaomi etc.)
  
  👉 Optional: Add "--s <deviceId>" to apply command to a specific device only.
  Example: node manage-apk.js --restricted --s 192.168.1.153:5555
  `);
  process.exit();
}

if (devicesToProcess.length === 0) {
  console.log('⚠️  No devices connected.');
  process.exit();
}

console.log(`\n🚀 Devices Found: ${devicesToProcess.length}\n`);

devicesToProcess.forEach(deviceId => {
  if (arg === '--uninstall') uninstallApp(deviceId);
  else if (arg === '--install') installApp(deviceId);
  else if (arg === '--both') {
    uninstallApp(deviceId);
    installApp(deviceId);
  } else if (arg === '--clear') clearAppData(deviceId);
  else if (arg === '--restricted') restrictedInstall(deviceId); // 🔧 NEW: supports manual install for restricted devices

  console.log('-----------------------------------');
});
