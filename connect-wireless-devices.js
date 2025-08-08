const { execSync } = require("child_process");

function getUsbDevices() {
  const raw = execSync("adb devices").toString();
  return raw
    .split("\n")
    .slice(1)
    .filter(line => line.trim().endsWith("device") && !line.includes(":5555"))
    .map(line => line.split("\t")[0].trim());
}

function enableTcpip(deviceId) {
  try {
    return execSync(`adb -s ${deviceId} tcpip 5555`).toString().trim();
  } catch {
    return "❌ TCP/IP enable failed.";
  }
}

function getDeviceIp(deviceId) {
  try {
    const output = execSync(`adb -s ${deviceId} shell ip route`).toString();
    const match = output.match(/src (\d+\.\d+\.\d+\.\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function connectByIp(ip) {
  try {
    return execSync(`adb connect ${ip}:5555`).toString().trim();
  } catch {
    return "❌ Connection failed.";
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async function () {
  console.log("🔌 [1] Enabling TCP/IP Mode for USB Devices...");
  const usbDevices = getUsbDevices();

  if (usbDevices.length === 0) {
    console.log("⚠️ No USB devices found.");
    return;
  }

  for (const deviceId of usbDevices) {
    const tcpResult = enableTcpip(deviceId);
    console.log(`📱 ${deviceId} ➤ ${tcpResult}`);
  }

  // ⏱️ Wait before continuing
  console.log("⏳ Waiting for devices to restart in TCP/IP mode...");
  await sleep(5000); // wait 5 seconds

  console.log("\n🌐 [2] Fetching Device IPs...");
  const ipMap = {};

  for (const deviceId of usbDevices) {
    const ip = getDeviceIp(deviceId);
    if (ip) {
      ipMap[deviceId] = ip;
      console.log(`📱 ${deviceId} ➤ IP: ${ip}`);
    } else {
      console.log(`📱 ${deviceId} ➤ ❌ Failed to get IP`);
    }
  }

  console.log("\n📡 [3] Connecting Devices Wirelessly...");
  Object.entries(ipMap).forEach(([deviceId, ip]) => {
    const connectResult = connectByIp(ip);
    console.log(`📱 ${deviceId} ➤ ${connectResult}`);
  });
})();
