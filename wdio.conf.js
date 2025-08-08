const path = require("path");
const glob = require("glob");
const { getConnectedDevices } = require("./device_Connectivity/helper");

const devices = getConnectedDevices();

if (devices.length === 0) {
  console.error("❌ No Android devices connected. Please connect at least one device via ADB.");
  process.exit(1);
}

console.log("✅ Connected Devices:");
devices.forEach((d, i) =>
  console.log(`Device ${i + 1}: ${d.deviceId} | Android ${d.version}`)
);

// Load specs
const specsPath = glob.sync("./test/specs/**/*.test.js", { cwd: __dirname });

exports.config = {
  runner: "local",
  hostname: "127.0.0.1",
  port: 4723,
  path: "/",

  specs: specsPath,
  exclude: [],

  maxInstances: devices.length, // Global parallel test instances

  capabilities: devices.map((d, index) => ({
    platformName: "Android",
    "appium:automationName": "UiAutomator2",
    "appium:deviceName": d.deviceId,
    "appium:platformVersion": d.version,
    "appium:app": path.resolve("./apps/snc_live_35_version.apk"),
    "appium:appPackage": "com.salesninjacrm",
    "appium:appActivity": ".MainActivity",
    "appium:noReset": true,
    "appium:fullReset": false,
    "appium:disableHiddenApiPolicyPrePApps": true,
    "appium:autoGrantPermissions": true,
    "appium:ignoreHiddenApiPolicyError": true,

    // Uncomment below if running multiple Appium servers per device
    // port: 4723 + index * 2, // e.g. 4723, 4725, 4727, ...
  })),

  // {
  //   platformName: "Android",
  //   "appium:automationName": "UiAutomator2",
  //   // "appium:deviceName": "10BF1X20MY003KN",
  //   "appium:deviceName": "10BE4H1NDS0005S",
  //   "appium:platformVersion": "14",
  //   "appium:app": path.resolve("./apps/dev_16_july.apk"),
  //   "appium:appPackage": "com.salesninjacrm",
  //   "appium:appActivity": ".MainActivity",
  //   "appium:noReset": true,
  //   "appium:fullReset": false,
  //   "appium:autoGrantPermissions": true,
  //   "appium:ignoreHiddenApiPolicyError": true,
  // },
  // {
  //   platformName: "Android",
  //   "appium:automationName": "UiAutomator2",
  //   "appium:deviceName": "10BF1X20MY003KN",
  //   "appium:platformVersion": "14",
  //   "appium:app": path.resolve("./apps/dev_16_july.apk"),
  //   "appium:appPackage": "com.salesninjacrm",
  //   "appium:appActivity": ".MainActivity",
  //   "appium:noReset": true,
  //   "appium:fullReset": false,
  //   "appium:autoGrantPermissions": true,
  //   "appium:ignoreHiddenApiPolicyError": true,
  // },

  logLevel: "info",
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: [],

  framework: "mocha",
  reporters: ["spec"],

  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },

  // 🔁 Dynamic error log per device
  afterTest: async function (test, context, { error, passed }) {
    const deviceName = browser.capabilities["appium:deviceName"];
    if (error) {
      console.error(`❌ Device: ${deviceName} | ❌ Test Failed: ${test.title} | Error: ${error.message}`);
    } else {
      console.log(`✅ Device: ${deviceName} | ✅ Test Passed: ${test.title}`);
    }
  },
};

// const path = require("path");
// const glob = require("glob");
// const { getConnectedDevices } = require("./device_Connectivity/helper");

// // 🔄 Get all connected devices
// const devices = getConnectedDevices(undefined, true);
// global.allConnectedDevices = devices.map((d) => d.deviceId);
// global.testRunResults = [];
// global.executedDevices = new Set();

// if (devices.length === 0) {
//   console.error("❌ No Android devices connected. Please connect at least one device via ADB.");
//   process.exit(1);
// }

// console.log("✅ Connected Devices:");
// devices.forEach((d, i) =>
//   console.log(`  📱 Device ${i + 1}: ${d.deviceId} | Android ${d.version}`)
// );

// // 🔄 Get all test files
// const allSpecs = glob.sync("./test/specs/**/*.test.js", { cwd: __dirname });

// exports.config = {
//   runner: "local",
//   hostname: "127.0.0.1",
//   port: 4723,
//   path: "/",
//   specs: [], // <- Leave this empty, using per-device specs instead
//   exclude: [],
//   maxInstances: devices.length,

//   // 🔧 Capabilities per device (parallel run)
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
//     port: 4723 + index,
//     specs: allSpecs, // 🔁 assign same tests to each device
//   })),

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

//   // 👷 Track test started device
//   onWorkerStart: function (cid, caps) {
//     const device = caps["appium:deviceName"];
//     console.log(`🚀 Starting test on ${device}`);
//     global.executedDevices.add(device);
//   },

//   // ✅ Log individual test results
//   afterTest: async function (test, context, { error }) {
//     const caps = browser.capabilities;
//     const deviceName = caps["appium:deviceName"] || "UNKNOWN_DEVICE";
//     const stackLine = error?.stack?.split("\n")[1]?.trim() || "No stack trace";

//     if (error) {
//       console.error(`❌ [${deviceName}] Test FAILED`);
//       global.testRunResults.push({
//         device: deviceName,
//         status: "FAILED",
//         error: `${error.message} @ ${stackLine}`,
//       });
//     } else {
//       console.log(`✅ [${deviceName}] Test PASSED`);
//       global.testRunResults.push({
//         device: deviceName,
//         status: "PASSED",
//       });
//     }
//   },

//   // 🧨 Track session failure
//   onWorkerEnd: function (cid, exitCode, specs, caps) {
//     const deviceId = caps?.["appium:deviceName"] || `UnknownDevice-${cid}`;
//     const alreadyLogged = global.testRunResults.some(r => r.device === deviceId);
//     if (exitCode !== 0 && !alreadyLogged) {
//       global.sessionErrors = global.sessionErrors || [];
//       global.sessionErrors.push({
//         device: deviceId,
//         reason: "Session failed or timed out",
//       });
//     }
//   },

//   // 📊 FINAL SUMMARY
//   onComplete: function () {
//     console.log("\n📊 TEST SUMMARY BY DEVICE:");
//     const reportedDevices = new Set();

//     global.testRunResults.forEach(result => {
//       reportedDevices.add(result.device);
//       const icon = result.status === "PASSED" ? "✅" : "❌";
//       console.log(
//         `${icon} ${result.device} => ${result.status}${result.error ? ` | ${result.error}` : ""}`
//       );
//     });

//     (global.sessionErrors || []).forEach(error => {
//       if (!reportedDevices.has(error.device)) {
//         reportedDevices.add(error.device);
//         console.log(`❌ ${error.device} => SESSION ERROR: ${error.reason}`);
//       }
//     });

//     global.executedDevices.forEach(device => {
//       if (!reportedDevices.has(device)) {
//         console.log(`❌ ${device} => EXECUTED BUT NO RESULT (test crash before reporting)`);
//       }
//     });

//     global.allConnectedDevices.forEach(device => {
//       if (!global.executedDevices.has(device)) {
//         console.log(`⚠️ ${device} => NO TEST EXECUTED`);
//       }
//     });

//     console.log("📥 End of test summary.\n");
//   },
// };
