const { spawn } = require("child_process");
const { getConnectedDevices } = require("./device_Connectivity/helper");

const BASE_PORT = 4723;

async function startAppiumServers() {
  const devices = getConnectedDevices();

  if (devices.length === 0) {
    console.error("❌ No Android devices connected.");
    process.exit(1);
  }

  console.log("✅ Connected Devices:");
  devices.forEach((device, index) => {
    console.log(`  📱 Device ${index + 1}: ${device.deviceId} | Android ${device.version} | Port: ${BASE_PORT + index * 2}`);
  });

  devices.forEach((device, index) => {
    const port = BASE_PORT + index * 2;
    console.log(`\nStarting Appium server for device ${device.deviceId} on port ${port}...`);

    const args = ["appium", "-p", port, "--session-override", "--log-level", "info"];
    const appiumProcess = spawn("npx", args, { shell: true });

    appiumProcess.stdout.on("data", (data) => {
      console.log(`[Appium ${device.deviceId}]: ${data}`);
    });

    appiumProcess.stderr.on("data", (data) => {
      console.error(`[Appium ${device.deviceId} ERROR]: ${data}`);
    });

    appiumProcess.on("close", (code) => {
      console.log(`[Appium ${device.deviceId}] exited with code ${code}`);
    });

    device.appiumProcess = appiumProcess; // Store reference if needed
  });
}

startAppiumServers();
