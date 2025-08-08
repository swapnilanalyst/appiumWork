const { spawn, spawnSync } = require("child_process");
const { getConnectedDevices } = require("./device_Connectivity/helper");
const path = require("path");
const fs = require("fs");

function getAppiumCommand() {
  const localAppium = path.join(
    __dirname,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "appium.cmd" : "appium"
  );

  try {
    const result = spawnSync("appium", ["-v"], { stdio: "ignore" });
    if (result.status === 0) return "appium";
  } catch (_) {}

  if (fs.existsSync(localAppium)) {
    return localAppium;
  }

  return "npx appium"; // ✅ return full command
}

const appiumCommand = getAppiumCommand();
console.log(`📦 Using Appium command: ${appiumCommand}`);

const devices = getConnectedDevices();
if (!devices.length) {
  console.error("❌ No devices found");
  process.exit(1);
}

devices.forEach(({ port, deviceId }) => {
const caps = `"${JSON.stringify({ udid: deviceId }).replace(/"/g, '\\"')}"`;

const args = appiumCommand === 'npx appium'
  ? ['appium', '-p', port, '--base-path', '/wd/hub', '--session-override', '--default-capabilities', caps]
  : ['-p', port, '--base-path', '/wd/hub', '--session-override', '--default-capabilities', caps];

  const [cmd, ...cmdArgs] = appiumCommand.split(" ");
  const fullArgs = [...cmdArgs, ...args];

  console.log(`🛠 Spawning: ${cmd} ${fullArgs.join(" ")}`);

  const child = spawn(cmd, fullArgs, {
    stdio: "inherit",
    shell: true, // ✅ THIS FIXES THE WINDOWS CMD SPAWN ISSUE
  });

  child.on("error", (err) => {
    console.error(`❌ Failed to start Appium for ${deviceId}:`, err.message);
  });

  child.on("exit", (code) => {
    console.log(`ℹ️ Appium server for ${deviceId} exited with code ${code}`);
  });

  console.log(`🚀 Appium server started for ${deviceId} on port ${port}`);
});
