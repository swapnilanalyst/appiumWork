// const path = require("path");
// const glob = require("glob");
// const { getConnectedDevices } = require("./device_Connectivity/helper");

// const BASE_PORT = 4723;
// const devices = getConnectedDevices();

// if (devices.length === 0) {
//   console.error("❌ No Android devices connected. Please connect at least one device via ADB.");
//   process.exit(1);
// }

// console.log("✅ Connected Devices:");
// devices.forEach((d, i) =>
//   console.log(`Device ${i + 1}: ${d.deviceId} | Android ${d.version}`)
// );

// // Load specs
// const specsPath = glob.sync("./test/specs/**/*.test.js", { cwd: __dirname });

// exports.config = {
//   runner: "local",
//   hostname: "127.0.0.1",
//   port: 4723,
//   path: "/",

//   specs: specsPath,
//   exclude: [],

//   maxInstances: devices.length, // Global parallel test instances

//   capabilities: devices.map((d, index) => ({
//     platformName: "Android",
//     "appium:automationName": "UiAutomator2",
//     "appium:deviceName": d.deviceId,
//     "appium:platformVersion": d.version,
//     "appium:app": path.resolve("./apps/snc_live_35_version.apk"),
//     "appium:appPackage": "com.salesninjacrm",
//     "appium:appActivity": ".MainActivity",
//     "appium:noReset": true,
//     "appium:fullReset": false,
//     "appium:disableHiddenApiPolicyPrePApps": true,
//     "appium:autoGrantPermissions": true,
//     "appium:ignoreHiddenApiPolicyError": true,
//      port: BASE_PORT + index * 2

//     // Uncomment below if running multiple Appium servers per device
//     // port: 4723 + index * 2, // e.g. 4723, 4725, 4727, ...
//   })),

//   // {
//   //   platformName: "Android",
//   //   "appium:automationName": "UiAutomator2",
//   //   // "appium:deviceName": "10BF1X20MY003KN",
//   //   "appium:deviceName": "10BE4H1NDS0005S",
//   //   "appium:platformVersion": "14",
//   //   "appium:app": path.resolve("./apps/dev_16_july.apk"),
//   //   "appium:appPackage": "com.salesninjacrm",
//   //   "appium:appActivity": ".MainActivity",
//   //   "appium:noReset": true,
//   //   "appium:fullReset": false,
//   //   "appium:autoGrantPermissions": true,
//   //   "appium:ignoreHiddenApiPolicyError": true,
//   // },
//   // {
//   //   platformName: "Android",
//   //   "appium:automationName": "UiAutomator2",
//   //   "appium:deviceName": "10BF1X20MY003KN",
//   //   "appium:platformVersion": "14",
//   //   "appium:app": path.resolve("./apps/dev_16_july.apk"),
//   //   "appium:appPackage": "com.salesninjacrm",
//   //   "appium:appActivity": ".MainActivity",
//   //   "appium:noReset": true,
//   //   "appium:fullReset": false,
//   //   "appium:autoGrantPermissions": true,
//   //   "appium:ignoreHiddenApiPolicyError": true,
//   // },

//   logLevel: "info",
//   bail: 0,
//   waitforTimeout: 10000,
//   connectionRetryTimeout: 120000,
//   connectionRetryCount: 3,

//   services: [],

//   framework: "mocha",
//   reporters: ["spec"],

//   mochaOpts: {
//     ui: "bdd",
//     timeout: 60000,
//   },

//   // 🔁 Dynamic error log per device
//   afterTest: async function (test, context, { error, passed }) {
//     const deviceName = browser.capabilities["appium:deviceName"];
//     if (error) {
//       console.error(`❌ Device: ${deviceName} | ❌ Test Failed: ${test.title} | Error: ${error.message}`);
//     } else {
//       console.log(`✅ Device: ${deviceName} | ✅ Test Passed: ${test.title}`);
//     }
//   },
// };


// const path = require("path");
// const glob = require("glob");
// const { getConnectedDevices } = require("./device_Connectivity/helper");

// // Base ports (we make unique ports per device using index)
// const BASE_APPIUM_PORT = 4723; // Appium server ports: 4723, 4725, 4727, ...
// const BASE_SYSTEM_PORT = 8200; // UiAutomator2 internal ports: 8200, 8201, ...
// const BASE_CHROMEDRIVER_PORT = 9515; // Chromedriver ports (only needed if WebView): 9515, 9516, ...

// // Simple wait helper
// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// // Get connected devices
// const devices = getConnectedDevices();

// if (!devices || devices.length === 0) {
// console.error("❌ No Android devices found. Connect at least one device via ADB and try again.");
// process.exit(1);
// }

// console.log("✅ Connected Devices:");
// devices.forEach((d, i) => {
// console.log( `- Device ${i + 1}: ${d.deviceId} | Android ${d.version}`);
// });

// // Find all test files
// const specsPath = glob.sync("./test/specs/**/*.test.js", { cwd: __dirname });

// exports.config = {
// runner: "local",
// hostname: "127.0.0.1",
// port: 4723, // Default launcher port (each device capability uses its own port below)
// path: "/",

// specs: specsPath,
// exclude: [],

// // Run as many tests in parallel as connected devices
// maxInstances: devices.length,

// // One capability per device
// capabilities: devices.map((d, index) => ({
// platformName: "Android",
// "appium:automationName": "UiAutomator2",

// // Make sure each WDIO worker talks to the correct device
// "appium:udid": d.deviceId,
// "appium:deviceName": d.deviceId,
// "appium:platformVersion": d.version,

// // App details
// "appium:app": path.resolve("./apps/snc_live_35_version.apk"),
// "appium:appPackage": "com.salesninjacrm",
// "appium:appActivity": ".MainActivity",

// // Keep app state, auto grant permissions, and ignore hidden API errors
// "appium:noReset": true,
// "appium:fullReset": false,
// "appium:autoGrantPermissions": true,
// "appium:disableHiddenApiPolicyPrePApps": true,
// "appium:ignoreHiddenApiPolicyError": true,

// // Important: unique internal ports for true parallel runs
// "appium:systemPort": BASE_SYSTEM_PORT + index,            // 8200, 8201, ...
// "appium:chromedriverPort": BASE_CHROMEDRIVER_PORT + index, // 9515, 9516, ... (safe even if WebView not used)

// // Give UiAutomator2 a bit more time to install/start
// "appium:uiautomator2ServerInstallTimeout": 60000,
// "appium:uiautomator2ServerLaunchTimeout": 60000,
// "appium:newCommandTimeout": 180,

// // Tell WDIO which Appium server port to use for this device
// port: BASE_APPIUM_PORT + index * 2, // 4723, 4725, 4727, ...
// })),

// logLevel: "info",
// bail: 0,
// waitforTimeout: 10000,
// connectionRetryTimeout: 120000,
// connectionRetryCount: 3,
// services: [],
// framework: "mocha",
// reporters: ["spec"],
// mochaOpts: {
// ui: "bdd",
// timeout: 60000,
// },

// // Small delay per device so all sessions don’t start at exactly the same moment.
// // This helps avoid ADB/installation clashes when running 3+ devices.
// beforeSession: async function (_config, caps) {
// const idx = typeof caps.wdioIndex === "number" ? caps.wdioIndex : 0;
// const delayMs = idx * 1500; // 1.5s for device #2, 3s for device #3, etc.
// if (delayMs > 0) {
// console.log(`⏳ Waiting ${delayMs}ms before starting session for device index ${idx}`);
// await sleep(delayMs);
// }
// },

// // Simple per-test result log with device name
// afterTest: async function (test, _context, { error }) {
// const deviceName = browser.capabilities["appium:deviceName"];
// if (error) {
// console.error(`❌ ${deviceName} | Failed: ${test.title} | ${error.message}`);
// } else {
// console.log(`✅ ${deviceName} | Passed: ${test.title}`);
// }
// },
// };


/* wdio.conf.js */
const path = require("path");
const glob = require("glob");
const { execSync } = require("child_process");

// ---- Configurable base ports ----
const BASE_APPIUM_PORT = 4723;        // 4723, 4725, 4727, ...
const BASE_SYSTEM_PORT = 8200;        // 8200, 8201, ...
const BASE_CHROMEDRIVER_PORT = 9515;  // 9515, 9516, ...

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Central device lister with silent mode
function listConnectedDevices({ silent = false } = {}) {
  let devices = [];
  try {
    const out = execSync("adb devices -l", { encoding: "utf8" });
    const lines = out.split("\n").slice(1).filter((l) => l.trim());
    for (const line of lines) {
      if (!/\sdevice(\s|$)/.test(line)) continue;
      const serial = line.trim().split(/\s+/)[0];
      let version = "unknown";
      try {
        version = execSync(`adb -s ${serial} shell getprop ro.build.version.release`, { encoding: "utf8" }).trim();
      } catch (_) {}
      devices.push({ deviceId: serial, version });
    }
  } catch (e) {
    if (!silent) console.error("ADB error while listing devices:", e.message);
  }
  if (!silent && devices.length) {
    console.log("✅ Connected Devices:");
    devices.forEach((d, i) => console.log(`- Device ${i + 1}: ${d.deviceId} | Android ${d.version}`));
  }
  return devices;
}

// Build capabilities from a device list
function buildCaps(devices) {
  return devices.map((d, index) => ({
    platformName: "Android",
    "appium:automationName": "UiAutomator2",

    "appium:udid": d.deviceId,
    "appium:deviceName": d.deviceId,
    "appium:platformVersion": d.version,

    "appium:app": path.resolve("./apps/snc_live_35_version.apk"),
    "appium:appPackage": "com.salesninjacrm",
    "appium:appActivity": ".MainActivity",

    "appium:noReset": true,
    "appium:fullReset": false,
    "appium:autoGrantPermissions": true,
    "appium:disableHiddenApiPolicyPrePApps": true,
    "appium:ignoreHiddenApiPolicyError": true,

    "appium:systemPort": BASE_SYSTEM_PORT + index,
    "appium:chromedriverPort": BASE_CHROMEDRIVER_PORT + index,

    "appium:uiautomator2ServerInstallTimeout": 60000,
    "appium:uiautomator2ServerLaunchTimeout": 60000,
    "appium:newCommandTimeout": 180,

    // Note: per-capability port requires using multiple Appium servers; if you run a single Appium server,
    // remove this "port" field and start one server at a single port. If you spawn multiple servers, keep it.
    // port: BASE_APPIUM_PORT + index * 2,
  }));
}

// Discover devices eagerly so WDIO sees non-empty capabilities at load time.
// This ensures the launcher validator doesn't fail with "Missing capabilities".
let resolvedDevices = [];
let resolvedCapabilities = [];
try {
  // Only print once unless a rerun without fresh process
  const printed = process.env.DEVICES_PRINTED === "1";
  resolvedDevices = listConnectedDevices({ silent: printed });
  if (resolvedDevices.length === 0) {
    // Leave capabilities empty for now; onPrepare will still abort with a clear message.
    // We avoid process.exit here to let WDIO show config errors gracefully if any.
  } else {
    resolvedCapabilities = buildCaps(resolvedDevices);
    process.env.DEVICES_PRINTED = "1";
  }
} catch (_) {}

// Specs discovery
const specsPath = glob.sync("./test/specs/**/*.test.js", { cwd: __dirname });

// Export config
exports.config = {
  runner: "local",
  hostname: "127.0.0.1",
  port: 4723,
  path: "/",

  specs: specsPath,
  exclude: [],

  // Make sure WDIO sees something here; fallback to 1 if no devices yet
  maxInstances: resolvedDevices.length > 0 ? resolvedDevices.length : 1,
  capabilities: resolvedCapabilities, // Non-empty if devices found at load time

  logLevel: "info",
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: [],
  framework: "mocha",
  reporters: ["spec"],
  mochaOpts: { ui: "bdd", timeout: 60000 },

  // onPrepare can finalize/validate; return the config so changes are honored across WDIO versions
  onPrepare: function (config) {
    // If capabilities were empty at load time, re-resolve now (print once)
    if (!config.capabilities || config.capabilities.length === 0) {
      const printed = process.env.DEVICES_PRINTED === "1";
      const devicesNow = listConnectedDevices({ silent: printed });
      if (!devicesNow || devicesNow.length === 0) {
        console.error("❌ No Android devices found. Connect at least one device via ADB and try again.");
        process.exit(1);
      }
      const capsNow = buildCaps(devicesNow);

      // Important: assign, don't splice; then return config to satisfy CLI validator in all versions
      config.capabilities = capsNow;
      config.maxInstances = devicesNow.length;
      process.env.DEVICES_PRINTED = "1";
    }
    return config;
  },

  beforeSession: async function (_config, caps) {
    // Prefer WDIO-provided index fields if present
    const idx = typeof caps.wdioWorkerIndex === "number"
      ? caps.wdioWorkerIndex
      : (typeof caps.wdioIndex === "number" ? caps.wdioIndex : 0);

    // Stagger startup slightly to reduce ADB contention
    const delayMs = idx * 1500;
    if (delayMs > 0) {
      console.log(`⏳ Waiting ${delayMs}ms before starting session for device index ${idx}`);
      await sleep(delayMs);
    }
  },

  afterTest: async function (test, _context, { error }) {
    const deviceName = browser.capabilities["appium:deviceName"];
    if (error) {
      console.error(`❌ ${deviceName} | Failed: ${test.title} | ${error.message}`);
    } else {
      console.log(`✅ ${deviceName} | Passed: ${test.title}`);
    }
  },
};
